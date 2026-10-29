
/*
  CUSTOMIZE THIS SECTION BEFORE PUBLISHING.
  WhatsApp number format: country code + number, digits only.
  Example for an Indian number: 919876543210
*/

const SHOP = {
    name: "Public Cyber Point",
    whatsapp: "9122699496",
    phone: "9122699496, 6299407914",
    address: "Dahaura, Sakri, Darbhanga",
    hours: "Monday–Saturday: 8:00 AM–8:00 PM",
    mapsUrl: "https://maps.app.goo.gl/3Z7sDqz1J4w22PjX6"
  };
  
  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });
  
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });
  
  // Contact details
  document.getElementById("year").textContent = new Date().getFullYear();
  
  document.getElementById("shopAddress").textContent =
    SHOP.address || "Please add your shop address.";
  
  document.getElementById("shopPhone").textContent =
    SHOP.phone || "Please add your contact number.";
  
  document.getElementById("shopHours").textContent = SHOP.hours;
  
  const callLink = document.getElementById("callLink");
  
  if (SHOP.phone) {
    callLink.href = "tel:" + SHOP.phone.replace(/[^\d+]/g, "");
  } else {
    callLink.addEventListener("click", event => {
      event.preventDefault();
      alert("Please add your contact number in script.js.");
    });
  }
  
  const mapsLink = document.getElementById("mapsLink");
  
  if (SHOP.mapsUrl) {
    mapsLink.href = SHOP.mapsUrl;
  } else if (SHOP.address) {
    mapsLink.href =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(SHOP.address);
  } else {
    mapsLink.addEventListener("click", event => {
      event.preventDefault();
      alert("Please add your shop address in script.js.");
    });
  }
  
  // WhatsApp enquiry buttons
  document.querySelectorAll(".whatsapp-link").forEach(link => {
    link.addEventListener("click", event => {
      if (!/^\d{10,15}$/.test(SHOP.whatsapp)) {
        event.preventDefault();
        alert("Please configure your WhatsApp number in script.js.");
        return;
      }
  
      const service = link.dataset.service;
      const message = service
        ? `Hello ${SHOP.name}, I would like to enquire about ${service}. Please share the price and details.`
        : `Hello ${SHOP.name}, I would like to enquire about your services and prices.`;
  
      link.href =
        "https://wa.me/" + SHOP.whatsapp +
        "?text=" + encodeURIComponent(message);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  });
  