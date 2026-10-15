// Before/after photo slider: sweeps in on load, then can be dragged or moved with arrow keys.
(() => {
  const el = document.querySelector("[data-compare]");
  if (!el) return;
  const handle = el.querySelector(".cmp-handle");

  // Where the slider starts, where the intro stops (percent of the width showing the "before" photo), and how long it takes.
  // START 100 = all "before". END 53.5 = middle. Change END to 0 to sweep all the way to "after".
  const START = 100, END = 53.5, DURATION = 2200, DELAY = 500;

  let pos = 50, raf = 0, dragging = false;

  const set = (p) => {
    pos = Math.min(100, Math.max(0, p));
    el.style.setProperty("--pos", pos + "%");
    handle.setAttribute("aria-valuenow", Math.round(pos));
    handle.setAttribute("aria-valuetext", `${Math.round(pos)}% 2011, ${Math.round(100 - pos)}% 2025`);
  };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  const play = () => {
    const path = [START, 0, END];   // all 2011 -> all 2025 -> middle
    const times = [3000, 1800];     // milliseconds for each leg
    const ease = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const t0 = performance.now();
    const tick = (now) => {
      let ms = now - t0, leg = 0;
      while (leg < times.length - 1 && ms > times[leg]) { ms -= times[leg]; leg++; }
      const t = Math.min(1, ms / times[leg]);
      set(path[leg] + (path[leg + 1] - path[leg]) * ease(t));
      raf = (leg === times.length - 1 && t === 1) ? 0 : requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };

  const moveTo = (clientX) => {
    const r = el.getBoundingClientRect();
    set(((clientX - r.left) / r.width) * 100);
  };

  // Drag with mouse, finger or pen
  el.addEventListener("pointerdown", (e) => {
    stop(); dragging = true;
    el.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  });
  el.addEventListener("pointermove", (e) => { if (dragging) moveTo(e.clientX); });
  const end = () => { dragging = false; };
  el.addEventListener("pointerup", end);
  el.addEventListener("pointercancel", end);

  // Keyboard
  handle.addEventListener("keydown", (e) => {
    const step = e.shiftKey ? 10 : 3;
    const keys = { ArrowLeft: pos - step, ArrowDown: pos - step, ArrowRight: pos + step, ArrowUp: pos + step, Home: 0, End: 100 };
    if (e.key in keys) { e.preventDefault(); stop(); set(keys[e.key]); }
  });

  // Intro: start on the original photo, then play once when it scrolls into view
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    set(END);
  } else {
    set(START);
    new IntersectionObserver((entries, obs) => {
      if (entries.some((x) => x.isIntersecting)) {
        obs.disconnect();
        setTimeout(() => { if (!dragging && !raf && pos === START) play(); }, DELAY);
      }
    }, { threshold: 0.6 }).observe(el);
  }
})();
