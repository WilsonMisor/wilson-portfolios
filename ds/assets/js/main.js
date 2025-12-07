const PROJECTS_PATH = "data/projects.json";
const CONFIG_PATH = "data/site-config.json";
const storagePrefix = (document.body && document.body.dataset.site) || "de";
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

  initEditMode();

  if (document.body.dataset.page === "admin") {
    initAdminPanel();
  }
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
  const featured = projects.filter((p) => p.featured).slice(0, 4).map(applyProjectOverride);
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
        : projects.filter((p) => applyProjectOverride(p).category === category);
    const mapped = filtered.map(applyProjectOverride);
    listEl.innerHTML = mapped.map((p) => projectCardMarkup(p)).join("");
    countEl.textContent = `Showing ${mapped.length} project${mapped.length === 1 ? "" : "s"}`;
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
  const project = applyProjectOverride(projects.find((p) => p.id === projectId) || {});
  if (!project.id) return;

  fillText("projectTitle", project.title);
  fillText("snapshotProblem", project.problem);
  fillText("snapshotRole", `${project.roleType} — ${project.roleDetail}`);
  fillText("snapshotStack", project.tools.join(", "));
  fillText("snapshotTimeline", project.timeline);
  setLinkValue("linkGithub", project.links.github);
  setLinkValue("linkDrive", project.links.drive);
  setLinkValue("linkCanva", project.links.canva);

  fillText("contextGoal", project.contextGoal);
  fillText("contextGoalBody", project.contextGoal);
  fillList("whatBuiltList", project.whatIBuilt);
  fillList("challengesList", project.challenges);
  fillList("outcomeList", project.outcomeDetails);

  const archBox = document.getElementById("architectureBox");
  if (archBox) {
    if (project.architecture && project.architecture.diagram) {
      archBox.innerHTML = `<img src="${project.architecture.diagram}" alt="Architecture diagram for ${project.title}">`;
    } else {
      archBox.innerHTML = `<div class="diagram-placeholder editable-image" data-edit-image-key="project_${project.id}_architecture">Architecture diagram placeholder</div>`;
    }
    if (project.architecture && project.architecture.note) {
      const note = document.createElement("p");
      note.className = "helper";
      note.textContent = project.architecture.note;
      archBox.appendChild(note);
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
  const caseStudyLink = `project-${project.id}.html`;
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
        ${project.tools.map((t) => `<span class="tag">${t}</span>`).join("")}
      </div>
      <div class="card-actions">
        <button class="btn primary" data-project-link="${project.id}">Read case study</button>
        <a class="btn secondary" href="${caseStudyLink}">Open page</a>
        <a class="btn" href="${project.links.github}" target="_blank" rel="noopener">GitHub</a>
        <a class="btn" href="${project.links.drive}" target="_blank" rel="noopener">Drive</a>
        <a class="btn" href="${project.links.canva}" target="_blank" rel="noopener">Canva</a>
      </div>
    </article>
  `;
}

function artifactMarkup(artifact, title, projectId, index) {
  const editKeyBase = `project_${projectId}_artifact_${index}`;
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
      ? `<img src="${artifact.src}" alt="${artifact.caption || artifact.title}">`
      : `<div class="artifact-placeholder editable-image" data-edit-image-key="${editKeyBase}">Image placeholder</div>`;
    return `
      <div class="artifact">
        <div class="meta">${artifact.title}</div>
        ${content}
        <p class="helper">${artifact.caption}</p>
      </div>
    `;
  }

  return "";
}

/* -------- Edit mode: links, text, images ---------- */
function initEditMode() {
  editMode = localStorage.getItem(EDIT_MODE_STORAGE_KEY) === "true";
  applyEditModeClass();
  setupEditableElements();
  setupEditToggle();
  setupEditHotkey();
}

function setupEditToggle() {
  const toggleBtn = document.getElementById("editToggle");
  if (!toggleBtn) return;
  toggleBtn.addEventListener("click", () => toggleEditMode());
  updateToggleLabel(toggleBtn);
}

function setupEditHotkey() {
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.code === "KeyE") {
      e.preventDefault();
      toggleEditMode();
    }
  });
}

function toggleEditMode() {
  editMode = !editMode;
  localStorage.setItem(EDIT_MODE_STORAGE_KEY, editMode);
  applyEditModeClass();
  setupEditableElements();
  const toggleBtn = document.getElementById("editToggle");
  if (toggleBtn) updateToggleLabel(toggleBtn);
}

function applyEditModeClass() {
  document.body.classList.toggle("edit-mode", editMode);
}

function updateToggleLabel(btn) {
  btn.textContent = editMode ? "Done" : "Edit";
}

function storageKey(base) {
  return `${storagePrefix}_${base}`;
}

function setupEditableElements() {
  setupEditableImages();
  setupEditableLinks();
  setupEditableText();
}

function setupEditableImages() {
  document.querySelectorAll("[data-edit-image-key]").forEach((el) => {
    const baseKey = el.dataset.editImageKey;
    const key = storageKey(baseKey);
    if (!el.dataset.imageSetup) {
      const overlay = document.createElement("div");
      overlay.className = "edit-overlay";
      const btnFile = document.createElement("button");
      btnFile.type = "button";
      btnFile.className = "edit-badge";
      btnFile.textContent = "Change photo";
      const btnUrl = document.createElement("button");
      btnUrl.type = "button";
      btnUrl.className = "edit-badge";
      btnUrl.textContent = "Use URL";
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.style.display = "none";

      btnFile.addEventListener("click", () => input.click());
      input.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          const dataUrl = evt.target?.result;
          if (typeof dataUrl === "string") {
            localStorage.setItem(key, dataUrl);
            setElementImage(el, dataUrl);
          }
        };
        reader.readAsDataURL(file);
      });

      btnUrl.addEventListener("click", () => {
        const current = localStorage.getItem(key) || getConfigValue(baseKey) || "";
        const next = window.prompt("Enter image path or URL", current);
        if (next) {
          localStorage.setItem(key, next);
          setElementImage(el, next);
        }
      });

      overlay.append(btnFile, btnUrl);
      el.appendChild(overlay);
      el.appendChild(input);
      el.dataset.imageSetup = "true";
    }
    const saved = localStorage.getItem(key);
    if (saved) setElementImage(el, saved);
    else {
      const cfg = getConfigValue(baseKey);
      if (cfg) setElementImage(el, cfg);
    }
  });
}

function setElementImage(el, source) {
  if (el.tagName === "IMG") {
    el.src = source;
  } else {
    el.style.backgroundImage = `url(${source})`;
  }
  el.classList.add("has-image");
}

function setupEditableLinks() {
  document.querySelectorAll("[data-edit-link-key]").forEach((link) => {
    const baseKey = link.dataset.editLinkKey;
    const key = storageKey(baseKey);
    const saved = localStorage.getItem(key);
    if (saved) link.href = transformLink(baseKey, saved);

    if (!link.dataset.linkSetup) {
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "edit-link-btn";
      editBtn.textContent = "Edit link";
      editBtn.addEventListener("click", () => {
        const current = localStorage.getItem(key) || link.getAttribute("href") || "";
        const next = window.prompt("Enter URL", current);
        if (next) {
          localStorage.setItem(key, next);
          link.href = transformLink(baseKey, next);
        }
      });
      link.insertAdjacentElement("afterend", editBtn);
      link.dataset.linkSetup = "true";
    }
  });
}

function transformLink(key, value) {
  if (key.includes("links.whatsappNumber")) return `https://wa.me/${value}`;
  if (key.includes("email") && !value.startsWith("mailto:")) return `mailto:${value}`;
  return value;
}

function setupEditableText() {
  document.querySelectorAll("[data-edit-text-key]").forEach((el) => {
    const baseKey = el.dataset.editTextKey;
    const key = storageKey(baseKey);
    const saved = localStorage.getItem(key);
    if (saved) el.textContent = saved;

    if (editMode) {
      el.contentEditable = "true";
      if (!el.dataset.textSetup) {
        el.addEventListener("blur", () => {
          localStorage.setItem(key, el.textContent || "");
        });
        el.dataset.textSetup = "true";
      }
    } else {
      el.contentEditable = "false";
    }
  });
}

/* -------- Global bindings ---------- */
function bindGlobalContent() {
  setTextFromConfig("ownerName", "owner.name", "Wilson Udomisor");
  setTextFromConfig("ownerTitle", "owner.title", "Data Engineer focused on reliable pipelines and clean analytics.");
  setTextFromConfig("ownerProof", "owner.proofLine", "I build end-to-end data systems with Python, SQL, Airflow, dbt, and cloud tools.");

  applyLinkBindings();
  setWhatsAppLink();

  setImageFromConfig("heroHomeImage", "images.homeHeroPhoto");
  setImageFromConfig("heroAboutImage", "images.aboutHeroPhoto");
  setImageFromConfig("headshotImage", "images.headshot");
}

function setTextFromConfig(id, path, fallback) {
  const el = document.getElementById(id);
  if (!el) return;
  const value = getMergedValue(path, fallback);
  el.textContent = value;
}

function applyLinkBindings() {
  document.querySelectorAll("[data-link-path]").forEach((el) => {
    const path = el.dataset.linkPath;
    const allowMailto = el.dataset.mailto === "true";
    const value = getMergedValue(path, el.getAttribute("href") || null);
    if (!value) {
      el.title = "Add your link via Admin or Edit Mode.";
      el.href = "#";
    } else {
      el.href = allowMailto && !value.startsWith("mailto:") ? `mailto:${value}` : value;
    }
  });
}

function setWhatsAppLink() {
  document.querySelectorAll("[data-whatsapp-link]").forEach((el) => {
    const number = getMergedValue("links.whatsappNumber", null);
    if (number) {
      el.href = `https://wa.me/${number}`;
      el.target = "_blank";
      el.rel = "noopener";
    } else {
      el.href = "#";
      el.title = "Add your WhatsApp number in Admin.";
    }
  });
}

function setImageFromConfig(id, path) {
  const el = document.getElementById(id);
  if (!el) return;
  const value = getMergedValue(path, null);
  if (value) setElementImage(el, value);
}

function getMergedValue(path, fallback = null) {
  const local = localStorage.getItem(storageKey(path));
  if (local) return local;
  const cfg = getConfigValue(path);
  if (cfg) return cfg;
  return fallback;
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

/* -------- Project overrides ---------- */
function applyProjectOverride(project) {
  if (!project || !project.id) return project;
  const overrideKey = storageKey(`project_${project.id}_override`);
  const overrideRaw = localStorage.getItem(overrideKey);
  if (!overrideRaw) return project;
  try {
    const overrideObj = JSON.parse(overrideRaw);
    return {
      ...project,
      ...overrideObj,
      links: { ...(project.links || {}), ...(overrideObj.links || {}) },
      tools: overrideObj.tools || project.tools,
      whatIBuilt: overrideObj.whatIBuilt || project.whatIBuilt,
      challenges: overrideObj.challenges || project.challenges,
      outcomeDetails: overrideObj.outcomeDetails || project.outcomeDetails,
      artifacts: overrideObj.artifacts || project.artifacts,
    };
  } catch (err) {
    console.warn("Invalid project override", err);
    return project;
  }
}

/* -------- Admin panel ---------- */
function initAdminPanel() {
  const adminStatus = document.getElementById("adminStatus");
  if (!adminStatus) return;
  if (!siteConfig) {
    adminStatus.textContent = "Config not loaded. Serve with a local server.";
    return;
  }
  adminStatus.textContent = "Client-side admin ready. Changes save to localStorage.";

  populateAdminForm();
  wireAdminForm();
}

function populateAdminForm() {
  const fields = [
    { id: "adminName", path: "owner.name" },
    { id: "adminTitle", path: "owner.title" },
    { id: "adminProof", path: "owner.proofLine" },
    { id: "adminGithub", path: "links.githubProfile" },
    { id: "adminLinkedIn", path: "links.linkedin" },
    { id: "adminEmail", path: "links.email" },
    { id: "adminWhatsApp", path: "links.whatsappNumber" },
    { id: "adminResume", path: "links.resume" },
    { id: "adminHeroHome", path: "images.homeHeroPhoto" },
    { id: "adminHeroAbout", path: "images.aboutHeroPhoto" },
    { id: "adminHeadshot", path: "images.headshot" },
  ];
  fields.forEach(({ id, path }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = getMergedValue(path, "");
  });

  const projectList = document.getElementById("adminProjects");
  if (!projectList) return;
  projectList.innerHTML = "";
  projectsData.forEach((proj) => {
    const merged = applyProjectOverride(proj);
    const wrapper = document.createElement("details");
    wrapper.className = "card";
    wrapper.innerHTML = `
      <summary>${merged.title} (${merged.id})</summary>
      <div class="admin-grid">
        <label>Title<input data-project-field="title" data-project-id="${merged.id}" value="${merged.title}"></label>
        <label>Tagline<input data-project-field="tagline" data-project-id="${merged.id}" value="${merged.tagline}"></label>
        <label>Problem<input data-project-field="problem" data-project-id="${merged.id}" value="${merged.problem}"></label>
        <label>Impact<input data-project-field="impact" data-project-id="${merged.id}" value="${merged.impact}"></label>
        <label>Category<input data-project-field="category" data-project-id="${merged.id}" value="${merged.category}"></label>
        <label>Tools (comma separated)<input data-project-field="tools" data-project-id="${merged.id}" value="${merged.tools.join(", ")}"></label>
        <label>Links: GitHub<input data-project-field="links.github" data-project-id="${merged.id}" value="${merged.links.github}"></label>
        <label>Links: Drive<input data-project-field="links.drive" data-project-id="${merged.id}" value="${merged.links.drive}"></label>
        <label>Links: Canva<input data-project-field="links.canva" data-project-id="${merged.id}" value="${merged.links.canva}"></label>
        <label>Featured<input type="checkbox" data-project-field="featured" data-project-id="${merged.id}" ${merged.featured ? "checked" : ""}></label>
      </div>
      <button class="btn secondary save-project" data-save-project="${merged.id}" type="button">Save project override</button>
    `;
    projectList.appendChild(wrapper);
  });
}

function wireAdminForm() {
  const saveBtn = document.getElementById("adminSaveConfig");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const fields = {
        "owner.name": document.getElementById("adminName")?.value,
        "owner.title": document.getElementById("adminTitle")?.value,
        "owner.proofLine": document.getElementById("adminProof")?.value,
        "links.githubProfile": document.getElementById("adminGithub")?.value,
        "links.linkedin": document.getElementById("adminLinkedIn")?.value,
        "links.email": document.getElementById("adminEmail")?.value,
        "links.whatsappNumber": document.getElementById("adminWhatsApp")?.value,
        "links.resume": document.getElementById("adminResume")?.value,
        "images.homeHeroPhoto": document.getElementById("adminHeroHome")?.value,
        "images.aboutHeroPhoto": document.getElementById("adminHeroAbout")?.value,
        "images.headshot": document.getElementById("adminHeadshot")?.value,
      };
      Object.entries(fields).forEach(([path, value]) => {
        if (value !== undefined && value !== null) {
          localStorage.setItem(storageKey(path), value);
        }
      });
      alert("Config saved locally. Refresh pages to see changes.");
    });
  }

  document.querySelectorAll(".save-project").forEach((btn) => {
    btn.addEventListener("click", () => saveProjectOverride(btn.dataset.saveProject));
  });

  const exportBtn = document.getElementById("adminExport");
  if (exportBtn) {
    exportBtn.addEventListener("click", handleExport);
  }

  const importBtn = document.getElementById("adminImport");
  if (importBtn) {
    importBtn.addEventListener("click", handleImport);
  }
}

function saveProjectOverride(projectId) {
  const fields = document.querySelectorAll(`[data-project-id="${projectId}"][data-project-field]`);
  const override = {};
  fields.forEach((input) => {
    const field = input.dataset.projectField;
    if (field === "featured") {
      override.featured = input.checked;
    } else if (field === "tools") {
      override.tools = input.value.split(",").map((t) => t.trim()).filter(Boolean);
    } else if (field.startsWith("links.")) {
      override.links = override.links || {};
      const key = field.split(".")[1];
      override.links[key] = input.value;
    } else {
      override[field] = input.value;
    }
  });
  localStorage.setItem(storageKey(`project_${projectId}_override`), JSON.stringify(override));
  alert(`Saved override for ${projectId} locally.`);
}

function handleExport() {
  const exportData = {};
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(storagePrefix + "_")) {
      exportData[key] = localStorage.getItem(key);
    }
  });
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${storagePrefix}-overrides.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleImport() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result || "{}");
        Object.entries(data).forEach(([k, v]) => {
          if (k.startsWith(storagePrefix + "_")) {
            localStorage.setItem(k, v);
          }
        });
        alert("Overrides imported. Refresh pages to see changes.");
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  });
  input.click();
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
