

// script.js - Enhanced Version
document.addEventListener("DOMContentLoaded", () => {
  // ===== Configuration =====
  const CONFIG = {
    dotCount: 350,
    dotRepelRadius: 150,
    dotRepelStrength: 1.5,
    cursorSmoothing: 0.15,
    performanceThrottle: 100 // ms
  };

  // ===== Background Dots =====
  const initDots = () => {
    const dotsContainer = document.querySelector(".background-dots");
    const dots = [];
    
    // Create dots with optimized performance
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < CONFIG.dotCount; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot", "animate"); // Add animate class for hardware acceleration
      dot.style.top = `${Math.random() * 100}vh`;
      dot.style.left = `${Math.random() * 100}vw`;
      dot.style.opacity = Math.random() * 0.5 + 0.3; // Random opacity for depth
      fragment.appendChild(dot);
      dots.push(dot);
    }
    
    dotsContainer.appendChild(fragment);
    return dots;
  };

  // ===== Dot Animation =====
  const setupDotInteractivity = (dots) => {
    let lastTime = 0;
    
    const handleMouseMove = (e) => {
      const now = Date.now();
      // Throttle calculations for performance
      if (now - lastTime < CONFIG.performanceThrottle) return;
      lastTime = now;
      
      dots.forEach(dot => {
        const rect = dot.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < CONFIG.dotRepelRadius) {
          const angle = Math.atan2(dy, dx);
          const repelDistance = (CONFIG.dotRepelRadius - distance) * CONFIG.dotRepelStrength;
          const offsetX = -Math.cos(angle) * repelDistance;
          const offsetY = -Math.sin(angle) * repelDistance;
          
          // Use transform for better performance than top/left
          dot.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
          dot.style.backgroundColor = `rgba(102, 252, 241, ${0.9 - (distance / CONFIG.dotRepelRadius) * 0.7})`;
        } else {
          dot.style.transform = "translate(0, 0)";
          dot.style.backgroundColor = "rgba(197, 198, 199, 0.15)";
        }
      });
    };
    
    // Optimized event listener with passive flag
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    // Cleanup function
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  };

  // ===== Custom Cursor =====
  const initCustomCursor = () => {
    const cursor = document.querySelector(".cursor");
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let rafId = null;
    
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * CONFIG.cursorSmoothing;
      cursorY += (mouseY - cursorY) * CONFIG.cursorSmoothing;
      
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(animateCursor);
    };
    
    // Start animation
    animateCursor();
    
    // Setup hover states
    const hoverElements = document.querySelectorAll('a, button, .hover-effect, .skill-card, [data-cursor-hover]');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor--hover');
        el.classList.add('hover-active');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor--hover');
        el.classList.remove('hover-active');
      });
    });
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  };

  // ===== Touch Device Detection =====
  const isTouchDevice = () => {
    return 'ontouchstart' in window || 
           navigator.maxTouchPoints > 0 || 
           navigator.msMaxTouchPoints > 0;
  };

  // ===== Initialization =====
  if (!isTouchDevice()) {
    const dots = initDots();
    const cleanupDots = setupDotInteractivity(dots);
    const cleanupCursor = initCustomCursor();
    
    // Cleanup if needed (for SPA navigation)
    window.addEventListener('beforeunload', () => {
      cleanupDots();
      cleanupCursor();
    });
  } else {
    // Disable custom cursor on touch devices
    document.body.style.cursor = 'default';
    document.querySelectorAll('[cursor="none"]').forEach(el => {
      el.style.cursor = 'default';
    });
  }

  // ===== Additional Effects =====
  // Add subtle animation to profile image
  const profileImg = document.querySelector('.profile-img');
  if (profileImg) {
    profileImg.addEventListener('mouseenter', () => {
      profileImg.style.transform = 'scale(1.03) rotate(2deg)';
    });
    profileImg.addEventListener('mouseleave', () => {
      profileImg.style.transform = 'scale(1)';
    });
  }

  // ===== Performance Monitoring =====
  if (process.env.NODE_ENV === 'development') {
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
    
    const animate = () => {
      stats.begin();
      stats.end();
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
});