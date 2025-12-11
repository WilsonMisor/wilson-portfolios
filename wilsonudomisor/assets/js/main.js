const PROJECTS_PATH = "assets/data/projects.json";
const CONFIG_PATH = "assets/data/site-config.json";
const storagePrefix = "wu";
const EDIT_MODE_STORAGE_KEY = `${storagePrefix}_edit_mode`;

let editMode = false;
let siteConfig = null;
let projectsData = [];

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  initSite();
});

async function initSite() {
  siteConfig = await fetchJSON(CONFIG_PATH);
  projectsData = (await fetchJSON(PROJECTS_PATH)) || [];

  bindGlobalContent();
  renderFeatured(projectsData);
  renderProjectIndex(projectsData);
  renderSingleProject(projectsData);
}

async function fetchJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return await res.json();
  } catch (err) {
    console.warn(`${path} not loaded. Serve with a local server for fetch to work.`, err);
    const fallback = document.getElementById("projectsFallback");
    if (fallback) {
      fallback.textContent = "Unable to load data files. Run a simple local server (python -m http.server) and reload.";
    }
    return null;
  }
}

function setActiveNav() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("header .nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && current === href) {
      link.classList.add("active");
    }
  });
}

/* ------------------ Rendering ------------------ */
function renderFeatured(projects) {
  const container = document.getElementById("featuredProjects");
  if (!container) return;
  const featured = projects.filter((p) => p.featured).slice(0, 6);
  container.innerHTML = featured.map((p) => projectCardMarkup(p, true)).join("");
  attachCardLinkHandlers(container);
}

function renderProjectIndex(projects) {
  const listEl = document.getElementById("projectsList");
  const countEl = document.getElementById("projectsCount");
  const filterButtons = document.querySelectorAll("[data-filter]");
  if (!listEl || !countEl) return;

  const applyFilter = (category) => {
    const filtered =
      category === "all"
        ? projects
        : projects.filter((p) => p.category === category);
    listEl.innerHTML = filtered.map((p) => projectCardMarkup(p)).join("");
    countEl.textContent = `Showing ${filtered.length} project${filtered.length === 1 ? "" : "s"}`;
    attachCardLinkHandlers(listEl);
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(btn.dataset.filter);
    });
  });

  applyFilter("all");
}

function renderSingleProject(projects) {
  const caseStudy = document.querySelector("[data-project-id]");
  if (!caseStudy) return;
  const projectId = caseStudy.dataset.projectId;
  const project = projects.find((p) => p.id === projectId) || {};
  if (!project.id) return;

  fillText("projectTitle", project.title);
  fillText("snapshotProblem", project.problem);
  fillText("snapshotRole", `${project.roleType} — ${project.roleDetail}`);
  fillText("snapshotStack", project.tools.join(", "));
  fillText("snapshotTimeline", project.timeline);
  setLinkValue("linkGithub", project.links.github);

  fillText("contextGoal", project.contextGoal);
  fillText("contextGoalBody", project.contextGoal);
  fillList("whatBuiltList", project.whatIBuilt);
  fillList("challengesList", project.challenges);
  fillList("outcomeList", project.outcomeDetails);

  const archBox = document.getElementById("architectureBox");
  if (archBox && project.architecture) {
    const archSection = archBox.querySelector("h3") ? archBox.querySelector("h3").parentElement : archBox;
    if (project.architecture.diagram) {
      const existingContent = archSection.querySelector("h3");
      archSection.innerHTML = existingContent ? `<h3>${existingContent.textContent}</h3>` : "";
      const img = document.createElement("img");
      img.src = project.architecture.diagram;
      img.alt = `Architecture diagram for ${project.title}`;
      archSection.appendChild(img);
    }
    if (project.architecture.note) {
      const note = document.createElement("p");
      note.className = "helper";
      note.textContent = project.architecture.note;
      archSection.appendChild(note);
    }
  }

  const artifactsWrap = document.getElementById("artifactsGallery");
  if (artifactsWrap) {
    artifactsWrap.innerHTML = (project.artifacts || [])
      .map((art, index) => artifactMarkup(art, project.title, project.id, index))
      .join("");
  }
}

function projectCardMarkup(project, featured = false) {
  const caseStudyLink = `projects/project-${project.id}.html`;
  const tagline = featured ? project.problem : project.tagline;
  const impactLine = featured ? project.impact : project.roleDetail;
  return `
    <article class="card" data-category="${project.category}">
      <h3>${project.title}</h3>
      <p>${tagline}</p>
      <p class="impact-line">${impactLine}</p>
      <div class="meta">
        <span>${project.roleType}</span>
        <span>${project.timeline}</span>
        <span>${project.category}</span>
      </div>
      <div class="tags">
        ${project.tools.slice(0, 6).map((t) => `<span class="tag">${t}</span>`).join("")}
      </div>
      <div class="card-actions">
        <a class="btn primary" href="${caseStudyLink}">Read case study</a>
        <a class="btn" href="${project.links.github}" target="_blank" rel="noopener">GitHub</a>
      </div>
    </article>
  `;
}

function artifactMarkup(artifact, title, projectId, index) {
  if (artifact.type === "link") {
    return `
      <div class="artifact">
        <div class="meta">${artifact.title}</div>
        <p class="helper">${artifact.caption}</p>
        <a class="btn secondary" href="${artifact.url}" target="_blank" rel="noopener">Open artifact</a>
      </div>
    `;
  }

  if (artifact.type === "image") {
    const content = artifact.src
      ? `<img src="${artifact.src}" alt="${artifact.caption || artifact.title || 'Project artifact'}">`
      : `<div class="artifact-placeholder">Image placeholder</div>`;
    return `
      <div class="artifact">
        <div class="meta">${artifact.title}</div>
        ${content}
        <p class="helper">${artifact.caption || ''}</p>
      </div>
    `;
  }

  return "";
}

/* -------- Global bindings ---------- */
function bindGlobalContent() {
  setTextFromConfig("ownerName", "owner.name", "Wilson Sunday Udomisor");
  setTextFromConfig("ownerTitle", "owner.title", "Data Engineer and Data Scientist");
  setTextFromConfig("ownerProof", "owner.proofLine", "Building reliable data systems and delivering actionable insights.");

  applyLinkBindings();
}

function setTextFromConfig(id, path, fallback) {
  const el = document.getElementById(id);
  if (!el) return;
  const value = getConfigValue(path) || fallback;
  el.textContent = value;
}

function applyLinkBindings() {
  document.querySelectorAll("[data-link-path]").forEach((el) => {
    const path = el.dataset.linkPath;
    const allowMailto = el.dataset.mailto === "true";
    const value = getConfigValue(path) || el.getAttribute("href") || null;
    if (!value) {
      el.title = "Link not configured";
      el.href = "#";
    } else {
      el.href = allowMailto && !value.startsWith("mailto:") ? `mailto:${value}` : value;
    }
  });
}

function getConfigValue(path) {
  if (!siteConfig) return null;
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), siteConfig);
}

function setLinkValue(id, url) {
  const el = document.getElementById(id);
  if (!el || !url) return;
  el.href = url;
}

/* -------- Helpers ---------- */
function fillText(id, text) {
  const el = document.getElementById(id);
  if (el && text !== undefined) el.textContent = text;
}

function fillList(id, items) {
  const el = document.getElementById(id);
  if (!el || !items) return;
  el.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function attachCardLinkHandlers(container) {
  container.querySelectorAll("[data-project-link]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const projectId = btn.dataset.projectLink;
      window.location.href = `projects/project-${projectId}.html`;
    });
  });
}
