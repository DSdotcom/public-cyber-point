/* about.js - shows the optional About sections only when real content exists in js/config.js */
(function () {
  "use strict";
  if (!window.CC) return;
  const { cfg, el, icon, clean, bindAll } = window.CC;
  const a = cfg.about || {};
  const byId = (id) => document.getElementById(id);

  const textBlocks = { aboutIntro: a.introduction, aboutMission: a.mission, aboutApproach: a.approach, aboutConvenience: a.convenience };
  Object.keys(textBlocks).forEach((id) => {
    const section = byId(id);
    const text = clean(textBlocks[id], 600);
    if (!section) return;
    if (text) section.querySelector("[data-text]").textContent = text; else section.hidden = true;
  });

  const values = (Array.isArray(a.values) ? a.values : []).filter((v) => v && clean(v.title));
  const valuesSection = byId("aboutValues");
  if (valuesSection) {
    if (!values.length) valuesSection.hidden = true;
    else values.forEach((v) => byId("valuesGrid").append(el("div", { class: "col-md-6 col-lg-4" }, [
      el("div", { class: "value-card" }, [el("h3", { text: clean(v.title, 60) }), el("p", { class: "mb-0 text-secondary", text: clean(v.text, 200) })])])));
  }

  const facilities = (Array.isArray(a.facilities) ? a.facilities : []).map((f) => clean(f, 80)).filter(Boolean);
  const facSection = byId("aboutFacilities");
  if (facSection) {
    if (!facilities.length) facSection.hidden = true;
    else facilities.forEach((f) => byId("facilityList").append(el("li", {}, [icon("bi-check-circle-fill"), el("span", { text: f })])));
  }
  bindAll(document);
})();
