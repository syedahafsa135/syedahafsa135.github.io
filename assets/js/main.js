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
    var cards = document.querySelectorAll('.project');

    filters.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var type = btn.getAttribute('data-filter');
            filters.forEach(function (b) {
                var active = b === btn;
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-pressed', active ? 'true' : 'false');
            });
            var shown = 0;
            cards.forEach(function (card) {
                var tags = (card.getAttribute('data-tags') || '').split(' ');
                card.hidden = !(type === 'all' || tags.indexOf(type) !== -1);
                if (!card.hidden) shown++;
            });
            var count = document.getElementById('filter-count');
            if (count) count.textContent = shown + (shown === 1 ? ' project' : ' projects');
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

    /* ---------- Show an "SH" avatar if no photo has been uploaded ---------- */
    var photo = document.querySelector('.profile-photo');
    var avatar = document.querySelector('.avatar');

    function hidePhoto() {
        if (photo) photo.hidden = true;
        if (avatar) avatar.hidden = false;
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

    /* ---------- Results dashboard: chart data ----------
       Every number here is a verified project result (see the comments in index.html).
       To change a chart, edit the numbers here only. */
    var CHARTS = {
        'p2p-split': {
            type: 'stack', unit: 'loans',
            parts: [
                { label: 'Charged off, defaulted or past due', value: 17010, s: 's1' },
                { label: 'All other loans', value: 96927, s: 's2' }
            ]
        },
        'p2p-corr': {
            type: 'bars', digits: 3, max: 1, valueName: 'Correlation (r)',
            rows: [
                ['Borrower rate ↔ lender yield', 0.999],
                ['APR ↔ borrower rate', 0.990],
                ['APR ↔ lender yield', 0.989],
                ['Estimated loss ↔ Prosper risk rating', 0.943]
            ],
            tip: function (r) { return r[0] + ': r = ' + r[1].toFixed(3) + ' (1.0 = move perfectly together)'; }
        },
        'sales-imp': {
            type: 'bars', digits: 3, max: 1, valueName: 'Importance',
            rows: [['TV', 0.625], ['Radio', 0.362], ['Newspaper', 0.013]],
            tip: function (r) { return r[0] + ' spend: ' + (r[1] * 100).toFixed(1) + '% of total importance'; }
        },
        'car-imp': {
            type: 'bars', digits: 3, max: 1, valueName: 'Importance',
            rows: [
                ['Present (new) price', 0.884], ['Year', 0.062], ['Kms driven', 0.034],
                ['Manual transmission', 0.009], ['Fuel: petrol', 0.004], ['Seller: individual', 0.003],
                ['Fuel: diesel', 0.003], ['Previous owners', 0.001]
            ],
            tip: function (r) { return r[0] + ': ' + (r[1] * 100).toFixed(1) + '% of total importance'; }
        },
        'car-fuel': {
            type: 'bars', digits: 0, valueName: 'Cars',
            rows: [['Petrol', 239], ['Diesel', 60], ['CNG', 2]],
            tip: function (r) { return r[1] + ' of 301 cars (' + (r[1] / 301 * 100).toFixed(1) + '%)'; }
        },
        'fyp-metrics': {
            type: 'grouped', digits: 3, max: 1,
            series: ['Bounding box', 'Pose keypoints'],
            rows: [
                ['Precision', 0.537, 0.364], ['Recall', 0.716, 0.455],
                ['mAP50', 0.583, 0.274], ['mAP50-95', 0.428, 0.088]
            ]
        },
        'disease': {
            type: 'grouped', digits: 3, max: 1,
            series: ['Diabetes (SVM)', 'Heart (logistic regression)'],
            rows: [
                ['Accuracy', 0.773, 0.885], ['Precision', 0.757, 0.879],
                ['Recall', 0.519, 0.906], ['F1 score', 0.615, 0.892]
            ]
        },
        /* Loan default (Project 2 report, Table 6 and Table A8) */
        'loan-auc': {
            type: 'bars', digits: 3, max: 1, valueName: 'Test ROC AUC',
            rows: [
                ['AdaBoost (tuned)', 0.740], ['Random Forest', 0.732], ['Neural network (MLP)', 0.715],
                ['Naïve Bayes', 0.714], ['Decision Tree', 0.711], ['Approve everything', 0.500]
            ],
            tip: function (r) { return r[0] + ': test AUC ' + r[1].toFixed(3) + ' (0.5 = coin flip)'; }
        },
        'loan-imp': {
            type: 'bars', digits: 3, valueName: 'Mean AUC drop',
            rows: [
                ['Age', 0.082], ['InterestRate', 0.038], ['LoanToIncome', 0.035],
                ['MonthsEmployed', 0.030], ['Income', 0.005], ['CreditScore', 0.004]
            ],
            tip: function (r) { return 'Shuffling ' + r[0] + ' lowers AUC by ' + r[1].toFixed(3) + ' on average'; }
        },
        /* Hotel bookings (Assignment 3 report, Tables 3 and 4, section 5.2) */
        'hotel-cancel': {
            type: 'bars', digits: 1, max: 100, valueName: 'Cancelled (%)',
            rows: [['Non Refund', 99.4], ['No Deposit', 28.7], ['Refundable', 22.2]],
            tip: function (r) { return r[0] + ': ' + r[1].toFixed(1) + '% of bookings cancelled'; }
        },
        'hotel-r2': {
            type: 'bars', digits: 3, max: 1, valueName: 'Adjusted R²',
            rows: [['Booking features only', 0.223], ['+ arrival month', 0.414], ['+ hotel × month', 0.551]],
            tip: function (r) { return r[0] + ': explains ' + (r[1] * 100).toFixed(1) + '% of room-rate variation'; }
        },
        'hotel-segment': {
            type: 'bars', digits: 2, valueName: '€ below Online TA',
            rows: [
                ['Direct', 0.28], ['Aviation', 15.24], ['Offline TA/TO', 29.64],
                ['Groups', 37.47], ['Corporate', 47.51], ['Complementary', 83.95]
            ],
            tip: function (r) { return r[0] + ' pays €' + r[1].toFixed(2) + ' a night less than Online TA on average'; }
        }
    };

    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }
    function fmt(v, digits) {
        return digits ? v.toFixed(digits) : v.toLocaleString('en-US');
    }
    function pct(v, max) { return (v / max * 100).toFixed(2) + '%'; }

    function barLine(value, max, digits, s) {
        var wrap = el('span', 'group-line');
        var track = el('span', 'bar-track');
        var fill = el('span', 'bar-fill' + (s ? ' ' + s : ''));
        fill.style.setProperty('--w', pct(value, max));
        track.appendChild(fill);
        wrap.appendChild(track);
        wrap.appendChild(el('span', 'bar-val', fmt(value, digits)));
        return wrap;
    }

    function addTable(host, head, rows) {
        var det = el('details', 'data-table');
        det.appendChild(el('summary', null, 'Show the numbers'));
        var wrap = el('div', 'table-wrap');
        var t = el('table');
        var tr = el('tr');
        head.forEach(function (h) { tr.appendChild(el('th', null, h)); });
        var thead = el('thead'); thead.appendChild(tr); t.appendChild(thead);
        var tbody = el('tbody');
        rows.forEach(function (r) {
            var row = el('tr');
            r.forEach(function (c, i) { row.appendChild(el('td', i ? 'num' : null, c)); });
            tbody.appendChild(row);
        });
        t.appendChild(tbody); wrap.appendChild(t); det.appendChild(wrap);
        host.appendChild(det);
    }

    function legend(host, names) {
        var ul = el('ul', 'legend');
        names.forEach(function (n, i) {
            var li = el('li');
            li.appendChild(el('span', 'swatch s' + (i + 1)));
            li.appendChild(document.createTextNode(n));
            ul.appendChild(li);
        });
        host.appendChild(ul);
    }

    function renderChart(host, cfg) {
        if (cfg.type === 'bars') {
            var max = cfg.max || Math.max.apply(null, cfg.rows.map(function (r) { return r[1]; }));
            var ul = el('ul', 'bars');
            cfg.rows.forEach(function (r) {
                var li = el('li', 'bar-row');
                li.tabIndex = 0;
                li.appendChild(el('span', 'bar-label', r[0]));
                var track = el('span', 'bar-track');
                var fill = el('span', 'bar-fill');
                fill.style.setProperty('--w', pct(r[1], max));
                track.appendChild(fill);
                li.appendChild(track);
                li.appendChild(el('span', 'bar-val', fmt(r[1], cfg.digits)));
                if (cfg.tip) {
                    var tip = el('span', 'tip', cfg.tip(r));
                    tip.setAttribute('aria-hidden', 'true');
                    li.appendChild(tip);
                }
                ul.appendChild(li);
            });
            host.appendChild(ul);
            addTable(host, ['Item', cfg.valueName], cfg.rows.map(function (r) { return [r[0], fmt(r[1], cfg.digits)]; }));
        }

        if (cfg.type === 'grouped') {
            legend(host, cfg.series);
            var list = el('ul', 'bars');
            cfg.rows.forEach(function (r) {
                var li = el('li', 'group-row');
                li.tabIndex = 0;
                li.appendChild(el('span', 'bar-label', r[0]));
                var lines = el('span', 'group-lines');
                lines.appendChild(barLine(r[1], cfg.max, cfg.digits, 's1'));
                lines.appendChild(barLine(r[2], cfg.max, cfg.digits, 's2'));
                li.appendChild(lines);
                var tip = el('span', 'tip', r[0] + ': ' + cfg.series[0] + ' ' + fmt(r[1], cfg.digits) +
                    ', ' + cfg.series[1] + ' ' + fmt(r[2], cfg.digits));
                tip.setAttribute('aria-hidden', 'true');
                li.appendChild(tip);
                list.appendChild(li);
            });
            host.appendChild(list);
            addTable(host, ['Metric'].concat(cfg.series), cfg.rows.map(function (r) {
                return [r[0], fmt(r[1], cfg.digits), fmt(r[2], cfg.digits)];
            }));
        }

        if (cfg.type === 'stack') {
            var total = cfg.parts.reduce(function (a, p) { return a + p.value; }, 0);
            var bar = el('div', 'stack-bar');
            bar.setAttribute('aria-hidden', 'true');
            cfg.parts.forEach(function (p) {
                var seg = el('span', 'stack-seg ' + p.s);
                seg.style.setProperty('--w', pct(p.value, total));
                seg.title = p.label + ': ' + fmt(p.value) + ' ' + cfg.unit;
                bar.appendChild(seg);
            });
            host.appendChild(bar);
            var ul2 = el('ul', 'legend');
            cfg.parts.forEach(function (p) {
                var li = el('li');
                li.appendChild(el('span', 'swatch ' + p.s));
                li.appendChild(document.createTextNode(p.label + ': ' + fmt(p.value) + ' (' + (p.value / total * 100).toFixed(1) + '%)'));
                ul2.appendChild(li);
            });
            host.appendChild(ul2);
        }
    }

    var looseCharts = [];
    document.querySelectorAll('[data-chart]').forEach(function (host) {
        var cfg = CHARTS[host.getAttribute('data-chart')];
        if (!cfg) return;
        renderChart(host, cfg);
        if (!host.closest('#dashboard')) looseCharts.push(host);
    });

    // Charts outside the dashboard (case-study pages) draw when they scroll into view
    if (looseCharts.length) {
        if ('IntersectionObserver' in window) {
            var chartObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-drawn');
                    chartObs.unobserve(entry.target);
                });
            }, { threshold: 0.2 });
            looseCharts.forEach(function (h) { chartObs.observe(h); });
        } else {
            looseCharts.forEach(function (h) { h.classList.add('is-drawn'); });
        }
    }

    /* ---------- Results dashboard: tabs ---------- */
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
    var dash = document.getElementById('dashboard');
    var dashSeen = false;

    function draw(panel) {
        if (!panel || !dashSeen) return;
        // Two frames so the bars animate from zero
        requestAnimationFrame(function () {
            requestAnimationFrame(function () { panel.classList.add('is-drawn'); });
        });
    }

    function selectTab(tab, focus) {
        tabs.forEach(function (t) {
            var on = t === tab;
            t.setAttribute('aria-selected', on ? 'true' : 'false');
            t.tabIndex = on ? 0 : -1;
            var panel = document.getElementById(t.getAttribute('aria-controls'));
            if (panel) panel.hidden = !on;
            if (on) draw(panel);
        });
        if (focus) tab.focus();
    }

    tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () { selectTab(tab); });
        tab.addEventListener('keydown', function (e) {
            var next = null;
            if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
            if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
            if (e.key === 'Home') next = tabs[0];
            if (e.key === 'End') next = tabs[tabs.length - 1];
            if (next) { e.preventDefault(); selectTab(next, true); }
        });
    });

    // "Results" buttons on project cards open the matching tab
    document.querySelectorAll('[data-tab]').forEach(function (link) {
        link.addEventListener('click', function () {
            var tab = document.getElementById('tab-' + link.getAttribute('data-tab'));
            if (tab) selectTab(tab);
        });
    });

    // Animate the bars the first time the dashboard scrolls into view
    if (dash && tabs.length) {
        var reveal = function () {
            dashSeen = true;
            var current = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0];
            if (current) draw(document.getElementById(current.getAttribute('aria-controls')));
        };
        if ('IntersectionObserver' in window) {
            var dashObs = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) { reveal(); dashObs.disconnect(); }
            }, { threshold: 0.15 });
            dashObs.observe(dash);
        } else {
            reveal();
        }
    }

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

    /* ---------- Personality layer ---------- */
    // Scroll progress line at the very top of the page
    var bar = document.createElement('div');
    bar.className = 'progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var ticking = false;
    function updateProgress() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.setProperty('--p', max > 0 ? Math.min(1, window.scrollY / max) : 0);
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); }
    }, { passive: true });
    updateProgress();

    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Hero: "build the dashboard / model / tool" swaps one word at a time
    var rot = document.querySelector('.rotator[data-words]');
    if (rot && !calm) {
        var words = rot.getAttribute('data-words').split(','), wi = 0;
        setInterval(function () {
            rot.classList.add('is-out');
            setTimeout(function () {
                wi = (wi + 1) % words.length;
                rot.textContent = words[wi];
                rot.classList.remove('is-out');
            }, 260);
        }, 2600);
    }

    // Section content fades up as it scrolls into view (skipped for reduced motion)
    if (!calm && 'IntersectionObserver' in window) {
        var items = document.querySelectorAll('.section .section-head, .project, .post, .timeline > li, .skill-column, .finding, .cs-body .section > .container');
        document.documentElement.classList.add('js');
        var revealObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                revealObs.unobserve(entry.target);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        items.forEach(function (el) {
            // Anything already on screen at load shows straight away
            if (el.getBoundingClientRect().top < window.innerHeight) return;
            el.classList.add('reveal');
            revealObs.observe(el);
        });
    }

    // Console easter egg for the curious recruiter who opens dev tools
    try {
        console.log('%c hi, curious one ♡ ', 'background:#B4386A;color:#fff;font:600 14px sans-serif;padding:4px 8px;border-radius:6px');
        console.log('Hiring? syedahafsa135@gmail.com');
    } catch (e) {}
})();
