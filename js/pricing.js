/* pricing.js - pricing table with search and category filter for pricing.html */
(function () {
  "use strict";
  const body = document.getElementById("pricingBody");
  if (!body || !window.CC) return;
  const { cfg, el, icon, clean, enabledServices, categories, categoryLabel, hasPrice, money, bindAll } = window.CC;

  const all = enabledServices();
  const input = document.getElementById("priceSearch");
  const filters = document.getElementById("categoryFilters");
  const count = document.getElementById("resultCount");
  const empty = document.getElementById("noResults");
  const tableWrap = document.getElementById("pricingTableWrap");
  const demo = document.getElementById("demoNotice");
  const sensitive = document.getElementById("sensitiveNotice");
  const notice = document.getElementById("pricingNotice");
  let activeCategory = "all";

  if (demo && !cfg.pricesAreDemo) demo.hidden = true;
  if (sensitive && !all.some((s) => s.sensitive)) sensitive.hidden = true;
  if (notice) notice.textContent = cfg.pricingNotice || "Please confirm the final price with us before ordering.";

  const used = new Set(all.map((s) => s.category));
  [{ id: "all", label: "All categories" }].concat(categories().filter((c) => used.has(c.id))).forEach((c) => {
    const b = el("button", { class: "filter-chip", text: c.label, attrs: { type: "button", "data-category": c.id, "aria-pressed": c.id === "all" ? "true" : "false" } });
    b.addEventListener("click", () => {
      activeCategory = c.id;
      filters.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.category === c.id)));
      render();
    });
    filters.append(b);
  });

  function row(s) {
    const priced = hasPrice(s);
    const availability = s.availability === "available"
      ? el("span", { class: "status-tag is-ok" }, [icon("bi-check-circle"), " Available"])
      : el("span", { class: "status-tag" }, [icon("bi-chat-dots"), " On request"]);
    const cell = (label, content, cls) => {
      const td = el("td", { class: cls || "", attrs: { "data-label": label } });
      td.append(content); return td;
    };
    return el("tr", {}, [
      cell("Service", el("strong", { text: s.title })),
      cell("Category", document.createTextNode(categoryLabel(s.category))),
      cell("Details", document.createTextNode(s.description || "")),
      cell("Price", el("span", { class: priced ? "price-value" : "price-value is-quote", text: priced ? money(s.price) : "Contact for pricing" })),
      cell("Unit", document.createTextNode(priced && s.unit ? s.unit : "-")),
      cell("Status", availability),
      cell("Ask", el("a", { class: "btn btn-outline-primary btn-sm", attrs: { href: "contact.html", "data-whatsapp": true, "data-service": s.title } },
        [icon("bi-whatsapp"), " Ask price"]))
    ]);
  }

  function render() {
    const term = clean(input.value, 60).toLowerCase();
    const list = all.filter((s) => (activeCategory === "all" || s.category === activeCategory) &&
      (!term || (s.title + " " + (s.description || "") + " " + categoryLabel(s.category)).toLowerCase().includes(term)));
    body.textContent = "";
    list.forEach((s) => body.append(row(s)));
    bindAll(body);
    tableWrap.hidden = !list.length;
    empty.hidden = list.length > 0;
    count.textContent = list.length === 1 ? "1 service found" : list.length + " services found";
  }

  input.addEventListener("input", render);
  document.getElementById("resetFilters").addEventListener("click", () => {
    input.value = ""; activeCategory = "all";
    filters.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.category === "all")));
    render(); input.focus();
  });
  render();
})();
