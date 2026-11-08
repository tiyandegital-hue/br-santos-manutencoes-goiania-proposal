/* Santos Manutenções — shared site JS. Business name = one swappable constant. */
const BUSINESS_NAME = "Santos Manutenções";
const WA_URL = "https://wa.me/5562992633484?text=Ol%C3%A1%2C%20preciso%20de%20um%20encanador%20urgente.";
const WA_TEL = "+5562992633484";

/* Mobile nav toggle */
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.getElementById("mainnav");
if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mainNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mainNav.classList.remove("open")));
}

/* FAQ accordions */
document.querySelectorAll(".faq-item").forEach(item => {
  const q = item.querySelector(".faq-q");
  const a = item.querySelector(".faq-a");
  q.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach(o => {
      o.classList.remove("open");
      o.querySelector(".faq-q").setAttribute("aria-expanded", "false");
    });
    if (!isOpen) {
      item.classList.add("open");
      q.setAttribute("aria-expanded", "true");
    }
  });
});

/* Scroll reveal (content is visible with JS off: .reveal only hides when JS runs) */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add("in"));
}

/* Marquee: duplicate track content for a seamless loop */
document.querySelectorAll(".marquee-track").forEach(track => {
  track.innerHTML += track.innerHTML;
});

/* Stamp current year in footers (fallback to 2026 if JS date is odd) */
document.querySelectorAll("[data-year]").forEach(el => { el.textContent = "2026"; });
