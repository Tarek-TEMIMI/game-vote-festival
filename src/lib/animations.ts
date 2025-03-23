
// Animation utility functions for smooth transitions and effects

// Function to apply staggered animations to elements
export const staggeredChildren = (selector: string, delay = 0.05) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el, index) => {
    (el as HTMLElement).style.animationDelay = `${index * delay}s`;
  });
};

// Function to trigger animation on scroll
export const animateOnScroll = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-up');
        entry.target.classList.remove('opacity-0');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    el.classList.add('opacity-0');
    observer.observe(el);
  });
};

// Apply smooth page transitions
export const pageTransition = (element: HTMLElement) => {
  element.classList.add('animate-fade-in');
  
  // Remove animation class after it completes to allow re-triggering
  setTimeout(() => {
    element.classList.remove('animate-fade-in');
  }, 600);
};

// Apply hover effect to cards
export const applyCardHoverEffect = (selector: string) => {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('scale-hover');
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('scale-hover');
    });
  });
};

// Initialize all animations
export const initializeAnimations = () => {
  animateOnScroll();
  applyCardHoverEffect('.interactive-card');
  
  // Add staggered animations to lists
  staggeredChildren('.staggered-item');
};
