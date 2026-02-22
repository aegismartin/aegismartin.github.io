'use strict';

// ── TABLE OF CONTENTS ──────────────────────────────────────
function initTOC() {
    const content  = document.getElementById('articleContent');
    const tocList  = document.getElementById('tocList');
    const headings = content.querySelectorAll('h2, h3');

    if (!headings.length) {
        document.getElementById('tocSidebar').style.display = 'none';
        return;
    }

    headings.forEach(heading => {
        const li = document.createElement('li');
        li.className = 'toc-item';

        const a = document.createElement('a');
        a.href = `#${heading.id}`;
        a.textContent = heading.textContent;
        a.className = `toc-link${heading.tagName === 'H3' ? ' h3' : ''}`;

        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.getElementById(heading.id);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        li.appendChild(a);
        tocList.appendChild(li);
    });
}

// ── ACTIVE TOC LINK ON SCROLL ──────────────────────────────
function initTOCScroll() {
    const headings = document.querySelectorAll('#articleContent h2, #articleContent h3');
    const links    = document.querySelectorAll('.toc-link');
    if (!headings.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

    headings.forEach(h => observer.observe(h));
}

// ── COPY BUTTONS ───────────────────────────────────────────
function initCopyButtons() {
    document.querySelectorAll('.code-copy-btn[data-copy]').forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.closest('.code-block-wrapper').querySelector('pre code');
            if (!code) return;
            navigator.clipboard.writeText(code.textContent.trim()).then(() => {
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 2000);
            });
        });
    });
}

// ── IMAGE LIGHTBOX ─────────────────────────────────────────
function initLightbox() {
    const overlay = document.getElementById('lightboxOverlay');
    const img     = document.getElementById('lightboxImg');
    const close   = document.getElementById('lightboxClose');

    document.querySelectorAll('.article-image img').forEach(el => {
        el.addEventListener('click', () => {
            img.src = el.src;
            img.alt = el.alt;
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { img.src = ''; }, 300);
    };

    close.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initTOC();
    initTOCScroll();
    initCopyButtons();
    initLightbox();
});
