// Coursework explorer for the Education page: search, filter, sort, collapse, and click-for-description cards.
// To add or edit a course, change the COURSES list below. Each line is:
//   [program, code, name, [topics], description]
(() => {
  const root = document.getElementById("coursework");
  if (!root) return;

  /* ---- Programs (the three blocks) ---- */
  const PROGRAMS = [
    { id: "edu", short: "UF · Education", title: "Education coursework at UF", school: "University of Florida", degree: "B.A. in Education Sciences", blurb: "Teacher preparation in learning, technology, assessment, and teaching diverse students." },
    { id: "biz", short: "UF · Business", title: "Business coursework at UF", school: "University of Florida", degree: "B.A. in Business Administration", blurb: "Foundations in economics, accounting, management, and entrepreneurship." },
    { id: "re", short: "FIU · Real Estate", title: "Real estate coursework at FIU", school: "Florida International University", degree: "M.S. in International Real Estate", blurb: "Graduate study in finance, markets, law, and development." },
  ];

  /* ---- Topics (the filter chips). A course can have several. ---- */
  const TOPICS = [
    ["teach", "Teaching & Learning"],
    ["incl", "Inclusive Teaching"],
    ["tech", "Technology"],
    ["fin", "Finance & Economics"],
    ["ent", "Entrepreneurship"],
    ["mgmt", "Management"],
    ["re", "Real Estate"],
    ["law", "Law"],
    ["quant", "Data & Analysis"],
    ["global", "Global"],
  ];

  /* ---- Courses ---- */
  const COURSES = [
    ["edu", "EDG 2021", "Critical Issues in Education", ["teach"], "Explores the broad field of education in a variety of traditional and nontraditional contexts. Introduces enduring issues in educational systems in the US and examines organizations and career fields focused on addressing these issues."],
    ["edu", "EEX 4294", "Differentiated Instruction", ["teach", "incl"], "Provides pre-service teachers with information and expertise related to instruction that effectively meets the academic needs of all students."],
    ["edu", "TSL 3323", "ESOL and Reading for Teachers", ["teach", "incl"], "Develop an understanding of literacy teaching and learning, with a dual focus on native speakers of English and English language learners; focuses on methods and materials used to support the development of proficient and critical adolescent readers in academic content areas."],
    ["edu", "EDF 3210", "Educational Psychology", ["teach"], "Introduces the application of psychology to the problems of education in a variety of educational settings. Also examines the theoretical and applied aspects of learning, motivation, human development, personality, and measurement and evaluation."],
    ["edu", "EEX 3093", "Exceptional People: School and Society", ["incl"], "Persons with disabilities and people from other diverse groups and the services they need from school and society for success. Consideration of the abilities, causes, and educational implications."],
    ["edu", "EME 4406", "Integrating Technology into the Secondary Curriculum", ["tech", "teach"], "Gain experience with curriculum design and course development, which assumes use of technology."],
    ["edu", "EME 2040", "Introduction to Educational Technology", ["tech"], "Introduces computer productivity (word processing, databases, spreadsheets, painting, drawing, layouts); multimedia (media design, digital video, presentation); communications (internet, Eric); educational software (computer-aided instruction, public domain software); interactive media (linked environments, one-to-many, presentations using electronic tools); reference materials (electronic encyclopedia, atlases, clip art, libraries, internet); instructional applications (techniques); and ethical."],
    ["edu", "EDF 4430", "Measurement and Evaluation in Education", ["teach", "quant"], "Basic principles and methods of measurement, evaluation, and test construction."],
    ["edu", "EDF 3604", "Social Foundations of Education", ["teach"], "Educative effects of social structures and social values and the issues involved in appraising these effects, including the resulting social demands upon schools."],
    ["edu", "EDF 2085", "Teaching Diverse Populations", ["teach", "incl"], "Surveys educational demographics, foundations of prejudice, elements of culture, political and philosophical roots of diversity and commonality, exceptionalities, and barriers to cultural understanding and diversity in the classroom."],
    ["edu", "EME 3813", "Technology Enhanced Learning Environments", ["tech", "teach"], "Analyzes how people learn in technology-enhanced environments, outlines how the design of technology-enhanced systems can support or undermine learning, and considers critical issues for instructors, designers, and learners in the digital age."],
    ["biz", "ENT 4934", "Business Plan Lab", ["ent"], "Special topics in entrepreneurship-related fields of study."],
    ["biz", "ACG 2021", "Financial Accounting", ["fin"], "Conceptual introduction to financial accounting. Emphasis is placed on wealth and income measurement and the preparation and interpretation of conventional financial statements."],
    ["biz", "GEB 3373", "International Business", ["mgmt", "global"], "Exposes the business environments (culture, politics, laws and economics) encountered in other parts of the world; to the tools and skills necessary to analyze the potential of other countries as locations for production, distribution and marketing; to how managing and integrating international operations in many parts of the world differs from the domestic focus of many business courses; and to the broad perspective required of successful managers working in international business."],
    ["biz", "MAN 4504", "Operations and Supply Chain Management", ["mgmt"], "Managerial concepts and quantitative tools required in the design, operation, and control of production systems and their relationship to business functions."],
    ["biz", "ECO 2013", "Principles of Macroeconomics", ["fin"], "In this course, students will learn the foundations of macroeconomics as the branch of economics concerned with how decision-making, in an environment of scarcity, maps onto the aggregate economy. Students will examine theories and evidence related to the following core set of topics: national income determination, money, monetary and fiscal policy, macroeconomic conditions, international trade and the balance of payments, and economic growth and development."],
    ["biz", "MAN 3025", "Principles of Management", ["mgmt"], "Fundamentals of management underlying the solution of problems of organization and operation of business enterprises."],
    ["biz", "ECO 2023", "Principles of Microeconomics", ["fin"], "Theories of production, determination of prices and distribution of income in regulated and unregulated industries. Attention is also given to industrial relations, monopolies and comparative economic systems."],
    ["biz", "GEB 3213", "Professional Writing in Business", ["mgmt"], "Teaches business students fundamental written communication skills focusing on those areas central to professional writing in business."],
    ["biz", "REE 3043", "Real Estate Analysis", ["re", "fin"], "Principles of real estate decision making within the context of our economic, social, legal and political-government systems."],
    ["biz", "ENT 4934", "Start Up Funding", ["ent", "fin"], "Special topics in entrepreneurship-related fields of study."],
    ["biz", "QMB 3250", "Statistics for Business Decisions", ["quant"], "Correlation and linear regression, model building, multiple regression, analysis of variance, time series analysis and decision analysis. Regression modeling with computer applications for business problems."],
    ["biz", "MAC 2233", "Survey of Calculus", ["quant"], "MAC 2233 surveys the important ideas of calculus but emphasizing its applications to business, economics, life, and social sciences. The course covers important precalculus topics: basics of functions and graphing, specific functions and their applications as models (linear, quadratic, rational, exponential, and logarithmic) as well as calculus: limits, differentiation, applications of the derivative, introduction to integration, and its applications including area."],
    ["biz", "BUL 4310", "The Legal Environment of Business", ["law"], "Introduces the legal environment of business and organizations. Emphasizes public and regulatory law and on the social, political and ethical aspects of legal issues in business. Subjects include the nature of law and legal process; administrative law of contracts and torts; business and the constitution; statutory and common law; contracts and torts; business organizations and securities, antitrust, consumer protection and employment law."],
    ["re", "REE 6305", "Advanced Real Estate Investments", ["re", "fin"], "The course emphasizes measuring risk and rate of return under conditions of uncertainty in real estate investment decision-making. Simulation is used to face the problems of matching investment strategy to the physical property, leverage, income taxation, and organizational alternatives."],
    ["re", "FIN 6406", "Corporate Finance", ["fin"], "This class focuses on financial decision-making and its impact on the economic value of the firm. The course provides practical applications and is based on modern financial theory, with an emphasis on valuation and risk management. The course examines valuation concepts, capital budgeting, risk analysis, and capital structure decisions in depth. It covers the ethical and financial implications of business decisions and their impact on the value of the firm."],
    ["re", "REE 6306C", "Corporate Real Estate", ["re", "mgmt"], "This course introduces students to the end-user perspective of non-real estate companies' use of real estate. Focus is on decision-making tools and strategies to optimize performance."],
    ["re", "REE 6327", "Global Real Estate Capital Markets", ["re", "fin", "global"], "This course is designed to provide MSIRE students with the knowledge of real estate capital markets and primarily focuses on the theory and operation of the mortgage-backed securities (MBS) and the markets for structured real estate debt, REITs and real estate equity derivatives. These markets have developed rapidly and become immensely important for both residential and commercial real estate."],
    ["re", "REE 6715", "Real Estate Development", ["re"], "This course will provide an overview of the principles of real estate development; allow the student to obtain a foundation of knowledge in real estate development; review the primary development product types, including land, residential, multi-family, industrial, office and mixed use property types."],
    ["re", "REE 6209", "Real Estate Finance", ["re", "fin"], "This course is an introduction to the fundamental concepts, principles, and analytical methods of real estate finance. The focus will be on commercial real estate capital markets, while we also discuss different aspects of residential real estate finance."],
    ["re", "REE 6435", "Real Estate Law", ["re", "law"], "This course takes a creative interactive approach and provides lessons applicable all over the world about practical ways that real estate law impacts everyday life, from understanding what it means to sign a real estate contract like a residential lease or purchase contract, to understanding the process to buy real estate, to obtaining financing to purchase real estate and to growing wealth by managing your own real estate."],
    ["re", "REE 6147", "Real Estate Market Analysis", ["re", "quant"], "This course provides an overview of basic theories and principles related to real estate market analysis. It gives a hands-on introduction to the industry-standard cash flow software (ARGUS) to assess risks and returns for income-producing real estate assets. Students will also learn how to use relevant data to conduct market research."],
    ["re", "REE 6045", "Real Estate Markets, Institutions and Practices", ["re"], "This course is designed to introduce the student to the nature, principles, and advanced fundamental and analytical practices of the real estate industry."],
    ["re", "REE 6935", "Seminar in International Real Estate", ["re", "global"], "Current trends and issues affecting industrial real estate on an international level. Topics include: the multinational corporation and its location decisions; foreign taxation; international trade and exchange rates."],
  ];

  /* ---------------------------------------------------------------- */

  const LEVEL_NAMES = ["Lower-division", "Upper-division", "Graduate"];
  const progById = Object.fromEntries(PROGRAMS.map((p) => [p.id, p]));
  const topicName = Object.fromEntries(TOPICS);
  // Level comes from the course number: 1000-2000s, 3000-4000s, 5000+ (graduate)
  const levelOf = (code) => { const n = parseInt((code.match(/\d{4}/) || ["2000"])[0], 10); return n >= 5000 ? 3 : n >= 3000 ? 2 : 1; };
  const courses = COURSES.map(([prog, code, name, tags, desc], i) => ({
    id: "c" + i, prog, code, name, tags, desc, level: levelOf(code),
    hay: [name, code, desc, progById[prog].school, progById[prog].degree, ...tags.map((t) => topicName[t])].join(" ").toLowerCase(),
  }));
  const byId = new Map(courses.map((c) => [c.id, c]));

  const state = { q: "", progs: new Set(PROGRAMS.map((p) => p.id)), topics: new Set(), sort: "az", group: true, collapsed: new Set() };

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const terms = () => state.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  // Escape the text, wrapping any search matches in <mark>
  const mark = (text, ts) => {
    if (!ts.length) return esc(text);
    const re = new RegExp("(" + ts.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")", "gi");
    return text.split(re).map((seg, i) => (i % 2 ? `<mark>${esc(seg)}</mark>` : esc(seg))).join("");
  };
  const pips = (l) => `<span class="cx-lvl l${l}" role="img" aria-label="${LEVEL_NAMES[l - 1]}"><i></i><i></i><i></i></span>`;

  const svg = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
  const ICON = {
    search: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'),
    x: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
    shuffle: svg('<path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>'),
    chev: svg('<path d="M6 9l6 6 6-6"/>', 'class="cx-chev"'),
  };

  /* ---- Page skeleton ---- */
  root.innerHTML = `
<div class="wrap">
  <h2>Coursework</h2>
  <p class="lede" style="margin-top:0">${courses.length} courses across ${PROGRAMS.length} programs. Search, filter by program or topic, or click any course to read its description.</p>
  <div class="cx">
    <div class="cx-panel">
      <div class="cx-row">
        <div class="cx-search">${ICON.search}<input type="search" placeholder="Search courses or keywords" aria-label="Search courses" autocomplete="off" spellcheck="false"><button type="button" class="cx-clear" aria-label="Clear search" hidden>${ICON.x}</button></div>
        <label class="cx-sort"><span>Sort</span><select aria-label="Sort courses">
          <option value="az">Name, A to Z</option>
          <option value="code">Course code</option>
          <option value="up">Level, lowest first</option>
          <option value="down">Level, highest first</option>
        </select></label>
        <label class="cx-switch"><input type="checkbox" checked><span class="cx-track"></span>Group by program</label>
      </div>
      <div><p class="cx-label">Programs <span>(turn blocks on or off)</span></p><div class="cx-chips" data-progs></div></div>
      <div><p class="cx-label">Topics <span>(shows courses that match any you pick)</span></p><div class="cx-chips" data-topics></div></div>
    </div>
    <div class="cx-meta">
      <p class="cx-count" aria-live="polite"></p>
      <div class="cx-actions">
        <span class="cx-legend">Level ${pips(1)} lower ${pips(2)} upper ${pips(3)} graduate</span>
        <button type="button" class="cx-link" data-clear hidden>Clear filters</button>
        <button type="button" class="cx-link" data-surprise>${ICON.shuffle} Surprise me</button>
      </div>
    </div>
    <div class="cx-groups"></div>
    <div class="cx-grid cx-flat" hidden></div>
    <div class="cx-empty" hidden></div>
  </div>
  <dialog class="cx-dialog" aria-labelledby="cx-title">
    <div class="cx-card">
      <button type="button" class="cx-x" aria-label="Close">${ICON.x}</button>
      <p class="cx-d-top"><span class="cx-d-code"></span><span class="cx-lvl-name"></span></p>
      <h3 id="cx-title"></h3>
      <p class="cx-d-where"></p>
      <div class="cx-d-tags"></div>
      <p class="cx-desc"></p>
      <div class="cx-d-nav"><button type="button" data-prev>&larr; Previous</button><span class="cx-d-pos"></span><button type="button" data-next>Next &rarr;</button></div>
    </div>
  </dialog>
</div>`;

  const $ = (s, el = root) => el.querySelector(s);
  const input = $(".cx-search input"), clearBtn = $(".cx-clear");
  const sortSel = $(".cx-sort select"), groupSw = $(".cx-switch input");
  const progBox = $("[data-progs]"), topicBox = $("[data-topics]");
  const countEl = $(".cx-count"), clearAll = $("[data-clear]"), surprise = $("[data-surprise]");
  const groupsEl = $(".cx-groups"), flatEl = $(".cx-flat"), emptyEl = $(".cx-empty");
  const dlg = $(".cx-dialog"), card = $(".cx-card");

  /* ---- Chips ---- */
  const chip = (cls, attr, html) => { const b = document.createElement("button"); b.type = "button"; b.className = cls; b.setAttribute(...attr); b.setAttribute("aria-pressed", "false"); b.innerHTML = html; return b; };
  const progChips = new Map(), topicChips = new Map();
  PROGRAMS.forEach((p) => { const b = chip(`cx-chip p-${p.id}`, ["data-prog", p.id], `<span class="cx-dot"></span>${p.short}<span class="n"></span>`); progChips.set(p.id, b); progBox.append(b); });
  TOPICS.forEach(([id, label]) => { const b = chip("cx-chip t", ["data-topic", id], `${label}<span class="n"></span>`); topicChips.set(id, b); topicBox.append(b); });

  /* ---- Program blocks ---- */
  const groups = {};
  PROGRAMS.forEach((p) => {
    const el = document.createElement("section");
    el.className = `cx-group p-${p.id}`;
    el.innerHTML = `<h3 class="cx-gh"><button type="button" class="cx-ghead" aria-expanded="true"><span class="cx-dot"></span><span class="cx-gtitle">${p.title}</span><span class="cx-gcount"></span>${ICON.chev}</button></h3><p class="cx-gblurb">${p.degree}, ${p.school}. ${p.blurb}</p><div class="cx-grid"></div>`;
    groups[p.id] = { el, head: $(".cx-ghead", el), count: $(".cx-gcount", el), grid: $(".cx-grid", el), blurb: $(".cx-gblurb", el) };
    groupsEl.append(el);
    groups[p.id].head.addEventListener("click", () => { state.collapsed.has(p.id) ? state.collapsed.delete(p.id) : state.collapsed.add(p.id); render(); });
  });

  /* ---- Tiles (created once, then reused) ---- */
  const tiles = new Map();
  courses.forEach((c) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = `cx-tile p-${c.prog}`; b.dataset.id = c.id;
    b.innerHTML = `<span class="cx-code"></span><span class="cx-name"></span><span class="cx-hint" hidden>Found in description or topics</span><span class="cx-foot"><span>${pips(c.level)} ${LEVEL_NAMES[c.level - 1]}</span><span class="cx-pl"><span class="cx-dot"></span>${progById[c.prog].short}</span></span>`;
    b.addEventListener("animationend", () => b.classList.remove("cx-in"));
    b.addEventListener("click", () => openCard(c.id));
    tiles.set(c.id, b);
  });

  /* ---- Filtering and sorting ---- */
  const byName = (a, b) => a.name.localeCompare(b.name);
  const sorters = {
    az: byName,
    code: (a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }) || byName(a, b),
    up: (a, b) => a.level - b.level || byName(a, b),
    down: (a, b) => b.level - a.level || byName(a, b),
  };
  const matches = (c, ts, skip) =>
    (skip === "prog" || state.progs.has(c.prog)) &&
    (skip === "topic" || !state.topics.size || c.tags.some((t) => state.topics.has(t))) &&
    ts.every((t) => c.hay.includes(t));

  let order = [];     // course ids in the order currently shown (used for Previous/Next)
  let lastKey = "";

  const render = () => {
    const ts = terms();
    const vis = courses.filter((c) => matches(c, ts)).sort(sorters[state.sort]);
    const shown = new Set(vis.map((c) => c.id));

    // Chip counts (each reflects the other active filters)
    PROGRAMS.forEach((p) => {
      const n = courses.filter((c) => c.prog === p.id && matches(c, ts, "prog")).length;
      const b = progChips.get(p.id);
      b.setAttribute("aria-pressed", state.progs.has(p.id));
      b.classList.toggle("dim", n === 0);
      $(".n", b).textContent = n;
    });
    TOPICS.forEach(([id]) => {
      const n = courses.filter((c) => c.tags.includes(id) && matches(c, ts, "topic")).length;
      const b = topicChips.get(id);
      b.setAttribute("aria-pressed", state.topics.has(id));
      b.classList.toggle("dim", n === 0 && !state.topics.has(id));
      $(".n", b).textContent = n;
    });

    // Tile text (search highlights)
    vis.forEach((c) => {
      const t = tiles.get(c.id);
      $(".cx-code", t).innerHTML = mark(c.code, ts);
      $(".cx-name", t).innerHTML = mark(c.name, ts);
      const title = (c.name + " " + c.code).toLowerCase();
      $(".cx-hint", t).hidden = !ts.length || ts.every((x) => title.includes(x));
    });

    // Layout: three program blocks, or one flat grid
    const key = state.group + state.sort;
    if (key !== lastKey) { tiles.forEach((t) => (t.dataset.shown = "")); lastKey = key; }
    order = [];
    groupsEl.hidden = !state.group;
    flatEl.hidden = state.group;
    if (state.group) {
      PROGRAMS.forEach((p) => {
        const g = groups[p.id], items = vis.filter((c) => c.prog === p.id);
        const total = courses.filter((c) => c.prog === p.id).length;
        g.el.hidden = !items.length;
        g.count.textContent = items.length === total ? total : `${items.length} of ${total}`;
        const open = !state.collapsed.has(p.id);
        g.head.setAttribute("aria-expanded", open);
        g.grid.hidden = !open;
        g.blurb.hidden = !open;
        g.grid.replaceChildren(...items.map((c) => tiles.get(c.id)));
        order.push(...items.map((c) => c.id));
      });
    } else {
      flatEl.replaceChildren(...vis.map((c) => tiles.get(c.id)));
      order = vis.map((c) => c.id);
    }

    // Fade in tiles that just appeared
    let i = 0;
    order.forEach((id) => {
      const t = tiles.get(id);
      if (t.dataset.shown) return;
      t.dataset.shown = "1";
      t.style.setProperty("--i", Math.min(i++, 14));
      t.classList.remove("cx-in"); void t.offsetWidth; t.classList.add("cx-in");
    });
    tiles.forEach((t, id) => { if (!shown.has(id)) t.dataset.shown = ""; });

    // Summary line, clear buttons, empty state
    const n = vis.length;
    countEl.innerHTML = n === courses.length ? `Showing all <b>${n}</b> courses` : `Showing <b>${n}</b> of ${courses.length} courses`;
    const filtered = !!(state.q.trim() || state.topics.size || state.progs.size !== PROGRAMS.length);
    clearAll.hidden = !filtered;
    clearBtn.hidden = !state.q;
    surprise.hidden = n === 0;
    emptyEl.hidden = n !== 0;
    if (n === 0) emptyEl.innerHTML = `${state.progs.size ? "No courses match these filters." : "Every program is turned off."}<br><button type="button" class="cx-link" data-clear>Clear filters</button>`;
  };

  const resetFilters = () => {
    state.q = ""; input.value = "";
    state.topics.clear();
    PROGRAMS.forEach((p) => state.progs.add(p.id));
    render();
  };

  /* ---- Control events ---- */
  input.addEventListener("input", () => { state.q = input.value; render(); });
  clearBtn.addEventListener("click", () => { state.q = ""; input.value = ""; render(); input.focus(); });
  sortSel.addEventListener("change", () => { state.sort = sortSel.value; render(); });
  groupSw.addEventListener("change", () => { state.group = groupSw.checked; render(); });
  progBox.addEventListener("click", (e) => {
    const b = e.target.closest("[data-prog]"); if (!b) return;
    const id = b.dataset.prog; state.progs.has(id) ? state.progs.delete(id) : state.progs.add(id); render();
  });
  topicBox.addEventListener("click", (e) => {
    const b = e.target.closest("[data-topic]"); if (!b) return;
    const id = b.dataset.topic; state.topics.has(id) ? state.topics.delete(id) : state.topics.add(id); render();
  });
  root.addEventListener("click", (e) => { if (e.target.closest("[data-clear]")) resetFilters(); });
  surprise.addEventListener("click", () => { if (order.length) openCard(order[Math.floor(Math.random() * order.length)]); });

  /* ---- Course card ---- */
  let current = null;
  const fillCard = (id, swap) => {
    const c = byId.get(id); if (!c) return;
    current = id;
    const p = progById[c.prog], ts = terms();
    card.className = `cx-card p-${c.prog}`;
    $(".cx-d-code", card).innerHTML = mark(c.code, ts);
    $(".cx-lvl-name", card).innerHTML = `${pips(c.level)} ${LEVEL_NAMES[c.level - 1]}`;
    $("#cx-title", card).innerHTML = mark(c.name, ts);
    $(".cx-d-where", card).textContent = `${p.school} · ${p.degree}`;
    $(".cx-d-tags", card).innerHTML = c.tags.map((t) => `<button type="button" data-topic="${t}" title="Show all ${topicName[t]} courses">${topicName[t]}</button>`).join("");
    $(".cx-desc", card).innerHTML = mark(c.desc, ts);
    $(".cx-desc", card).scrollTop = 0;
    const idx = order.indexOf(id);
    $(".cx-d-pos", card).textContent = idx >= 0 ? `${idx + 1} of ${order.length}` : "";
    $("[data-prev]", card).disabled = $("[data-next]", card).disabled = order.length < 2;
    if (swap) { card.classList.remove("cx-swap"); void card.offsetWidth; card.classList.add("cx-swap"); }
  };
  const openCard = (id) => {
    fillCard(id, false);
    if (!dlg.open) { dlg.showModal(); document.documentElement.classList.add("cx-lock"); }
  };
  const step = (d) => {
    if (order.length < 2) return;
    const i = order.indexOf(current);
    fillCard(order[(i + d + order.length) % order.length], true);
  };
  dlg.addEventListener("close", () => document.documentElement.classList.remove("cx-lock"));
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  $(".cx-x", card).addEventListener("click", () => dlg.close());
  $("[data-prev]", card).addEventListener("click", () => step(-1));
  $("[data-next]", card).addEventListener("click", () => step(1));
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  });
  // Swipe left/right on touch screens
  let sx = 0, sy = 0;
  card.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  card.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 70 && Math.abs(dy) < 50) step(dx < 0 ? 1 : -1);
  }, { passive: true });
  // Clicking a topic on the card closes it and shows every course on that topic
  $(".cx-d-tags", card).addEventListener("click", (e) => {
    const b = e.target.closest("[data-topic]"); if (!b) return;
    state.topics = new Set([b.dataset.topic]);
    state.q = ""; input.value = "";
    PROGRAMS.forEach((p) => state.progs.add(p.id));
    render();
    dlg.close();
    $(".cx-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  render();
})();
