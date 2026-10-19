// Homepage interactions: the experience reel and the "How I'd teach it" picker.
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =====================================================
     1. EXPERIENCE REEL
     Plays each experience for SLIDE_MS, then moves on. It pauses on hover, when off screen,
     and on keyboard focus. Visitors can also pick, step, swipe or pause it.
     ===================================================== */
  const SLIDE_MS = 7000;

  const root = document.querySelector("[data-reel]");
  if (root) {
    root.classList.add("js");
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const slides = [...root.querySelectorAll(".rv-slide")];
    const figs = [...root.querySelectorAll(".rv-fig")];
    const count = root.querySelector(".rv-count");
    const toggle = root.querySelector('[data-act="toggle"]');
    const body = root.querySelector(".rv-body");
    const n = tabs.length;

    // Photos: try each file in data-src until one loads. Until then, the dashed placeholder stays.
    // To use your own photo, save it as /photos/home-peace-corps.jpg, home-fsa.jpg, home-kanapaha.jpg or home-flofly.jpg.
    figs.forEach((fig) => {
      const list = (fig.dataset.src || "").split("|").filter(Boolean);
      (function next() {
        const src = list.shift();
        if (!src) return;
        const img = new Image();
        img.alt = "";
        img.onload = () => { fig.classList.add("has-img"); fig.prepend(img); };
        img.onerror = next;
        img.src = src;
      })();
    });

    let i = 0, elapsed = 0, last = 0;
    let playing = !reduced, inView = false, hovering = false, focused = false;

    // Count a number up the first time its slide appears
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const countUp = (el) => {
      if (reduced) return;
      const to = +el.dataset.count, t0 = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - t0) / 900);
        el.textContent = Math.round(to * ease(t));
        if (t < 1) requestAnimationFrame(step);
      };
      el.textContent = "0";
      requestAnimationFrame(step);
    };

    const paint = () => {
      tabs.forEach((t, k) => {
        const p = k < i ? 1 : k === i ? Math.min(1, elapsed / SLIDE_MS) : 0;
        t.querySelector(".rv-bar b").style.transform = `scaleX(${p})`;
      });
    };

    const live = () => root.querySelector(".rv-slides").setAttribute("aria-live", playing ? "off" : "polite");

    const go = (to) => {
      const prev = i;
      i = (to + n) % n;
      elapsed = reduced ? SLIDE_MS : 0;
      tabs.forEach((t, k) => {
        t.setAttribute("aria-selected", k === i);
        t.tabIndex = k === i ? 0 : -1;
      });
      slides.forEach((s, k) => { s.hidden = false; s.classList.toggle("on", k === i); });
      figs.forEach((f, k) => f.classList.toggle("on", k === i));
      count.textContent = `${i + 1} of ${n}`;
      if (i !== prev) slides[i].querySelectorAll("[data-count]").forEach(countUp);
      paint();
    };

    const setPlaying = (on) => {
      playing = on;
      toggle.textContent = on ? "Pause" : "Play";
      toggle.setAttribute("aria-pressed", String(!on));
      live();
    };

    const tick = (now) => {
      requestAnimationFrame(tick);
      const dt = Math.min(now - last, 100);
      last = now;
      if (!playing || !inView || hovering || focused || document.hidden) return;
      elapsed += dt;
      if (elapsed >= SLIDE_MS) go(i + 1);
      else paint();
    };

    // Start: slide 1 is showing; begin the clock once the reel is on screen
    go(0);
    setPlaying(playing);
    new IntersectionObserver((entries) => { inView = entries.some((e) => e.isIntersecting); }, { threshold: 0.35 }).observe(root);
    requestAnimationFrame((t) => { last = t; tick(t); });

    // Controls
    tabs.forEach((t, k) => {
      t.addEventListener("click", () => go(k));
      t.addEventListener("keydown", (e) => {
        const to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: n - 1 }[e.key];
        if (to === undefined) return;
        e.preventDefault();
        go(to);
        tabs[i].focus();
      });
    });
    root.querySelector('[data-act="prev"]').addEventListener("click", () => go(i - 1));
    root.querySelector('[data-act="next"]').addEventListener("click", () => go(i + 1));
    toggle.addEventListener("click", () => setPlaying(!playing));

    // Pause while someone is reading
    body.addEventListener("mouseenter", () => { hovering = true; });
    body.addEventListener("mouseleave", () => { hovering = false; });
    root.addEventListener("focusin", (e) => { focused = e.target.matches(":focus-visible"); });
    root.addEventListener("focusout", () => { focused = false; });

    // Swipe on phones
    let x0 = null;
    body.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") x0 = e.clientX; });
    body.addEventListener("pointerup", (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
    });
    body.addEventListener("pointercancel", () => { x0 = null; });
  }

  /* =====================================================
     2. "HOW I'D TEACH IT" PICKER
     ===================================================== */
  const fx = document.querySelector("[data-firsts]");
  if (fx) {
    const tabs = [...fx.querySelectorAll('[role="tab"]')];
    const panels = [...fx.querySelectorAll('[role="tabpanel"]')];
    const select = (k, focus) => {
      tabs.forEach((t, j) => {
        t.setAttribute("aria-selected", j === k);
        t.tabIndex = j === k ? 0 : -1;
        panels[j].hidden = j !== k;
      });
      if (focus) tabs[k].focus();
    };
    tabs.forEach((t, k) => {
      t.addEventListener("click", () => select(k));
      t.addEventListener("keydown", (e) => {
        const to = { ArrowRight: k + 1, ArrowLeft: k - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (to === undefined) return;
        e.preventDefault();
        select((to + tabs.length) % tabs.length, true);
      });
    });
  }

  /* =====================================================
     3. STUDENTS OF EVERY AGE: bars rise once when scrolled into view
     ===================================================== */
  const ages = document.querySelector("[data-ages]");
  if (ages) {
    ages.classList.add("js");
    if (reduced || !("IntersectionObserver" in window)) {
      ages.classList.add("in");
    } else {
      new IntersectionObserver((entries, obs) => {
        if (entries.some((e) => e.isIntersecting)) { ages.classList.add("in"); obs.disconnect(); }
      }, { threshold: 0.35 }).observe(ages);
    }
  }
})();
