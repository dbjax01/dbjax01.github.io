// Edit the menu here once; every page updates.
const before = [["index.html", "Home"]];
const dropdown = [
  ["florida-scholars.html", "Florida Scholars Academy"],
  ["virtual-enterprises.html", "Kanapaha Middle School"],
  ["flo-fly.html", "Flo-Fly"],
  ["education.html", "Education"]
];
const after = [["peace-corps.html", "Peace Corps"], ["goals.html", "Career Goals"], ["resume.html", "Resume"]];

const here = location.pathname.split("/").pop() || "index.html";
const item = ([h, t]) => `<li><a href="${h}"${h === here ? ' aria-current="page"' : ""}>${t}</a></li>`;
const inDropdown = dropdown.some(([h]) => h === here);

const links =
  before.map(item).join("") +
  `<li class="dd"><button type="button" aria-expanded="false"${inDropdown ? ' aria-current="true"' : ""}>Background &#9662;</button><ul>${dropdown.map(item).join("")}</ul></li>` +
  after.map(item).join("") +
  '<li><a href="#contact">Contact</a></li>';

document.head.insertAdjacentHTML("beforeend", '<link rel="icon" href="photos/favicon.svg" type="image/svg+xml"><link rel="icon" href="photos/favicon.ico" sizes="any">');

document.body.insertAdjacentHTML("afterbegin", `<header><nav class="wrap" aria-label="Main"><a class="logo" href="index.html">David Jackson</a><ul>${links}</ul></nav></header>`);

document.body.insertAdjacentHTML("beforeend", `<footer class="contact" id="contact"><div class="wrap"><h2>Let's talk about your students</h2><p>I'm available for secondary teaching roles after my Peace Corps service. I'd welcome a conversation with any principal or department head.</p><p><a class="big" href="mailto:Dbjackson2001@gmail.com">Dbjackson2001@gmail.com</a></p><p><a href="https://www.linkedin.com/in/dbj01/">linkedin.com/in/dbj01</a></p></div></footer>`);

// Open and close the dropdown (works with taps on phones too)
const dd = document.querySelector(".dd");
const btn = dd.querySelector("button");
const closeMenu = () => { dd.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); };
btn.addEventListener("click", () => {
  const open = dd.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
});
document.addEventListener("click", (e) => { if (!dd.contains(e.target)) closeMenu(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });