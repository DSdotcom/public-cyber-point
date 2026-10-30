/*
  base-404.js - used ONLY by 404.html.
  GitHub Pages serves 404.html for any missing address (e.g. /repo/typo/page), so relative links would break.
  This sets a <base> tag so css/js/images and links still resolve from the site root.
  Project site (username.github.io/repo/): detected automatically.
  User site (username.github.io/): set REPO_BASE = "/" below. Custom domain at root: also "/".
*/
(function () {
  "use strict";
  var REPO_BASE = null; // null = auto-detect
  var base = "/";
  if (REPO_BASE) {
    base = REPO_BASE;
  } else if (/\.github\.io$/.test(location.hostname)) {
    var first = location.pathname.split("/")[1];
    if (first) base = "/" + first.replace(/[^A-Za-z0-9._-]/g, "") + "/";
  }
  document.write('<base href="' + base + '">');
})();
