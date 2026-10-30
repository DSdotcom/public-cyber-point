/*
  contact.js - builds the enquiry form and handles its two workflows.
  1) WhatsApp (default): opens a pre-filled chat. The customer reviews it and presses Send in WhatsApp.
  2) Optional email via formsubmit.co (off by default): only after the customer ticks consent and presses the button.
  Nothing is stored in the browser, and no success message is shown unless the workflow really succeeded.
*/
(function () {
  "use strict";
  const mount = document.querySelector("[data-contact-form-mount]");
  if (!mount || !window.CC || !window.Validation) return;

  const { cfg, biz, el, safeUrl, clean, enabledServices, buildWhatsAppUrl, bindAll } = window.CC;
  const V = window.Validation;

  /* Safe URL for the optional form service: https + formsubmit.co only. */
  function formServiceEndpoint() {
    const f = cfg.formService || {};
    if (!f.enabled) return "";
    const url = safeUrl(f.endpoint, { allowRelative: false });
    try { return new URL(url).hostname === "formsubmit.co" ? url : ""; } catch (e) { return ""; }
  }
  const endpoint = formServiceEndpoint();

  // Static template. No configuration values are inserted here.
  mount.innerHTML =
    '<form id="enquiryForm" class="enquiry-form" novalidate>' +
    '<div id="formErrors" class="alert alert-danger" role="alert" tabindex="-1" hidden></div>' +
    '<div class="mb-3"><label class="form-label" for="f-name">Your name <span class="req">(required)</span></label>' +
    '<input class="form-control" id="f-name" name="name" type="text" autocomplete="name" maxlength="60" aria-describedby="err-name">' +
    '<div class="field-error" id="err-name"></div></div>' +
    '<div class="row g-3 mb-3"><div class="col-md-6"><label class="form-label" for="f-phone">Phone number <span class="opt">(optional)</span></label>' +
    '<input class="form-control" id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="20" aria-describedby="err-phone">' +
    '<div class="field-error" id="err-phone"></div></div>' +
    '<div class="col-md-6"><label class="form-label" for="f-email">Email address <span class="opt">(optional)</span></label>' +
    '<input class="form-control" id="f-email" name="email" type="email" autocomplete="email" maxlength="100" aria-describedby="err-email">' +
    '<div class="field-error" id="err-email"></div></div></div>' +
    '<div class="mb-3"><label class="form-label" for="f-service">Service required</label>' +
    '<select class="form-select" id="f-service" name="service" aria-describedby="err-service"><option value="">General enquiry</option></select>' +
    '<div class="field-error" id="err-service"></div></div>' +
    '<div class="mb-3"><label class="form-label" for="f-message">Message <span class="req">(required)</span></label>' +
    '<textarea class="form-control" id="f-message" name="message" rows="4" maxlength="500" aria-describedby="hint-message err-message"></textarea>' +
    '<div class="form-text" id="hint-message">Up to 500 characters. Do not write passwords, OTPs or ID numbers here.</div>' +
    '<div class="field-error" id="err-message"></div></div>' +
    '<div class="hp-field" aria-hidden="true"><label for="f-website">Leave this field empty</label>' +
    '<input id="f-website" name="_honey" type="text" tabindex="-1" autocomplete="off"></div>' +
    '<div class="d-flex flex-wrap gap-2 align-items-center">' +
    '<button type="submit" class="btn btn-whatsapp btn-lg" id="btnWhatsApp"><i class="bi bi-whatsapp" aria-hidden="true"></i> Prepare WhatsApp message</button></div>' +
    '<p class="form-help mt-3 mb-0">This opens WhatsApp with your message ready to review. Nothing is sent until you press Send in WhatsApp.</p>' +
    '<div id="emailOption" class="email-option" hidden>' +
    '<hr><h3 class="h6">Or send by email</h3>' +
    '<p class="form-help">This option sends your details to a third-party form service (formsubmit.co), which passes them to the shop owner by email. It is not used unless you press the button below.</p>' +
    '<div class="form-check mb-3"><input class="form-check-input" type="checkbox" id="f-consent" aria-describedby="err-consent">' +
    '<label class="form-check-label" for="f-consent">I agree that my name, message and any phone or email I entered are sent through formsubmit.co.</label>' +
    '<div class="field-error" id="err-consent"></div></div>' +
    '<button type="button" class="btn btn-primary" id="btnEmail"><i class="bi bi-envelope" aria-hidden="true"></i> Send by email</button></div>' +
    '<div id="formStatus" class="form-status" role="status" aria-live="polite" hidden></div>' +
    '</form>';

  const form = mount.querySelector("#enquiryForm");
  const $ = (id) => form.querySelector("#" + id);
  const services = enabledServices();
  const select = $("f-service");
  services.forEach((s) => select.append(el("option", { text: s.title, attrs: { value: s.title } })));
  select.append(el("option", { text: "Other", attrs: { value: "Other" } }));
  if (endpoint) $("emailOption").hidden = false;

  const FIELDS = ["name", "phone", "email", "service", "message", "consent"];
  const allowedServices = services.map((s) => s.title).concat(["Other"]);

  function read() {
    return {
      name: V.tidy($("f-name").value), phone: V.tidy($("f-phone").value), email: V.tidy($("f-email").value),
      service: $("f-service").value, message: V.tidy($("f-message").value),
      consent: $("f-consent").checked, honey: $("f-website").value
    };
  }

  function showErrors(errors) {
    const box = $("formErrors");
    FIELDS.forEach((f) => {
      const holder = form.querySelector("#err-" + f);
      const input = f === "consent" ? $("f-consent") : $("f-" + f);
      if (holder) holder.textContent = errors[f] || "";
      if (input) { if (errors[f]) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid"); }
    });
    const list = Object.keys(errors);
    box.textContent = "";
    if (!list.length) { box.hidden = true; return; }
    box.append(el("strong", { text: "Please fix the following:" }));
    const ul = el("ul", { class: "mb-0 mt-1" });
    list.forEach((f) => ul.append(el("li", {}, [el("a", { text: errors[f], attrs: { href: "#" + (f === "consent" ? "f-consent" : "f-" + f) } })])));
    box.append(ul);
    box.hidden = false;
    box.focus();
    ul.querySelectorAll("a").forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault(); const t = form.querySelector(a.getAttribute("href")); if (t) t.focus();
    }));
  }

  function status(kind, text, extra) {
    const box = $("formStatus");
    box.className = "form-status alert alert-" + kind;
    box.textContent = "";
    box.append(el("span", { text }));
    if (extra) box.append(" ", extra);
    box.hidden = false;
  }

  function composeWhatsAppMessage(v) {
    const lines = ["Hello " + (biz.name || "") + ", I would like to enquire about " + (v.service || "your services") + ".", "", v.message, ""];
    lines.push("Name: " + v.name);
    if (v.phone) lines.push("Phone: " + v.phone);
    if (v.email) lines.push("Email: " + v.email);
    return lines.join("\n");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    $("formStatus").hidden = true;
    const v = read();
    const errors = V.validateEnquiry(v, { allowedServices });
    showErrors(errors);
    if (Object.keys(errors).length) return;

    const url = buildWhatsAppUrl({ message: composeWhatsAppMessage(v) });
    if (!url) {
      status("warning", "The WhatsApp number on this site is not set up correctly. Please call us instead.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
    const link = el("a", { text: "Open WhatsApp manually", attrs: { href: url, target: "_blank", rel: "noopener noreferrer" } });
    status("info", "Your message is ready in WhatsApp. Review it and press Send there. Nothing has been sent yet. If WhatsApp did not open:", link);
  });

  $("btnEmail").addEventListener("click", async () => {
    $("formStatus").hidden = true;
    const v = read();
    if (v.honey) return; // hidden field filled in: treat as spam and do nothing
    const errors = V.validateEnquiry(v, { allowedServices, requireContact: true, requireConsent: true });
    showErrors(errors);
    if (Object.keys(errors).length || !endpoint) return;

    const btn = $("btnEmail");
    btn.disabled = true;
    status("secondary", "Sending...");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: v.name, phone: v.phone, email: v.email, service: v.service || "General enquiry",
          message: v.message, _subject: "Website enquiry - " + (biz.name || "cyber cafe"), _honey: ""
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && String(data.success) === "true") {
        status("success", "Your enquiry was sent by the form service. We will reply using the details you gave.");
        form.reset();
      } else {
        status("danger", "The enquiry could not be sent. Please use WhatsApp or call us instead.");
      }
    } catch (err) {
      status("danger", "Could not reach the form service. Check your connection, or use WhatsApp or call us.");
    } finally {
      btn.disabled = false;
    }
  });

  bindAll(mount);
})();
