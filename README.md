# Syeda Hafsa | Portfolio

Live site: https://syedahafsa135.github.io

Data analytics, machine learning and software projects with measured results. Plain HTML, CSS and JavaScript, hosted on GitHub Pages. No build step.

## Preview locally

Double-click `index.html` to open it in your browser. (If Python is installed, `python -m http.server 8000` and http://localhost:8000 also tests the 404 page.)

## Structure

- `index.html`: home page (about, results dashboard, projects with lane filters, experience and education, writing, skills, contact)
- `projects/`: case-study pages (`loan-default.html`, `hotel-bookings.html`, `p2p-lending.html`, `sales-prediction.html`, `car-price-prediction.html`)
- `404.html`: page GitHub Pages shows for missing URLs
- `assets/css/style.css`: styles, light and dark themes
- `assets/js/main.js`: theme toggle, project filters, nav highlighting, results-dashboard charts, copy-email button
- `assets/images/`: figures per project, `og-card.png` (link preview), `profile.jpg` (add your photo)
- `assets/Syeda_Hafsa_CV.pdf`: CV for the download button (copied from `../cv_output/`)

When you change `style.css` or `main.js`, bump the `?v=` number on every page so visitors get the new files.

Every number on the site comes from a project report, notebook or saved model. If you ever need a placeholder, wrap it in `<span class="confirm">[CONFIRM: ...]</span>` (it shows in yellow) and search for that text before publishing.
