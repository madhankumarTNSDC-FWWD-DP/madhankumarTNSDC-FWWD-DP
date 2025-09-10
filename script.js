/*
  Site interactions (Annotated)
  - Mobile nav toggle
  - Smooth scroll for in-page links
  - Project filter by keyword
  - Contact form validation + fake submit with toast
*/

// Helper: select
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// 1) Mobile nav toggle
const navToggle = $('.nav-toggle');
const nav = $('.nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.style.display === 'flex';
    nav.style.display = open ? 'none' : 'flex';
    navToggle.setAttribute('aria-expanded', String(!open));
  });
}

// 2) Smooth scroll (respects reduced-motion)
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    const target = id && $(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      // Close mobile nav after click
      if (getComputedStyle(navToggle).display !== 'none') {
        nav.style.display = 'none';
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// 3) Project filter
const filterInput = $('#project-filter');
const projectCards = $$('#project-list .card');
if (filterInput) {
  filterInput.addEventListener('input', () => {
    const q = filterInput.value.trim().toLowerCase();
    projectCards.forEach(card => {
      const keys = (card.dataset.keywords || card.textContent).toLowerCase();
      card.style.display = keys.includes(q) ? '' : 'none';
    });
  });
}

// 4) Contact form validation + fake submit
const form = $('#contact-form');
const toast = $('#toast');
const toastText = $('#toast-text');
const toastClose = $('.toast-close');

function showToast(msg) {
  if (!toast) return;
  toastText.textContent = msg;
  toast.hidden = false;
  // Auto-hide after 4s
  setTimeout(() => (toast.hidden = true), 4000);
}

if (toastClose) {
  toastClose.addEventListener('click', () => (toast.hidden = true));
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();

    // Very basic validation
    if (!name || !email || !message) {
      showToast('Please fill out all fields.');
      return;
    }
    const emailOk = /.+@.+\..+/.test(email);
    if (!emailOk) {
      showToast('Please enter a valid email.');
      return;
    }

    // Simulate send
    form.reset();
    showToast('Thanks! Your message was sent.');
  });
}

// 5) Footer year
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();