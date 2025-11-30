document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const isExpanded = navLinks.classList.contains("active");
      mobileToggle.setAttribute("aria-expanded", isExpanded);
    });
  }

  // Scroll Animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const fadeElements = document.querySelectorAll(".fade-in");
  fadeElements.forEach((el) => observer.observe(el));

  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        navLinks.classList.remove("active"); // Close mobile menu
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Hero video poster -> fade out when Vimeo iframe loads
  const heroIframe = document.querySelector('.hero-bg iframe');
  const heroPoster = document.querySelector('.hero-poster');
  if (heroIframe && heroPoster) {
    heroIframe.addEventListener('load', () => {
      heroIframe.style.opacity = '1';
      heroPoster.classList.add('hidden');
    });

    // Try to fetch Vimeo thumbnail for a more accurate poster
    const vimeoIdMatch = (heroIframe.getAttribute('src') || '').match(/video\/(\d+)/);
    const vimeoId = vimeoIdMatch ? vimeoIdMatch[1] : null;
    if (vimeoId) {
      fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.thumbnail_url) {
            heroPoster.src = data.thumbnail_url;
          }
        })
        .catch(() => {
          // Keep default poster.svg if fetch fails
        });
    }
  }
});
