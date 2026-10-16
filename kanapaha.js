// Tabs + slideshow for the Kanapaha page. Works with plain links if JS is off.
document.querySelectorAll("[data-viewer]").forEach((v) => {
  const tabs = [...v.querySelectorAll('[role="tab"]')];
  const panels = [...v.querySelectorAll('[role="tabpanel"]')];

  function select(tab, focus) {
    tabs.forEach((t, i) => {
      const on = t === tab;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("keydown", (e) => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
    });
  });

  panels.forEach((p) => {
    const links = [...p.querySelectorAll(".v-thumbs a")];
    const img = p.querySelector(".v-stage img");
    const stage = p.querySelector(".v-stage");
    const title = p.querySelector(".v-title");
    const note = p.querySelector(".v-note");
    const num = p.querySelector(".v-num");
    let i = 0;

    function show(n) {
      i = (n + links.length) % links.length;
      const a = links[i];
      img.src = a.href;
      img.alt = a.dataset.alt;
      title.textContent = a.dataset.title;
      note.textContent = a.dataset.note;
      num.textContent = `${i + 1} / ${links.length}`;
      links.forEach((l, j) => j === i ? l.setAttribute("aria-current", "true") : l.removeAttribute("aria-current"));
      a.scrollIntoView({ block: "nearest", inline: "center", behavior: "auto" });
      new Image().src = links[(i + 1) % links.length].href; // preload next
    }
    links.forEach((a, j) => a.addEventListener("click", (e) => { e.preventDefault(); show(j); }));
    p.querySelector(".v-prev").addEventListener("click", () => show(i - 1));
    p.querySelector(".v-next").addEventListener("click", () => show(i + 1));
    p.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(i - 1);
      if (e.key === "ArrowRight") show(i + 1);
    });
    // Swipe on touch screens
    let x0 = null;
    stage.addEventListener("pointerdown", (e) => { if (e.pointerType === "touch") x0 = e.clientX; });
    stage.addEventListener("pointerup", (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
    });
  });
});

// Student work showcase: shuffles through images and changes every 5 seconds.
(() => {
  const root = document.querySelector("[data-showcase]");
  if (!root) return;
  const all = JSON.parse(document.getElementById("sc-data").textContent);
  const img = root.querySelector(".sc-stage img");
  const title = root.querySelector(".v-title");
  const note = root.querySelector(".v-note");
  const toggle = root.querySelector(".sc-toggle");
  const filters = [...document.querySelectorAll(".sc-filters button")];
  const desc = document.getElementById("sc-desc");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DELAY = 5000;

  let cat = "all", queue = [], hist = [], pos = -1, playing = !reduce, hover = false, timer = null, token = 0, last = null;

  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // For "All", rotate through the three sets so each gets a turn.
  function makeQueue() {
    const sets = ["shirts", "pixel", "career"].map((c) => shuffle(all.filter((x) => x.cat === c)));
    let q = [];
    if (cat === "all") {
      while (sets.some((s) => s.length)) shuffle(sets.filter((s) => s.length)).forEach((s) => q.push(s.shift()));
    } else {
      q = shuffle(all.filter((x) => x.cat === cat));
    }
    if (q.length > 1 && q[0] === last) q.push(q.shift());
    return q;
  }

  function show(item) {
    last = item;
    const my = ++token;
    title.textContent = item.title;
    note.textContent = item.note;
    img.classList.add("out");
    const pre = new Image();
    pre.onload = pre.onerror = () => {
      if (my !== token) return;
      img.src = item.src;
      img.alt = item.alt;
      img.classList.remove("out");
    };
    pre.src = item.src;
    schedule();
  }

  function next() {
    if (pos < hist.length - 1) { pos++; return show(hist[pos]); }
    if (!queue.length) queue = makeQueue();
    const item = queue.shift();
    hist.push(item); if (hist.length > 60) hist.shift();
    pos = hist.length - 1;
    show(item);
  }
  function prev() { if (pos > 0) { pos--; show(hist[pos]); } }

  function schedule() {
    clearTimeout(timer);
    if (playing && !hover && !document.hidden) timer = setTimeout(next, DELAY);
  }
  function setPlaying(on) {
    playing = on;
    toggle.textContent = on ? "Pause" : "Play";
    toggle.setAttribute("aria-label", on ? "Pause slideshow" : "Play slideshow");
    schedule();
  }

  root.querySelector(".v-next").addEventListener("click", next);
  root.querySelector(".v-prev").addEventListener("click", prev);
  toggle.addEventListener("click", () => setPlaying(!playing));
  root.addEventListener("mouseenter", () => { hover = true; clearTimeout(timer); });
  root.addEventListener("mouseleave", () => { hover = false; schedule(); });
  root.addEventListener("focusin", () => { hover = true; clearTimeout(timer); });
  root.addEventListener("focusout", () => { hover = false; schedule(); });
  document.addEventListener("visibilitychange", schedule);

  let x0 = null;
  const stage = root.querySelector(".sc-stage");
  stage.addEventListener("pointerdown", (e) => { if (e.pointerType === "touch") x0 = e.clientX; });
  stage.addEventListener("pointerup", (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
  });

  filters.forEach((b) => b.addEventListener("click", () => {
    filters.forEach((f) => f.setAttribute("aria-pressed", f === b));
    cat = b.dataset.cat;
    desc.textContent = b.dataset.desc;
    queue = []; hist = []; pos = -1;
    next();
  }));

  setPlaying(playing);
  next();
})();
