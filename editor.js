let projects = readStoredProjects();
let selectedId = projects[0]?.id || "";
let uploadedImage = "";

const form = document.querySelector("#project-form");
const projectSelect = document.querySelector("#project-select");
const imageUpload = document.querySelector("#image-upload");
const preview = document.querySelector("#card-preview");
const editorGrid = document.querySelector("#editor-project-grid");
const newProjectButton = document.querySelector("#new-project");
const deleteProjectButton = document.querySelector("#delete-project");
const resetButton = document.querySelector("#reset-projects");

function currentProject() {
  return projects.find((project) => project.id === selectedId) || projects[0];
}

function projectFromForm() {
  const formData = new FormData(form);
  return {
    id: String(formData.get("id") || `project-${Date.now()}`),
    badge: String(formData.get("badge") || "").trim(),
    image: uploadedImage || currentProject()?.image || "assets/portfolio-visual.svg",
    imageAlt: String(formData.get("title") || "Project preview"),
    imageFit: String(formData.get("imageFit") || "contain"),
    type: String(formData.get("type") || "").trim(),
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    tags: String(formData.get("tags") || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  };
}

function populateSelect() {
  projectSelect.innerHTML = projects
    .map((project) => `<option value="${escapeHtml(project.id)}">${escapeHtml(project.title)}</option>`)
    .join("");
  projectSelect.value = selectedId;
}

function fillForm(project) {
  if (!project) return;
  uploadedImage = "";
  form.elements.id.value = project.id;
  form.elements.badge.value = project.badge || "";
  form.elements.type.value = project.type || "";
  form.elements.title.value = project.title || "";
  form.elements.description.value = project.description || "";
  form.elements.tags.value = (project.tags || []).join(", ");
  form.elements.imageFit.value = project.imageFit || "contain";
  imageUpload.value = "";
  renderPreview();
}

function renderPreview() {
  const project = projectFromForm();
  preview.innerHTML = projectCardTemplate(project);
}

function renderAll() {
  populateSelect();
  fillForm(currentProject());
  renderProjectGrid(editorGrid, projects);
}

function resizeImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("error", reject);
    reader.addEventListener("load", () => {
      const image = new Image();
      image.addEventListener("error", reject);
      image.addEventListener("load", () => {
        const maxWidth = 1200;
        const maxHeight = 760;
        const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
        const width = Math.round(image.width * ratio);
        const height = Math.round(image.height * ratio);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.88));
      });
      image.src = String(reader.result || "");
    });
    reader.readAsDataURL(file);
  });
}

projectSelect?.addEventListener("change", () => {
  selectedId = projectSelect.value;
  fillForm(currentProject());
});

form?.addEventListener("input", renderPreview);

imageUpload?.addEventListener("change", async () => {
  const file = imageUpload.files?.[0];
  if (!file) return;

  try {
    uploadedImage = await resizeImageFile(file);
    renderPreview();
  } catch {
    uploadedImage = "";
  }
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const updatedProject = projectFromForm();
  const index = projects.findIndex((project) => project.id === updatedProject.id);

  if (index >= 0) {
    projects[index] = updatedProject;
  } else {
    projects.push(updatedProject);
  }

  selectedId = updatedProject.id;
  saveStoredProjects(projects);
  renderAll();
});

newProjectButton?.addEventListener("click", () => {
  const newProject = {
    id: `project-${Date.now()}`,
    badge: "New Project",
    image: "assets/portfolio-visual.svg",
    imageAlt: "New project preview",
    imageFit: "contain",
    type: "Project",
    title: "Projek Baru",
    description: "Tulis penerangan ringkas projek di sini.",
    tags: ["Tag 1", "Tag 2"],
  };

  projects.push(newProject);
  selectedId = newProject.id;
  saveStoredProjects(projects);
  renderAll();
});

deleteProjectButton?.addEventListener("click", () => {
  if (projects.length <= 1) return;
  projects = projects.filter((project) => project.id !== selectedId);
  selectedId = projects[0]?.id || "";
  saveStoredProjects(projects);
  renderAll();
});

resetButton?.addEventListener("click", () => {
  projects = structuredClone(defaultProjects);
  selectedId = projects[0].id;
  saveStoredProjects(projects);
  renderAll();
});

renderAll();
