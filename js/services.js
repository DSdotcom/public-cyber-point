/* services.js - search + category filter for services.html (no backend) */
(function () {
  "use strict";
  const grid = document.getElementById("serviceGrid");
  if (!grid || !window.CC) return;
  const { el, clean, enabledServices, categories, categoryLabel, serviceCard, bindAll } = window.CC;

  const all = enabledServices();
  const input = document.getElementById("serviceSearch");
  const filters = document.getElementById("categoryFilters");
  const count = document.getElementById("resultCount");
  const empty = document.getElementById("noResults");
  const reset = document.getElementById("resetFilters");
  let activeCategory = "all";

  const sensitive = document.getElementById("sensitiveNotice");
  if (sensitive && !all.some((s) => s.sensitive)) sensitive.hidden = true;

  // Only show category buttons that have at least one enabled service.
  const used = new Set(all.map((s) => s.category));
  const options = [{ id: "all", label: "All services" }].concat(categories().filter((c) => used.has(c.id)));
  options.forEach((c) => {
    const b = el("button", { class: "filter-chip", text: c.label, attrs: { type: "button", "data-category": c.id, "aria-pressed": c.id === "all" ? "true" : "false" } });
    b.addEventListener("click", () => { activeCategory = c.id; syncChips(); render(); });
    filters.append(b);
  });

  function syncChips() {
    filters.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.category === activeCategory)));
  }

  function matches(s, term) {
    if (activeCategory !== "all" && s.category !== activeCategory) return false;
    if (!term) return true;
    return (s.title + " " + (s.description || "") + " " + categoryLabel(s.category)).toLowerCase().includes(term);
  }

  function render() {
    const term = clean(input.value, 60).toLowerCase();
    const list = all.filter((s) => matches(s, term));
    grid.textContent = "";
    list.forEach((s) => { const card = serviceCard(s); card.classList.add("is-visible"); grid.append(card); });
    bindAll(grid);
    empty.hidden = list.length > 0;
    grid.hidden = list.length === 0;
    count.textContent = list.length === 1 ? "1 service found" : list.length + " services found";
  }

  function clearAll() { input.value = ""; activeCategory = "all"; syncChips(); render(); input.focus(); }
  input.addEventListener("input", render);
  reset.addEventListener("click", clearAll);

  const q = new URLSearchParams(location.search).get("q");
  if (q) input.value = clean(q, 60);
  render();
})();
