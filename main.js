// Mobile navigation toggle
const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

btnNavEl.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open");
});

// Sticky navigation

const sectionHeroEl = document.querySelector(".section-hero");

const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];
    console.log(ent);

    if (ent.isIntersecting === false) {
      document.body.classList.add("sticky");
    }

    if (ent.isIntersecting === true) {
      document.body.classList.remove("sticky");
    }
  },
  {
    // In the viewport
    root: null,
    threshold: 0,
    rootMargin: "-80px",
  }
);
obs.observe(sectionHeroEl);


// Team Slider

const sliderGrid = document.querySelector(".team-grid");
const prevBtn = document.querySelector(".nav-btn--prev");
const nextBtn = document.querySelector(".nav-btn--next");
const cards = document.querySelectorAll(".team-card");

if (sliderGrid && prevBtn && nextBtn) {
  let currentIndex = 0;
  
  const getCardsToShow = () => {
    if (window.innerWidth > 1000) return 3;
    if (window.innerWidth > 700) return 2;
    return 1;
  };

  const updateSlider = () => {
    const cardsToShow = getCardsToShow();
    const totalCards = cards.length;
    const maxIndex = totalCards - cardsToShow;
    
    // Boundary check
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const cardWidth = cards[0].offsetWidth;
    const style = window.getComputedStyle(sliderGrid);
    const gap = parseFloat(style.gap) || 0;
    
    const moveDistance = (cardWidth + gap) * currentIndex;
    sliderGrid.style.transform = `translateX(-${moveDistance}px)`;
  };

  nextBtn.addEventListener("click", () => {
    const cardsToShow = getCardsToShow();
    const totalCards = cards.length;
    const maxIndex = totalCards - cardsToShow;

    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0; // wrap around to start
    }
    updateSlider();
  });

  prevBtn.addEventListener("click", () => {
    const cardsToShow = getCardsToShow();
    const totalCards = cards.length;
    const maxIndex = totalCards - cardsToShow;

    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = maxIndex; // wrap around to end
    }
    updateSlider();
  });

  // Handle window resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateSlider();
    }, 100);
  });

  // Initial update
  updateSlider();
}
import { initGlobe } from './globe.js';

const container = document.getElementById('globe-container');

// Regional Hubs Data
const hubData = {
  dublin: {
    name: 'DUBLIN',
    coords: [53.3498, -6.2603],
    coordsLabel: '53.3498° N, 06.2603° W',
    role: 'Governance & investor relations.',
    email: 'dublin@lumifrik.com'
  },
  accra: {
    name: 'ACCRA',
    coords: [5.6037, -0.1870],
    coordsLabel: '05.6037° N, 00.1870° W',
    role: 'Fintech operations, LDIB management.',
    email: 'accra@lumifrik.com'
  },
  bamako: {
    name: 'BAMAKO',
    coords: [12.6392, -8.0029],
    coordsLabel: '12.6392° N, 08.0029° W',
    role: 'Tokenization & regulatory liaison.',
    email: 'bamako@lumifrik.com'
  },
  dubai: {
    name: 'DUBAI',
    coords: [25.2048, 55.2708],
    coordsLabel: '25.2048° N, 55.2708° E',
    role: 'GCC investor engagement & MENA fund structuring.',
    email: 'dubai@lumifrik.com'
  },
  hongkong: {
    name: 'HONG KONG SAR',
    coords: [22.3193, 114.1694],
    coordsLabel: '22.3193° N, 114.1694° E',
    role: 'Technology & venture innovation hub.',
    email: 'hongkong@lumifrik.com'
  }
};

// Define markers for the globe
const markers = Object.values(hubData).map(hub => ({
  location: hub.coords,
  size: 0.1
}));

// Initialiser le globe avec les markers
const globe = initGlobe(container, { markers });

// Hub Activation Logic
const activateHub = (hubId) => {
  const data = hubData[hubId];
  if (!data) return;

  // 1. Rotate Globe
  globe.rotateToLocation(data.coords[0], data.coords[1]);

  // 2. Update Info Panel
  const cityEl = document.getElementById('panel-city');
  const coordsEl = document.getElementById('panel-coords');
  const roleEl = document.getElementById('panel-role-text');
  const emailEl = document.getElementById('panel-email');

  if (cityEl && coordsEl && roleEl && emailEl) {
    cityEl.textContent = data.name;
    coordsEl.textContent = data.coordsLabel;
    roleEl.textContent = data.role;
    emailEl.textContent = data.email;
    emailEl.href = `mailto:${data.email}`;
  }

  // 3. Update Active State in Navigation
  document.querySelectorAll('.hub-nav-item').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.hub === hubId) {
      btn.classList.add('active');
    }
  });
};

// Event Listeners
document.querySelectorAll('.hub-nav-item').forEach(btn => {
  // Mobile/Click interaction
  btn.addEventListener('click', () => {
    activateHub(btn.dataset.hub);
  });
  
  // Desktop/Hover interaction
  btn.addEventListener('mouseenter', () => {
    activateHub(btn.dataset.hub);
  });
});

// Initialize with Dublin
activateHub('dublin');

// Magnetic Logo Effect
const logoItems = document.querySelectorAll(".logo-item");

logoItems.forEach((item) => {
  const inner = item.querySelector(".logo-inner");
  
  item.addEventListener("mousemove", (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    if (typeof gsap !== 'undefined') {
      gsap.to(inner, {
        duration: 0.5,
        x: x * 0.3,
        y: y * 0.3,
        ease: "power2.out",
      });
    }
  });

  item.addEventListener("mouseleave", () => {
    if (typeof gsap !== 'undefined') {
      gsap.to(inner, {
        duration: 0.5,
        x: 0,
        y: 0,
        ease: "elastic.out(1, 0.3)",
      });
    }
  });
});

