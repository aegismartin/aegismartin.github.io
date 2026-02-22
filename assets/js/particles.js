'use strict';

// ═══════════════════════════════════════════════════════════
// PARTICLES.JS — Shared across all pages
// Aegis Martin Portfolio
// ═══════════════════════════════════════════════════════════

// ── PARTICLE SYSTEM ──────────────────────────────────────────
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.count = 80;
        this.mouseX = -9999;
        this.mouseY = -9999;
        this.init();
    }

    init() {
        this.resize();
        this.populate();
        this.loop();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', e => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    populate() {
        this.particles = [];
        for (let i = 0; i < this.count; i++) {
            this.particles.push({
                x:     Math.random() * this.canvas.width,
                y:     Math.random() * this.canvas.height,
                size:  Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
            });
        }
    }

    update(p) {
        const dx = this.mouseX - p.x;
        const dy = this.mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150 && dist > 0) {
            const force = (150 - dist) / 150;
            p.x -= (dx / dist) * force * 2;
            p.y -= (dy / dist) * force * 2;
        }

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = this.canvas.width;
        if (p.x > this.canvas.width) p.x = 0;
        if (p.y < 0) p.y = this.canvas.height;
        if (p.y > this.canvas.height) p.y = 0;
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const a = this.particles[i];
                const b = this.particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(168,85,247,${0.15 * (1 - d / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        // Particles
        for (const p of this.particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(168,85,247,${p.opacity})`;
            ctx.fill();
        }
    }

    loop() {
        for (const p of this.particles) this.update(p);
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

// ── NAVBAR SCROLL ─────────────────────────────────────────────
function initNavbar() {
    const nav = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(10,10,10,0.95)';
            nav.style.boxShadow  = '0 5px 20px rgba(0,0,0,0.5)';
        } else {
            nav.style.background = 'rgba(10,10,10,0.8)';
            nav.style.boxShadow  = 'none';
        }
    }, { passive: true });
}

// ── SMOOTH SCROLL ─────────────────────────────────────────────
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ── GLITCH TEXT ───────────────────────────────────────────────
function initGlitch() {
    const glitchText = document.querySelector('.glitch-text');
    if (!glitchText) return;
    glitchText.addEventListener('mouseenter', function() {
        this.style.animation = 'none';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.style.animation = 'glitch 0.5s ease';
            });
        });
    });
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
    initNavbar();
    initSmoothScroll();
    initGlitch();
});
