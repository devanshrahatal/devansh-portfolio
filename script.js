// ================= INIT =================

gsap.registerPlugin(ScrollTrigger);
const ST_DEBUG = false;

// ================= PRELOADER LOGIC =================
const preloaderLogs = [
  { text: "Initializing Data Pipeline...", delay: 400 },
  { text: "Loading Analytics Modules... [OK]", delay: 800, type: "success" },
  { text: "Calibrating Prediction Models...", delay: 1400 },
  { text: "Verifying Dataset Access... [GRANTED]", delay: 2100, type: "success" },
  { text: "Analytics Engine Online. Welcome, User.", delay: 2600, type: "highlight" }
];

const logContainer = document.getElementById("preloader-logs");
const preloader = document.getElementById("preloader");

if (logContainer && preloader) {
  // Lock scroll
  document.body.style.overflow = "hidden";

  let cumulativeDelay = 0;

  preloaderLogs.forEach((log, index) => {
    setTimeout(() => {
      // Remove cursor from previous line if any (optional, but keep it simple: just append lines before cursor)
      const cursor = logContainer.querySelector(".cursor");
      
      const p = document.createElement("div");
      p.className = `log-line ${log.type || ""}`;
      p.textContent = `> ${log.text}`;
      
      // Insert before cursor
      logContainer.insertBefore(p, cursor);
      
      // Auto-scroll to bottom
      logContainer.scrollTop = logContainer.scrollHeight;

      // If last log, finish up
      if (index === preloaderLogs.length - 1) {
        setTimeout(() => {
          // Fade out
          preloader.classList.add("hidden");
          document.body.style.overflow = ""; // Enable scroll
          
          // Trigger Hero Animations manually
          if (typeof tl !== 'undefined') tl.play();
          
          if (window.innerWidth <= 900) {
            document.querySelectorAll(".about-left, .about-right, .highlight-card, .project-card, .skill-card, .contact-wrapper > *, .exp-card, .year-header, .service-card").forEach(el => {
              el.style.opacity = "1";
              el.style.transform = "none";
            });
          }
          
          ScrollTrigger.refresh();
          
        }, 800); // Pause after last log before fade
      }
    }, log.delay);
  });
}

// Scroll Progress Bar
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (scrollTop / scrollHeight) * 100;
  const progressBar = document.getElementById("scroll-progress");
  const percentText = document.getElementById("scroll-percent-text");
  
  if(progressBar) progressBar.style.width = scrolled + "%";
  if(percentText) percentText.innerText = Math.round(scrolled) + "%";
});

// =============== GSAP Hero Entrance Animations ===============

// Timeline for smooth sequential entrance (Paused initially, triggered by preloader)
const tl = gsap.timeline({ paused: true, delay: 0.1, ease: "power3.out" });

// If preloader doesn't exist (e.g. removed), play immediately
if (!document.getElementById("preloader")) {
  tl.play();
}

// Hero text animations
tl.from(".hero-eyebrow", { opacity: 0, y: -20, duration: 0.4 })
  .add("nameStart", "-=0.2") // Start label for name sync
  .from(".hero-title", { opacity: 0, y: 30, duration: 0.5 }, "nameStart")
  .from(".hero-subtitle", { opacity: 0, y: 25, duration: 0.45 }, "-=0.3")
  .from(".hero-desc", { opacity: 0, y: 20, duration: 0.45 }, "-=0.3")
  .from(".hero-actions", { opacity: 0, y: 20, duration: 0.5 }, "-=0.3")
  .from(".hero-tags span", {
    opacity: 0,
    y: 10,
    duration: 0.4,
    stagger: 0.1,
  });

// Hero image wrapper (photo)
tl.from(
  ".hero-image-wrapper",
  {
    opacity: 0,
    y: 10,
    scale: 0.9,
    duration: 0.6,
    ease: "back.out(1.7)", // subtle pop effect
  },
  "nameStart"
);

// Right-side card animation
tl.from(
  ".hero-card",
  {
    opacity: 0,
    x: 60,
    duration: 0.6,
  },
  "-=0.4"
);

// Floating badge animation
tl.from(
  ".floating-badge",
  {
    opacity: 0,
    y: -20,
    duration: 0.6,
  },
  "-=0.5"
);

// =============== Floating Badge Effect (Loop) ===============

gsap.to(".floating-badge", {
  y: 8,
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut",
  duration: 1.5,
});

// Photo float loop
gsap.to(".hero-image-wrapper", {
  y: -12,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  duration: 3,
});

// =============== Background Glow Pulsing ===============

gsap.to(".bg-blur-1", {
  opacity: 0.9,
  scale: 1.15,
  duration: 4,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});

gsap.to(".bg-blur-2", {
  opacity: 0.75,
  scale: 1.2,
  duration: 5,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});

// =============== Hover Depth effect for hero card ===============

const heroCard = document.querySelector(".hero-card");

if (heroCard) {
  heroCard.addEventListener("mousemove", (e) => {
    const rect = heroCard.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(heroCard, {
      rotationY: x * 0.03,
      rotationX: -y * 0.03,
      transformPerspective: 700,
      ease: "power2.out",
      duration: 0.3,
    });
  });

  heroCard.addEventListener("mouseleave", () => {
    gsap.to(heroCard, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: "power3.out",
    });
  });
} else {
  console.warn(".hero-card not found — skipping hover depth effect.");
}

// =============== Random Electric Spark on Orbit Dot ===============
const orbitDot = document.querySelector(".orbit-dot");

