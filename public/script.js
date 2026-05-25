document.addEventListener("DOMContentLoaded", (event) => {
    // Register GSAP plugins (though ScrollTrigger is loaded, we're building an auto-playing timeline)
    gsap.registerPlugin(ScrollTrigger);

    // Initial setup: ensure all frames except frame-0 are hidden
    gsap.set(".frame", { autoAlpha: 0 });
    gsap.set("#frame-0", { autoAlpha: 1 });

    const tl = gsap.timeline();

    // Кадр 0: Открывашка (0-2s)
    tl.to("#frame-0", { opacity: 0, duration: 0.5, delay: 2 });

    // Кадр 1: Удар (2-5s)
    tl.to("#frame-1", { autoAlpha: 1, duration: 0.5 }, "-=0.5")
      .fromTo("#frame-1 h1", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" })
      .to("#frame-1", { opacity: 0, duration: 0.5 }, "+=1.5");

    // Кадр 2: Диагностика (5-9s)
    tl.to("#frame-2", { autoAlpha: 1, duration: 0.5 }, "-=0.5")
      .fromTo("#frame-2 > div", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.2)" })
      // Simulate cursor movement and click
      .to("#cursor", { autoAlpha: 1, duration: 0.2 })
      .to("#cursor", { top: "50%", left: "50%", duration: 1, ease: "power2.inOut" })
      .to("#diag-btn-1", { backgroundColor: "#e5e7eb", duration: 0.1 })
      .to("#diag-btn-1", { backgroundColor: "#f9fafb", duration: 0.1 })
      .to("#frame-2", { opacity: 0, duration: 0.5 }, "+=0.5");

    // Кадр 3: Score (9-13s)
    tl.to("#frame-3", { autoAlpha: 1, duration: 0.5 }, "-=0.5")
      .fromTo("#frame-3 > div", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
      .fromTo("#frame-3 .text-6xl", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)" }, "-=0.4")
      .fromTo("#frame-3 p", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.2")
      .to("#frame-3", { opacity: 0, duration: 0.5 }, "+=1.5");

    // Кадр 4: Было / Стало (13-17s)
    tl.to("#frame-4", { autoAlpha: 1, duration: 0.5 }, "-=0.5")
      // Simulate slow scroll down
      .fromTo("#before-after-scroll", { y: 50 }, { y: -50, duration: 3, ease: "linear" })
      .to("#frame-4", { opacity: 0, duration: 0.5 }, "-=0.5");

    // Кадр 5: Фишки в деле (17-22s) - 3 screens
    tl.to("#frame-5", { autoAlpha: 1, duration: 0.5 })
      .fromTo("#frame-5 > div", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 })
      // Screen 1 visible
      .to("#f5-screen-1", { opacity: 0, duration: 0.3, delay: 1.2 })
      // Screen 2 visible
      .to("#f5-screen-2", { opacity: 1, duration: 0.3 })
      .to("#f5-screen-2", { opacity: 0, duration: 0.3, delay: 1.2 })
      // Screen 3 visible
      .to("#f5-screen-3", { opacity: 1, duration: 0.3 })
      .to("#frame-5", { opacity: 0, duration: 0.5 }, "+=1.2");

    // Кадр 6: Финальный удар (22-27s)
    tl.to("#frame-6", { autoAlpha: 1, duration: 0.5 }, "-=0.5")
      .fromTo("#frame-6 > div", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.2)" })
      .fromTo("#frame-6 p", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
      // Finger click simulation
      .to("#finger", { autoAlpha: 1, duration: 0.2 }, "+=0.5")
      .to("#finger", { top: "65%", left: "50%", duration: 0.8, ease: "power2.inOut" })
      .to("#buy-btn", { scale: 0.95, duration: 0.1 })
      .to("#buy-btn", { scale: 1, duration: 0.1 })
      .to("#frame-6", { opacity: 0, duration: 0.5 }, "+=1");

    // Кадр 7: Аутро (27-30s)
    tl.to("#frame-7", { autoAlpha: 1, duration: 0.5 })
      .fromTo("#frame-7 h1", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8 })
      .fromTo("#frame-7 div", { opacity: 0 }, { opacity: 1, duration: 0.5 }, "+=0.5");
});
