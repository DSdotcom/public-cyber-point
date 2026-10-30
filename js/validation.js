/*
  validation.js - pure validation helpers for the enquiry form (no DOM access).
  Validation here only checks that input looks sensible. It does NOT send or store anything.
*/
(function () {
  "use strict";

  const LIMITS = Object.freeze({ nameMin: 2, nameMax: 60, messageMin: 10, messageMax: 500, emailMax: 100 });
  const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M} .'\-]*$/u;
  const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
  const PHONE_RE = /^(?:\+?91)?[6-9]\d{9}$/;

  const tidy = (v) => String(v == null ? "" : v).replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "").trim();

  function validateName(v) {
    const s = tidy(v);
    if (!s) return "Enter your name.";
    if (s.length < LIMITS.nameMin) return "Your name must have at least 2 characters.";
    if (s.length > LIMITS.nameMax) return "Your name must be 60 characters or fewer.";
    if (!NAME_RE.test(s)) return "Use letters, spaces, full stops, apostrophes or hyphens only.";
    return "";
  }

  function validatePhone(v) {
    const s = tidy(v).replace(/[\s\-()]/g, "");
    if (!s) return "";
    return PHONE_RE.test(s) ? "" : "Enter a 10-digit Indian mobile number, with or without +91.";
  }

  function validateEmail(v) {
    const s = tidy(v);
    if (!s) return "";
    return s.length <= LIMITS.emailMax && EMAIL_RE.test(s) ? "" : "Enter a valid email address, for example name@example.com.";
  }

  function validateMessage(v) {
    const s = tidy(v);
    if (!s) return "Write a short message about what you need.";
    if (s.length < LIMITS.messageMin) return "Please write at least 10 characters so we can understand your request.";
    if (s.length > LIMITS.messageMax) return "Your message must be 500 characters or fewer.";
    return "";
  }

  /** Returns an object of { fieldName: errorMessage }. Empty object means valid. */
  function validateEnquiry(values, options) {
    const o = options || {};
    const errors = {};
    const set = (k, m) => { if (m) errors[k] = m; };
    set("name", validateName(values.name));
    set("phone", validatePhone(values.phone));
    set("email", validateEmail(values.email));
    set("message", validateMessage(values.message));
    if (values.service && Array.isArray(o.allowedServices) && !o.allowedServices.includes(values.service)) {
      errors.service = "Choose a service from the list.";
    }
    if (o.requireContact && !tidy(values.phone) && !tidy(values.email)) {
      errors.phone = errors.phone || "Add a phone number or an email address so we can reply.";
    }
    if (o.requireConsent && !values.consent) {
      errors.consent = "Tick the box to agree before sending.";
    }
    return errors;
  }

  window.Validation = Object.freeze({ LIMITS, tidy, validateName, validatePhone, validateEmail, validateMessage, validateEnquiry });
})();