function triggerSpark() {
  if (!orbitDot) return;
  
  // Activate spark
  orbitDot.classList.add("spark");
  
  // Remove quickly (flash)
  setTimeout(() => {
    orbitDot.classList.remove("spark");
  }, 200); // 150ms flash duration
  
  // Schedule next spark (random between 2s and 7s)
  const nextSparkDelay = Math.random() * 2000 + 1000;
  setTimeout(triggerSpark, nextSparkDelay);
}

// Start the loop
if (orbitDot) {
  setTimeout(triggerSpark, 3000); // Initial delay
}

// =============== Navbar Fade In ===============

gsap.from(".navbar", {
  opacity: 0,
  y: -20,
  duration: 0.6,
  ease: "power2.out",
});

// ================== ABOUT SECTION SCROLL ANIMATION ==================

ScrollTrigger.batch(".about-left, .about-right", {
  start: "top 95%",
  once: true,
  onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.2 })
});
ScrollTrigger.batch(".highlight-card", {
  start: "top 95%",
  once: true,
  onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 })
});

// ===================== PROJECTS SCROLL ANIMATION =====================
ScrollTrigger.batch(".project-card", {
  start: "top 95%",
  once: true,
  onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.2 })
});

// ===================== SKILLS ACCORDION =====================
const skillHeaders = document.querySelectorAll(".skill-header");

skillHeaders.forEach(header => {
  header.addEventListener("click", () => {
    const category = header.parentElement;
    const grid = category.querySelector(".skills-grid");
    const isOpen = category.classList.contains("active");

    if (isOpen) {
      // Close
      category.classList.remove("active");
      gsap.to(grid, { height: 0, opacity: 0, paddingBottom: 0, paddingTop: 0, duration: 0.3, ease: "power2.out" });
    } else {
      // Open
      category.classList.add("active");
      // Animate grid height
      gsap.to(grid, { height: "auto", opacity: 1, paddingBottom: "1.5rem", paddingTop: "1.5rem", duration: 0.4, ease: "power2.out" });
      
      // Animate children entrance
      gsap.fromTo(grid.children, 
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, delay: 0.1 }
      );
    }
  });
});

// Setup Initial State (First one active is handled by CSS class, but need to set height for animation to work right)
// Actually we will treat "active" class in HTML as "initially open" source of truth
document.querySelectorAll(".skill-category").forEach(cat => {
  const grid = cat.querySelector(".skills-grid");
  if (cat.classList.contains("active")) {
    gsap.set(grid, { height: "auto", opacity: 1, paddingBottom: "1.5rem" });
  } else {
    gsap.set(grid, { height: 0, opacity: 0, paddingBottom: 0 });
  }
});

// ===================== CONTACT SECTION ANIMATIONS =====================

ScrollTrigger.batch(".contact-wrapper > *", {
  start: "top 95%",
  once: true,
  onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.2 })
});

// ================= BACK TO TOP BUTTON =================

const topBtn = document.getElementById("backToTop");
if (topBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      topBtn.style.display = "flex";
    } else {
      topBtn.style.display = "none";
    }
  });

  topBtn.addEventListener("click", () => {
    topBtn.classList.add("launching");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      topBtn.classList.remove("launching");
    }, 700);
  });
} else {
  console.warn("#backToTop not found — skipping back-to-top behavior.");
}
// =============== MOBILE NAV ===============

const menuBtn = document.querySelector(".menu-btn");
const mobileNav = document.querySelector(".mobile-nav");
const closeBtn = document.querySelector(".close-menu");
const navOverlay = document.querySelector(".nav-overlay");
const navLinks = document.querySelectorAll(".mobile-nav a");

function closeMenu() {
  if (mobileNav) mobileNav.classList.remove("active");
  if (navOverlay) navOverlay.classList.remove("active");
}

function openMenu() {
  if (mobileNav) mobileNav.classList.add("active");
  if (navOverlay) navOverlay.classList.add("active");
}

if (menuBtn && mobileNav) {
  menuBtn.addEventListener("click", openMenu);
  
  if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
  }
  
  if (navOverlay) {
    navOverlay.addEventListener("click", closeMenu);
  }
  
  // Close when clicking any link
  navLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });
} else {
  console.warn(".menu-btn or .mobile-nav not found — skipping mobile nav behavior.");
}
// =============== CUSTOM CURSOR SYSTEM ===============

const cursorDot = document.querySelector(".custom-cursor-dot");
const cursorRing = document.querySelector(".custom-cursor-ring");

if (cursorDot && cursorRing) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  const ringSpeed = 0.15; // Easing factor for trailing ring

  // Track mouse position
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows instantly
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth ring animation loop
  function animateRing() {
    ringX += (mouseX - ringX) * ringSpeed;
    ringY += (mouseY - ringY) * ringSpeed;

    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;

    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state for interactive elements
  const interactiveElements = document.querySelectorAll(
    "a, button, .btn, .social-btn, .nav-cta, .hero-download-btn, .service-card, .project-card, .skill-card, .skill-header, .certificate-card, input, textarea"
  );

  interactiveElements.forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursorRing.classList.add("hover");
      cursorDot.classList.add("hover");
    });
    el.addEventListener("mouseleave", () => {
      cursorRing.classList.remove("hover");
      cursorDot.classList.remove("hover");
    });
  });

  // Click effect
  document.addEventListener("mousedown", () => {
    cursorRing.classList.add("clicking");
    cursorDot.classList.add("clicking");
  });
  document.addEventListener("mouseup", () => {
    cursorRing.classList.remove("clicking");
    cursorDot.classList.remove("clicking");
  });

  // Hide cursor when mouse leaves window
  document.addEventListener("mouseleave", () => {
    cursorDot.style.opacity = "0";
    cursorRing.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    cursorDot.style.opacity = "1";
    cursorRing.style.opacity = "1";
  });

  // Hide on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    cursorDot.style.display = "none";
    cursorRing.style.display = "none";
    document.body.style.cursor = "auto";
  }
} else {
  console.warn("Custom cursor elements not found — skipping custom cursor.");
}

