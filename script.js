const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const projectGrid = document.querySelector("#project-grid");

renderProjectGrid(projectGrid);

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
  const message = String(formData.get("message") || "").trim();

  const subject = encodeURIComponent(`Portfolio feedback from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nFeedback:\n${message}`,
  );

  window.location.href = `mailto:redzuanchrls@gmail.com?subject=${subject}&body=${body}`;

  if (feedbackNote) {
    feedbackNote.textContent = "Email client sedang dibuka. Terima kasih untuk feedback anda.";
  }
});
