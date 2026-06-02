/* ============================================================
   SCS — main.js  |  Interactivité côté client
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------
     1. NAVBAR — scroll shadow + hamburger mobile
  -------------------------------------------------------- */
  const navbar     = document.getElementById('mainNav');
  const navToggle  = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
      }
    });
  }

  /* --------------------------------------------------------
     2. PRODUCT FILTER TABS
  -------------------------------------------------------- */
  const filterTabs  = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card[data-cat]');

  if (filterTabs.length && productCards.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.filter;

        productCards.forEach(card => {
          const match = cat === 'all' || card.dataset.cat === cat;
          if (match) {
            card.style.display = 'flex';
            requestAnimationFrame(() => {
              card.style.opacity  = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.opacity  = '0';
            card.style.transform = 'translateY(16px)';
            setTimeout(() => { card.style.display = 'none'; }, 280);
          }
        });

        // Show / hide empty state
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
          const visible = [...productCards].filter(c => c.style.display !== 'none');
          emptyState.style.display = visible.length === 0 ? 'block' : 'none';
        }
      });
    });

    // Restore transition on cards (removed inline to avoid FOUC)
    productCards.forEach(c => {
      c.style.transition = 'opacity .28s ease, transform .28s ease';
    });
  }

  /* --------------------------------------------------------
     3. SCROLL ANIMATIONS (IntersectionObserver)
  -------------------------------------------------------- */
  const animated = document.querySelectorAll('.animate-fade-up');
  if (animated.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    animated.forEach(el => io.observe(el));
  }

  /* --------------------------------------------------------
     4. ANIMATED COUNTERS
  -------------------------------------------------------- */
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el   = entry.target;
          const end  = parseInt(el.dataset.target, 10);
          const suf  = el.dataset.suffix || '';
          const dur  = 1600;
          const step = end / (dur / 16);
          let cur = 0;
          const timer = setInterval(() => {
            cur += step;
            if (cur >= end) { cur = end; clearInterval(timer); }
            el.textContent = Math.round(cur) + suf;
          }, 16);
          cio.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  }

  /* --------------------------------------------------------
     5. QUOTE / ORDER MODAL
  -------------------------------------------------------- */
  const modal         = document.getElementById('quoteModal');
  const modalClose    = document.getElementById('modalClose');
  const modalProdName = document.getElementById('modalProdName');

  const openModal = (productName) => {
    if (!modal) return;
    if (modalProdName) modalProdName.value = productName || '';
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => modal.classList.add('open'));
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  };

  document.querySelectorAll('.btn-quote').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.product || ''));
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }

  /* --------------------------------------------------------
     6. IMAGE UPLOAD PREVIEW (admin)
  -------------------------------------------------------- */
  const fileInput    = document.getElementById('imageFile');
  const uploadPreview = document.getElementById('uploadPreview');
  const uploadZone   = document.querySelector('.upload-zone');

  if (fileInput && uploadZone) {
    uploadZone.addEventListener('click', () => fileInput.click());

    ['dragover', 'dragenter'].forEach(ev =>
      uploadZone.addEventListener(ev, (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--primary)';
      })
    );
    ['dragleave', 'dragend'].forEach(ev =>
      uploadZone.addEventListener(ev, () => {
        uploadZone.style.borderColor = '';
      })
    );
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.style.borderColor = '';
      if (e.dataTransfer.files[0]) showPreview(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) showPreview(fileInput.files[0]);
    });

    function showPreview(file) {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (uploadPreview) {
          uploadPreview.src = e.target.result;
          uploadPreview.style.display = 'block';
        }
      };
      reader.readAsDataURL(file);
    }
  }

  /* --------------------------------------------------------
     7. AUTO-DISMISS ALERTS
  -------------------------------------------------------- */
  document.querySelectorAll('.alert[data-dismiss]').forEach(alert => {
    const delay = parseInt(alert.dataset.dismiss, 10) || 4500;
    setTimeout(() => {
      alert.style.opacity   = '0';
      alert.style.transform = 'translateY(-8px)';
      setTimeout(() => alert.remove(), 320);
    }, delay);
  });

  /* --------------------------------------------------------
     8. DELETE CONFIRMATION (admin)
  -------------------------------------------------------- */
  document.querySelectorAll('a[data-confirm]').forEach(link => {
    link.addEventListener('click', (e) => {
      if (!confirm(link.dataset.confirm)) e.preventDefault();
    });
  });

});
