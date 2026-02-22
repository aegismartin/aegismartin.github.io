'use strict';

// ═══════════════════════════════════════════════════════════
// NAV.JS — Hamburger menu, shared across all pages
// Aegis Martin Portfolio
// ═══════════════════════════════════════════════════════════

(function () {
    // ── Elements ──────────────────────────────────────────
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.querySelector('.nav-links');
    const overlay   = document.querySelector('.nav-overlay');
    const navbar    = document.querySelector('.navbar');

    if (!hamburger || !navLinks || !overlay) return;

    // ── Open / close helpers ──────────────────────────────
    function openNav() {
        hamburger.classList.add('active');
        navLinks.classList.add('open');
        overlay.classList.add('active');
        document.body.classList.add('nav-open');
        hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeNav() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        overlay.classList.remove('active');
        document.body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    function toggleNav() {
        if (navLinks.classList.contains('open')) {
            closeNav();
        } else {
            openNav();
        }
    }

    // ── Events ────────────────────────────────────────────
    hamburger.addEventListener('click', toggleNav);

    // Close when overlay (dimmed background) is clicked
    overlay.addEventListener('click', closeNav);

    // Close when a nav link is clicked (SPA-style navigation)
    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeNav);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
            closeNav();
            hamburger.focus();
        }
    });

    // ── Close nav when resizing back to desktop ────────────
    // Prevents the nav from staying open if user rotates device
    // or resizes a browser window back above the mobile breakpoint.
    const mq = window.matchMedia('(min-width: 641px)');
    function handleResize(e) {
        if (e.matches) {
            closeNav();
        }
    }

    // Use addEventListener for the MediaQueryList (modern + legacy)
    if (mq.addEventListener) {
        mq.addEventListener('change', handleResize);
    } else if (mq.addListener) {
        mq.addListener(handleResize); // Safari < 14 fallback
    }

    // ── Navbar scroll shadow ───────────────────────────────
    // Already fixed-position, but add a subtle shadow on scroll
    // so the nav is clearly separated from content on all pages.
    if (navbar) {
        let lastScroll = 0;
        window.addEventListener('scroll', function () {
            const current = window.scrollY;
            if (current > 20) {
                navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
            } else {
                navbar.style.boxShadow = '';
            }
            lastScroll = current;
        }, { passive: true });
    }
})();