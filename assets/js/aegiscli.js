'use strict';

// ═══════════════════════════════════════════════════════════
// AEGISCLI.JS — AegisCLI page specific logic
// Aegis Martin Portfolio
// ═══════════════════════════════════════════════════════════

// ── STATS COUNTER ─────────────────────────────────────────────
class StatsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.animated = false;
        this.observe();
    }

    observe() {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated) {
                        this.animated = true;
                        this.animate();
                    }
                });
            },
            { threshold: 0.5 }
        );
        this.counters.forEach(c => observer.observe(c));
    }

    animate() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const tick = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(tick);
                } else {
                    counter.textContent = target;
                }
            };

            tick();
        });
    }
}

// ── TERMINAL TABS ─────────────────────────────────────────────
class TerminalTabs {
    constructor() {
        this.tabs     = document.querySelectorAll('.terminal-tab');
        this.contents = document.querySelectorAll('.terminal-content');
        this.init();
    }

    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });
    }

    switchTab(selected) {
        const target = selected.getAttribute('data-tab');

        this.tabs.forEach(t => t.classList.remove('active'));
        selected.classList.add('active');

        this.contents.forEach(c => {
            c.classList.remove('active');
            if (c.getAttribute('data-content') === target) {
                c.classList.add('active');
            }
        });
    }
}

// ── ARCHITECTURE MODULE HOVER ──────────────────────────────────
class ArchDiagram {
    constructor() {
        this.modules = document.querySelectorAll('.arch-module');
        this.init();
    }

    init() {
        this.modules.forEach(mod => {
            mod.addEventListener('mouseenter', () => {
                mod.style.transform = 'translateY(-10px) scale(1.05)';
            });
            mod.addEventListener('mouseleave', () => {
                mod.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// ── CARD TILT ─────────────────────────────────────────────────
class CardTilt {
    constructor() {
        this.cards = document.querySelectorAll('[data-tilt]');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', e => this.tilt(e, card));
            card.addEventListener('mouseleave', e => this.reset(card));
        });
    }

    tilt(e, card) {
        const rect    = card.getBoundingClientRect();
        const x       = e.clientX - rect.left;
        const y       = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotX    = (y - centerY) / 10;
        const rotY    = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;

        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.transform = `translate(${(x - centerX) / 2}px, ${(y - centerY) / 2}px)`;
        }
    }

    reset(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
        const glow = card.querySelector('.card-glow');
        if (glow) glow.style.transform = 'translate(0,0)';
    }
}

// ── SCROLL REVEAL ─────────────────────────────────────────────
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.feature-card, .roadmap-item, .principle-item, .gallery-placeholder');
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

// ── PROGRESS BARS ─────────────────────────────────────────────
class ProgressBars {
    constructor() {
        this.bars    = document.querySelectorAll('.progress-fill');
        this.animated = new Set();
        this.observe();
    }

    observe() {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated.has(entry.target)) {
                        this.animated.add(entry.target);
                        const width = entry.target.style.width;
                        entry.target.style.width = '0%';
                        setTimeout(() => { entry.target.style.width = width; }, 100);
                    }
                });
            },
            { threshold: 0.5 }
        );
        this.bars.forEach(b => observer.observe(b));
    }
}

// ── HERO PARALLAX ─────────────────────────────────────────────
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.animated-bg').forEach(el => {
            el.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }, { passive: true });
}

// ── LIGHTBOX ──────────────────────────────────────────────────
class Lightbox {
    constructor() {
        this.overlay  = document.getElementById('lightbox');
        this.img      = document.getElementById('lightboxImg');
        this.caption  = document.getElementById('lightboxCaption');
        this.closeBtn = document.getElementById('lightboxClose');
        this.prevBtn  = document.getElementById('lightboxPrev');
        this.nextBtn  = document.getElementById('lightboxNext');
        this.items    = [...document.querySelectorAll('.gallery-item[data-lightbox]')];
        this.current  = 0;
        if (!this.overlay) return;
        this.init();
    }

    init() {
        // Open on gallery item click
        this.items.forEach((item, i) => {
            item.addEventListener('click', () => {
                // Don't open lightbox if image is missing
                if (item.classList.contains('img-missing')) return;
                this.open(i);
            });
        });

        // Controls
        this.closeBtn.addEventListener('click', () => this.close());
        this.prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.navigate(-1); });
        this.nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.navigate(1); });

        // Close on backdrop click
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        // Keyboard nav
        document.addEventListener('keydown', (e) => {
            if (!this.overlay.classList.contains('active')) return;
            if (e.key === 'Escape')      this.close();
            if (e.key === 'ArrowLeft')   this.navigate(-1);
            if (e.key === 'ArrowRight')  this.navigate(1);
        });
    }

    open(index) {
        this.current = index;
        this.show();
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        // Reset after transition
        setTimeout(() => { this.img.src = ''; }, 300);
    }

    navigate(dir) {
        this.current = (this.current + dir + this.items.length) % this.items.length;
        this.show();
    }

    show() {
        const item    = this.items[this.current];
        const src     = item.getAttribute('data-lightbox');
        const label   = item.querySelector('.placeholder-label')?.textContent || '';
        this.img.src  = src;
        this.img.alt  = label;
        this.caption.textContent = label;

        // Show/hide nav arrows
        this.prevBtn.style.display = this.items.length > 1 ? '' : 'none';
        this.nextBtn.style.display = this.items.length > 1 ? '' : 'none';
    }
}

// ── DOCS TOAST ────────────────────────────────────────────────
function initDocsToast() {
    const toast    = document.getElementById('docsToast');
    const closeBtn = document.getElementById('docsToastClose');
    const triggers = document.querySelectorAll('.docs-soon');
    let hideTimer;

    function show() {
        clearTimeout(hideTimer);
        toast.classList.add('visible');
        hideTimer = setTimeout(hide, 4000);
    }

    function hide() {
        toast.classList.remove('visible');
    }

    triggers.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            show();
        });
    });

    closeBtn.addEventListener('click', hide);
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    new StatsCounter();
    new TerminalTabs();
    new ArchDiagram();
    new CardTilt();
    new ScrollReveal();
    new ProgressBars();
    new Lightbox();
    initParallax();
    initDocsToast();
});