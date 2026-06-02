/* ==========================================================================
   Sankalp Digital Pathshala - Dynamic Photo Gallery & Filters
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const galleryGrid = document.getElementById('galleryGrid');
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  
  if (!galleryGrid) return;

  // Initialize: Load all items from public API
  loadGalleryItems();

  // Handle Filtering Button Actions
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const cards = galleryGrid.querySelectorAll('.gallery-card');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          // Trigger slight fade-in via script
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });
});

async function loadGalleryItems() {
  const grid = document.getElementById('galleryGrid');
  try {
    const response = await fetch('/api/public/gallery');
    const result = await response.json();

    if (result.success && result.data.length > 0) {
      grid.innerHTML = '';
      result.data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'gallery-card tilt-card';
        card.setAttribute('data-category', item.category.toLowerCase().replace(' ', '-'));
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        card.innerHTML = `
          <div class="gallery-img-wrap" onclick="openGalleryLightbox('${item.imageUrl}', '${item.title}')">
            <img src="${item.imageUrl}" alt="${item.title}" loading="lazy">
            <div class="img-overlay">
              <i class="fas fa-search-plus"></i>
            </div>
          </div>
          <div class="gallery-info">
            <h3>${item.title}</h3>
            <span class="category-badge">${item.category}</span>
            <p>${item.description}</p>
          </div>
        `;
        grid.appendChild(card);
      });
      
      // Re-trigger tilt-card listeners on newly added nodes
      triggerNewTiltListeners();
    }
  } catch (err) {
    console.error('Failed to load gallery items:', err);
  }
}

// Simple lightbox modal setup
function openGalleryLightbox(url, title) {
  let lightbox = document.getElementById('galleryLightboxModal');
  
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'galleryLightboxModal';
    lightbox.style.position = 'fixed';
    lightbox.style.top = '0';
    lightbox.style.left = '0';
    lightbox.style.width = '100%';
    lightbox.style.height = '100%';
    lightbox.style.background = 'rgba(0, 0, 0, 0.9)';
    lightbox.style.zIndex = '5000';
    lightbox.style.display = 'flex';
    lightbox.style.justifyContent = 'center';
    lightbox.style.alignItems = 'center';
    lightbox.style.flexDirection = 'column';
    lightbox.style.cursor = 'zoom-out';
    
    lightbox.innerHTML = `
      <img id="lightboxImg" src="" style="max-width: 90%; max-height: 80%; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.5)">
      <h3 id="lightboxTitle" style="color: #fff; margin-top: 1.5rem; font-family: Outfit, sans-serif;"></h3>
      <button style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: #fff; font-size: 2rem; cursor: pointer;"><i class="fas fa-times"></i></button>
    `;
    
    lightbox.addEventListener('click', () => {
      lightbox.style.display = 'none';
    });
    
    document.body.appendChild(lightbox);
  }
  
  document.getElementById('lightboxImg').src = url;
  document.getElementById('lightboxTitle').textContent = title;
  lightbox.style.display = 'flex';
}

function triggerNewTiltListeners() {
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((centerY - y) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });
}
