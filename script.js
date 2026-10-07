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

function renderTree() {
  if (!familyTree || !data.root) return;
  const r = data.root;
  const branches = Array.isArray(data.branches) ? data.branches : [];

  const branchHtml = branches.length
    ? branches.map(b => `
      <article class="person-card">
        <div class="avatar">${esc(b.initials || b.name?.slice(0,2) || "AF")}</div>
        <span class="relation">${esc(b.relation || "Keluarga")}</span>
        <h3>${esc(b.name)}</h3>
        <span class="meta">${esc(b.note || "")}</span>
      </article>`).join("")
    : `
      <article class="empty-branch">
        <div>
          <strong>Cabang keluarga belum ditambahkan</strong>
          <span>Anggota berikutnya akan muncul di sini setelah datanya dimasukkan.</span>
        </div>
      </article>`;

  familyTree.innerHTML = `
    <div class="root-wrap">
      <article class="person-card root">
        <div class="avatar">${esc(r.initials || "AR")}</div>
        <span class="relation">${esc(r.role || "Family Root")}</span>
        <h3>${esc(r.name)}</h3>
        <span class="meta">${esc(r.generation || "")}</span>
        <span class="meta">${esc(r.note || "")}</span>
      </article>
      <div class="tree-line"></div>
    </div>
    <div class="branch-shelf">${branchHtml}</div>
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