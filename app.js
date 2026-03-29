// ── DATA ──────────────────────────────────────────────────────────────
const PHASES = [
  { id: 1, topics: ['t1-1','t1-2','t1-3','t1-4','t1-5','t1-6'], milestones: ['m1-1','m1-2','m1-3','m1-4'] },
  { id: 2, topics: ['t2-1','t2-2','t2-3','t2-4','t2-5','t2-6'], milestones: ['m2-1','m2-2','m2-3','m2-4'] },
  { id: 3, topics: ['t3-1','t3-2','t3-3','t3-4','t3-5','t3-6'], milestones: ['m3-1','m3-2','m3-3','m3-4'] },
  { id: 4, topics: ['t4-1','t4-2','t4-3','t4-4','t4-5','t4-6'], milestones: ['m4-1','m4-2','m4-3','m4-4'] },
  { id: 5, topics: ['t5-1','t5-2','t5-3','t5-4','t5-5','t5-6'], milestones: ['m5-1','m5-2','m5-3','m5-4'] },
  { id: 6, topics: ['t6-1','t6-2','t6-3','t6-4','t6-5','t6-6'], milestones: ['m6-1','m6-2','m6-3','m6-4'] },
];

const SECTION_FILES = PHASES.map((phase) => `sections/phase-${phase.id}.html`);

// ── STORAGE ──────────────────────────────────────────────────────────
const STORAGE_KEY = 'ai_pathway_v1';

