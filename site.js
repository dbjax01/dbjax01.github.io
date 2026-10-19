// Edit the menu here once; every page updates.
const before = [["/", "Home"]];
const dropdown = [
  ["/fsa/", "Florida Scholars Academy"],
  ["/kanapaha/", "Kanapaha Middle School"],
  ["/flo-fly/", "Flo-Fly"],
  ["/education/", "Education"]
];
const after = [["/peace_corps/", "Peace Corps"], ["/goals/", "Career Goals"], ["/resume/", "Resume"]];

// The order of the "Previous / Next" links at the bottom of each page. Home is not part of it.
const tour = [
  ["/peace_corps/", "Peace Corps"],
  ["/fsa/", "Florida Scholars Academy"],
  ["/kanapaha/", "Kanapaha Middle School"],
  ["/flo-fly/", "Flo-Fly"],
  ["/education/", "Education"],
  ["/goals/", "Career Goals"],
  ["/resume/", "Resume"]
];

const EMAIL = "Dbjackson2001@gmail.com";
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Normalize the current address so "/education", "/education/" and "/education/index.html" all match "/education/"
const here = location.pathname.replace(/index\.html$/, "").replace(/\/?$/, "/");
const item = ([h, t]) => `<li><a href="${h}"${h === here ? ' aria-current="page"' : ""}>${t}</a></li>`;
const inDropdown = dropdown.some(([h]) => h === here);

const links =
  before.map(item).join("") +
  `<li class="dd"><button type="button" aria-expanded="false"${inDropdown ? ' aria-current="true"' : ""}>Background <span aria-hidden="true">&#9662;</span></button><ul>${dropdown.map(item).join("")}</ul></li>` +
  after.map(item).join("") +
  '<li><a href="#contact">Contact</a></li>';

document.head.insertAdjacentHTML("beforeend", '<meta name="theme-color" content="#F5F8F7"><link rel="icon" href="/photos/favicon.svg" type="image/svg+xml"><link rel="icon" href="/photos/favicon.ico" sizes="any">');

document.body.insertAdjacentHTML("afterbegin",
  `<a class="skip" href="#main">Skip to content</a>` +
  `<header><nav class="wrap" aria-label="Main"><a class="logo" href="/">David Jackson</a>` +
  `<button type="button" class="nav-toggle" aria-expanded="false" aria-controls="nav-list"><span class="nav-ico" aria-hidden="true"><i></i><i></i><i></i></span>Menu</button>` +
  `<ul id="nav-list">${links}</ul></nav><div class="read" aria-hidden="true"><i></i></div></header>`);

const main = document.querySelector("main");
if (main && !main.id) { main.id = "main"; main.tabIndex = -1; }

// Previous / next page links
const k = tour.findIndex(([h]) => h === here);
if (main && k > -1) {
  const prev = tour[k - 1], next = tour[k + 1] || ["/", "Home"];
  main.insertAdjacentHTML("beforeend",
    `<section class="pager-sec"><div class="wrap pager" role="navigation" aria-label="More pages">` +
    (prev ? `<a class="prev" href="${prev[0]}"><small>Previous</small><b>${prev[1]}</b></a>` : "") +
    `<a class="next" href="${next[0]}"><small>${next[0] === "/" ? "Back to" : "Next"}</small><b>${next[1]}</b></a></div></section>`);
}

document.body.insertAdjacentHTML("beforeend",
  `<footer class="contact" id="contact"><div class="wrap"><h2>Let's talk about your students</h2>` +
  `<p>I'm available for secondary teaching roles after my Peace Corps service. I'd welcome a conversation with any principal or department head.</p>` +
  `<p class="mail"><a class="big" href="mailto:${EMAIL}">${EMAIL}</a><button type="button" class="copy-btn" data-copy="${EMAIL}">Copy email</button></p>` +
  `<p><a href="https://www.linkedin.com/in/dbj01/">linkedin.com/in/dbj01</a></p>` +
  `<ul class="foot-links"><li><a href="/">Home</a></li><li><a href="/resume/">Resume</a></li><li><a href="/goals/">Career Goals</a></li><li><a href="/peace_corps/">Peace Corps</a></li></ul>` +
  `</div></footer>` +
  `<button type="button" class="to-top" aria-label="Back to top"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 15l7-7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></button>` +
  `<div class="toast" role="status" aria-live="polite"></div>`);

// ---- Menu: dropdown on desktop, full-width panel on phones ----
const header = document.querySelector("header");
const dd = document.querySelector(".dd");
const ddBtn = dd.querySelector("button");
const toggle = document.querySelector(".nav-toggle");
const closeDropdown = () => { dd.classList.remove("open"); ddBtn.setAttribute("aria-expanded", "false"); };
const closePanel = () => { header.classList.remove("menu-open"); toggle.setAttribute("aria-expanded", "false"); };

ddBtn.addEventListener("click", () => {
  const open = dd.classList.toggle("open");
  ddBtn.setAttribute("aria-expanded", open);
});
toggle.addEventListener("click", () => {
  const open = header.classList.toggle("menu-open");
  toggle.setAttribute("aria-expanded", open);
  if (!open) closeDropdown();
});
document.querySelector("#nav-list").addEventListener("click", (e) => { if (e.target.closest("a")) { closePanel(); closeDropdown(); } });
document.addEventListener("click", (e) => {
  if (!dd.contains(e.target)) closeDropdown();
  if (!header.contains(e.target)) closePanel();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const wasOpen = header.classList.contains("menu-open") || dd.classList.contains("open");
    closeDropdown(); closePanel();
    if (wasOpen) toggle.offsetParent ? toggle.focus() : ddBtn.focus();
  }
});
matchMedia("(min-width: 901px)").addEventListener("change", (m) => { if (m.matches) closePanel(); });

// ---- Reading progress bar and back-to-top button ----
const bar = document.querySelector(".read i");
const toTop = document.querySelector(".to-top");
let queued = false;
const onScroll = () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    bar.style.setProperty("--p", max > 0 ? Math.min(1, scrollY / max).toFixed(3) : 0);
    toTop.classList.toggle("show", scrollY > 800);
  });
};
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);
onScroll();
toTop.addEventListener("click", () => { scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); });

// ---- Copy email ----
const toast = document.querySelector(".toast");
let toastTimer = 0;
const say = (msg) => {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
};
document.querySelectorAll("[data-copy]").forEach((b) => {
  b.addEventListener("click", async () => {
    const text = b.dataset.copy;
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; }
    catch {
      const t = document.createElement("textarea");
      t.value = text; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select();
      try { ok = document.execCommand("copy"); } catch {}
      t.remove();
    }
    if (ok) {
      const old = b.textContent;
      b.textContent = "Copied"; b.classList.add("done");
      say("Email address copied");
      setTimeout(() => { b.textContent = old; b.classList.remove("done"); }, 2000);
    } else {
      say("Could not copy. Select the address instead.");
    }
  });
});
