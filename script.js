const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

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