// Ensure ScrollTrigger recalculates positions (helpful after dynamic layout)
if (window.ScrollTrigger) {
  ScrollTrigger.refresh();
}
// ===================== EXPERIENCE SECTION ANIMATION =====================

ScrollTrigger.batch(".exp-card", {
  start: "top 95%",
  once: true,
  onEnter: batch => gsap.to(batch, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    stagger: 0.2,
    ease: "power3.out"
  })
});
ScrollTrigger.batch(".exp-dot", {
  start: "top 90%",
  once: true,
  onEnter: batch => gsap.to(batch, {
    scale: 1,
    opacity: 1,
    duration: 0.4,
    stagger: 0.15,
    ease: "back.out(1.8)",
    boxShadow: "0 0 15px rgba(226, 28, 52, 0.9)"
  })
});
document.querySelectorAll(".exp-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;

    gsap.to(card, {
      rotationY: x * 0.03,
      rotationX: -y * 0.03,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.6, ease: "power3.out" });
  });
});
ScrollTrigger.batch(".exp-item", {
  start: "top 80%",
  once: true,
  onEnter: batch => batch.forEach(item => {
    const dot = item.querySelector(".exp-dot");
    if (dot) {
      dot.classList.add("active");
      gsap.to(dot, { opacity: 1, scale: 1, duration: 0.4 });
    }
  })
});
const glow = document.querySelector(".timeline-glow");

if (glow) {
  ScrollTrigger.create({
    trigger: ".experience-timeline",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: self => {
      glow.style.opacity = 1;
      glow.style.top = `${self.progress * 100}%`;
    },
  });
}

ScrollTrigger.batch(".year-header", {
  start: "top 90%",
  once: true,
  onEnter: batch => gsap.to(batch, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: "power3.out"
  })
});
// ===================== TYPEWRITER ANIMATION =====================

const roles = [
  "Data Analyst",
  "Business Analyst",
  "Power BI Developer",
  "SQL & Data Modeling Specialist"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;
const speed = 90;
const eraseSpeed = 60;
const delayBetween = 900;

function typeWriter() {
  const element = document.getElementById("typewriter");
  const current = roles[roleIndex];

  if (!deleting) {
    element.textContent = current.substring(0, charIndex++);
    if (charIndex > current.length) {
      deleting = true;
      setTimeout(typeWriter, delayBetween);
      return;
    }
  } else {
    element.textContent = current.substring(0, charIndex--);
    if (charIndex < 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeWriter, deleting ? eraseSpeed : speed);
}

typeWriter();

// ===================== NEURAL NETWORK BACKGROUND EFFECT =====================

const canvas = document.getElementById("antigravity-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];
  
  // Configuration
  const particleCount = 60; // Total nodes
  const connectionDistance = 140; // Max distance to draw line
  const mouseDistance = 180; // Max distance for mouse connection

  // Resize handling
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles(); // Re-scatter when resized
  }
  window.addEventListener("resize", resize);
  
  // Particle Class
  class Node {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5; // Very slow drift
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1; // Small dots
      
      // Theme colors (Red/Maroon/White)
      const colors = ["#E21C34", "#500B28", "#e2e8f0"]; 
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Node());
    }
  }

  // Mouse Interaction
  let mouse = { x: null, y: null };
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Update and draw all particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(ctx);
      
      // Connect to other particles
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.hypot(dx, dy);

        if (distance < connectionDistance) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(148, 163, 184, ${1 - distance / connectionDistance})`; // Text-muted color with fade
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      
      // Connect to mouse
      if (mouse.x != null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const distance = Math.hypot(dx, dy);

        if (distance < mouseDistance) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(226, 28, 52, ${1 - distance / mouseDistance})`; // Accent red color for mouse interaction
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          
          // Slight attraction to mouse (optional, keeps it interactive)
          if(distance < mouseDistance - 50) {
             particles[i].x -= dx * 0.01;
             particles[i].y -= dy * 0.01;
          }
        }
      }
    }
    requestAnimationFrame(animate);
  }

  // Start
  resize();
  animate();
  
}

// ===================== PERFECT WATER RIPPLE EFFECT =====================

window.addEventListener("click", (e) => {
  // Create multiple rings for the ripple effect
  const ripplesToSpawn = 4; // Increased for fluid depth
  
  for (let i = 0; i < ripplesToSpawn; i++) {
    setTimeout(() => {
      const ripple = document.createElement("div");
      ripple.className = "water-ripple";
      
      // Position it at click center
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      
      // Randomize size slightly for organic feel
      const size = Math.random() * 10 + 20; // 20-30px initial base
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;

      document.body.appendChild(ripple);
      
      // Remove after animation
      ripple.addEventListener("animationend", () => {
        ripple.remove();
      });
    }, i * 120); // 120ms staggered delay
  }
});

// ===================== PROJECT LIGHTBOX =====================

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.querySelector(".lightbox-close");
const projectImages = document.querySelectorAll(".project-image img");

