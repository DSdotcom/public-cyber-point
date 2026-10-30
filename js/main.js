/*
  main.js - code shared by every page.
  Reads js/config.js, builds the header/footer, wires up WhatsApp/call/map links,
  and exposes a small helper object (window.CC) used by the page scripts.
  Dynamic content is always written with textContent / setAttribute, never innerHTML with config data.
*/
(function () {
  "use strict";

  const cfg = (typeof SITE_CONFIG === "object" && SITE_CONFIG) || {};
  const biz = cfg.business || {};
  const addr = biz.address || {};
  const img = cfg.images || {};
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  /* ---------- small helpers ---------- */

  /** Create an element safely: el("a", {class, text, attrs:{href}}, [children]) */
  function el(tag, opts, kids) {
    const node = document.createElement(tag);
    const o = opts || {};
    if (o.class) node.className = o.class;
    if (o.text != null) node.textContent = o.text;
    if (o.attrs) {
      Object.keys(o.attrs).forEach((k) => {
        const v = o.attrs[k];
        if (v !== null && v !== undefined && v !== false) node.setAttribute(k, v === true ? "" : String(v));
      });
    }
    [].concat(kids || []).forEach((k) => { if (k) node.append(k); });
    return node;
  }

  /** Bootstrap Icons element. The class name is validated before use. */
  function icon(name, extra) {
    const safe = /^bi-[a-z0-9-]+$/.test(name || "") ? name : "bi-dot";
    return el("i", { class: ("bi " + safe + " " + (extra || "")).trim(), attrs: { "aria-hidden": "true" } });
  }

  /** Accept only https:// URLs or simple relative paths. Returns "" when unsafe. */
  function safeUrl(value, options) {
    const allowRelative = !options || options.allowRelative !== false;
    if (typeof value !== "string") return "";
    const u = value.trim();
    if (!u) return "";
    if (/^https:\/\//i.test(u)) {
      try { return new URL(u).href; } catch (e) { return ""; }
    }
    if (allowRelative && !u.startsWith("/") && !u.includes("..") &&
        /^[A-Za-z0-9_\-./]+(\?[A-Za-z0-9_\-=&%]*)?(#[A-Za-z0-9_\-]*)?$/.test(u)) return u;
    return "";
  }

  /** Remove control characters (keeps new lines) and limit length. */
  function clean(value, max) {
    return String(value == null ? "" : value)
      .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "")
      .trim()
      .slice(0, max || 500);
  }

  /** Digits only, country code added to 10-digit numbers. Returns "" if unsuitable for wa.me. */
  function normalizePhone(raw) {
    let digits = String(raw == null ? "" : raw).replace(/\D/g, "").replace(/^0+/, "");
    if (digits.length === 10) digits = String(biz.defaultCountryCode || "91") + digits;
    return /^[1-9]\d{10,14}$/.test(digits) ? digits : "";
  }

  const money = (n) => new Intl.NumberFormat("en-IN", {
    style: "currency", currency: biz.currency || "INR", minimumFractionDigits: 0, maximumFractionDigits: 2
  }).format(n);

  const hasPrice = (s) => typeof s.price === "number" && isFinite(s.price) && s.price >= 0;
  const priceText = (s) => hasPrice(s) ? money(s.price) + (s.unit ? " " + s.unit : "") : "Contact for pricing";
  const enabledServices = () => (Array.isArray(cfg.services) ? cfg.services : []).filter((s) => s && s.enabled && s.id && s.title);
  const categories = () => Array.isArray(cfg.categories) ? cfg.categories : [];
  const categoryLabel = (id) => (categories().find((c) => c.id === id) || {}).label || "Other Services";

  function fullAddress() {
    return [addr.line1, addr.city, addr.state, addr.postalCode].filter(Boolean).join(", ");
  }

  /** Replace {name} {hours} {phone} {address} in FAQ text. */
  function fill(text) {
    const map = { name: biz.name, hours: biz.hours && biz.hours.text, phone: biz.phone, address: fullAddress() };
    return String(text || "").replace(/\{(name|hours|phone|address)\}/g, (m, k) => map[k] || "our team");
  }

  /* ---------- WhatsApp ---------- */

  /** Build a wa.me link. Returns "" if the configured number is not valid. Nothing is sent automatically. */
  function buildWhatsAppUrl(options) {
    const number = normalizePhone(biz.whatsapp);
    if (!number) return "";
    const o = options || {};
    const name = biz.name || "your cyber cafe";
    const service = clean(o.service, 100);
    const fallback = service
      ? "Hello " + name + ", I would like to know more about your " + service + " service and its pricing."
      : "Hello " + name + ", I would like to know more about your services and pricing.";
    const text = clean(o.message, 900) || fallback;
    return "https://wa.me/" + number + "?text=" + encodeURIComponent(text);
  }

  const NEW_TAB_NOTE = " (opens in a new tab)";
  function markNewTab(a) {
    if (!a.querySelector(".visually-hidden")) a.append(el("span", { class: "visually-hidden", text: NEW_TAB_NOTE }));
  }

  function bindWhatsApp(root) {
    (root || document).querySelectorAll("[data-whatsapp]").forEach((a) => {
      const url = buildWhatsAppUrl({ service: a.dataset.service });
      if (url) {
        a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; markNewTab(a);
      } else {
        a.href = "contact.html"; // number missing/invalid: send visitors to the contact page instead of a dead link
      }
    });
  }

  /* ---------- bind config values into the page ---------- */

  function bindAll(root) {
    const scope = root || document;
    const values = {
      name: biz.name, tagline: biz.tagline, owner: biz.owner, phone: biz.phone, email: biz.email,
      hours: biz.hours && biz.hours.text, address: fullAddress(), description: biz.shortDescription
    };
    scope.querySelectorAll("[data-bind]").forEach((n) => {
      const v = values[n.dataset.bind];
      if (v) n.textContent = v;
      else { const row = n.closest("[data-row]"); if (row) row.hidden = true; }
    });

    const phone = normalizePhone(biz.phone);
    const mapUrl = safeUrl(biz.mapsUrl, { allowRelative: false }) ||
      (fullAddress() ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(fullAddress()) : "");
    const emailOk = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(biz.email || "");

    scope.querySelectorAll("[data-link]").forEach((a) => {
      const type = a.dataset.link;
      let href = "";
      if (type === "call" && phone) href = "tel:+" + phone;
      if (type === "email" && emailOk) href = "mailto:" + biz.email;
      if (type === "directions" && mapUrl) {
        href = mapUrl; a.target = "_blank"; a.rel = "noopener noreferrer"; markNewTab(a);
      }
      if (href) a.href = href; else a.hidden = true;
    });

    scope.querySelectorAll("[data-img='logo']").forEach((i) => {
      const src = safeUrl(img.logo);
      if (src) i.src = src; else i.hidden = true;
    });
    scope.querySelectorAll("[data-year]").forEach((n) => { n.textContent = String(new Date().getFullYear()); });
    bindWhatsApp(scope);
  }

  /* ---------- header, announcement, footer ---------- */

  const NAV = [
    ["index.html", "Home"], ["services.html", "Services"], ["pricing.html", "Pricing"],
    ["about.html", "About Us"], ["contact.html", "Contact"]
  ];

  function renderAnnouncement() {
    const a = cfg.announcement || {};
    const text = clean(a.text, 200);
    if (!text) return null;
    const bar = el("div", { class: "announcement-bar", attrs: { role: "region", "aria-label": "Announcement" } });
    const inner = el("div", { class: "container" }, [icon("bi-megaphone"), el("span", { text: " " + text })]);
    const href = safeUrl(a.linkHref);
    if (href && clean(a.linkText, 40)) {
      const link = el("a", { text: clean(a.linkText, 40), attrs: { href } });
      if (/^https:/i.test(href)) { link.target = "_blank"; link.rel = "noopener noreferrer"; }
      inner.append(" ", link);
    }
    bar.append(inner);
    return bar;
  }

  function renderHeader() {
    const mount = document.getElementById("site-header");
    if (!mount) return;
    // Static markup only: no config values are interpolated into this string.
    mount.innerHTML =
      '<header class="site-header">' +
      '<nav class="navbar navbar-expand-lg" aria-label="Main navigation"><div class="container">' +
      '<a class="navbar-brand" href="index.html"><img data-img="logo" width="40" height="40" alt="">' +
      '<span class="brand-text"><span class="brand-name" data-bind="name"></span><small data-bind="tagline"></small></span></a>' +
      '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation"><i class="bi bi-list" aria-hidden="true"></i></button>' +
      '<div class="collapse navbar-collapse" id="mainNav"><ul class="navbar-nav ms-lg-auto align-items-lg-center" id="navList"></ul>' +
      '<a class="btn btn-whatsapp nav-cta" data-whatsapp href="contact.html"><i class="bi bi-whatsapp" aria-hidden="true"></i> WhatsApp us</a>' +
      '</div></div></nav></header>';

    const list = mount.querySelector("#navList");
    NAV.forEach(([href, label]) => {
      const a = el("a", { class: "nav-link", text: label, attrs: { href } });
      if (href === page || (page === "" && href === "index.html")) { a.classList.add("active"); a.setAttribute("aria-current", "page"); }
      list.append(el("li", { class: "nav-item" }, [a]));
    });
    const bar = renderAnnouncement();
    if (bar) mount.prepend(bar);
  }

  function renderFooter() {
    const mount = document.getElementById("site-footer");
    if (!mount) return;
    mount.innerHTML =
      '<footer class="site-footer"><div class="container"><div class="row g-4">' +
      '<div class="col-lg-4"><a class="footer-brand" href="index.html"><img data-img="logo" width="40" height="40" alt="">' +
      '<span data-bind="name"></span></a><p class="mt-3" data-bind="description"></p>' +
      '<ul class="list-inline social-links" id="socialLinks"></ul></div>' +
      '<div class="col-6 col-lg-2"><h2 class="footer-title">Pages</h2><ul class="list-unstyled footer-list" id="footerNav"></ul></div>' +
      '<div class="col-6 col-lg-3"><h2 class="footer-title">Popular services</h2><ul class="list-unstyled footer-list" id="footerServices"></ul></div>' +
      '<div class="col-lg-3"><h2 class="footer-title">Visit or contact</h2><ul class="list-unstyled footer-list footer-contact">' +
      '<li data-row><i class="bi bi-geo-alt" aria-hidden="true"></i><span data-bind="address"></span></li>' +
      '<li><i class="bi bi-telephone" aria-hidden="true"></i><a data-link="call" href="contact.html"><span data-bind="phone"></span></a></li>' +
      '<li data-row><i class="bi bi-clock" aria-hidden="true"></i><span data-bind="hours"></span></li>' +
      '<li><i class="bi bi-whatsapp" aria-hidden="true"></i><a data-whatsapp href="contact.html">Chat on WhatsApp</a></li>' +
      '</ul></div></div>' +
      '<div class="footer-bottom"><p class="mb-0">&copy; <span data-year></span> <span data-bind="name"></span>. All rights reserved.</p>' +
      '<p class="mb-0"><a href="contact.html#privacy">Privacy information</a></p></div></div></footer>' +
      '<a class="fab-whatsapp" data-whatsapp href="contact.html" aria-label="Chat on WhatsApp"><i class="bi bi-whatsapp" aria-hidden="true"></i></a>' +
      '<button type="button" class="back-to-top" id="backToTop" aria-label="Back to top" hidden><i class="bi bi-arrow-up" aria-hidden="true"></i></button>';

    const nav = mount.querySelector("#footerNav");
    NAV.forEach(([href, label]) => nav.append(el("li", {}, [el("a", { text: label, attrs: { href } })])));

    const svc = mount.querySelector("#footerServices");
    const picks = enabledServices().filter((s) => s.featured).slice(0, 5);
    picks.forEach((s) => svc.append(el("li", {}, [el("a", { text: s.title, attrs: { href: "services.html?q=" + encodeURIComponent(s.title) } })])));
    if (!picks.length) svc.append(el("li", {}, [el("a", { text: "All services", attrs: { href: "services.html" } })]));

    const social = mount.querySelector("#socialLinks");
    const s = cfg.social || {};
    [["facebook", "bi-facebook", "Facebook"], ["instagram", "bi-instagram", "Instagram"], ["youtube", "bi-youtube", "YouTube"]].forEach(([key, ic, label]) => {
      const href = safeUrl(s[key], { allowRelative: false });
      if (href) social.append(el("li", { class: "list-inline-item" }, [el("a", {
        attrs: { href, target: "_blank", rel: "noopener noreferrer", "aria-label": label + " (opens in a new tab)" } }, [icon(ic)])]));
    });
    if (!social.children.length) social.remove();

    const btn = mount.querySelector("#backToTop");
    const toggle = () => { btn.hidden = window.scrollY < 600; };
    window.addEventListener("scroll", toggle, { passive: true });
    btn.addEventListener("click", () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      const skip = document.getElementById("main"); if (skip) skip.focus({ preventScroll: true });
    });
    toggle();
  }

  /* ---------- map / location ---------- */

  function renderMap(mount) {
    if (!mount) return;
    mount.textContent = "";
    const src = safeUrl(biz.mapsEmbedUrl, { allowRelative: false });
    if (src && src.startsWith("https://www.google.com/maps/embed")) {
      mount.append(el("iframe", { class: "map-frame", attrs: {
        src, title: "Map showing the location of " + (biz.name || "the business"), loading: "lazy",
        referrerpolicy: "no-referrer-when-downgrade", width: "600", height: "400",
        sandbox: "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" } }));
    } else {
      mount.append(el("div", { class: "map-placeholder" }, [
        icon("bi-geo-alt", "fs-1"),
        el("p", { class: "mb-0", text: "Map preview is not set up yet. Use the Get Directions button to open the location in Google Maps." })
      ]));
    }
  }

  /* ---------- service card (used on home + services page) ---------- */

  function serviceCard(s) {
    const quote = !hasPrice(s);
    return el("article", { class: "service-card reveal" }, [
      el("span", { class: "service-icon" }, [icon(s.icon)]),
      el("h3", { class: "service-title", text: s.title }),
      el("p", { class: "service-desc", text: s.description || "" }),
      el("p", { class: "service-price" + (quote ? " is-quote" : ""), text: priceText(s) }),
      el("a", { class: "btn btn-outline-primary btn-sm service-cta", attrs: { href: "contact.html", "data-whatsapp": true, "data-service": s.title } },
        [icon("bi-whatsapp"), " Ask on WhatsApp"])
    ]);
  }

  /* ---------- SEO: canonical, Open Graph, LocalBusiness data ---------- */

  function applySeo() {
    const base = safeUrl(cfg.siteUrl || "", { allowRelative: false });
    const absolute = (p) => (base ? new URL(p, base.endsWith("/") ? base : base + "/").href : "");
    const head = document.head;

    if (base && page !== "404.html") {
      const url = absolute(page === "index.html" ? "" : page);
      head.append(el("link", { attrs: { rel: "canonical", href: url } }));
      head.append(el("meta", { attrs: { property: "og:url", content: url } }));
      const hero = safeUrl(img.hero);
      if (hero) head.append(el("meta", { attrs: { property: "og:image", content: absolute(hero) } }));
    }

    if (page !== "index.html" && page !== "contact.html") return;
    const data = { "@context": "https://schema.org", "@type": "LocalBusiness", name: biz.name };
    if (biz.shortDescription) data.description = biz.shortDescription;
    const phone = normalizePhone(biz.phone); if (phone) data.telephone = "+" + phone;
    if (biz.email) data.email = biz.email;
    if (base) data.url = base;
    if (addr.line1) data.address = {
      "@type": "PostalAddress", streetAddress: addr.line1, addressLocality: addr.city,
      addressRegion: addr.state, postalCode: addr.postalCode, addressCountry: addr.country || "IN" };
    const h = biz.hours || {};
    if (Array.isArray(h.days) && h.opens && h.closes) data.openingHoursSpecification = [{
      "@type": "OpeningHoursSpecification", dayOfWeek: h.days, opens: h.opens, closes: h.closes }];
    const map = safeUrl(biz.mapsUrl, { allowRelative: false }); if (map) data.hasMap = map;
    const logo = safeUrl(img.logo); if (logo && base) data.image = absolute(logo);
    const same = Object.values(cfg.social || {}).map((u) => safeUrl(u, { allowRelative: false })).filter(Boolean);
    if (same.length) data.sameAs = same;
    const tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.textContent = JSON.stringify(data);
    head.append(tag);
  }

  /* ---------- gentle entrance animation (content is visible if this fails) ---------- */

  function initReveal() {
    try {
      const items = document.querySelectorAll(".reveal");
      if (!items.length || !("IntersectionObserver" in window) ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      document.documentElement.classList.add("anim");
      const io = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      }), { threshold: 0.1 });
      items.forEach((i) => io.observe(i));
    } catch (err) {
      document.documentElement.classList.remove("anim");
    }
  }

  /* ---------- start ---------- */

  renderHeader();
  renderFooter();
  applySeo();
  bindAll(document);
  document.addEventListener("DOMContentLoaded", initReveal);

  window.CC = Object.freeze({
    cfg, biz, el, icon, safeUrl, clean, normalizePhone, money, hasPrice, priceText,
    enabledServices, categories, categoryLabel, fullAddress, fill,
    buildWhatsAppUrl, bindAll, bindWhatsApp, renderMap, serviceCard
  });
})();
