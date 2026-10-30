# Public Cyber Point website

A fast, mobile-friendly static website for a local cyber cafe: services, pricing, WhatsApp enquiries, location and contact. No backend, no build step, no paid services. Hosted free on GitHub Pages.

## 1. Overview
Pages: Home, Services (search + filters), Pricing (search + filters), About Us, Contact, 404.
All business details live in **`js/config.js`**. The pages read from it, so you rarely edit HTML.

**Important placeholders to replace before launch:** phone, WhatsApp, email, hours, the demo prices (`pricesAreDemo`), the sample images, and `siteUrl`. The site never invents testimonials, awards or history. Empty optional sections stay hidden.

## 2. Technology stack
HTML5, CSS3 (custom properties), vanilla JavaScript ES6+, Bootstrap 5.3.3, Bootstrap Icons 1.11.3, Google Fonts (Inter, Plus Jakarta Sans), Git + GitHub Pages.

External dependencies (loaded from CDNs, pinned versions, Bootstrap files use Subresource Integrity):
- `cdn.jsdelivr.net`: Bootstrap CSS/JS, Bootstrap Icons
- `fonts.googleapis.com` / `fonts.gstatic.com`: fonts
- Optional: `formsubmit.co` (contact form by email, off by default); `www.google.com/maps/embed` (map, off until configured)

AOS and Swiper are intentionally not used; CSS and a few lines of JS cover the animations and gallery.

## 3. Folder structure
```
index.html  services.html  pricing.html  about.html  contact.html  404.html
robots.txt  sitemap.xml  LICENSE  README.md  .nojekyll
assets/images/ (logo.png, favicon.png, hero.webp, workspace.webp, printing.webp, gallery/)
css/  style.css (design tokens + components)  responsive.css  animations.css
js/   config.js (EDIT THIS)  main.js (shared)  home.js  services.js  pricing.js
      about.js  contact.js  validation.js  base-404.js (404 page only)
```
`about.js`, `home.js` and `base-404.js` were added to keep each page's code separate.

## 4. Run locally
1. Install Visual Studio Code and the **Live Server** extension.
2. Open the `cyber-cafe-website` folder in VS Code.
3. Right-click `index.html` and choose **Open with Live Server**.

Opening files by double-click mostly works, but use Live Server for the most accurate result.

## 5. Change the business name and contact details
Edit the `business` block in `js/config.js` (name, tagline, phone, WhatsApp, email, address, hours). Every page, the footer and the structured data update automatically.

## 6. Add or remove services
In `config.js`, each service is one line-block in `services`:
```js
{ id: "lamination", title: "Lamination", category: "documents", icon: "bi-layers",
  description: "Protect important documents.", price: 25, unit: "per sheet",
  enabled: true, featured: true, previewPrice: true, availability: "available" }
```
- `enabled: false` hides it everywhere. Only enable services you really offer.
- `featured: true` shows it on the home page; `previewPrice: true` lists it in the home pricing preview.
- Icons: any name from https://icons.getbootstrap.com (for example `bi-printer`).
- Categories are in the `categories` list.

## 7. Update prices
Set `price` to a number in INR, or `null` to show "Contact for pricing". Set `unit` (for example `"per page"`). The sample prices are **demonstration data**: replace them, then set `pricesAreDemo: false` to remove the demo notices.

## 8. Replace images and the logo
- Logo: replace `assets/images/logo.png` (square, about 256 px). Favicon: `assets/images/favicon.png`.
- Hero: replace `assets/images/hero.webp` (about 1200x900) and edit `images.heroAlt`; set `heroIsSample: false`.
- Gallery: put your photos in `assets/images/gallery/` (WebP, about 800x600), edit the `gallery` list, set `galleryIsSample: false`.
- The included images are labelled placeholders, not photos of your shop.

## 9. Configure WhatsApp
Set `business.whatsapp` (any format, e.g. `+91 98765 43210`). The site keeps digits only, adds `91` to 10-digit numbers, and checks the length. If the number is invalid, WhatsApp buttons send visitors to the Contact page instead. Nothing is ever sent automatically: WhatsApp opens with a message the customer reviews and sends.

