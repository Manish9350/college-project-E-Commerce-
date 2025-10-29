import { gsap } from 'gsap';

export const pageEnter = (element) => {
  gsap.fromTo(element, 
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
  );
};

export const staggerItems = (element) => {
  gsap.fromTo(element.children,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)" }
  );
};

export const hoverAnimation = (element) => {
  gsap.to(element, {
    scale: 1.05,
    duration: 0.3,
    ease: "power2.out"
  });
};

export const hoverAnimationOut = (element) => {
  gsap.to(element, {
    scale: 1,
    duration: 0.3,
    ease: "power2.out"
  });
};