if (lightbox && lightboxImg) {
  // Open Lightbox
  projectImages.forEach(img => {
    img.style.cursor = "zoom-in"; // Indicate clickable
    img.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent ripple
      lightboxImg.src = img.src;
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden"; // Disable scroll
    });
  });

  // Close Lightbox function
  const closeLightbox = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = ""; // Enable scroll
    setTimeout(() => {
      lightboxImg.src = ""; // Clear src after fade out
    }, 300);
  };

  // Event Listeners for closing
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  
  // Close on backdrop click
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
}


// ===================== 3D TILT PROJECT CARDS =====================

const projectCards = document.querySelectorAll(".project-card, .exp-card");

projectCards.forEach((card) => {
  // Add Glare Element dynamically
  const glare = document.createElement("div");
  glare.classList.add("card-glare");
  card.appendChild(glare);

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (max +/- 10 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Invert X for rotationY because moving mouse right (positive X) should rotate card right (positive Y rotation is confusing, check standard tilt)
    // Actually: Mouse Right -> Rotate Y Positive (Right side goes back/away)
    // Mouse Top -> Rotate X Positive (Top goes back/away)
    
    const rotateY = ((x - centerX) / centerX) * 8; // Max 8deg
    const rotateX = ((centerY - y) / centerY) * 8; // Max 8deg, inverted Y for natural tilt
    
    // Glare movement
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    
    // Apply Transform
    // scale(1.02) gives it a slight lift
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.3), transparent 80%)`;
  });

  card.addEventListener("mouseleave", () => {
    // Reset
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
    glare.style.opacity = "0"; // Ensure glare fades out
  });
  
  card.addEventListener("mouseenter", () => {
    glare.style.opacity = "1";
  });
});

// ===================== ACTIVE SCROLL SPY =====================

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links a, .mobile-nav a");

const observerOptions = {
  root: null,
  rootMargin: "-20% 0px -60% 0px", // Trigger when section is near top
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");
      
      // Remove active from all
      navItems.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });
    }
  });
}, observerOptions);

sections.forEach((section) => {
  observer.observe(section);
});

// ===================== MAGNETIC BUTTONS =====================

const magneticButtons = document.querySelectorAll(".btn, .social-btn, .nav-cta, .hero-download-btn");

magneticButtons.forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.2,
      y: y * 0.2,
      duration: 0.3,
      ease: "power2.out"
    });
  });

  btn.addEventListener("mouseleave", () => {
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)"
    });
  });
});

// ===================== SKILL PROGRESS BARS =====================

const progressBars = document.querySelectorAll(".progress-bar span");

progressBars.forEach((bar) => {
  const targetWidth = bar.style.width;
  
  // Reset width initially
  gsap.set(bar, { width: 0 });
  
  ScrollTrigger.create({
    trigger: bar,
    start: "top 85%",
    onEnter: () => {
      gsap.to(bar, {
        width: targetWidth,
        duration: 1.5,
        ease: "power2.out"
      });
    }
  });
});

// ===================== SERVICES ANIMATION =====================

ScrollTrigger.batch(".service-card", {
  start: "top 90%",
  once: true,
  onEnter: batch => gsap.to(batch, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.2,
    ease: "power2.out"
  })
});

// Service Card Hover Effect (GSAP to handle transform conflict)
document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    gsap.to(card, {
      y: -15, 
      scale: 1.02, 
      duration: 0.3, 
      ease: "power2.out",
      overwrite: "auto"
    });
  });
  
  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      y: 0, 
      scale: 1, 
      duration: 0.5, 
  });
});
});

// ===================== CONTACT FORM SUBMISSION (EmailJS) =====================

(function () {
  emailjs.init("XtmYZiZcVYhLtBoud"); // Public Key
})();

const contactForm = document.getElementById("contact-form");
const submitBtn = document.querySelector(".submit-btn");

if (contactForm && submitBtn) {
  const originalText = submitBtn.innerText; 

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // UI Loading State
    submitBtn.innerText = "Transmitting...";
    submitBtn.classList.add("sending");
    submitBtn.classList.remove("success-state"); // ensure clean slate
    submitBtn.disabled = true;

    emailjs.sendForm(
      "devansh_contact",  
      "contact_devansh",  
      this
    )
    .then(() => {
        // Success UI
        submitBtn.classList.remove("sending");
        submitBtn.classList.add("success-state");
        submitBtn.innerHTML = `
          <svg class="check-icon" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Transmission Complete
        `;
        
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.innerText = originalText;
          submitBtn.classList.remove("success-state");
          submitBtn.disabled = false;
        }, 3500);
    })
    .catch((error) => {
        // Error UI
        console.error("EmailJS Error:", error);
        submitBtn.classList.remove("sending");
        submitBtn.innerText = "Failed. Try Again.";
        submitBtn.style.background = "#ef4444"; // Keep inline for error red
        
        setTimeout(() => {
          submitBtn.innerText = originalText;
          submitBtn.style.background = "";
          submitBtn.disabled = false;
        }, 3000);
    });
  });
}

// ===================== GLITCH TEXT REVEAL =====================
const glitchHeadings = document.querySelectorAll("[data-glitch]");

glitchHeadings.forEach(heading => {
  const originalText = heading.dataset.glitch;
  // Capture the original HTML (with spans/colors) to restore later
  const originalHTML = heading.innerHTML;
  
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  
  ScrollTrigger.create({
    trigger: heading,
    start: "top 85%",
    onEnter: () => {
      let iterations = 0;
      const interval = setInterval(() => {
        heading.innerText = originalText // Use innerText to avoid breaking during scramble
          .split("")
          .map((letter, index) => {
            if (index < iterations) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
        
        if (iterations >= originalText.length) { 
          clearInterval(interval);
          // Restore the full original HTML with spans/colors
          heading.innerHTML = originalHTML;
        }
        
        iterations += 1 / 3; // speed
      }, 30);
      
      // Safety cleanup
      setTimeout(() => {
        clearInterval(interval);
        if (heading.innerHTML !== originalHTML) {
          heading.innerHTML = originalHTML;
        }
      }, 1500); // Slightly longer safety buffer
    }
  });
});

// ===================== ADVANCED SCROLL ANIMATIONS =====================

// 3. About Me Text Scrubbing
const scrubTexts = document.querySelectorAll(".scrub-text");
scrubTexts.forEach(text => {
  gsap.to(text, {
    backgroundPositionX: "0%",
    ease: "none",
    scrollTrigger: {
      trigger: text,
      start: "top 85%",
      end: "bottom 50%",
      scrub: 1 // smooth scrubbing
    }
  });
});

// ===================== SKILL ANALYTICS RADAR CHART =====================
const radarCenter = 150;
const radarAxesDirs = [
  { dx: 0, dy: -120 },    // Python
  { dx: 120, dy: -60 },   // SQL
  { dx: 120, dy: 60 },    // Visualization
  { dx: 0, dy: 120 },     // Statistics
  { dx: -120, dy: 60 },   // ML
  { dx: -120, dy: -60 }   // Excel
];
const radarTargetSkills = [0.90, 0.85, 0.88, 0.75, 0.70, 0.80]; // Python, SQL, Vis, Stats, ML, Excel

const radarProgress = { val: 0 };

function drawRadar(progressVal) {
  const points = radarAxesDirs.map((dir, i) => {
    const scale = radarTargetSkills[i] * progressVal;
    const x = radarCenter + dir.dx * scale;
    const y = radarCenter + dir.dy * scale;
    return `${x},${y}`;
  }).join(" ");
  
  const polygon = document.getElementById("radar-data");
  if (polygon) {
    polygon.setAttribute("points", points);
  }
  
  const clipPolygon = document.getElementById("radar-clip-polygon");
  if (clipPolygon) {
    clipPolygon.setAttribute("points", points);
  }
  
  const dotsContainer = document.getElementById("radar-dots");
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    radarAxesDirs.forEach((dir, i) => {
      const scale = radarTargetSkills[i] * progressVal;
      const x = radarCenter + dir.dx * scale;
      const y = radarCenter + dir.dy * scale;
      
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", 4);
      dotsContainer.appendChild(circle);
    });
  }
}

// Initial draw (at 0)
drawRadar(0);

// Animate radar chart on scroll
if (document.getElementById("radar-chart")) {
  gsap.to(radarProgress, {
    val: 1,
    duration: 1.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#radar-chart",
      start: "top 80%",
      toggleActions: "play none none reverse"
    },
    onUpdate: () => {
      drawRadar(radarProgress.val);
    }
  });

  // Label Hover Interactivity
  const radarLabels = document.querySelectorAll(".radar-label");
  radarLabels.forEach((label, index) => {
    label.addEventListener("mouseenter", () => {
      const circles = document.querySelectorAll("#radar-dots circle");
      if (circles[index]) {
        gsap.to(circles[index], {
          r: 7,
          fill: "#ffffff",
          stroke: "var(--accent)",
          duration: 0.25,
          ease: "power1.out"
        });
      }
      label.style.color = "var(--accent)";
      label.style.textShadow = "0 0 10px rgba(226, 28, 52, 0.4)";
    });
    
    label.addEventListener("mouseleave", () => {
      const circles = document.querySelectorAll("#radar-dots circle");
      if (circles[index]) {
        gsap.to(circles[index], {
          r: 4,
          fill: "#ffffff",
          stroke: "var(--accent)",
          duration: 0.25,
          ease: "power1.out"
        });
      }
      label.style.color = "";
      label.style.textShadow = "";
    });
  });
}

// Ensure calculation is correct after all DOM loaded
setTimeout(() => { ScrollTrigger.refresh(); }, 500);


// ===================== ANIMATED STAT COUNTERS =====================

document.querySelectorAll(".stat-value[data-target]").forEach(statEl => {
  const target = parseInt(statEl.getAttribute("data-target"), 10);
  const suffix = statEl.getAttribute("data-suffix") || "";
  
  // Set initial text
  statEl.textContent = "0" + suffix;
  
  ScrollTrigger.create({
    trigger: statEl,
    start: "top 85%",
    toggleActions: "play none none reverse",
    once: true,
    onEnter: () => {
      const counter = { val: 0 };
      gsap.to(counter, {
        val: target,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          statEl.textContent = Math.round(counter.val) + suffix;
        }
      });
    }
  });
});

// ===================== RADAR HOVER DETAIL POPUPS =====================

const radarPopup = document.getElementById("radar-popup");
const radarPopupTitle = radarPopup ? radarPopup.querySelector(".radar-popup-title") : null;
const radarPopupSkills = radarPopup ? radarPopup.querySelector(".radar-popup-skills") : null;
const chartContainer = document.querySelector(".radar-chart-container");

if (radarPopup && chartContainer) {
  const radarLabelsAll = document.querySelectorAll(".radar-label");
  
  radarLabelsAll.forEach(label => {
    label.addEventListener("mouseenter", (e) => {
      const skillName = label.textContent;
      const subskillsData = label.getAttribute("data-subskills");
      if (!subskillsData) return;
      
      // Parse sub-skills
      const subskills = subskillsData.split(",").map(item => {
        const [name, value] = item.split(":");
        return { name: name.trim(), value: parseInt(value, 10) };
      });
      
      // Build popup content
      radarPopupTitle.textContent = skillName;
      radarPopupSkills.innerHTML = subskills.map(skill => `
        <div class="radar-sub-skill">
          <div class="radar-sub-skill-header">
            <span>${skill.name}</span>
            <span>${skill.value}%</span>
          </div>
          <div class="radar-sub-skill-bar">
            <div class="radar-sub-skill-fill" style="width: 0%;" data-width="${skill.value}%"></div>
          </div>
        </div>
      `).join("");
      
      // Position popup relative to chart container
      const containerRect = chartContainer.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();
      
      let popupLeft = labelRect.left - containerRect.left + labelRect.width / 2;
      let popupTop = labelRect.top - containerRect.top + labelRect.height + 8;
      
      // Keep popup within container bounds
      const popupWidth = 240;
      if (popupLeft + popupWidth > containerRect.width) {
        popupLeft = containerRect.width - popupWidth - 10;
      }
      if (popupLeft < 10) popupLeft = 10;
      
      // If near bottom, show above
      if (popupTop + 200 > containerRect.height) {
        popupTop = labelRect.top - containerRect.top - 200;
      }
      
      radarPopup.style.left = popupLeft + "px";
      radarPopup.style.top = popupTop + "px";
      radarPopup.classList.add("active");
      
      // Animate bars after a tiny delay
      requestAnimationFrame(() => {
        radarPopup.querySelectorAll(".radar-sub-skill-fill").forEach(bar => {
          bar.style.width = bar.getAttribute("data-width");
        });
      });
    });
    
    label.addEventListener("mouseleave", () => {
      radarPopup.classList.remove("active");
      // Reset bar widths
      radarPopup.querySelectorAll(".radar-sub-skill-fill").forEach(bar => {
        bar.style.width = "0%";
      });
    });
  });
}

// ===================== SECTION REVEAL ANIMATIONS =====================

const revealSections = document.querySelectorAll(
  ".services-section, .skills-section, .certificates-section, .experience-section, .education-section, .dashboard-section"
);

revealSections.forEach(section => {
  section.classList.add("reveal-section");
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
    }
  });
}, {
  root: null,
  rootMargin: "0px",
  threshold: 0.08
});

revealSections.forEach(section => {
  revealObserver.observe(section);
});


// ===================== MOBILE PERFORMANCE: REDUCE PARTICLES =====================

// Reduce particle count on mobile for better performance
if (window.innerWidth <= 768) {
  // The particle system is already initialized, so we reduce dynamically
  // by trimming the particles array if it exists
  if (typeof particles !== 'undefined' && particles.length > 25) {
    particles.length = 25;
  }
}

// ===================== LIVE SYSTEM STATUS BAR =====================

const sqlLatency = document.getElementById("sql-latency");
const sqlMemory = document.getElementById("sql-memory");

if (sqlLatency && sqlMemory) {
  setInterval(() => {
    // Generate random database latency (10ms to 24ms)
    const randomLatency = Math.floor(Math.random() * 15) + 10;
    sqlLatency.textContent = `${randomLatency}ms`;

    // Generate random memory utilization (38% to 45%)
    const randomMemory = Math.floor(Math.random() * 8) + 38;
    sqlMemory.textContent = `${randomMemory}%`;
  }, 3000);
}

// ===================== RESUME PREVIEW POPUP =====================

const resumeOverlay = document.getElementById("resumePreviewOverlay");
const resumePopup = document.getElementById("resumePreviewPopup");
const resumeCloseBtn = document.getElementById("resumeCloseBtn");
const resumeDownloadBtn = document.getElementById("resumeDownloadBtn");

// Track if popup has been shown this session
let resumePopupShown = false;

function openResumePreview() {
  if (!resumeOverlay) return;
  resumeOverlay.classList.remove("closing");
  resumeOverlay.classList.add("active");
}

function closeResumePreview() {
  if (!resumeOverlay) return;
  // Add closing class for shrink-back animation
  resumeOverlay.classList.add("closing");
  resumeOverlay.classList.remove("active");
  // After animation completes, remove closing class
  setTimeout(() => {
    resumeOverlay.classList.remove("closing");
  }, 500);
}

// Auto-trigger 5 seconds after preloader finishes
// The preloader dispatches its finish around line 43-51 (hidden class added after ~3.4s)
// We listen for the preloader becoming hidden, then wait 5 more seconds
if (resumeOverlay) {
  const preloaderEl = document.getElementById("preloader");

  if (preloaderEl) {
    // Use MutationObserver to detect when preloader gets the "hidden" class
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          if (preloaderEl.classList.contains("hidden") && !resumePopupShown) {
            resumePopupShown = true;
            observer.disconnect();
            // Wait 5 seconds after homepage is visible
            setTimeout(() => {
              openResumePreview();
            }, 5000);
          }
        }
      });
    });

    observer.observe(preloaderEl, { attributes: true });
  } else {
    // No preloader, show after 5 seconds
    if (!resumePopupShown) {
      resumePopupShown = true;
      setTimeout(() => {
        openResumePreview();
      }, 5000);
    }
  }

  // Close button
  if (resumeCloseBtn) {
    resumeCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeResumePreview();
    });
  }

  // Download button — start download, then close
  if (resumeDownloadBtn) {
    resumeDownloadBtn.addEventListener("click", (e) => {
      // The <a> tag handles the download natively
      // Close the popup after a tiny delay to let download start
      setTimeout(() => {
        closeResumePreview();
      }, 300);
    });
  }

  // Close when clicking the overlay background (outside the popup)
  resumeOverlay.addEventListener("click", (e) => {
    if (e.target === resumeOverlay) {
      closeResumePreview();
    }
  });
}

// Initialize Devansh AI Assistant Chatbot
initAIChatbot();

/* ===================== DEVANSH AI ASSISTANT (DevBot) LOGIC ===================== */
function initAIChatbot() {
  const toggleBtn = document.getElementById("ai-chat-toggle");
  const windowEl = document.getElementById("ai-chat-window");
  const closeBtn = document.getElementById("ai-chat-close");
  const messagesEl = document.getElementById("ai-chat-messages");
  const formEl = document.getElementById("ai-chat-form");
  const inputEl = document.getElementById("ai-chat-input");
  const chipsContainer = document.getElementById("ai-chat-chips");
  const bannerEl = document.getElementById("ai-chat-banner");
  const bannerTextEl = document.getElementById("ai-banner-text");

  if (!toggleBtn || !windowEl || !messagesEl || !formEl || !inputEl) return;

  // Auto-popping banner promos (every 10 seconds)
  const bannerPrompts = [
    "Ask HeroBot about Devansh's 9.15 CPI!",
    "Explore Devansh's SQL & Power BI Projects!",
    "Ask HeroBot for Devansh's Resume!",
    "Check out Devansh's Certifications!",
    "Have a question? Ask HeroBot!"
  ];
  let bannerIndex = 0;

  setInterval(() => {
    if (windowEl.classList.contains("hidden") && bannerEl && bannerTextEl) {
      bannerIndex = (bannerIndex + 1) % bannerPrompts.length;
      bannerTextEl.textContent = bannerPrompts[bannerIndex];
      bannerEl.classList.remove("hidden");

      setTimeout(() => {
        bannerEl.classList.add("hidden");
      }, 3500);
    }
  }, 10000);

  // Toggle chat modal
  toggleBtn.addEventListener("click", () => {
    windowEl.classList.toggle("hidden");
    if (bannerEl) bannerEl.classList.add("hidden");
    if (!windowEl.classList.contains("hidden")) {
      inputEl.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      windowEl.classList.add("hidden");
    });
  }

  // Quick chips clicks & scroll controls
  const prevChipBtn = document.getElementById("ai-chip-prev");
  const nextChipBtn = document.getElementById("ai-chip-next");

  if (prevChipBtn && chipsContainer) {
    prevChipBtn.addEventListener("click", () => {
      chipsContainer.scrollBy({ left: -120, behavior: "smooth" });
    });
  }

  if (nextChipBtn && chipsContainer) {
    nextChipBtn.addEventListener("click", () => {
      chipsContainer.scrollBy({ left: 120, behavior: "smooth" });
    });
  }

  if (chipsContainer) {
    chipsContainer.addEventListener("click", (e) => {
      const chip = e.target.closest(".ai-chip");
      if (chip) {
        const query = chip.dataset.query || chip.innerText;
        handleUserQuery(query);
      }
    });
  }

  // Form submit
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = inputEl.value.trim();
    if (!query) return;
    inputEl.value = "";
    handleUserQuery(query);
  });

  function appendMessage(text, sender = "bot", isHTML = false) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `ai-message ${sender}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "ai-msg-content";
    if (isHTML) {
      contentDiv.innerHTML = text;
    } else {
      contentDiv.textContent = text;
    }

    msgDiv.appendChild(contentDiv);
    messagesEl.appendChild(msgDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return msgDiv;
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "ai-message bot typing-msg";
    typingDiv.innerHTML = `
      <div class="ai-msg-content typing-indicator">
        <span></span><span></span><span></span>
      </div>
    `;
    messagesEl.appendChild(typingDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return typingDiv;
  }

  function handleUserQuery(query) {
    appendMessage(query, "user");

    const typingEl = showTypingIndicator();

    setTimeout(() => {
      typingEl.remove();
      const botResponse = generateAIResponse(query);
      appendMessage(botResponse.html, "bot", true);
    }, 550);
  }

  function generateAIResponse(q) {
    const query = q.toLowerCase();

    // 1. Projects
    if (query.includes("project") || query.includes("work") || query.includes("readmit") || query.includes("driveguard") || query.includes("zomato") || query.includes("build")) {
      return {
        html: `
          Here are <strong>Devansh's 3 flagship Data Analytics projects</strong>:
          <ul>
            <li><strong>ReadmitIQ</strong>: Healthcare readmission risk analyzer (100k+ EHR records, MySQL star schema, XGBoost + SMOTE, 0.65 ROC-AUC, FastAPI & Power BI).</li>
            <li><strong>DriveGuard</strong>: 30 FPS MediaPipe/OpenCV driver fatigue safety system (0-100% fatigue score, emergency SOS, CSV logs, Matplotlib trends).</li>
            <li><strong>Zomato Operations Intelligence</strong>: 18-month 15-city logistics simulation (119k+ orders, 123k+ payments, 38 DAX measures, SLA tracking).</li>
          </ul>
          <div class="ai-btn-group">
            <a href="#projects" class="ai-action-btn">View Projects Section</a>
          </div>
        `
      };
    }

    // 2. Certifications & Courses
    if (query.includes("certif") || query.includes("course") || query.includes("training") || query.includes("edunet") || query.includes("linuxworld")) {
      return {
        html: `
          <strong>Devansh's Professional Certifications</strong>:
          <ul>
            <li><strong>Data Analytics & BI Training</strong>: LinuxWorld Informatics Pvt. Ltd. (2026)</li>
            <li><strong>Analytics Project Certification</strong>: LinuxWorld Informatics Pvt. Ltd. (2026)</li>
            <li><strong>Python, Data Analysis & AI</strong>: Edunet Foundation | SAP Code Unnati (2025)</li>
            <li><strong>Machine Learning & SAP Analytics</strong>: Edunet Foundation | SAP Code Unnati (2026)</li>
          </ul>
          <div class="ai-btn-group">
            <a href="#certificates" class="ai-action-btn">View Certifications Marquee</a>
          </div>
        `
      };
    }

    // 3. Education & CPI
    if (query.includes("cpi") || query.includes("education") || query.includes("college") || query.includes("gpa") || query.includes("degree") || query.includes("study") || query.includes("university") || query.includes("grade") || query.includes("school")) {
      return {
        html: `
          <strong>Academic Credentials</strong>:
          <ul>
            <li><strong>B.Tech in A.I. & Data Science</strong>: ITM SLS Baroda University (<strong>CPI: 9.15</strong> | 2023–2027).</li>
            <li><strong>12th Grade</strong>: Kendriya Vidyalaya No. 2 Army Baroda (72% | 2023).</li>
            <li><strong>10th Grade</strong>: Kendriya Vidyalaya No. 2 Army Baroda (84% | 2021).</li>
          </ul>
          <div class="ai-btn-group">
            <a href="#education" class="ai-action-btn">Jump to Education</a>
          </div>
        `
      };
    }

    // 4. Skills & Tech Stack
    if (query.includes("skill") || query.includes("tech") || query.includes("stack") || query.includes("power bi") || query.includes("sql") || query.includes("python") || query.includes("dax") || query.includes("tools")) {
      return {
        html: `
          <strong>Devansh's Core Competencies</strong>:
          <ul>
            <li><strong>Business Intelligence & Viz</strong>: Power BI, DAX, Power Query, Executive Dashboards, Matplotlib, Seaborn.</li>
            <li><strong>Database & SQL</strong>: MySQL, 6 to 7-table Star Schemas, CTEs, Window Functions, Dimensional Modeling.</li>
            <li><strong>Python & Data Analytics</strong>: Pandas, NumPy, Exploratory Data Analysis (EDA), Scikit-Learn, Statistics.</li>
            <li><strong>Deployment</strong>: FastAPI, Docker, Git, RESTful APIs.</li>
          </ul>
          <div class="ai-btn-group">
            <a href="#skills" class="ai-action-btn">View Skill Analytics</a>
          </div>
        `
      };
    }

    // 5. Experience & Work History
    if (query.includes("experience") || query.includes("job") || query.includes("intern") || query.includes("role") || query.includes("linuxworld") || query.includes("gdg")) {
      return {
        html: `
          <strong>Devansh's Professional Experience (3 Roles)</strong>:
          <ul>
            <li><strong>Data Analyst Trainee</strong> @ LinuxWorld Informatics (Jun 2026 – Jul 2026).</li>
            <li><strong>Lecturer Intern (System Programming)</strong> @ ITM SLS Baroda University (Jun 2025 – Nov 2025).</li>
            <li><strong>Web Tech Coordinator</strong> @ GDG on Campus ITMBU (Aug 2024 – May 2025).</li>
          </ul>
          <div class="ai-btn-group">
            <a href="#experience" class="ai-action-btn">View Experience Timeline</a>
          </div>
        `
      };
    }

    // 6. Resume / CV
    if (query.includes("resume") || query.includes("cv") || query.includes("download") || query.includes("pdf")) {
      return {
        html: `
          You can download or view Devansh's official resume right now!
          <div class="ai-btn-group">
            <a href="./assets/Devansh_Resume.pdf" download="Devansh_Resume.pdf" class="ai-action-btn">Download Resume PDF</a>
          </div>
        `
      };
    }

    // 7. Contact & Hire
    if (query.includes("contact") || query.includes("email") || query.includes("phone") || query.includes("reach") || query.includes("hire") || query.includes("freelance") || query.includes("location")) {
      return {
        html: `
          <strong>Get In Touch with Devansh</strong>:
          <ul>
            <li><strong>Email</strong>: <a href="mailto:devanshrahatal@gmail.com" style="color:var(--accent);">devanshrahatal@gmail.com</a></li>
            <li><strong>Phone</strong>: +91 6354937925</li>
            <li><strong>Location</strong>: Vadodara, Gujarat, India</li>
          </ul>
          <div class="ai-btn-group">
            <a href="#contact" class="ai-action-btn">Open Terminal Contact Form</a>
          </div>
        `
      };
    }

    // 8. Default Fallback
    return {
      html: `
        I'm HeroBot, Devansh's portfolio AI assistant! Here are some key topics you can ask me about:
        <ul>
          <li>Featured Projects (ReadmitIQ, DriveGuard, Zomato)</li>
          <li>Certifications (LinuxWorld, Edunet SAP Code Unnati)</li>
          <li>Core Skills (SQL, Power BI, Python, DAX)</li>
          <li>Education & CPI (9.15 CPI)</li>
          <li>Work Experience (LinuxWorld, ITMBU, GDG)</li>
        </ul>
        <div class="ai-btn-group">
          <a href="./assets/Devansh_Resume.pdf" download="Devansh_Resume.pdf" class="ai-action-btn">Download CV</a>
          <a href="#contact" class="ai-action-btn">Contact Devansh</a>
        </div>
      `
    };
  }
}
