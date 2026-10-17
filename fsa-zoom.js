// Campus-to-classroom zoom for the Florida Scholars Academy page.
// Edit the ROOMS list to change which building is yours or which side is which program.
(() => {
  const svg = document.getElementById("fsa-svg");
  if (!svg) return;
  const NS = "http://www.w3.org/2000/svg";
  const el = (name, attrs = {}, parent) => {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const viewer = svg.closest(".fsa-viewer");
  const R = 2;

  // Positions are in photo pixels (the photo is 1426 x 595). Each room is 98 x 60.
  const ROOMS = [
    { x: 875, y: 249, side: "mhos" },
    { x: 999, y: 250, side: "mhos", mine: true },
    { x: 885, y: 334, side: "saos" },
    { x: 1015, y: 336, side: "saos" }
  ];
  const SIDE = { mhos: "Mental Health Overlay Services (MHOS)", saos: "Substance Abuse Overlay Services (SAOS)" };

  // Camera positions: [left, top, width]
  const VIEWS = { 1: [0, -59, 1426], 2: [812, 235, 360], 3: [983, 247.5, 130] };

  const COPY = {
    1: ["The campus", "Ocala Youth Academy has 72 beds for males aged 15 to 18. The four classroom buildings sit together on the grounds. Select the glowing box, or use the buttons, to zoom in."],
    2: ["Four classrooms, two programs", "The classrooms are arranged two by two. Two serve the 36 Mental Health Overlay Services students and two serve the 36 Substance Abuse Overlay Services students, with 18 students and one teacher in each room. Select my classroom to go inside."],
    3: ["My classroom", "Eighteen students, three staff members, and me at the front of the room. Hover over or tap anyone to see who they are."]
  };

  // ---------- Build the scene ----------
  const cluster = svg.querySelector("#fsa-cluster");
  const read = document.getElementById("fsa-read");
  const people = [];
  const say = (t) => { read.textContent = t; };

  function person(parent, cls, cx, cy, r, label, extra = {}) {
    const c = el("circle", { cx, cy, r, class: "person " + cls, "data-label": label, tabindex: -1, role: "img", "aria-label": label, ...extra }, parent);
    people.push(c);
    return c;
  }

  ROOMS.forEach((r) => {
    const g = el("g", { transform: `translate(${r.x} ${r.y}) scale(.1)`, class: `room ${r.side}${r.mine ? " mine" : ""}` }, cluster);
    el("rect", { width: 980, height: 600, rx: 10, class: "floor" }, g);
    el("rect", { x: 300, y: 566, width: 380, height: 16, rx: 4, class: "board" }, g);         // whiteboard (front, bottom wall)
    el("rect", { x: 968, y: 120, width: 12, height: 100, class: "win" }, g);                  // windows
    el("rect", { x: 968, y: 260, width: 12, height: 100, class: "win" }, g);
    el("line", { x1: 0, y1: 60, x2: 0, y2: 170, class: "door" }, g);                           // door, left wall near the top
    el("line", { x1: 980, y1: 430, x2: 980, y2: 540, class: "door" }, g);                      // door, right wall near the bottom
    el("rect", { x: 40, y: 470, width: 150, height: 46, rx: 6, class: "desk" }, g);            // teacher desk, bottom left
    for (let i = 0; i < 18; i++) {
      const x = 240 + (i % 6) * 100, y = 130 + Math.floor(i / 6) * 110;
      el("rect", { x: x - 38, y: y + 20, width: 76, height: 30, rx: 5, class: "desk" }, g);
      person(g, "stu", x, y, 22, "Student");
    }
    if (r.mine) {
      person(g, "me", 115, 550, 28, "Me, the teacher");
      el("text", { x: 160, y: 562, class: "me-lab" }, g).textContent = "Me";
      [[870, 160], [870, 310], [520, 490]].forEach(([x, y], i) =>
        person(g, "stf pop", x, y, 24, "Staff member", { style: `--i:${i}` }));
    } else {
      person(g, "tch", 115, 550, 26, "Teacher");
    }
    // Clicking a room in the classroom view
    g.addEventListener("click", () => {
      if (stage !== 2) return;
      if (r.mine) { stop(); go(3); } else say(`${SIDE[r.side]} classroom: 18 students and one teacher.`);
    });
    g.addEventListener("mouseenter", () => { if (stage === 2) say(r.mine ? "My classroom. Select it to go inside." : `${SIDE[r.side]} classroom.`); });
    g.addEventListener("mouseleave", () => { if (stage === 2) say(""); });
  });

  people.forEach((p) => {
    const on = () => { if (stage === 3) say(p.dataset.label); };
    p.addEventListener("mouseenter", on);
    p.addEventListener("focus", on);
    p.addEventListener("click", on);
    p.addEventListener("mouseleave", () => { if (stage === 3) say(""); });
  });

  // The glowing hotspot on the campus view
  const hot = svg.querySelector("#fsa-hot");
  hot.addEventListener("click", () => { stop(); go(2); });
  hot.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); stop(); go(2); } });

  // ---------- Camera ----------
  let stage = 1, vb = VIEWS[1].slice(), raf = 0, finish = null;
  const apply = ([x, y, w]) => svg.setAttribute("viewBox", `${x} ${y} ${w} ${w / R}`);
  const center = ([x, y, w]) => [x + w / 2, y + w / R / 2];

  function ui() {
    svg.dataset.stage = stage;
    viewer.dataset.stage = stage;
    document.getElementById("fsa-title").textContent = COPY[stage][0];
    document.getElementById("fsa-desc").textContent = COPY[stage][1];
    say("");
    viewer.querySelectorAll(".v-tabs button").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.stage === stage)));
    hot.setAttribute("tabindex", stage === 1 ? 0 : -1);
    people.forEach((p) => p.setAttribute("tabindex", stage === 3 && p.closest(".mine") ? 0 : -1));
  }

  function go(n, instant) {
    stage = n;
    ui();
    const from = vb.slice(), to = VIEWS[n];
    cancelAnimationFrame(raf);
    if (finish) { finish(); finish = null; }
    if (instant || reduce) { vb = to.slice(); apply(vb); return Promise.resolve(); }
    const [cx0, cy0] = center(from), [cx1, cy1] = center(to);
    const dur = 2000;
    return new Promise((res) => {
      finish = res;
      const t0 = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / dur);
        const e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const w = from[2] * Math.pow(to[2] / from[2], e);
        // Keeps the target steady on screen while zooming (a true "fly-in" feel)
        const dz = 1 / to[2] - 1 / from[2];
        const s = Math.abs(dz) < 1e-9 ? e : (1 / w - 1 / from[2]) / dz;
        const cx = cx0 + (cx1 - cx0) * s, cy = cy0 + (cy1 - cy0) * s;
        vb = [cx - w / 2, cy - w / R / 2, w];
        apply(vb);
        if (t < 1) raf = requestAnimationFrame(tick); else { finish = null; res(); }
      };
      raf = requestAnimationFrame(tick);
    });
  }

  // ---------- Autoplay and controls ----------
  let token = 0;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const stop = () => { token++; };
  async function play() {
    const id = ++token;
    await go(1);
    if (id !== token) return;
    await sleep(reduce ? 400 : 1100);
    if (id !== token) return;
    await go(2);
    if (id !== token) return;
    await sleep(reduce ? 400 : 1200);
    if (id !== token) return;
    await go(3);
  }

  viewer.querySelectorAll(".v-tabs button[data-stage]").forEach((b) =>
    b.addEventListener("click", () => { stop(); go(+b.dataset.stage); }));
  document.getElementById("fsa-play").addEventListener("click", play);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && stage > 1 && svg.contains(document.activeElement)) { stop(); go(stage - 1); }
  });

  apply(vb);
  ui();
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { io.disconnect(); setTimeout(() => { if (token === 0 && stage === 1) play(); }, 700); }
    }, { threshold: 0.6 });
    io.observe(svg);
  }
})();