async function loadPhaseSections() {
  const mainEl = document.getElementById('phases-root');
  if (!mainEl) return;

  const sections = await Promise.all(
    SECTION_FILES.map(async (path) => {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load ${path}: ${response.status}`);
      }
      return response.text();
    })
  );

  mainEl.innerHTML = sections.join('\n\n');
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const data = JSON.parse(saved);
    PHASES.forEach(phase => {
      // Topics
      phase.topics.forEach(id => {
        const cb = document.getElementById(id);
        if (cb && data[id]) cb.checked = true;
      });
      // Milestones
      phase.milestones.forEach(id => {
        const cb = document.getElementById(id);
        if (cb && data[id]) cb.checked = true;
      });
      // Project completion
      if (data['proj_built_' + phase.id]) applyProjectBuilt(phase.id, true);
      // Collapsed state
      if (data['collapsed_' + phase.id]) {
        const card = document.getElementById('phase-' + phase.id);
        if (card) card.classList.add('collapsed');
      }
    });
  } catch (error) {
    console.error('Failed loading progress:', error);
  }
}

function saveProgress() {
  const data = {};
  PHASES.forEach(phase => {
    phase.topics.forEach(id => {
      const cb = document.getElementById(id);
      if (cb) data[id] = cb.checked;
    });
    phase.milestones.forEach(id => {
      const cb = document.getElementById(id);
      if (cb) data[id] = cb.checked;
    });
    const projCard = document.getElementById('proj-card-' + phase.id);
    data['proj_built_' + phase.id] = projCard ? projCard.classList.contains('proj-built') : false;
    const card = document.getElementById('phase-' + phase.id);
    if (card) data['collapsed_' + phase.id] = card.classList.contains('collapsed');
  });
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (error) { console.error(error); }
  updateAllProgress();
}

function resetAll() {
  if (!confirm('Reset all progress? This cannot be undone.')) return;
  try { localStorage.removeItem(STORAGE_KEY); } catch (error) { console.error(error); }
  PHASES.forEach(phase => {
    phase.topics.forEach(id => {
      const cb = document.getElementById(id);
      if (cb) cb.checked = false;
    });
    phase.milestones.forEach(id => {
      const cb = document.getElementById(id);
      if (cb) cb.checked = false;
    });
    applyProjectBuilt(phase.id, false);
  });
  updateAllProgress();
}

// ── PROJECT COMPLETION ────────────────────────────────────────────────
function applyProjectBuilt(phaseId, isBuilt) {
  const card = document.getElementById('proj-card-' + phaseId);
  const btn  = document.getElementById('proj-btn-' + phaseId);
  if (!card || !btn) return;
  if (isBuilt) {
    card.classList.add('proj-built');
    btn.textContent = '✓ Built';
  } else {
    card.classList.remove('proj-built');
    btn.textContent = 'Mark Built';
  }
}

function toggleProject(phaseId) {
  const card = document.getElementById('proj-card-' + phaseId);
  if (!card) return;
  const nowBuilt = !card.classList.contains('proj-built');
  applyProjectBuilt(phaseId, nowBuilt);
  saveProgress();
}

// ── PROGRESS ─────────────────────────────────────────────────────────
function updateAllProgress() {
  let totalDone = 0, totalTopics = 0, phasesComplete = 0;

  PHASES.forEach(phase => {
    const checked = phase.topics.filter(id => {
      const cb = document.getElementById(id);
      return cb && cb.checked;
    }).length;
    const total = phase.topics.length;
    const pct = total ? Math.round((checked / total) * 100) : 0;

    totalDone += checked;
    totalTopics += total;
    if (pct === 100) phasesComplete++;

    // Phase ring (dasharray = 128.8 for r=20.5)
    const ringEl = document.getElementById('ring-' + phase.id);
    if (ringEl) {
      const offset = 128.8 - (128.8 * pct / 100);
      ringEl.style.strokeDashoffset = offset;
    }
    const pctEl = document.getElementById('pct-' + phase.id);
    if (pctEl) pctEl.textContent = pct + '%';

    // Sidebar bar
    const navBar = document.getElementById('nav-bar-' + phase.id);
    if (navBar) navBar.style.width = pct + '%';
    const navPct = document.getElementById('nav-pct-' + phase.id);
    if (navPct) navPct.textContent = pct + '%';
  });

  // Overall ring (dasharray = 131.95 for r=21)
  const overallPct = totalTopics ? Math.round((totalDone / totalTopics) * 100) : 0;
  const overallRing = document.getElementById('overall-ring');
  if (overallRing) {
    overallRing.style.strokeDashoffset = 131.95 - (131.95 * overallPct / 100);
  }
  const overallPctEl = document.getElementById('overall-pct');
  if (overallPctEl) overallPctEl.textContent = overallPct + '%';

  // Header stats
  const doneEl = document.getElementById('total-done');
  if (doneEl) doneEl.textContent = totalDone;
  const topicsEl = document.getElementById('total-topics');
  if (topicsEl) topicsEl.textContent = totalTopics;
  const phasesDoneEl = document.getElementById('phases-done');
  if (phasesDoneEl) phasesDoneEl.textContent = phasesComplete + '/6';
}

// ── TOGGLE ───────────────────────────────────────────────────────────
function togglePhase(headerEl) {
  const card = headerEl.closest('.phase-card');
  card.classList.toggle('collapsed');
  const isExpanded = !card.classList.contains('collapsed');
  headerEl.setAttribute('aria-expanded', isExpanded);
  saveProgress();
}

function handleHeaderKey(event, headerEl) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    togglePhase(headerEl);
  }
}

// ── SCROLL NAV ───────────────────────────────────────────────────────
function scrollToPhase(event, phaseId) {
  event.preventDefault();
  const target = document.getElementById(phaseId);
  const mainEl = document.querySelector('main');
  if (!target || !mainEl) return;

  // Set active immediately on click for instant feedback
  setActiveNavItem(phaseId);

  const targetTop = target.offsetTop - 20; // 20px breathing room
  mainEl.scrollTo({ top: targetTop, behavior: 'smooth' });
}

function setActiveNavItem(phaseId) {
  document.querySelectorAll('.phase-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.target === phaseId);
  });
}

// ── INTERSECTION OBSERVER (highlight nav on scroll) ──────────────────
function initScrollSpy() {
  const mainEl = document.querySelector('main');
  if (!mainEl) return;

  const observer = new IntersectionObserver(
    (entries) => {
      // Find the topmost visible phase card
      let topEntry = null;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!topEntry || entry.boundingClientRect.top < topEntry.boundingClientRect.top) {
            topEntry = entry;
          }
        }
      });
      if (topEntry) {
        setActiveNavItem(topEntry.target.id);
      }
    },
    {
      root: mainEl,
      rootMargin: '-10% 0px -60% 0px', // trigger when card is in the upper portion
      threshold: 0,
    }
  );

  PHASES.forEach(phase => {
    const card = document.getElementById('phase-' + phase.id);
    if (card) observer.observe(card);
  });
}

// ── INIT ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadPhaseSections();
  } catch (error) {
    console.error(error);
    const mainEl = document.getElementById('phases-root');
    if (mainEl) {
      mainEl.innerHTML = '<p style="color:#ff4d6a">Failed to load study phases. Run this project from a local server and refresh.</p>';
    }
    return;
  }

  loadProgress();
  updateAllProgress();

  // Sync aria-expanded with collapsed state after loading saved state
  PHASES.forEach(phase => {
    const card = document.getElementById('phase-' + phase.id);
    if (card) {
      const header = card.querySelector('.phase-header');
      if (header) {
        header.setAttribute('aria-expanded', !card.classList.contains('collapsed'));
      }
    }
  });

  // Set first nav item active by default, then start scroll spy
  setActiveNavItem('phase-1');
  initScrollSpy();
});
