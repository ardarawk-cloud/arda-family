const data = window.ARDA_FAMILY_DATA || {};
const familyTree = document.getElementById("familyTree");
const ancestorGrid = document.getElementById("ancestorGrid");
const researchBoard = document.getElementById("researchBoard");
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const year = document.getElementById("year");

if (year) year.textContent = new Date().getFullYear();

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }));
}

function esc(value="") {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  })[c]);
}

function personCard(person, extraClass = "") {
  return `
    <article class="person-card ${extraClass}">
      <div class="avatar">${person.photo ? `<img src="${esc(person.photo)}" alt="${esc(person.name || "Anggota keluarga")}"${person.photoPosition ? ` style="object-position:${esc(person.photoPosition)}"` : ""}>` : esc(person.initials || person.name?.slice(0,2) || "AF")}</div>
      <span class="relation">${esc(person.relation || person.role || "Keluarga")}</span>
      <h3>${esc(person.name)}</h3>
      ${person.alias ? `<div class="person-alias">${esc(person.alias)}</div>` : ""}
      ${person.origin ? `<span class="meta">Asal: ${esc(person.origin)}</span>` : ""}
      ${person.status ? `<span class="status-badge ${person.status === "Cerai" ? "divorced" : "married"}">${esc(person.status)}</span>` : ""}
      ${person.generation ? `<span class="meta">${esc(person.generation)}</span>` : ""}
      ${person.note ? `<span class="meta">${esc(person.note)}</span>` : ""}
    </article>
  `;
}

function renderTree() {
  if (!familyTree || !data.root) return;

  const families = Array.isArray(data.families) ? data.families : [];

  const familyHtml = families.map(group => {
    const spouse = group.spouse || {};
    const children = Array.isArray(group.children) ? group.children : [];
    const childrenHtml = children.length
      ? children.map(child => `
          <div class="child-wrap">
            <div class="child-line"></div>
            ${personCard(child, "child-card")}
          </div>
        `).join("")
      : '<div class="empty-branch"><strong>Belum ada data anak</strong></div>';

    return `
      <section class="family-branch">
        <div class="branch-label">Keluarga ${String(group.order || "").padStart(2,"0")}</div>
        ${personCard(spouse, "spouse-card")}
        <div class="desc-line"></div>
        <div class="children-grid">${childrenHtml}</div>
      </section>
    `;
  }).join("");

  familyTree.innerHTML = `
    <div class="root-wrap">
      ${personCard(data.root, "root")}
      <div class="tree-line"></div>
    </div>
    <div class="family-shelf">${familyHtml}</div>
  `;
}

function renderAncestors() {
  if (!ancestorGrid) return;
  const items = Array.isArray(data.ancestors) ? data.ancestors : [];
  ancestorGrid.innerHTML = items.length ? items.map(a => `
    <article class="ancestor-card">
      <span class="tag">${esc(a.relation || "Leluhur")}</span>
      <h3>${esc(a.name)}</h3>
      <div class="alias">${esc(a.alias || "")}</div>
      <p>${esc(a.note || "")}</p>
      <dl>
        <dt>Hubungan</dt><dd>${esc(a.relation || "—")}</dd>
        <dt>Asal</dt><dd>${esc(a.place || "—")}</dd>
        <dt>Status</dt><dd>${esc(a.status || "Dalam riset")}</dd>
      </dl>
    </article>
  `).join("") : '<div class="empty-branch"><strong>Belum ada arsip leluhur</strong></div>';
}

function renderResearch() {
  if (!researchBoard) return;
  const items = Array.isArray(data.research) ? data.research : [];
  researchBoard.innerHTML = items.map((r,i) => `
    <article class="research-item">
      <span class="no">${String(i+1).padStart(2,"0")}</span>
      <h3>${esc(r.title)}</h3>
      <p>${esc(r.text)}</p>
    </article>
  `).join("");
}

renderTree();
renderAncestors();
renderResearch();