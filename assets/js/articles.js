'use strict';

// ═══════════════════════════════════════════════════════════
// ARTICLES.JS — Articles page specific logic
// Aegis Martin Portfolio
// ═══════════════════════════════════════════════════════════

// ── CUSTOM SELECT ─────────────────────────────────────────────
// Powers both the series dropdown and the tag dropdown.
// Fully styled via CSS (.csel), zero native <select> dependency.
class CustomSelect {
    constructor(el, onChange) {
        this.el       = el;
        this.trigger  = el.querySelector('.csel-trigger');
        this.dot      = el.querySelector('.csel-dot');
        this.label    = el.querySelector('.csel-label');
        this.panel    = el.querySelector('.csel-panel');
        this.options  = el.querySelectorAll('.csel-option');
        this.value    = 'all';
        this.onChange = onChange;
        this._bind();
    }

    _bind() {
        // Toggle open on trigger click
        this.trigger.addEventListener('click', e => {
            e.stopPropagation();
            // Close any other open selects first
            document.querySelectorAll('.csel.open').forEach(other => {
                if (other !== this.el) other.classList.remove('open');
            });
            const isOpen = this.el.classList.toggle('open');
            this.trigger.setAttribute('aria-expanded', String(isOpen));
        });

        // Select an option
        this.options.forEach(opt => {
            opt.addEventListener('click', () => {
                this._select(opt.dataset.value, opt.dataset.label, opt.dataset.dot);
                this._close();
            });
        });

        // Close on outside click or Escape
        document.addEventListener('click', () => this._close());
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') this._close();
        });
    }

    _close() {
        this.el.classList.remove('open');
        this.trigger.setAttribute('aria-expanded', 'false');
    }

    _select(value, label, dotClass) {
        this.value = value;
        this.label.textContent = label;
        // Reset dot class then apply the new color variant
        this.dot.className = 'csel-dot' + (dotClass ? ' ' + dotClass : '');
        this.options.forEach(o => o.classList.toggle('active', o.dataset.value === value));
        if (this.onChange) this.onChange(value);
    }
}

// ── FILTER SYSTEM ─────────────────────────────────────────────
class FilterSystem {
    constructor() {
        this.grid         = document.getElementById('articlesGrid');
        this.cards        = Array.from(document.querySelectorAll('.art-card'));
        this.sortToggle   = document.getElementById('sortToggle');
        this.resultsCount = document.getElementById('resultsCount');
        this.noResults    = document.getElementById('noResults');

        this.activeSeries = 'all';
        this.activeTag    = 'all';
        this.sortOrder    = 'desc';

        this._storeDates();
        this._initSelects();
        this._initSort();
    }

    _storeDates() {
        this.cards.forEach(card => {
            card._date = new Date(card.dataset.date);
        });
    }

    _initSelects() {
        this.seriesSelect = new CustomSelect(
            document.getElementById('seriesSelect'),
            value => { this.activeSeries = value; this.filter(); }
        );

        this.tagSelect = new CustomSelect(
            document.getElementById('tagSelect'),
            value => { this.activeTag = value; this.filter(); }
        );
    }

    _initSort() {
        this.sortToggle.addEventListener('click', () => {
            this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
            this.sortToggle.classList.toggle('asc', this.sortOrder === 'asc');
            this.sortToggle.querySelector('.sort-label').textContent =
                this.sortOrder === 'desc' ? 'Newest' : 'Oldest';
            this.filter();
        });
    }

    filter() {
        let visible = this.cards.filter(card => {
            const seriesMatch = this.activeSeries === 'all' || card.dataset.series === this.activeSeries;
            const tagMatch    = this.activeTag    === 'all' || card.dataset.tags.split(',').includes(this.activeTag);
            return seriesMatch && tagMatch;
        });

        visible.sort((a, b) =>
            this.sortOrder === 'desc' ? b._date - a._date : a._date - b._date
        );

        this.cards.forEach(c => c.style.display = 'none');

        if (visible.length === 0) {
            this.grid.style.display = 'none';
            this.noResults.style.display = 'flex';
        } else {
            this.grid.style.display = 'grid';
            this.noResults.style.display = 'none';
            visible.forEach(c => {
                c.style.display = 'block';
                this.grid.appendChild(c);
            });
        }

        this.resultsCount.textContent = visible.length;
    }
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    new FilterSystem();
});