// Brainstorm client-side helper — injected into every served page.
// Records clicks to server and auto-reloads when new content arrives.
(function () {
  'use strict';

  var currentFile = null;

  // ── Event recording ──────────────────────────────────────────────────────

  function recordEvent(data) {
    fetch('/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({}, data, { timestamp: Math.floor(Date.now() / 1000) })),
    }).catch(function () {});
  }

  // ── Selection handling ───────────────────────────────────────────────────

  window.toggleSelect = function (el) {
    var container = el.closest('[data-multiselect]');
    var isMulti = container !== null;

    if (!isMulti) {
      document.querySelectorAll('.option.selected, .card.selected').forEach(function (e) {
        e.classList.remove('selected');
      });
    }

    el.classList.toggle('selected');

    var choice = el.dataset.choice || '';
    var text =
      (el.querySelector('h3') || el.querySelector('h4') || el).textContent.trim().slice(0, 100);

    recordEvent({ type: 'click', choice: choice, text: text });
    updateIndicator();
  };

  function updateIndicator() {
    var selected = document.querySelectorAll('.option.selected, .card.selected');
    var indicator = document.getElementById('bs-indicator');
    if (!indicator) return;

    if (selected.length === 0) {
      indicator.style.display = 'none';
    } else {
      var choices = Array.prototype.slice
        .call(selected)
        .map(function (e) { return e.dataset.choice; })
        .join(', ');
      indicator.textContent = 'Đã chọn: ' + choices;
      indicator.style.display = 'block';
    }
  }

  // ── Auto-reload polling ──────────────────────────────────────────────────

  function poll() {
    fetch('/poll')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.file && data.file !== currentFile) {
          if (currentFile !== null) {
            // New content arrived — reload
            location.reload();
          } else {
            currentFile = data.file;
          }
        }
      })
      .catch(function () {})
      .finally(function () { setTimeout(poll, 2000); });
  }

  // ── Init ─────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    // Capture current file from meta tag if present
    var meta = document.querySelector('meta[name="bs-file"]');
    if (meta) currentFile = meta.getAttribute('content');

    updateIndicator();
    setTimeout(poll, 2000);
  });
})();
