const PROJECT_STORAGE_KEY = "redzuanPortfolioProjects";

const defaultProjects = [
  {
    id: "myclaim",
    badge: "Django Stack",
    image: "assets/myclaim-preview.png",
    imageAlt: "Logo MyClaim JN",
    imageFit: "contain",
    type: "Django System",
    title: "e-Nazir MyClaim System",
    description:
      "Sistem tuntutan elaun dan pemantauan bajet untuk mendigitalkan proses claim manual di Jemaah Nazir.",
    tags: ["Django", "Bootstrap 5", "Chart.js"],
  },
  {
    id: "vehicle-booking",
    badge: "Laravel Stack",
    image: "assets/vehicle-booking-preview.png",
    imageAlt: "Logo MyTempahanJN",
    imageFit: "contain",
    type: "Laravel App",
    title: "Sistem Tempahan Kenderaan JN",
    description:
      "Aplikasi tempahan kenderaan dengan Google OAuth, kelulusan admin, assignment pemandu, laporan, dan audit log.",
    tags: ["Laravel", "Supabase", "RBAC"],
  },
  {
    id: "social-dashboard",
    badge: "Data Dashboard",
    image: "assets/social-media-dashboard.png",
    imageAlt: "Paparan Social Media Monitoring Dashboard",
    imageFit: "contain",
    type: "Data Dashboard",
    title: "Social Media Monitoring Dashboard",
    description:
      "Dashboard Looker Studio untuk memantau posting JNN/JNC, platform, jenis kandungan, dan tahap engagement.",
    tags: ["Looker Studio", "Google Sheets", "Reporting"],
  },
  {
    id: "email-telegram",
    badge: "Workflow Automation",
    image: "assets/email-telegram-n8n.png",
    imageAlt: "Visual automasi Email, Telegram, dan n8n",
    imageFit: "cover",
    type: "Automation",
    title: "Email-to-Telegram Notification",
    description:
      "Workflow n8n yang memantau Gmail melalui IMAP dan menghantar notifikasi Telegram secara real-time.",
    tags: ["n8n", "Gmail IMAP", "Telegram API"],
  },
  {
    id: "portfolio",
    badge: "Vercel Deployment",
    image: "assets/portfolio-preview.png",
    imageAlt: "Paparan hero portfolio Syed Redzuan",
    imageFit: "contain",
    type: "Portfolio Deployment",
    title: "Personal Portfolio Website",
    description:
      "Deployed a static portfolio website using GitHub and Vercel with automatic deployment triggered by Git commits.",
    tags: ["GitHub", "Vercel", "CI/CD"],
  },
];

function readStoredProjects() {
  try {
    const storedProjects = JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY) || "null");
    return Array.isArray(storedProjects) ? storedProjects : defaultProjects;
  } catch {
    return defaultProjects;
  }
}

function saveStoredProjects(projects) {
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function projectCardTemplate(project) {
  const tags = (project.tags || [])
    .filter(Boolean)
    .map((tag) => `<span>${escapeHtml(tag)}</span>`)
    .join("");
  const fit = project.imageFit === "cover" ? "cover" : "contain";

  return `
    <article class="project-card">
      <div class="project-shot screenshot">
        <span>${escapeHtml(project.badge || "Project")}</span>
        <figure>
          <img class="fit-${fit}" src="${escapeHtml(project.image)}" alt="${escapeHtml(project.imageAlt || project.title)}" />
        </figure>
      </div>
      <div class="project-content">
        <p class="project-type">${escapeHtml(project.type)}</p>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description)}</p>
        <div class="tags">${tags}</div>
      </div>
    </article>
  `;
}

function renderProjectGrid(target, projects = readStoredProjects()) {
  if (!target) return;
  target.innerHTML = projects.map(projectCardTemplate).join("");
}
