// globe.js - Module pour initialiser le globe Cobe en vanilla JS

import createGlobe from 'cobe';

export function initGlobe(containerElement, options = {}) {
  const { markers = [] } = options;
  
  // Créer le canvas
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.cursor = 'grab';
  canvas.style.contain = 'layout paint size';
  canvas.style.opacity = '0';
  canvas.style.transition = 'opacity 1s ease';
  
  containerElement.appendChild(canvas);

  // Variables pour la rotation et l'interaction
  let phi = 0;
  let theta = 0.3;
  let width = 0;
  let pointerInteracting = null;
  let pointerInteractionMovement = 0;
  let r = 0;
  
  // Variables pour la rotation automatique vers une location
  let focusPhi = 0;
  let focusTheta = 0.3;
  const doublePi = Math.PI * 2;
  let autoRotate = true;

  // Fonction pour convertir lat/long en angles
  const locationToAngles = (lat, long) => {
    return [
      Math.PI - ((long * Math.PI) / 180 - Math.PI / 2),
      (lat * Math.PI) / 180
    ];
  };

  // Fonction de redimensionnement
  const onResize = () => {
    if (canvas) {
      width = containerElement.offsetWidth;
    }
  };
  
  window.addEventListener('resize', onResize);
  onResize();

  // Initialiser le globe
  const globe = createGlobe(canvas, {
    devicePixelRatio: 2,
    width: width * 2,
    height: width * 2,
    phi: 0,
    theta: 0.3,
    dark: 1,
    diffuse: 3,
    mapSamples: 16000,
    mapBrightness: 1.2,
    baseColor: [1, 1, 1],
    markerColor: [251 / 255, 100 / 255, 21 / 255],
    glowColor: [1.2, 1.2, 1.2],
    markers: markers,
    onRender: (state) => {
      // Si on est en train de dragger, on ignore tout
      if (!pointerInteracting) {
        if (autoRotate) {
          // Rotation automatique continue
          phi += 0.005;
          focusPhi = phi;
        } else {
          // Animation vers la position cible
          const distPositive = (focusPhi - phi + doublePi) % doublePi;
          const distNegative = (phi - focusPhi + doublePi) % doublePi;
          
          if (distPositive < distNegative) {
            phi += distPositive * 0.08;
          } else {
            phi -= distNegative * 0.08;
          }
          
          theta = theta * 0.92 + focusTheta * 0.08;
          
          // Réactiver l'auto-rotation si on est proche de la cible
          if (Math.abs(distPositive) < 0.01 || Math.abs(distNegative) < 0.01) {
            autoRotate = true;
          }
        }
      }
      
      state.phi = phi + r;
      state.theta = theta;
      state.width = width * 2;
      state.height = width * 2;
    }
  });

  // Gestionnaires d'événements pour le drag
  canvas.addEventListener('pointerdown', (e) => {
    pointerInteracting = e.clientX - pointerInteractionMovement;
    canvas.style.cursor = 'grabbing';
  });

  canvas.addEventListener('pointerup', () => {
    pointerInteracting = null;
    canvas.style.cursor = 'grab';
  });

  canvas.addEventListener('pointerout', () => {
    pointerInteracting = null;
    canvas.style.cursor = 'grab';
  });

  canvas.addEventListener('mousemove', (e) => {
    if (pointerInteracting !== null) {
      const delta = e.clientX - pointerInteracting;
      pointerInteractionMovement = delta;
      r = delta / 200;
    }
  });

  canvas.addEventListener('touchmove', (e) => {
    if (pointerInteracting !== null && e.touches[0]) {
      const delta = e.touches[0].clientX - pointerInteracting;
      pointerInteractionMovement = delta;
      r = delta / 100;
    }
  });

  // Afficher le canvas avec fade-in
  setTimeout(() => {
    canvas.style.opacity = '1';
  }, 0);

  // Fonction publique pour rotater vers une location
  const rotateToLocation = (lat, long) => {
    const [newPhi, newTheta] = locationToAngles(lat, long);
    focusPhi = newPhi;
    focusTheta = newTheta;
    autoRotate = false;
  };

  // Fonction de nettoyage
  const destroy = () => {
    globe.destroy();
    window.removeEventListener('resize', onResize);
    canvas.remove();
  };

  return {
    destroy,
    rotateToLocation
  };
}