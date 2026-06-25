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
    details:
      "Sistem ini dibina untuk memusatkan proses tuntutan elaun, memudahkan semakan kewangan, dan memberi paparan bajet secara lebih jelas kepada pengguna dalaman. Fokus utama projek ialah workflow tuntutan, role-based access, dashboard perbelanjaan, dan migrasi data daripada format manual kepada database yang lebih tersusun.",
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
    details:
      "Sistem ini membantu pengguna membuat permohonan kenderaan, manakala admin boleh meluluskan permohonan, menetapkan kenderaan dan pemandu, menyemak kalendar tempahan, serta menghasilkan laporan. Projek ini menekankan aliran kerja yang boleh dijejak, akses mengikut peranan, dan dokumentasi UAT.",
    tags: ["Laravel", "Supabase", "RBAC"],
  },
  {
    id: "social-dashboard",
    badge: "Data Dashboard",
    image: "assets/social-media-dashboard.png",
    imageAlt: "Paparan Social Media Monitoring Dashboard",
    imageFit: "contain",
    type: "Data Dashboard",
    title: "Social Media Activity Monitoring Dashboard",
    description:
      "Dashboard Looker Studio untuk memantau posting JNN/JNC, platform, jenis kandungan, dan tahap engagement.",
    details:
      "Project Description\nDeveloped an interactive Looker Studio dashboard to monitor and analyze social media posting activities for JNN/JNC units. The dashboard visualizes posting frequency, platform usage, content types, engagement levels, and reporting status based on data collected through Google Forms and Google Sheets.\n\nKey Features\n• Integrated Google Forms responses with Google Sheets as the main data source.\n• Built interactive filters for date, JNN/JNC unit, platform, and content type.\n• Displayed key metrics such as total postings, active reporting units, main platform, and engagement level.\n• Visualized posting distribution by unit, content category, platform, and likes/reactions level.\n• Identified JNN/JNC units that had submitted reports and units with no records.\n• Created a simple monitoring view for management reporting and presentation purposes.\n\nTools & Technologies\n• Looker Studio\n• Google Sheets\n• Google Forms\n• Data Visualization\n• Dashboard Design\n• Data Cleaning\n• Reporting Analytics\n\nRole & Responsibilities\n• Designed the dashboard layout and reporting structure.\n• Cleaned and organized raw social media activity data.\n• Created calculated fields for engagement level ordering and reporting analysis.\n• Built charts, scorecards, tables, filters, and date range controls.\n• Prepared simplified insights for management-level presentation.",
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
    details:
      "Automasi ini menggunakan n8n, Gmail IMAP, dan Telegram Bot API untuk memantau email masuk dan menghantar alert terus ke Telegram. Workflow dikonfigurasi supaya mesej kekal unread dan attachment tidak dimuat turun bagi mengurangkan risiko pengendalian fail.",
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
    details:
      "Portfolio ini dibina sebagai static website dan dideploy melalui GitHub serta Vercel. Setiap perubahan yang dipush ke repository akan trigger deployment automatik, menjadikan proses update portfolio lebih cepat dan tersusun.",
    tags: ["GitHub", "Vercel", "CI/CD"],
  },
];

function readStoredProjects() {
  try {
    const storedProjects = JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY) || "null");
    if (!Array.isArray(storedProjects)) return defaultProjects;

    return storedProjects.map((project) => {
      const defaultProject = defaultProjects.find((item) => item.id === project.id);
      return {
        ...defaultProject,
        ...project,
        details: project.details || defaultProject?.details || project.description || "",
      };
    });
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
  const ratingHtml =
    typeof window !== "undefined" && typeof window.getProjectRatingSummary === "function"
      ? window.getProjectRatingSummary(project.id)
      : "";

  return `
    <article class="project-card" data-project-id="${escapeHtml(project.id)}" tabindex="0" role="button" aria-label="Lihat detail ${escapeHtml(project.title)}">
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
        ${ratingHtml}
        <div class="tags">${tags}</div>
      </div>
    </article>
  `;
}

function normalizeProject(project) {
  return {
    ...project,
    details: project.details || project.description || "",
  };
}

function renderProjectGrid(target, projects = readStoredProjects()) {
  if (!target) return;
  target.innerHTML = projects.map(normalizeProject).map(projectCardTemplate).join("");
}