## 10. Configure Google Maps
- `mapsUrl`: your Google Maps share link, used by **Get Directions**.
- `mapsEmbedUrl` (optional): in Google Maps choose Share > Embed a map, copy only the `src="..."` URL (it must start with `https://www.google.com/maps/embed`). If empty, a clear placeholder is shown instead of a misleading map.

## 11. GitHub Pages base path
All links and assets use relative paths, so the site works at `https://username.github.io/repository-name/` without changes. Set `siteUrl` in `config.js` (with trailing slash) once deployed; it enables canonical links, Open Graph URLs and structured data URLs. Then replace `USERNAME` and `REPOSITORY-NAME` in `sitemap.xml` and `robots.txt`.

## 12. Deploy with GitHub
1. Create a free account, then **New repository** (public).
2. Upload the project files (Add file > Upload files), or from a terminal in the project folder:
   ```
   git init
   git add .
   git commit -m "Initial website"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPOSITORY-NAME.git
   git push -u origin main
   ```
3. Later changes: `git add .`, `git commit -m "Update prices"`, `git push`.
4. In the repository open **Settings > Pages**.
5. Under Build and deployment choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then Save.
6. Wait a minute or two for the deployment to finish (see the Actions tab).
7. Open the address shown at the top of the Pages settings.
8. Click through every page, link, image, the map and the WhatsApp buttons.

## 13. Contact form options
- **WhatsApp (default, no backend):** the form checks the input, then opens WhatsApp with a message prepared for the customer to review. The page says plainly that nothing has been sent yet.
- **Email via FormSubmit (optional):** set `formService.enabled: true` and `endpoint: "https://formsubmit.co/ajax/YOUR-ACTIVATION-CODE"`. The first submission triggers an activation email from FormSubmit to the owner's address; follow it once. Only `formsubmit.co` endpoints are accepted. Data is sent only after the visitor ticks the consent box and presses **Send by email**, and success is shown only if the service confirms it. Review FormSubmit's terms and privacy policy first.

## 14. Security and privacy notes
- Dynamic content is written with `textContent`/`setAttribute`; configuration data is never inserted with `innerHTML`.
- URLs from the config are validated (https only for external links; relative paths without `..`).
- A Content Security Policy (meta tag) restricts scripts, styles, frames and network requests to the hosts listed above. GitHub Pages cannot set HTTP headers, so the meta tag is the available option.
- External links use `rel="noopener noreferrer"`. No cookies, analytics or tracking. Nothing is saved in `localStorage`.
- Never put passwords or API keys in any frontend file. Do not use WhatsApp Business API credentials here.

## 15. Common problems
| Problem | Fix |
|---|---|
| Page shows 404 on GitHub | Pages not enabled, wrong branch/folder, or `index.html` not in the root. Check Settings > Pages. |
| No styles or icons | The CDN was blocked or offline. Check the browser console and your connection. If you edit a Bootstrap URL, remove or update its `integrity` value. |
| Images missing | File names are case-sensitive on GitHub. Check the paths in `config.js`. |
| WhatsApp button goes to Contact page | `business.whatsapp` is empty or invalid. |
| Map shows a placeholder | `mapsEmbedUrl` is empty or not a Google Maps embed link. |
| Changes not visible | Wait for deployment, then hard-refresh (Ctrl+F5). |
| 404 page looks unstyled | For a user site (`username.github.io`), set `REPO_BASE = "/"` in `js/base-404.js`. |

## 16. Testing checklist (tick each yourself before launch)
**Functionality:** all navigation links; mobile menu opens/closes; service search and filters; pricing search and filters; WhatsApp buttons open the right chat and text; form errors appear and are readable; Get Directions opens your location; FAQ accordion; back-to-top; delete a config value and confirm the page still loads.
**Responsive:** at 320, 375, 425, 768, 1024, 1440 and 1920 px there is no sideways scrolling or overlap, the pricing table becomes stacked cards on phones, forms fit.
**Deployment:** every page loads at the repository URL; no broken links or images; no red errors in the browser console.
**Quality:** titles and descriptions per page; keyboard-only use works with visible focus; no fake testimonials or invented details; run Lighthouse and treat the scores as targets.

## License
MIT. See `LICENSE`.
