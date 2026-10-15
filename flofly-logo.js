// Animated Flo-Fly logo.
// Sequence: propeller alone on the circle -> spins up while the blue streaks fade in and spin with it
// (like motion blur behind the blades) -> slows to a stop, and on its final turn the blade uncovers "Flo-Fly".
// Put <div data-flofly-logo></div> where the logo should go.
(() => {
  const host = document.querySelector("[data-flofly-logo]");
  if (!host) return;

  /* ---- Settings you may want to tweak ---- */
  const BG = host.dataset.bg || "/photos/flo-fly_background.png"; // gradient circle with black ring
  const HOLD = 600;      // ms the lone propeller sits still before spinning
  const SPIN = 3000;     // ms from spin-up to full stop
  const TURNS = 3;       // full rotations (the last one reveals the text)
  const FADE_FROM = 0; // propeller speed (degrees/second) where the blue streaks start to appear...
  const FADE_TO = 720;   // ...and where they are fully visible

  /* ---- Artwork (from Flo-Fly (New).svg) ---- */
  const STREAK_STYLE = "fill:#5fd8ff;stroke:#000;stroke-width:20;stroke-linecap:square;stroke-linejoin:round;paint-order:markers stroke fill";
  const STREAKS = "<path d=\"m 625.06,486.39 c -12.02,0.24 -24.16,1.56 -36.3,4.02 -12.5,2.53 -36.17,10.52 -47.65,16.09 -32.95,15.97 -61.04,40.54 -81.64,71.4 -6.51,9.75 -19.14,35.24 -21.91,44.22 l -1.61,5.23 4.64,-2.78 c 4.53,-2.71 4.71,-2.95 7.67,-10.2 10.02,-24.58 31.64,-52.53 54.59,-70.56 17.23,-13.53 33.31,-22.19 54.84,-29.5 21.76,-7.39 43.28,-10.59 65.21,-9.69 78.85,3.23 145.51,55.57 168.04,128.35 l 29.7,-10.89 c -0.69,-2 -1.4,-3.95 -2.13,-5.84 -31,-80.7 -109.3,-131.55 -193.45,-129.84 z\"/><path d=\"m 287.69,670.39 c 0.27,-15.82 8.75,-62.95 14.71,-81.78 18.85,-59.56 52.77,-112.45 98.58,-153.72 15.97,-14.39 50.51,-38.4 69.54,-48.34 147.85,-77.27 330.02,-36.71 430.53,95.86 19.6,25.85 39.8,61.67 46.79,82.95 2.11,6.42 4.89,5.38 -30.22,11.31 l -22.9,3.87 -6.99,-15.53 C 826.88,429.92 677.55,357.85 532.39,393.53 c -35.88,8.82 -69.2,24.08 -100.92,46.22 -31.4,21.91 -53.36,43.44 -74.88,73.4 -28.67,39.91 -50.55,95.25 -55.24,139.7 -1.38,13.11 -1.56,13.58 -7.62,20.09 l -6.2,6.67 z\"/><path d=\"m 126.64,687.88 c -3.31,-23.23 -1.93,-94.26 2.39,-123.23 13.66,-91.65 50.95,-177.08 108.38,-248.26 20.02,-24.81 64.98,-68.08 90.53,-87.11 198.47,-147.82 474.8,-131.1 653.08,39.53 34.76,33.27 72.75,81.01 87.97,110.54 4.59,8.92 8.42,6.74 -41.61,23.65 l -32.64,11.03 -13.88,-21.11 C 860.08,209.3 624.47,138.74 420.2,225.01 c -50.49,21.32 -95.72,51.48 -137,91.34 -40.85,39.45 -67.98,76.13 -92.48,125.06 -32.64,65.17 -51.72,151.36 -48.17,217.56 1.05,19.52 0.89,20.26 -6.45,31.21 l -7.52,11.22 z\" transform=\"translate(-2.171321,53.714176)\"/>";
  const TEXT = "<path d=\"m 274.88,421.03 41.99,-103.05 h -14.92 q -29.56,0 -55.81,4.97 -25.97,5.25 -46.41,14.92 -25.42,12.16 -43.1,29.56 -18.23,17.68 -29.01,39.78 -10.77,21.83 -10.77,42.27 0,18.23 8.01,33.71 7.74,15.2 21.27,23.76 13.54,8.56 30.39,8.56 18.23,0 35.92,-9.12 17.41,-9.12 28.73,-24.59 7.18,-9.39 18.79,-29.56 9.67,-17.41 14.92,-31.22 z M 459.99,148.34 417.72,251.95 h 35.64 7.46 q 30.67,0.28 30.67,27.08 0,10.22 -5.8,19.34 -5.8,9.39 -16.02,14.37 -10.22,5.25 -21.83,5.25 H 440.65 390.92 L 337.32,450.32 q -20.72,50.84 -53.32,87.3 -14.64,15.75 -31.77,26.25 -16.58,10.5 -38.4,17.13 -19.89,6.08 -41.72,6.08 -37.57,0 -67.69,-16.85 Q 73.75,553.37 56.9,524.08 39.77,494.52 39.77,457.78 q 0,-41.72 19.06,-78.46 18.51,-36.19 53.6,-64.65 33.98,-27.9 80.95,-44.2 45.59,-15.75 99.18,-17.13 l 38.96,-1.11 q 8.29,0 12.16,-0.28 l 53.05,-133.44 3.04,-7.74 q 5.8,-14.92 15.2,-21.83 9.12,-6.63 25.42,-6.63 h 8.56 141.73 7.46 q 15.2,0 22.93,6.91 8.01,7.18 8.01,19.89 0,16.58 -12.71,27.63 -12.71,11.6 -31.22,11.6 h -7.18 z M 722.45,134.81 615.25,399.2 h 29.01 6.63 q 28.18,0.28 28.18,24.59 0,14.64 -11.6,25.14 -12.16,10.5 -28.18,10.5 h -6.91 -49.73 q -20.17,0 -32.05,-9.39 -12.16,-9.12 -12.16,-24.59 0,-11.88 8.29,-30.39 l 111.62,-274.34 2.76,-7.46 q 13.26,-30.94 40.61,-30.94 12.16,0 19.89,7.46 8.01,7.46 8.01,18.51 0,8.56 -4.14,19.06 z m 124.33,202.24 q 0,-14.64 -8.84,-24.31 -9.12,-9.39 -23.21,-9.39 -13.54,0 -26.52,9.12 -12.43,9.39 -20.44,24.31 -7.74,14.64 -7.74,31.77 0,31.22 34.53,31.22 18.23,0 27.08,-6.91 10.5,-8.01 17.96,-24.31 7.18,-16.58 7.18,-31.5 z m -58.57,122.67 q -24.86,0 -36.47,-2.49 -11.33,-1.93 -21.55,-8.56 -17.68,-12.71 -27.08,-32.6 -9.95,-19.89 -9.95,-43.1 0,-25.97 10.22,-49.18 10.22,-23.48 27.63,-41.17 17.13,-17.41 40.06,-27.9 22.38,-10.22 48.35,-10.22 20.17,0 37.57,6.35 16.85,6.08 29.29,18.23 12.43,11.88 19.34,28.73 6.91,16.58 6.91,36.74 0,20.17 -7.18,42.55 -7.46,21.55 -20.44,39.78 -12.99,17.96 -29.56,28.73 -9.12,5.53 -17.13,8.29 -9.95,3.32 -19.89,4.42 -12.43,1.38 -30.11,1.38 z\" style=\"fill:#fff;stroke:#000;stroke-width:19.2152;stroke-linecap:square;stroke-linejoin:bevel\"/><path d=\"m 578.28,1065.07 40.79,-100.09 h -14.49 q -28.71,0 -54.21,4.83 -25.22,5.1 -45.08,14.49 -24.69,11.81 -41.86,28.71 -17.71,17.17 -28.18,38.64 -10.47,21.2 -10.47,41.06 0,17.71 7.78,32.74 7.51,14.76 20.66,23.08 13.15,8.32 29.52,8.32 17.71,0 34.88,-8.86 16.91,-8.86 27.91,-23.88 6.98,-9.12 18.25,-28.71 9.39,-16.91 14.49,-30.32 z M 758.07,800.22 717.01,900.84 h 34.62 7.25 q 29.79,0.27 29.79,26.3 0,9.93 -5.64,18.78 -5.64,9.12 -15.56,13.95 -9.93,5.1 -21.2,5.1 h -6.98 -48.3 l -52.06,128.54 q -20.13,49.38 -51.79,84.8 -14.22,15.3 -30.86,25.49 -16.1,10.2 -37.3,16.64 -19.32,5.9 -40.52,5.9 -36.49,0 -65.74,-16.37 -29.79,-16.37 -46.16,-44.81 -16.64,-28.71 -16.64,-64.4 0,-40.52 18.52,-76.21 17.98,-35.15 52.06,-62.79 33.01,-27.1 78.62,-42.93 44.28,-15.3 96.34,-16.64 l 37.84,-1.07 q 8.05,0 11.81,-0.27 l 51.52,-129.61 2.95,-7.51 q 5.64,-14.49 14.76,-21.2 8.86,-6.44 24.69,-6.44 h 8.32 137.66 7.25 q 14.76,0 22.27,6.71 7.78,6.98 7.78,19.32 0,16.1 -12.34,26.83 -12.34,11.27 -30.32,11.27 h -6.98 z M 1012.99,787.07 908.88,1043.87 h 28.18 6.44 q 27.37,0.27 27.37,23.88 0,14.22 -11.27,24.42 -11.81,10.2 -27.37,10.2 h -6.71 -48.3 q -19.59,0 -31.13,-9.12 -11.81,-8.86 -11.81,-23.88 0,-11.54 8.05,-29.52 l 108.41,-266.46 2.68,-7.25 q 12.88,-30.05 39.45,-30.05 11.81,0 19.32,7.25 7.78,7.25 7.78,17.98 0,8.32 -4.03,18.52 z m 51.25,384.8 h -37.57 q -30.59,0 -45.89,9.66 -15.56,9.93 -15.56,29.52 0,13.15 8.86,21.47 8.59,8.59 21.74,8.59 25.49,0 45.35,-27.91 9.93,-13.69 23.08,-41.32 z m 154.57,-222.99 -66.55,164.49 h 30.86 6.71 q 12.61,0 20.13,6.17 7.25,6.44 7.25,17.71 0,14.49 -11.27,24.42 -11.81,10.2 -27.64,10.2 h -6.44 -43.47 q -4.03,12.34 -10.2,25.22 -12.88,28.71 -22.81,45.35 -9.93,16.37 -18.78,24.96 -33.27,33.01 -79.7,33.01 -27.1,0 -49.11,-12.08 -22.54,-11.81 -34.88,-32.2 -12.61,-20.66 -12.61,-45.35 0,-19.32 8.05,-36.76 7.78,-17.44 22.27,-30.86 13.95,-12.61 32.74,-19.86 26.3,-9.93 76.21,-9.93 h 43.47 l 8.05,-19.32 q -20.13,9.66 -37.03,9.66 -27.91,0 -46.16,-15.03 -17.98,-14.76 -17.98,-38.37 0,-15.03 11.54,-43.2 l 29.25,-72.18 q 8.59,-20.93 18.25,-28.98 9.93,-8.59 24.69,-8.59 11.81,0 19.86,7.25 7.78,7.25 7.78,17.98 0,8.59 -6.98,26.57 l -26.03,64.13 q -6.71,15.3 -6.71,20.93 0,5.64 4.83,8.86 4.56,3.22 12.34,3.22 11.54,0 24.42,-7.25 13.15,-6.98 16.64,-16.1 l 35.96,-88.02 2.95,-7.25 q 6.17,-14.76 16.37,-22.54 10.2,-7.78 23.35,-7.78 12.08,0 19.59,7.25 7.78,7.25 7.78,18.52 0,9.12 -4.03,18.52 z\" style=\"fill:#fff;stroke:#000;stroke-width:18.6633;stroke-linecap:square;stroke-linejoin:bevel\"/>";
  const PROP = `<g transform="matrix(-3.770639,11.311189,11.311189,3.770639,251.69071,-56.674651)" style="fill:#fff;stroke:#000;stroke-width:1.4258"><ellipse cx="49.347145" cy="49.832035" rx="5.0496321" ry="5.137002" style="stroke-width:1.44041"/><path d="m 88.31,11.57 -2.22,-2.26 c -0.95,-0.81 -1.73,-0.2 -2.54,0.81 -7.75,7.42 -15.24,14.47 -22.36,20.98 -4.14,3.68 -7.85,8.37 -11.26,14.04 -3.1,0.06 -5.12,1.53 -5.55,4.84 -1.01,0.73 -2.23,1.27 -3.65,1.61 -4.51,0.72 -7.82,3.12 -9.99,7.1 -6.76,10.03 -13.52,19.47 -20.3,28.07 -0.41,0.69 -0.42,1.34 0.16,1.94 l 1.75,1.61 c 0.64,0.49 1.43,0.38 2.38,-0.32 l 22.05,-21.62 6.82,-6.45 c 2.12,-2.48 3.54,-4.99 4.92,-7.1 2.8,-0.05 4.66,-1.4 5.23,-4.52 1.66,-0.98 3.26,-1.66 4.76,-1.77 5.97,-1.01 8.09,-3.07 9.04,-5.16 5.42,-9.57 12.59,-19.75 20.46,-30.17 0.48,-0.64 0.79,-1.13 0.32,-1.61 z m -39.17,42.43 c -2.19,0 -3.96,-1.8 -3.96,-4.03 0,-2.23 1.77,-4.03 3.96,-4.03 2.19,0 3.96,1.8 3.96,4.03 0,2.23 -1.77,4.03 -3.96,4.03 z"/><ellipse cx="49.347145" cy="49.832035" rx="4.3245316" ry="4.3993549" style="stroke-width:1.38961"/></g>`;

  const HX = 629.28, HY = 689.4, R = 1000; // propeller hub (rotation centre) and mask radius
  const LEFT = 155.26;                     // resting angle of the left blade (degrees, clockwise from 3 o'clock)
  const LAG = 3;                           // degrees the text reveal trails behind the blade, so its edge hides under the blade
  const TOTAL = 360 * TURNS;

  host.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-40.72 19.4 1340 1340" role="img" aria-label="Flo-Fly logo: a drone propeller on a green circle with the name Flo-Fly" style="display:block;width:100%;height:auto">
<defs>
<mask id="ff-text-mask" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1700" height="1700"><path id="ff-text-wedge" fill="#fff" d=""/></mask>
<g id="ff-prop">${PROP}</g>
</defs>
<image href="${BG}" x="20.32" y="80.6" width="1217.92" height="1217.6" preserveAspectRatio="none"/>
<g id="ff-streaks" opacity="0" style="${STREAK_STYLE}">${STREAKS}</g>
<g id="ff-text" mask="url(#ff-text-mask)">${TEXT}</g>
<use class="ff-ghost" href="#ff-prop" opacity="0"/><use class="ff-ghost" href="#ff-prop" opacity="0"/><use class="ff-ghost" href="#ff-prop" opacity="0"/>
<use id="ff-main" href="#ff-prop"/>
</svg>`;

  const $ = (s) => host.querySelector(s);
  const main = $("#ff-main"), ghosts = [...host.querySelectorAll(".ff-ghost")];
  const streakG = $("#ff-streaks"), textG = $("#ff-text"), textW = $("#ff-text-wedge");

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const spin = (a) => `rotate(${a.toFixed(2)} ${HX} ${HY})`;

  // Pie-slice mask that grows clockwise from angle a0 by `sweep` degrees
  const wedge = (a0, sweep) => {
    if (sweep <= 0) return "";
    if (sweep >= 359.9) return `M${HX - R} ${HY - R}h${2 * R}v${2 * R}h${-2 * R}z`;
    const p = (a) => { const r = (a * Math.PI) / 180; return `${(HX + R * Math.cos(r)).toFixed(1)} ${(HY + R * Math.sin(r)).toFixed(1)}`; };
    return `M${HX} ${HY}L${p(a0)}A${R} ${R} 0 ${sweep > 180 ? 1 : 0} 1 ${p(a0 + sweep)}Z`;
  };

  // Easing: slow start, fast spin, long slow-down (same as CSS cubic-bezier(.4, 0, .2, 1))
  const bezier = (x1, y1, x2, y2) => {
    const f = (t, a, b) => 3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t;
    return (x) => {
      let lo = 0, hi = 1, t = x;
      for (let i = 0; i < 24; i++) { (f(t, x1, x2) < x ? (lo = t) : (hi = t)); t = (lo + hi) / 2; }
      return f(t, y1, y2);
    };
  };
  const ease = bezier(0.4, 0, 0.2, 1);
  const phiAt = (ms) => TOTAL * ease(clamp(ms / SPIN, 0, 1)); // degrees turned so far

  let streakOpacity = 0; // only ever goes up: streaks fade in while speeding up, then stay
  const render = (phi, omega, withText = true) => {
    const rot = phi % 360;
    main.setAttribute("transform", spin(rot));
    // Blue streaks turn with the propeller and fade in as it gains speed
    streakOpacity = withText ? clamp((phi - FADE_FROM) / (FADE_TO - FADE_FROM), 0, 1) : 1;
    streakG.setAttribute("transform", spin(rot));
    streakG.setAttribute("opacity", streakOpacity.toFixed(3));
    // Faint trailing copies of the propeller add to the motion-blur feel while it is fast
    const speed = clamp((omega - 200) / 500, 0, 1);
    ghosts.forEach((g, i) => {
      g.setAttribute("transform", spin(rot - (i + 1) * omega * 0.011));
      g.setAttribute("opacity", (speed * (0.3 - 0.09 * i)).toFixed(3));
    });
    // Text: uncovered by the left blade during the final turn
    if (withText) textW.setAttribute("d", wedge(LEFT, clamp(phi - (TOTAL - 360) - LAG, 0, 360)));
  };

  const finish = () => {
    main.setAttribute("transform", spin(0));
    streakG.setAttribute("transform", spin(0));
    streakG.setAttribute("opacity", "1");
    ghosts.forEach((g) => g.setAttribute("opacity", "0"));
    textG.removeAttribute("mask");
  };

  let raf = 0, busy = true; // busy until the first animation finishes
  const play = (replay = false) => {
    const t0 = performance.now();
    const tick = (now) => {
      const ms = now - t0;
      if (ms >= SPIN) { finish(); busy = false; return; }
      const omega = (phiAt(ms + 8) - phiAt(ms - 8)) / 0.016; // degrees per second
      render(phiAt(ms), omega, !replay);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };

    // Click, tap, or Enter/Space on the logo: spin the propeller and streaks again (the text stays put)
  host.style.cursor = "pointer";
  host.setAttribute("role", "button");
  host.setAttribute("tabindex", "0");
  host.setAttribute("aria-label", "Flo-Fly logo. Activate to spin the propeller again.");
    // Every tap adds one more full turn. Tapping mid-spin keeps the current speed and smoothly stretches the spin.
  const TAP_DEG = 360;                        // degrees added per tap
  const TAP_BASE = 0.9, TAP_PER_TURN = 0.4;   // seconds: base time + extra time per full turn still to go
  let spinRun = null;
  const spinPose = (s, now) => {              // angle and speed of the current spin at time `now`
    const u = clamp((now - s.t0) / (s.D * 1000), 0, 1), D = s.D, d = s.p1 - s.p0;
    const h01 = 3 * u * u - 2 * u * u * u, h10 = u * u * u - 2 * u * u + u;
    const dh01 = 6 * u - 6 * u * u, dh10 = 3 * u * u - 4 * u + 1;
    return { a: s.p0 + h01 * d + h10 * D * s.v0, v: (dh01 * d + dh10 * D * s.v0) / D, done: u >= 1 };
  };
  const spinStep = () => {
    const { a, v, done } = spinPose(spinRun, performance.now());
    render(a, Math.abs(v), false);
    if (done) { spinRun = null; finish(); return; }
    requestAnimationFrame(spinStep);
  };
  const again = () => {
    if (busy || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const now = performance.now();
    if (spinRun) {                            // already spinning: add a turn, carry on from the current angle and speed
      const { a, v } = spinPose(spinRun, now);
      const p1 = spinRun.p1 + TAP_DEG, d = p1 - a;
      let D = TAP_BASE + TAP_PER_TURN * (d / 360);
      if (v > 0) D = Math.min(D, 2.5 * d / v);   // keeps the propeller from ever slowing or reversing mid-spin
      spinRun = { p0: a, v0: v, p1, D, t0: now };
    } else {
      spinRun = { p0: 0, v0: 0, p1: TAP_DEG, D: TAP_BASE + TAP_PER_TURN, t0: now };
      requestAnimationFrame(spinStep);
    }
  };
  host.addEventListener("click", again);
  host.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); again(); } });

  // Start state: just the propeller
  render(0, 0);

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { finish(); return; }

  // Wait until the background has loaded and the logo is on screen, then play once
  const loaded = new Promise((ok) => { const im = new Image(); im.onload = im.onerror = ok; im.src = BG; });
  const visible = new Promise((ok) => {
    if (!("IntersectionObserver" in window)) return ok();
    new IntersectionObserver((e, o) => { if (e.some((x) => x.isIntersecting)) { o.disconnect(); ok(); } }, { threshold: 0.6 }).observe(host);
  });
  Promise.all([loaded, visible]).then(() => setTimeout(play, HOLD));
})();
