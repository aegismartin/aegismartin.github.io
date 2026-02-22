'use strict';

// ═══════════════════════════════════════════════════════════
// SCRIPT.JS — Index page specific logic
// Aegis Martin Portfolio
// ═══════════════════════════════════════════════════════════

// ── SCROLL REVEAL ─────────────────────────────────────────────
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.cert-card');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            },
            { threshold: 0.1 }
        );

        this.elements.forEach(el => observer.observe(el));
    }
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    new ScrollReveal();
});
