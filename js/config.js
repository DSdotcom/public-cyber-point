/*
  ==========================================================================
  SITE CONFIGURATION - the ONLY file you need to edit for business details.
  --------------------------------------------------------------------------
  * Everything here is PUBLIC. Never put passwords, API keys or secrets here.
  * Leave a value as "" (or [] for lists) to hide the feature that uses it.
  * Values marked PLACEHOLDER must be confirmed by the owner before launch.
  ==========================================================================
*/
const SITE_CONFIG = {
  business: {
    name: "Public Cyber Point",
    tagline: "Your Trusted Digital Service Center",
    shortDescription:
      "A local cyber cafe for printing, scanning, documentation, online applications and everyday digital help.",
    owner: "Vicky Kumar",                       // PLACEHOLDER
    phone: "+91 9122699496",        // PLACEHOLDER - shown and used for "Call" buttons
    whatsapp: "+91 9122699496",                 // PLACEHOLDER - any format; digits are extracted automatically
    defaultCountryCode: "91",                   // added when a 10-digit number is given
    email: "codecrash7@gmail.com",              // PLACEHOLDER
    address: {
      line1: "Dahaura, Sakri, Darbhanga",
      city: "Sakri",
      state: "Bihar",
      postalCode: "847239",
      country: "IN"
    },
    mapsUrl: "https://maps.app.goo.gl/Em2N8bmpmjPfjnsn9", // "Get Directions" button (https only)
    mapsEmbedUrl: "",   // Optional. Paste the src of Google Maps > Share > Embed a map. Empty = placeholder is shown.
    hours: {
      text: "Daily: 8:00 AM - 8:00 PM",         // PLACEHOLDER - shown to visitors
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], // used in structured data
      opens: "08:00",
      closes: "20:00"
    },
    currency: "INR"
  },

  // Production URL, e.g. "https://username.github.io/repository-name/". Leave "" until deployed.
  // Used for canonical links, Open Graph URLs and structured data. Relative paths are used everywhere else,
  // so the site works under any repository sub-path.
  siteUrl: "",

  images: {
    logo: "assets/images/logo.png",
    favicon: "assets/images/favicon.png",
    hero: "assets/images/hero.webp",
    heroAlt: "Sample image: a computer workstation and printer. Replace with a photo of your shop.",
    heroIsSample: true
  },

  // Shown in a bar above the header. Set text to "" to hide it.
  announcement: {
    text: "",           // e.g. "Open on all days. Message us on WhatsApp to confirm services and prices."
    linkText: "",
    linkHref: ""        // internal page such as "pricing.html" or an https:// link
  },

  // Prices below are DEMONSTRATION values. Replace them, then set pricesAreDemo to false.
  pricesAreDemo: true,
  pricingNotice: "Final charges depend on document type, quantity, materials and any government or portal fees. Please confirm the price with us before ordering.",

  categories: [
    { id: "printing",   label: "Printing and Photocopying", icon: "bi-printer" },
    { id: "documents",  label: "Documentation",             icon: "bi-file-earmark-text" },
    { id: "computer",   label: "Computer and Internet",     icon: "bi-pc-display" },
    { id: "assistance", label: "Online Assistance",         icon: "bi-person-workspace" },
    { id: "photo",      label: "Photo Services",            icon: "bi-camera" },
    { id: "other",      label: "Other Services",            icon: "bi-grid" }
  ],

  /*
    SERVICES
    id            unique, lowercase, no spaces
    category      one of the category ids above
    icon          any Bootstrap Icons class name
    price         number in INR, or null to show "Contact for pricing"
    unit          e.g. "per page" (only shown with a price)
    enabled       false = hidden everywhere (the site never claims a disabled service)
    featured      true = shown on the home page
    previewPrice  true = listed in the home page pricing preview
    sensitive     true = shows a reminder about protecting passwords/OTPs
    availability  "available" or "on-request"
  */
  services: [
    { id: "internet-access", title: "Internet and Computer Access", category: "computer", icon: "bi-pc-display",
      description: "Use a computer with internet for browsing, forms, study and everyday tasks.",
      price: 20, unit: "per hour", enabled: true, featured: true, previewPrice: true, availability: "available" },
    { id: "bw-printing", title: "Black and White Printing", category: "printing", icon: "bi-printer",
      description: "Clear black and white printouts of documents, notes and forms.",
      price: 2, unit: "per page", enabled: true, featured: true, previewPrice: true, availability: "available" },
    { id: "color-printing", title: "Color Printing", category: "printing", icon: "bi-palette",
      description: "Color prints for reports, certificates, photos and presentations.",
      price: 10, unit: "per page", enabled: true, featured: true, previewPrice: true, availability: "available" },
    { id: "photocopying", title: "Photocopying", category: "printing", icon: "bi-files",
      description: "Quick copies of ID proofs, certificates and everyday documents.",
      price: 2, unit: "per page", enabled: true, featured: true, previewPrice: true, availability: "available" },
    { id: "scanning", title: "Document Scanning", category: "documents", icon: "bi-upc-scan",
      description: "Scan paper documents to PDF or image files for upload or email.",
      price: 10, unit: "per page", enabled: true, featured: true, previewPrice: true, availability: "available" },
    { id: "lamination", title: "Lamination", category: "documents", icon: "bi-layers",
      description: "Protect important documents, cards and certificates.",
      price: 25, unit: "per sheet", enabled: true, featured: true, previewPrice: true, availability: "available" },
    { id: "binding", title: "Binding", category: "documents", icon: "bi-journal-bookmark",
      description: "Neat binding for projects, reports and file sets.",
      price: null, unit: "", enabled: true, featured: false, previewPrice: true, availability: "on-request" },
    { id: "resume", title: "Resume and CV Preparation", category: "documents", icon: "bi-person-vcard",
      description: "Help preparing a clean resume or CV, ready to print or share.",
      price: null, unit: "", enabled: true, featured: false, previewPrice: false, availability: "on-request" },
    { id: "typing", title: "Document Typing", category: "documents", icon: "bi-keyboard",
      description: "Typing of letters, applications and other documents.",
      price: null, unit: "", enabled: true, featured: false, previewPrice: false, availability: "on-request" },
    { id: "pdf-tools", title: "PDF Editing and Conversion", category: "documents", icon: "bi-filetype-pdf",
      description: "Convert, merge, compress or edit PDF files.",
      price: null, unit: "", enabled: true, featured: false, previewPrice: false, availability: "on-request" },
    { id: "online-forms", title: "Online Form Assistance", category: "assistance", icon: "bi-ui-checks",
      description: "Help filling and submitting eligible online applications and registrations.",
      price: 50, unit: "per form", enabled: true, featured: true, previewPrice: true, sensitive: true, availability: "available" },
    { id: "pan-assistance", title: "PAN Application Assistance", category: "assistance", icon: "bi-person-badge",
      description: "Help with PAN applications through the official channels.",
      price: null, unit: "", enabled: true, featured: false, previewPrice: false, sensitive: true, availability: "on-request" },
    { id: "email-help", title: "Email and Online Assistance", category: "assistance", icon: "bi-envelope-paper",
      description: "Help creating accounts, sending email and using online services.",
      price: null, unit: "", enabled: true, featured: false, previewPrice: false, sensitive: true, availability: "on-request" },
    { id: "passport-photo", title: "Passport Photo Services", category: "photo", icon: "bi-person-square",
      description: "Photos for applications and documents.",
      price: null, unit: "", enabled: true, featured: false, previewPrice: false, availability: "on-request" },
    // Switch these on ONLY if you really offer them.
    { id: "govt-applications", title: "Government Application Assistance", category: "assistance", icon: "bi-bank",
      description: "Help with government applications and registrations.",
      price: null, unit: "", enabled: false, featured: false, previewPrice: false, sensitive: true, availability: "on-request" },
    { id: "ticket-booking", title: "Ticket Booking Assistance", category: "other", icon: "bi-ticket-perforated",
      description: "Help booking travel and event tickets online.",
      price: null, unit: "", enabled: false, featured: false, previewPrice: false, sensitive: true, availability: "on-request" }
  ],

  // Gallery. These are SAMPLE images. Replace files in assets/images/gallery/ and set isSample to false.
  galleryIsSample: true,
  gallery: [
    { src: "assets/images/gallery/workstations.webp", alt: "Sample image: computer workstations", caption: "Computer workstations", width: 800, height: 600 },
    { src: "assets/images/gallery/printing.webp",     alt: "Sample image: printing equipment",   caption: "Printing equipment",    width: 800, height: 600 },
    { src: "assets/images/gallery/service-desk.webp", alt: "Sample image: service desk",         caption: "Service desk",          width: 800, height: 600 },
    { src: "assets/images/gallery/interior.webp",     alt: "Sample image: interior workspace",   caption: "Interior workspace",    width: 800, height: 600 },
    { src: "assets/images/gallery/facilities.webp",   alt: "Sample image: available facilities", caption: "Facilities",            width: 800, height: 600 }
  ],

  // Add ONLY real customer feedback with permission. An empty list hides the whole section.
  // Example: { quote: "Quick and helpful.", name: "A. Customer", detail: "Printing customer" }
  testimonials: [],

  // Optional social profiles. Only https:// links are used. Empty = hidden.
  social: { facebook: "", instagram: "", youtube: "" },

  // FAQ. Tokens {name} {hours} {phone} {address} are replaced automatically.
  faqs: [
    { q: "What services are available?", a: "Please see our Services page for the current list. If you do not see what you need, message us and we will tell you whether we can help." },
    { q: "Do you provide color printing?", a: "Color printing is listed on our Services page when it is available. Message us to confirm the price and quantity before visiting.", requires: "color-printing" },
    { q: "Can I contact the cafe through WhatsApp?", a: "Yes. Use any WhatsApp button on this site. It opens a ready-to-edit message and nothing is sent until you press send in WhatsApp." },
    { q: "What are the opening hours?", a: "{name} is open {hours}." },
    { q: "Do I need to book before visiting?", a: "Booking is not required for most services. For larger jobs, message or call {phone} first so we can confirm availability." },
    { q: "How can I confirm service pricing?", a: "Prices on this site are a guide. Message or call us to confirm the final price for your document, quantity and material before we start." },
    { q: "Can I bring documents on my phone or email them?", a: "Please ask us first on WhatsApp or by phone. Do not share passwords, OTPs or identity documents in a message you do not need to send." }
  ],

  // Optional third-party form service (OFF by default). See README > "Contact form options".
  // Only formsubmit.co endpoints are accepted. Customer data is sent ONLY when the visitor ticks the consent box and presses the button.
  formService: {
    enabled: false,
    endpoint: ""   // e.g. "https://formsubmit.co/ajax/your-activation-code"
  },

  about: {
    introduction: "Public Cyber Point is a local digital service center in Sakri, Darbhanga. We help people with printing, scanning, documentation and online applications.",
    mission: "",           // Write your own. Empty = section hidden.
    values: [],            // e.g. [{ title: "Clear pricing", text: "We confirm the price before we start." }]
    approach: "We confirm what you need and the price first, then complete the work with you at the counter.",
    facilities: [],        // e.g. ["Air-conditioned seating", "Power backup"] - list only what is true
    convenience: "You can ask about a service on WhatsApp before you visit."
  }
};
