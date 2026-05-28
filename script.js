// ==============================================
// script.js – Portfolio Interactivity (Mobile Menu Fix)
// ==============================================

document.addEventListener('DOMContentLoaded', () => {
  // ---------- DOM Elements ----------
  const html = document.documentElement;
  const darkModeToggle = document.getElementById('darkModeToggle');
  const toggleThumb = document.getElementById('toggleThumb');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const bar1 = document.getElementById('bar1');
  const bar2 = document.getElementById('bar2');
  const bar3 = document.getElementById('bar3');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselPrev = document.getElementById('carouselPrev');
  const carouselNext = document.getElementById('carouselNext');
  const carouselDots = document.querySelectorAll('.carousel-dot');
  const currentYearSpan = document.getElementById('currentYear');

  // ---------- State ----------
  let currentSlide = 0;
  const totalSlides = document.querySelectorAll('.carousel-slide').length;
  let menuOpen = false;

  // ---------- Dark Mode ----------
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    html.classList.add('dark');
    updateToggleUI(true);
  }

  darkModeToggle.addEventListener('click', () => {
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateToggleUI(isDark);
  });

  function updateToggleUI(isDark) {
    toggleThumb.style.transform = isDark ? 'translateX(20px)' : 'translateX(0px)';
    toggleThumb.innerHTML = isDark ? '☀️' : '🌙';
  }

  // ---------- Mobile Menu (Fixed) ----------
  function openMobileMenu() {
    mobileMenu.classList.remove('hidden');
    // Force the browser to recognize the element is visible before reading height
    mobileMenu.style.display = 'block';
    // Read the full content height
    const menuHeight = mobileMenu.scrollHeight;
    // Apply max-height for smooth transition
    mobileMenu.style.maxHeight = menuHeight + 'px';
    mobileMenu.style.paddingTop = '0.75rem';
    mobileMenu.style.paddingBottom = '0.75rem';
    // Animate hamburger to X
    bar1.style.transform = 'translateY(8px) rotate(45deg)';
    bar2.style.opacity = '0';
    bar3.style.transform = 'translateY(-8px) rotate(-45deg)';
    bar3.style.width = '1.5rem';
  }

  function closeMobileMenu() {
    mobileMenu.style.maxHeight = '0';
    mobileMenu.style.paddingTop = '0';
    mobileMenu.style.paddingBottom = '0';
    // Reset hamburger icon
    bar1.style.transform = 'none';
    bar2.style.opacity = '1';
    bar3.style.transform = 'none';
    bar3.style.width = '1rem';
    // After transition ends, hide element completely
    setTimeout(() => {
      if (!menuOpen) {
        mobileMenu.classList.add('hidden');
        mobileMenu.style.display = ''; // remove inline display
      }
    }, 400);
  }

  mobileMenuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
      openMobileMenu();
    } else {
      closeMobileMenu();
    }
  });

  // Close mobile menu when a link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuOpen) {
        menuOpen = false;
        closeMobileMenu();
      }
    });
  });

  // Reset menu state on window resize (optional)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && menuOpen) {
      menuOpen = false;
      closeMobileMenu();
    }
  });

  // ---------- Smooth Scrolling ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- Active Nav Link on Scroll ----------
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink(); // set initial state

  // ---------- Certificate Carousel ----------
  function updateCarousel(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;
    carouselTrack.style.transform = `translateX(${-currentSlide * 100}%)`;
    carouselDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  carouselPrev.addEventListener('click', () => updateCarousel(currentSlide - 1));
  carouselNext.addEventListener('click', () => updateCarousel(currentSlide + 1));

  carouselDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'), 10);
      updateCarousel(index);
    });
  });

  let autoSlideInterval = setInterval(() => updateCarousel(currentSlide + 1), 5000);
  const carouselContainer = document.getElementById('carouselContainer');
  carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
  carouselContainer.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(() => updateCarousel(currentSlide + 1), 5000);
  });

  updateCarousel(0);

  // ---------- Footer Year ----------
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});