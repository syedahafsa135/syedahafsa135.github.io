/* ==========================================================
   Syeda Hafsa | Portfolio scripts
   Replaces the template's assets/js/main.js
   ========================================================== */
(function () {
    'use strict';

    var root = document.documentElement;

    /* ---------- Theme toggle ---------- */
    var toggle = document.getElementById('theme-toggle');

    function isDark() {
        var set = root.getAttribute('data-theme');
        if (set) return set === 'dark';
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function syncToggle() {
        if (!toggle) return;
        var dark = isDark();
        var icon = toggle.querySelector('i');
        icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
        toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }

    if (toggle) {
        toggle.addEventListener('click', function () {
            var next = isDark() ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (e) {}
            syncToggle();
        });
        syncToggle();

        // If the visitor hasn't picked a theme, follow the system setting live
        if (window.matchMedia) {
            var mq = window.matchMedia('(prefers-color-scheme: dark)');
            var onChange = function () { if (!root.getAttribute('data-theme')) syncToggle(); };
            if (mq.addEventListener) mq.addEventListener('change', onChange);
            else if (mq.addListener) mq.addListener(onChange);
        }
    }

    /* ---------- Project filters ---------- */
    var filters = document.querySelectorAll('.filter');
    var cards = document.querySelectorAll('.project-card');

    filters.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var type = btn.getAttribute('data-filter');
            filters.forEach(function (b) {
                var active = b === btn;
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-pressed', active ? 'true' : 'false');
            });
            cards.forEach(function (card) {
                var tags = (card.getAttribute('data-tags') || '').split(' ');
                card.hidden = !(type === 'all' || tags.indexOf(type) !== -1);
            });
        });
    });

    /* ---------- Highlight the current section in the nav ---------- */
    var links = document.querySelectorAll('.topbar nav a');
    var sections = [];
    links.forEach(function (link) {
        var href = link.getAttribute('href') || '';
        if (href.charAt(0) !== '#' || href.length < 2) return; // skip links to other pages
        var target = document.getElementById(href.slice(1));
        if (target) sections.push({ link: link, target: target });
    });

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (l) { l.classList.remove('is-active'); });
                sections.forEach(function (s) {
                    if (s.target === entry.target) s.link.classList.add('is-active');
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(function (s) { observer.observe(s.target); });
    }

    /* ---------- Hide the photo block if no photo has been uploaded ---------- */
    var photo = document.querySelector('.profile-photo');
    var about = document.querySelector('.about-content');

    function hidePhoto() {
        if (photo) photo.hidden = true;
        if (about) about.classList.add('no-photo');
    }
    if (photo) {
        if (photo.complete && photo.naturalWidth === 0) hidePhoto();
        photo.addEventListener('error', hidePhoto);
    }

    /* ---------- Screenshot slots on case-study pages ----------
       If an image file hasn't been added yet:
       - on your own computer, show a dashed box with the file name to add
       - on the live site, hide the figure so visitors never see a broken image */
    var isLocal = location.protocol === 'file:' ||
        location.hostname === 'localhost' || location.hostname === '127.0.0.1';

    document.querySelectorAll('.shot img').forEach(function (img) {
        function missing() {
            var fig = img.closest('.shot');
            if (!fig) return;
            if (isLocal) {
                var box = document.createElement('div');
                box.className = 'shot-missing';
                box.textContent = 'Add image: ' + img.getAttribute('src').replace(/^(\.\.\/)+/, '');
                img.replaceWith(box);
            } else {
                fig.hidden = true;
            }
        }
        if (img.complete && img.naturalWidth === 0) missing();
        else img.addEventListener('error', missing);
    });

    /* ---------- Copy email ---------- */
    var copyBtn = document.getElementById('copy-email');
    var status = document.getElementById('copy-status');
    var email = 'syedahafsa135@gmail.com';

    if (copyBtn) {
        copyBtn.addEventListener('click', function () {
            function done(msg) {
                if (status) status.textContent = msg;
                setTimeout(function () { if (status) status.textContent = ''; }, 2500);
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(
                    function () { done('Email copied to clipboard.'); },
                    function () { done('Could not copy. Please select the address above.'); }
                );
            } else {
                done('Could not copy. Please select the address above.');
            }
        });
    }

    /* ---------- Footer year ---------- */
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
})();
