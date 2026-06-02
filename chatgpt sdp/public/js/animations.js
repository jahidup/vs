/* ==========================================================================
   Sankalp Digital Pathshala - GSAP & Interactive 3D Card Animations
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Core Scroll Counters using GSAP / ScrollTrigger
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0 && typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      
      gsap.to(counter, {
        innerText: target,
        duration: 2.5,
        snap: { innerText: 1 },
        ease: 'power3.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 85%', // Triggers when the top of element hits 85% of screen
          toggleActions: 'play none none none',
        },
        onUpdate: function() {
          // Add plus sign or suffix where relevant
          if (target === 1500) {
            counter.innerText = Math.ceil(this.targets()[0].innerText) + "+";
          } else if (target === 98) {
            counter.innerText = Math.ceil(this.targets()[0].innerText) + "%";
          } else {
            counter.innerText = Math.ceil(this.targets()[0].innerText);
          }
        }
      });
    });
  }

  // 2. Parallax Hero Background Sliders
  const slides = document.querySelectorAll('.hero-slider .slide');
  if (slides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 6000); // Transitions slide backgrounds every 6 seconds
  }

  // 3. Interactive Mouse-follow 3D Card Tilt Controls
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate inside the element
      const y = e.clientY - rect.top;  // y coordinate inside the element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate tilt degrees (Max 8deg tilt)
      const rotateX = ((centerY - y) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });
  
});
