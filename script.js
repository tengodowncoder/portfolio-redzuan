const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const projectGrid = document.querySelector("#project-grid");
const feedbackProject = document.querySelector("#feedback-project");
const modal = document.querySelector("#project-modal");
const modalContent = document.querySelector("#modal-content");
const COMMENT_STORAGE_KEY = "redzuanPortfolioComments";
let activeProjectId = "";

renderProjectGrid(projectGrid);

function readComments() {
  try {
    const comments = JSON.parse(localStorage.getItem(COMMENT_STORAGE_KEY) || "{}");
    return comments && typeof comments === "object" ? comments : {};
  } catch {
    return {};
  }
}

function saveComment(projectId, comment) {
  const comments = readComments();
  comments[projectId] = [...(comments[projectId] || []), comment];
  localStorage.setItem(COMMENT_STORAGE_KEY, JSON.stringify(comments));
}

function getProjectById(projectId) {
  return readStoredProjects().find((project) => project.id === projectId);
}

function stars(value) {
  const rating = Number(value) || 0;
  return "★★★★★"
    .split("")
    .map((star, index) => `<span class="${index < rating ? "active" : ""}">${star}</span>`)
    .join("");
}

function renderComments(projectId) {
  const comments = readComments()[projectId] || [];

  if (!comments.length) {
    return `<p class="empty-comments">Belum ada feedback untuk sistem ini.</p>`;
  }

  return comments
    .map(
      (comment) => `
        <article class="comment-item">
          <div>
            <strong>${escapeHtml(comment.name)}</strong>
            <div class="comment-stars">${stars(comment.rating)}</div>
          </div>
          <p>${escapeHtml(comment.message)}</p>
        </article>
      `,
    )
    .join("");
}

function openProjectModal(projectId) {
  const project = getProjectById(projectId);
  if (!project || !modal || !modalContent) return;

  activeProjectId = projectId;
  const tags = (project.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  const fit = project.imageFit === "cover" ? "cover" : "contain";

  modalContent.innerHTML = `
    <div class="modal-hero">
      <div class="project-shot screenshot">
        <span>${escapeHtml(project.badge || "Project")}</span>
        <figure>
          <img class="fit-${fit}" src="${escapeHtml(project.image)}" alt="${escapeHtml(project.imageAlt || project.title)}" />
        </figure>
      </div>
      <div>
        <p class="project-type">${escapeHtml(project.type)}</p>
        <h2 id="modal-title">${escapeHtml(project.title)}</h2>
        <p>${escapeHtml(project.description)}</p>
        <div class="tags">${tags}</div>
      </div>
    </div>
    <div class="modal-detail">
      <h3>Detail penuh</h3>
      <p>${escapeHtml(project.details || project.description)}</p>
    </div>
    <div class="modal-comments">
      <h3>Feedback visitor</h3>
      <div id="modal-comments-list">${renderComments(project.id)}</div>
    </div>
  `;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeProjectModal() {
  modal?.classList.remove("open");
  modal?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function populateFeedbackProjects() {
  if (!feedbackProject) return;

  feedbackProject.innerHTML = readStoredProjects()
    .map((project) => `<option value="${escapeHtml(project.id)}">${escapeHtml(project.title)}</option>`)
    .join("");
}

populateFeedbackProjects();

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

projectGrid?.addEventListener("click", (event) => {
  const card = event.target.closest(".project-card");
  if (!card) return;
  openProjectModal(card.dataset.projectId);
});

projectGrid?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest(".project-card");
  if (!card) return;
  event.preventDefault();
  openProjectModal(card.dataset.projectId);
});

modal?.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-modal]")) {
    closeProjectModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProjectModal();
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const target = entry.target;
      const endValue = Number(target.dataset.count || 0);
      let current = 0;
      const step = Math.max(1, Math.ceil(endValue / 28));

      const tick = () => {
        current = Math.min(endValue, current + step);
        target.textContent = `${current}+`;

        if (current < endValue) {
          requestAnimationFrame(tick);
        }
      };

      tick();
      counterObserver.unobserve(target);
    });
  },
  { threshold: 0.4 },
);

counters.forEach((counter) => counterObserver.observe(counter));

const feedbackForm = document.querySelector("#feedback-form");
const feedbackNote = document.querySelector("#feedback-note");

feedbackForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(feedbackForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const projectId = String(formData.get("project") || "").trim();
  const project = getProjectById(projectId);
  const rating = String(formData.get("rating") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const comment = {
    name,
    email,
    rating,
    message,
    createdAt: new Date().toISOString(),
  };

  saveComment(projectId, comment);

  const subject = encodeURIComponent(`Portfolio feedback for ${project?.title || "project"} from ${name}`);
  const body = encodeURIComponent(
    `Project: ${project?.title || projectId}\nRating: ${rating}/5\nName: ${name}\nEmail: ${email}\n\nFeedback:\n${message}`,
  );

  window.location.href = `mailto:redzuanchrls@gmail.com?subject=${subject}&body=${body}`;

  if (activeProjectId === projectId) {
    const commentList = document.querySelector("#modal-comments-list");
    if (commentList) {
      commentList.innerHTML = renderComments(projectId);
    }
  }

  if (feedbackNote) {
    feedbackNote.textContent =
      "Feedback disimpan dalam browser ini dan email client sedang dibuka. Terima kasih.";
  }

  feedbackForm.reset();
});
