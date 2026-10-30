/* home.js - fills the dynamic sections of index.html from js/config.js */
(function () {
  "use strict";
  if (!window.CC) return;
  const { cfg, el, icon, safeUrl, clean, enabledServices, priceText, hasPrice, serviceCard, fill, renderMap, bindAll } = window.CC;
  const byId = (id) => document.getElementById(id);

  function renderFeatured() {
    const grid = byId("featuredServices");
    if (!grid) return;
    const list = enabledServices().filter((s) => s.featured);
    const items = list.length ? list : enabledServices().slice(0, 6);
    if (!items.length) {
      grid.append(el("p", { class: "empty-state", text: "Our services list is being updated. Please message us to ask what we offer." }));
      return;
    }
    items.forEach((s) => grid.append(serviceCard(s)));
  }

  function renderPricePreview() {
    const list = byId("pricePreview");
    if (!list) return;
    const rows = enabledServices().filter((s) => s.previewPrice);
    rows.forEach((s) => list.append(el("li", { class: "rate-row" }, [
      el("span", { class: "rate-name", text: s.title }),
      el("span", { class: "rate-price" + (hasPrice(s) ? "" : " is-quote"), text: priceText(s) })
    ])));
    const note = byId("priceDemoNote");
    if (note && !cfg.pricesAreDemo) note.hidden = true;
    if (!rows.length) { const wrap = byId("pricePreviewWrap"); if (wrap) wrap.hidden = true; }
  }

  function renderGallery() {
    const grid = byId("galleryGrid");
    const section = byId("gallerySection");
    if (!grid) return;
    const items = (Array.isArray(cfg.gallery) ? cfg.gallery : []).filter((g) => safeUrl(g && g.src));
    if (!items.length) { if (section) section.hidden = true; return; }
    items.forEach((g) => {
      const image = el("img", { class: "gallery-img", attrs: {
        src: safeUrl(g.src), alt: clean(g.alt, 150), loading: "lazy", decoding: "async",
        width: g.width || 800, height: g.height || 600 } });
      const btn = el("button", { class: "gallery-item reveal", attrs: {
        type: "button", "data-bs-toggle": "modal", "data-bs-target": "#galleryModal",
        "data-src": safeUrl(g.src), "data-alt": clean(g.alt, 150), "data-caption": clean(g.caption, 80),
        "aria-label": "View larger: " + clean(g.caption || g.alt, 80) } }, [
        image, el("span", { class: "gallery-caption", text: clean(g.caption, 80) })]);
      grid.append(btn);
    });
    const note = byId("galleryNote");
    if (note && !cfg.galleryIsSample) note.hidden = true;

    const modal = byId("galleryModal");
    if (modal) modal.addEventListener("show.bs.modal", (ev) => {
      const t = ev.relatedTarget; if (!t) return;
      const big = byId("galleryModalImg");
      big.src = t.dataset.src; big.alt = t.dataset.alt;
      byId("galleryModalCaption").textContent = t.dataset.caption || "";
    });
  }

  function renderTestimonials() {
    const section = byId("testimonialsSection");
    const grid = byId("testimonialGrid");
    if (!section || !grid) return;
    const items = (Array.isArray(cfg.testimonials) ? cfg.testimonials : []).filter((t) => t && clean(t.quote) && clean(t.name));
    if (!items.length) return; // section stays hidden: never show invented reviews
    items.forEach((t) => grid.append(el("figure", { class: "testimonial reveal" }, [
      el("blockquote", {}, [el("p", { text: clean(t.quote, 400) })]),
      el("figcaption", { text: "- " + clean(t.name, 60) + (clean(t.detail, 60) ? ", " + clean(t.detail, 60) : "") })
    ])));
    section.hidden = false;
  }

  function renderFaq() {
    const root = byId("faqAccordion");
    if (!root) return;
    const enabledIds = new Set(enabledServices().map((s) => s.id));
    (Array.isArray(cfg.faqs) ? cfg.faqs : [])
      .filter((f) => f && f.q && f.a && (!f.requires || enabledIds.has(f.requires)))
      .forEach((f, i) => {
        const hid = "faq-h-" + i, cid = "faq-c-" + i;
        root.append(el("div", { class: "accordion-item" }, [
          el("h3", { class: "accordion-header", attrs: { id: hid } }, [
            el("button", { class: "accordion-button collapsed", text: fill(f.q), attrs: {
              type: "button", "data-bs-toggle": "collapse", "data-bs-target": "#" + cid,
              "aria-expanded": "false", "aria-controls": cid } })]),
          el("div", { class: "accordion-collapse collapse", attrs: { id: cid, "aria-labelledby": hid, "data-bs-parent": "#faqAccordion" } }, [
            el("div", { class: "accordion-body", text: fill(f.a) })])
        ]));
      });
    if (!root.children.length) { const s = byId("faqSection"); if (s) s.hidden = true; }
  }

  function renderHero() {
    const imgEl = byId("heroImg");
    const badge = byId("heroSample");
    const conf = cfg.images || {};
    const src = safeUrl(conf.hero);
    if (imgEl && src) { imgEl.src = src; if (conf.heroAlt) imgEl.alt = clean(conf.heroAlt, 200); }
    if (badge && !conf.heroIsSample) badge.hidden = true;
  }

  renderHero();
  renderFeatured();
  renderPricePreview();
  renderGallery();
  renderTestimonials();
  renderFaq();
  renderMap(byId("mapMount"));
  bindAll(document);
})();
