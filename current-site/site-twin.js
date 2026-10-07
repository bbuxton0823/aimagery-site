(() => {
  const isAec = () => location.pathname === '/aec' || location.pathname === '/aec/';

  function addNavLink() {
    const nav = document.querySelector('header nav');
    if (!nav || nav.querySelector('a[href="#site-twin"]')) return;
    const includes = nav.querySelector('a[href="#includes"]');
    const link = document.createElement('a');
    link.href = '#site-twin';
    link.className = includes?.className || 'text-slate-200 transition hover:text-white';
    link.textContent = 'Site Twin';
    nav.insertBefore(link, includes || null);
  }

  function addIncludesTile() {
    const includes = document.querySelector('#includes');
    const grid = includes?.querySelector('.grid');
    if (!grid || grid.querySelector('[data-site-twin-tile]')) return;
    const link = document.createElement('a');
    link.href = '#site-twin';
    link.dataset.siteTwinTile = 'true';
    link.className = 'rounded-lg border border-commercial-teal/50 bg-slate-900/60 p-4 text-sm text-slate-200 sm:col-span-2';
    link.textContent = 'Site Twin client viewer, early access: your scan and model side by side in one private link';
    grid.append(link);
  }

  function addSchematicPlan() {
    if (document.querySelector('[data-schematic-plan]')) return;
    const section = [...document.querySelectorAll('section')].find((candidate) =>
      candidate.querySelector('h2')?.textContent?.includes('Production-Ready Floor Plans')
    );
    const shell = section?.querySelector('.section-shell');
    if (!shell) return;
    const card = document.createElement('article');
    card.dataset.schematicPlan = 'true';
    card.className = 'stw-plan-card';
    card.innerHTML = `
      <div class="stw-plan-copy">
        <p class="stw-plan-eyebrow">Floor plan sample</p>
        <h3>Sample Schematic 2D Floor Plan</h3>
        <p>A clear, dimensioned plan generated from the property scan, showing room names, openings, fixtures, and the overall layout for everyday project reference.</p>
      </div>
      <div class="stw-plan-image">
        <img src="/images/aec/schematic-floor-plan-sample.webp" alt="Sample schematic 2D floor plan with labeled rooms and dimensions" width="640" height="820" loading="lazy" decoding="async" fetchpriority="low">
      </div>`;
    shell.append(card);
  }

  function sectionMarkup() {
    return `
      <section id="site-twin" class="stw" aria-labelledby="stw-title" data-site-twin>
        <div class="stw-shell">
          <header class="stw-head">
            <p class="stw-eyebrow">Site Twin · Early access prototype</p>
            <h2 id="stw-title" class="stw-title">Your building and its model, from the same spot</h2>
            <div class="stw-rule" aria-hidden="true"></div>
            <p class="stw-lede">Site Twin brings a Matterport tour and the model drafted from it into linked browser views. Walk, turn, or zoom in one pane and the other follows, giving owners, contractors, architects, and engineers a practical way to review the model against visible site conditions.</p>
          </header>

          <figure class="stw-media">
            <video class="stw-video" controls muted loop playsinline preload="none" poster="/images/aec/site-twin/site-twin-anonymous-poster.webp?v=20261007-5">
              <source src="/images/aec/site-twin/site-twin-anonymous.mp4" type="video/mp4">
              Your browser does not support embedded video.
            </video>
            <figcaption class="stw-legend">
              <span><strong>Left:</strong> Matterport scan</span>
              <span><strong>Right:</strong> model drafted from the scan</span>
              <span><strong>Linked:</strong> position, direction, and zoom</span>
            </figcaption>
          </figure>

          <div class="stw-grid">
            <p class="stw-point"><strong>Review matching viewpoints.</strong>Inspect a building detail in the scan, then see the corresponding model geometry from the same position and direction.</p>
            <p class="stw-point"><strong>Preserve concealed conditions.</strong>Capture framing, plumbing, electrical, HVAC, and blocking before drywall, then revisit those locations later.</p>
            <p class="stw-point"><strong>Compare construction milestones.</strong>Organize existing-conditions, pre-drywall, and final captures as one documented project history.</p>
            <p class="stw-point"><strong>Keep people in the review loop.</strong>Use measurements and overlays as review aids, while verifying critical dimensions and construction conditions on site.</p>
          </div>

          <ul class="stw-audience" aria-label="Who Site Twin helps">
            <li><strong>General contractors:</strong> retain a visual record of what is behind finished walls.</li>
            <li><strong>Owners and facility teams:</strong> receive one browser-based reference for scans, models, and project stages.</li>
            <li><strong>Architects and engineers:</strong> review modeled geometry against the captured building before continuing design work.</li>
          </ul>

          <div class="stw-actions">
            <p class="stw-note">Site Twin is an early-access prototype available with qualifying scan-to-BIM projects.</p>
            <a class="stw-btn stw-btn--secondary" href="https://my.matterport.com/show/?m=pDFxjSfvf7F" target="_blank" rel="noopener noreferrer">Explore the Matterport scan</a>
            <a class="stw-btn" href="#quote">Ask for Site Twin in your quote</a>
          </div>
        </div>
      </section>`;
  }

  function install() {
    if (!isAec()) return;
    addNavLink();
    addIncludesTile();
    addSchematicPlan();
    if (document.querySelector('[data-site-twin]')) return;
    const comparisons = document.querySelector('#comparisons');
    if (!comparisons) return;
    comparisons.insertAdjacentHTML('afterend', sectionMarkup());
    if (location.hash === '#site-twin') {
      requestAnimationFrame(() => document.querySelector('#site-twin')?.scrollIntoView());
    }
  }

  let timer;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(install, 1200);
  };

  addEventListener('load', schedule, { once: true });
  addEventListener('popstate', schedule);
  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
