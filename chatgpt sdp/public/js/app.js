/* ==========================================================================
   Sankalp Digital Pathshala - App Controller (Lenis, Nav, Accordions, Tabs)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Remove Loader overlay when fully loaded
  const loader = document.getElementById('loaderOverlay');
  if (loader) {
    window.addEventListener('load', () => {
      document.body.classList.add('loaded');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 800);
    });
  } else {
    document.body.classList.add('loaded');
  }

  // 2. Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 3. Scroll Progress Indicator & Header Sticky Shrink
  const scrollProgress = document.getElementById('scrollProgress');
  const navbar = document.getElementById('mainNavbar');
  
  window.addEventListener('scroll', () => {
    // Progress
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = scrolled + "%";
    }

    // Header Shrink
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  // 4. Mobile Menu Navigation Toggler
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('active')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });
  }

  // 5. FAQ Accordion Handler
  const faqContainer = document.getElementById('faqListContainer');
  if (faqContainer) {
    const faqQuestions = faqContainer.querySelectorAll('.faq-question');
    faqQuestions.forEach(q => {
      q.addEventListener('click', () => {
        const item = q.parentElement;
        const isActive = item.classList.contains('active');
        
        // Collapse all items
        faqContainer.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        
        // Open target if was not active
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }
});

// 6. Home Page Ecosystem Dual-Tabs Switch
function switchEcoTab(tabKey) {
  const tabs = document.querySelectorAll('.eco-tab-btn');
  const panels = document.querySelectorAll('.eco-tab-content');
  const visualImg = document.getElementById('ecoVisualImg');
  
  tabs.forEach(btn => btn.classList.remove('active'));
  panels.forEach(p => p.classList.remove('active'));

  if (tabKey === 'academic') {
    document.querySelector("button[onclick=\"switchEcoTab('academic')\"]").classList.add('active');
    document.getElementById('eco-academic').classList.add('active');
    if (visualImg) visualImg.src = "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=800&q=80";
  } else {
    document.querySelector("button[onclick=\"switchEcoTab('skills')\"]").classList.add('active');
    document.getElementById('eco-skills').classList.add('active');
    if (visualImg) visualImg.src = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80";
  }
}
