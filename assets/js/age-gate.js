/* ═══════════════════════════════════════════════════════════
   AGE-GATE.JS — 18+ confirmation overlay
   Aegis Martin Portfolio
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const STORAGE_KEY = 'aegis_age_verified';

    /* ── Already verified this session? Skip. ─────────────────── */
    if (sessionStorage.getItem(STORAGE_KEY) === '1') return;

    /* ── Inject styles ────────────────────────────────────────── */
    const style = document.createElement('style');
    style.textContent = `
        #age-gate-overlay {
            position: fixed;
            inset: 0;
            z-index: 99999;
            background: #0a0a0a;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Work Sans', sans-serif;
            padding: 1.5rem;
            /* Subtle noise grain */
            background-image:
                radial-gradient(ellipse 80% 60% at 50% -10%, rgba(168,85,247,0.18) 0%, transparent 70%),
                url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
        }

        #age-gate-card {
            max-width: 480px;
            width: 100%;
            border: 1px solid #2a2a2a;
            border-radius: 16px;
            background: #111111;
            padding: 3rem 2.5rem;
            text-align: center;
            box-shadow: 0 0 60px rgba(168,85,247,0.12), 0 0 0 1px rgba(168,85,247,0.08);
            animation: age-gate-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes age-gate-in {
            from { opacity: 0; transform: translateY(24px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }

        #age-gate-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 72px;
            height: 72px;
            border-radius: 50%;
            border: 2px solid #a855f7;
            background: rgba(168,85,247,0.1);
            font-family: 'Barlow Semi Condensed', 'Work Sans', sans-serif;
            font-size: 1.5rem;
            font-weight: 800;
            color: #a855f7;
            letter-spacing: 0.02em;
            margin-bottom: 1.5rem;
            box-shadow: 0 0 24px rgba(168,85,247,0.25);
        }

        #age-gate-title {
            font-family: 'Barlow Semi Condensed', 'Work Sans', sans-serif;
            font-size: 1.75rem;
            font-weight: 800;
            color: #ffffff;
            margin-bottom: 0.75rem;
            letter-spacing: 0.01em;
            line-height: 1.2;
        }

        #age-gate-subtitle {
            font-size: 0.95rem;
            color: #a0a0a0;
            line-height: 1.6;
            margin-bottom: 2rem;
        }

        #age-gate-subtitle strong {
            color: #ffffff;
        }

        .age-gate-actions {
            display: flex;
            gap: 0.75rem;
            justify-content: center;
        }

        #age-gate-confirm {
            flex: 1;
            padding: 0.85rem 1.5rem;
            border-radius: 8px;
            border: none;
            background: linear-gradient(135deg, #a855f7, #7c3aed);
            color: #ffffff;
            font-family: 'Barlow Semi Condensed', 'Work Sans', sans-serif;
            font-size: 1rem;
            font-weight: 700;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            cursor: pointer;
            transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
            box-shadow: 0 4px 20px rgba(168,85,247,0.35);
        }

        #age-gate-confirm:hover {
            opacity: 0.92;
            transform: translateY(-1px);
            box-shadow: 0 6px 28px rgba(168,85,247,0.5);
        }

        #age-gate-confirm:active {
            transform: translateY(0);
        }

        #age-gate-deny {
            flex: 1;
            padding: 0.85rem 1.5rem;
            border-radius: 8px;
            border: 1px solid #2a2a2a;
            background: transparent;
            color: #a0a0a0;
            font-family: 'Barlow Semi Condensed', 'Work Sans', sans-serif;
            font-size: 1rem;
            font-weight: 700;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            cursor: pointer;
            transition: border-color 0.2s, color 0.2s, transform 0.15s;
        }

        #age-gate-deny:hover {
            border-color: #ef4444;
            color: #ef4444;
            transform: translateY(-1px);
        }

        #age-gate-note {
            margin-top: 1.75rem;
            font-size: 0.75rem;
            color: #666666;
            line-height: 1.5;
        }
    `;
    document.head.appendChild(style);

    /* ── Build the overlay ────────────────────────────────────── */
    const overlay = document.createElement('div');
    overlay.id = 'age-gate-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'age-gate-title');

    overlay.innerHTML = `
        <div id="age-gate-card">
            <div id="age-gate-badge">18+</div>
            <h2 id="age-gate-title">Mature Content Ahead</h2>
            <p id="age-gate-subtitle">
                This article contains <strong>strong language</strong> and mature themes.
                By continuing, you confirm that you are <strong>18 years of age or older</strong>.
            </p>
            <div class="age-gate-actions">
                <button id="age-gate-confirm">I'm 18+, Let Me In</button>
                <button id="age-gate-deny">Take Me Back</button>
            </div>
            <p id="age-gate-note">
                This check is for content advisory purposes only.
            </p>
        </div>
    `;

    /* ── Mount after DOM is ready ─────────────────────────────── */
    function mount() {
        document.body.style.overflow = 'hidden';
        document.body.appendChild(overlay);

        document.getElementById('age-gate-confirm').addEventListener('click', function () {
            sessionStorage.setItem(STORAGE_KEY, '1');
            overlay.style.transition = 'opacity 0.3s ease';
            overlay.style.opacity = '0';
            document.body.style.overflow = '';
            setTimeout(function () { overlay.remove(); }, 320);
        });

        document.getElementById('age-gate-deny').addEventListener('click', function () {
            // Go back, or fall back to articles page
            if (document.referrer) {
                history.back();
            } else {
                window.location.href = '../../articles.html';
            }
        });

        /* Trap focus inside the gate */
        const focusable = overlay.querySelectorAll('button');
        overlay.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const idx = Array.from(focusable).indexOf(document.activeElement);
                focusable[(idx + 1) % focusable.length].focus();
            }
            if (e.key === 'Escape') {
                document.getElementById('age-gate-deny').click();
            }
        });

        focusable[0].focus();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }

})();