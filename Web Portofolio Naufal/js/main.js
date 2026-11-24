/**
 * Main Portfolio Controller
 * Mengontrol interaktivitas, rendering dinamis, modal, terminal emulator, audio synthesizer,
 * filter proyek, tabs skill, dan formulir kontak.
 */

document.addEventListener('DOMContentLoaded', () => {
  const DATA = window.PORTFOLIO_DATA;
  if (!DATA) {
    console.error("Portfolio data not found.");
    return;
  }

  // ------------------------------------------------------------------------
  // SOUND SYNTHESIZER (Web Audio API - Zero External Dependencies)
  // ------------------------------------------------------------------------
  let audioCtx = null;
  let soundEnabled = localStorage.getItem('soundEnabled') === 'true';

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playUiSound(freq = 600, type = 'sine', duration = 0.06) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio might be blocked until user interacts
    }
  }

  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (soundToggleBtn) {
    updateSoundBtnState();
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem('soundEnabled', soundEnabled);
      updateSoundBtnState();
      if (soundEnabled) {
        initAudio();
        playUiSound(800, 'sine', 0.1);
        showToast("🔊 Efek Suara Diaktifkan!");
      } else {
        showToast("🔇 Efek Suara Dinonaktifkan.");
      }
    });
  }

  function updateSoundBtnState() {
    if (!soundToggleBtn) return;
    soundToggleBtn.innerHTML = soundEnabled
      ? '<span title="Suara Aktif">🔊</span>'
      : '<span title="Suara Mati">🔇</span>';
  }

  // ------------------------------------------------------------------------
  // THEME SWITCHER
  // ------------------------------------------------------------------------
  const savedTheme = localStorage.getItem('siteTheme') || 'violet';
  document.body.setAttribute('data-theme', savedTheme);

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeDropdown = document.getElementById('theme-dropdown');

  if (themeToggleBtn && themeDropdown) {
    themeToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeDropdown.classList.toggle('show');
      playUiSound(700);
    });

    document.querySelectorAll('.theme-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = btn.getAttribute('data-set-theme');
        document.body.setAttribute('data-theme', selected);
        localStorage.setItem('siteTheme', selected);
        themeDropdown.classList.remove('show');
        playUiSound(900, 'sine', 0.08);
        showToast(`Tema diganti ke: ${btn.textContent.trim()}`);
      });
    });

    document.addEventListener('click', () => {
      themeDropdown.classList.remove('show');
    });
  }

  // ------------------------------------------------------------------------
  // TYPEWRITER EFFECT (Hero Section)
  // ------------------------------------------------------------------------
  const typewriterTarget = document.getElementById('typewriter-text');
  const wordsToType = [
    "Fullstack Web Developer",
    "Modern UI/UX Engineer",
    "API & Cloud Architect",
    "Creative Problem Solver"
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeEffect() {
    if (!typewriterTarget) return;

    const currentWord = wordsToType[wordIndex];

    if (isDeleting) {
      typewriterTarget.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 45;
    } else {
      typewriterTarget.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 105;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 1800; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % wordsToType.length;
      typeSpeed = 400; // Pause before new word
    }

    setTimeout(typeEffect, typeSpeed);
  }
  typeEffect();

  // ------------------------------------------------------------------------
  // STATS COUNTER ANIMATION
  // ------------------------------------------------------------------------
  const statsContainer = document.getElementById('stats-row');
  if (statsContainer && DATA.profile.stats) {
    statsContainer.innerHTML = DATA.profile.stats.map(s => `
      <div class="stat-item">
        <div class="stat-number" data-target="${s.value}">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>
    `).join('');
  }

  // ------------------------------------------------------------------------
  // SKILLS MATRIX RENDERER & TABS
  // ------------------------------------------------------------------------
  const skillsContainer = document.getElementById('skills-container');
  const skillTabs = document.querySelectorAll('.skills-tabs .tab-btn');

  function renderSkills(category = 'frontend') {
    if (!skillsContainer) return;
    const skillsList = DATA.skills[category] || DATA.skills.frontend;

    skillsContainer.innerHTML = skillsList.map(skill => `
      <div class="skill-card">
        <div class="skill-header">
          <div class="skill-info-left">
            <span class="skill-name">${skill.name}</span>
          </div>
          <span class="skill-percent">${skill.level}%</span>
        </div>
        <div class="skill-bar-bg">
          <div class="skill-bar-fill" style="width: 0%" data-width="${skill.level}%"></div>
        </div>
        <div class="skill-subtext">${skill.desc}</div>
      </div>
    `).join('');

    // Trigger bar fill animation
    setTimeout(() => {
      document.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.getAttribute('data-width');
      });
    }, 50);
  }

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-category');
      renderSkills(cat);
      playUiSound(750);
    });
  });

  renderSkills('frontend');

  // ------------------------------------------------------------------------
  // PROJECTS SHOWCASE & FILTER
  // ------------------------------------------------------------------------
  const projectsGrid = document.getElementById('projects-grid');
  const projectFilters = document.querySelectorAll('.project-filters .filter-btn');

  function renderProjects(filter = 'all') {
    if (!projectsGrid) return;
    const list = filter === 'all'
      ? DATA.projects
      : DATA.projects.filter(p => p.categorySlug === filter);

    projectsGrid.innerHTML = list.map(p => `
      <div class="project-card" data-id="${p.id}">
        <div class="project-thumb">
          <img src="${p.image}" alt="${p.title}" loading="lazy">
          <span class="project-badge-cat">${p.category}</span>
        </div>
        <div class="project-content">
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.description}</p>
          <div class="project-tags">
            ${p.tags.slice(0, 4).map(t => `<span class="tag-pill">${t}</span>`).join('')}
          </div>
          <div class="project-actions">
            <button class="btn-detail open-modal-btn" data-id="${p.id}">
              <span>Detail Fitur</span>
              <span>→</span>
            </button>
            <div style="display:flex; gap:0.5rem;">
              <a href="${p.githubUrl}" target="_blank" rel="noopener" class="icon-btn" style="width:32px;height:32px;" title="Source Code">
                &lt;/&gt;
              </a>
              <a href="${p.demoUrl}" target="_blank" rel="noopener" class="icon-btn" style="width:32px;height:32px;" title="Live Preview">
                ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Re-bind modal triggers
    document.querySelectorAll('.open-modal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        openProjectModal(id);
        playUiSound(650);
      });
    });
  }

  projectFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderProjects(filter);
      playUiSound(720);
    });
  });

  renderProjects('all');

  // ------------------------------------------------------------------------
  // PROJECT DETAIL MODAL
  // ------------------------------------------------------------------------
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalThumb = document.getElementById('modal-thumb-img');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalMetrics = document.getElementById('modal-metrics');
  const modalDesc = document.getElementById('modal-desc');
  const modalTags = document.getElementById('modal-tags');
  const modalFeatures = document.getElementById('modal-features');
  const modalLiveBtn = document.getElementById('modal-live-btn');
  const modalGithubBtn = document.getElementById('modal-github-btn');

  function openProjectModal(id) {
    const project = DATA.projects.find(p => p.id === id);
    if (!project || !modalOverlay) return;

    modalThumb.src = project.image;
    modalThumb.alt = project.title;
    modalTitle.textContent = project.title;
    modalCategory.textContent = project.category;
    modalMetrics.textContent = project.metrics;
    modalDesc.textContent = project.longDescription || project.description;

    modalTags.innerHTML = project.tags.map(t => `<span class="tag-pill">${t}</span>`).join('');
    modalFeatures.innerHTML = project.features.map(f => `<li>${f}</li>`).join('');

    modalLiveBtn.href = project.demoUrl;
    modalGithubBtn.href = project.githubUrl;

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = 'auto';
    playUiSound(500);
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // ------------------------------------------------------------------------
  // TIMELINE & EXPERIENCE RENDERER
  // ------------------------------------------------------------------------
  const timelineContainer = document.getElementById('experience-timeline');
  if (timelineContainer && DATA.experience) {
    timelineContainer.innerHTML = DATA.experience.map(exp => `
      <div class="timeline-item">
        <div class="timeline-node"></div>
        <div class="timeline-card">
          <div class="timeline-header">
            <div>
              <div class="timeline-role">${exp.role}</div>
              <div class="timeline-company">${exp.company} • ${exp.type}</div>
            </div>
            <div class="timeline-period">${exp.period}</div>
          </div>
          <div class="timeline-desc">${exp.description}</div>
          <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
            ${exp.skills.map(s => `<span class="tag-pill">${s}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  // ------------------------------------------------------------------------
  // TESTIMONIALS RENDERER
  // ------------------------------------------------------------------------
  const testimonialsContainer = document.getElementById('testimonials-grid');
  if (testimonialsContainer && DATA.testimonials) {
    testimonialsContainer.innerHTML = DATA.testimonials.map(t => `
      <div class="testimonial-card">
        <div>
          <div class="testimonial-stars">★★★★★</div>
          <p class="testimonial-quote">"${t.quote}"</p>
        </div>
        <div class="testimonial-author">
          <img src="${t.avatar}" alt="${t.name}" class="author-avatar">
          <div>
            <div class="author-name">${t.name}</div>
            <div class="author-title">${t.title}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ------------------------------------------------------------------------
  // FAQ ACCORDION
  // ------------------------------------------------------------------------
  const faqContainer = document.getElementById('faq-accordion');
  if (faqContainer && DATA.faqs) {
    faqContainer.innerHTML = DATA.faqs.map((f, i) => `
      <div class="faq-item ${i === 0 ? 'active' : ''}">
        <button class="faq-question-btn">
          <span>${f.q}</span>
          <span class="faq-arrow">▼</span>
        </button>
        <div class="faq-answer">
          <p>${f.a}</p>
        </div>
      </div>
    `).join('');

    faqContainer.querySelectorAll('.faq-question-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        item.classList.toggle('active');
        playUiSound(600);
      });
    });
  }

  // ------------------------------------------------------------------------
  // INTERACTIVE TERMINAL EMULATOR
  // ------------------------------------------------------------------------
  const termBody = document.getElementById('terminal-body');
  const termInput = document.getElementById('terminal-input');
  const termPills = document.querySelectorAll('.term-pill');

  const COMMANDS = {
    help: () => `
      <div style="color: #67e8f9;">Perintah yang tersedia:</div>
      <div>  <b style="color: #fcd34d;">whoami</b>   - Informasi profil singkat Naufal</div>
      <div>  <b style="color: #fcd34d;">skills</b>   - Daftar keahlian teknis utama</div>
      <div>  <b style="color: #fcd34d;">projects</b> - Daftar featured projects</div>
      <div>  <b style="color: #fcd34d;">music</b>    - Status pemutar musik CyberPulse</div>
      <div>  <b style="color: #fcd34d;">play</b>     - Putar musik santai / lofi</div>
      <div>  <b style="color: #fcd34d;">pause</b>    - Jeda pemutaran musik</div>
      <div>  <b style="color: #fcd34d;">contact</b>  - Channel kontak & sosial media</div>
      <div>  <b style="color: #fcd34d;">theme</b>    - Ubah tema: theme violet | emerald | blue | amber | rose</div>
      <div>  <b style="color: #fcd34d;">matrix</b>   - Mode rahasia Matrix animation</div>
      <div>  <b style="color: #fcd34d;">clear</b>    - Bersihkan layar terminal</div>
    `,
    whoami: () => `
      <div>Halo! Saya <b style="color:#a5b4fc;">${DATA.profile.name}</b> (${DATA.profile.title}).</div>
      <div style="color:#94a3b8;">${DATA.profile.bio}</div>
      <div style="color:#34d399; margin-top:4px;">📍 Lokasi: ${DATA.profile.location} | Status: ${DATA.profile.status}</div>
    `,
    skills: () => `
      <div><b style="color:#38bdf8;">[Frontend]</b> React, Next.js, TypeScript, Tailwind CSS, Vue.js</div>
      <div><b style="color:#818cf8;">[Backend]</b>  Node.js, Express, PostgreSQL, Prisma, MongoDB, REST/GraphQL</div>
      <div><b style="color:#34d399;">[Tools]</b>    Docker, Git/GitHub, Cloud (Vercel/AWS), Linux, Figma</div>
    `,
    projects: () => `
      <div>Berikut beberapa proyek unggulan:</div>
      ${DATA.projects.slice(0, 4).map(p => `<div>⚡ <b>${p.title}</b> - <i>${p.category}</i> (${p.tags.slice(0, 3).join(', ')})</div>`).join('')}
      <div style="color:#94a3b8; margin-top:4px;">Ketik 'contact' jika berminat bekerja sama!</div>
    `,
    music: () => {
      if (window.CYBER_PLAYER) {
        const cur = window.CYBER_PLAYER.getCurrentTrack();
        const status = window.CYBER_PLAYER.isPlaying ? "▶ Sedang Memutar" : "⏸ Jeda";
        return `<div>🎵 <b>CyberPulse Player:</b> ${status} - <i>${cur.title}</i> oleh ${cur.artist} (${cur.genre})</div><div>Ketik <b>play</b> atau <b>pause</b> untuk mengontrol musik.</div>`;
      }
      return `<div>CyberPulse Player siap dimainkan.</div>`;
    },
    play: () => {
      if (window.CYBER_PLAYER) {
        window.CYBER_PLAYER.playTrack();
        const cur = window.CYBER_PLAYER.getCurrentTrack();
        return `<div style="color:#34d399;">▶ Memutar musik: <b>${cur.title}</b> - ${cur.artist}</div>`;
      }
      return `<div>Player tidak ditemukan.</div>`;
    },
    pause: () => {
      if (window.CYBER_PLAYER) {
        window.CYBER_PLAYER.pauseTrack();
        return `<div style="color:#f59e0b;">⏸ Musik dijeda.</div>`;
      }
      return `<div>Player tidak ditemukan.</div>`;
    },
    contact: () => `
      <div>Email: <a href="mailto:${DATA.profile.email}" style="color:#38bdf8;">${DATA.profile.email}</a></div>
      <div>WhatsApp: <a href="https://wa.me/${DATA.profile.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" style="color:#34d399;">${DATA.profile.whatsapp}</a></div>
      <div>GitHub: <a href="${DATA.profile.github}" target="_blank" style="color:#a5b4fc;">${DATA.profile.github}</a></div>
      <div>LinkedIn: <a href="${DATA.profile.linkedin}" target="_blank" style="color:#60a5fa;">${DATA.profile.linkedin}</a></div>
    `,
    clear: () => {
      if (termBody) termBody.innerHTML = '';
      return '';
    },
    matrix: () => {
      document.body.setAttribute('data-theme', 'emerald');
      return `<div style="color:#10b981; font-family:monospace;">Wake up, Neo... The Matrix has you. 🟢 (Emerald theme activated)</div>`;
    },
    sudo: () => {
      return `<div style="color:#ef4444;">Permission denied: Anda tidak memiliki akses root untuk mengacak-acak server ini 😉</div>`;
    }
  };

  function executeCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    const parts = cmd.split(' ');
    const mainCmd = parts[0];
    const arg = parts[1];

    // Append user input line
    const userLine = document.createElement('div');
    userLine.className = 'term-output-line';
    userLine.innerHTML = `<span class="term-prompt">naufal@dev:~$</span> <span class="term-command">${cmdRaw}</span>`;
    termBody.appendChild(userLine);

    // Process output
    let outputHtml = '';
    if (mainCmd === 'theme' && arg) {
      const valid = ['violet', 'emerald', 'blue', 'amber', 'rose'];
      if (valid.includes(arg)) {
        document.body.setAttribute('data-theme', arg);
        localStorage.setItem('siteTheme', arg);
        outputHtml = `<div style="color:#34d399;">Tema berhasil diubah menjadi: <b>${arg}</b></div>`;
      } else {
        outputHtml = `<div style="color:#ef4444;">Pilihan tema tidak valid. Coba: violet, emerald, blue, amber, rose</div>`;
      }
    } else if (COMMANDS[mainCmd]) {
      outputHtml = COMMANDS[mainCmd]();
    } else {
      outputHtml = `<div style="color:#ef4444;">Command not recognized: '${cmdRaw}'. Ketik <b>help</b> untuk melihat perintah.</div>`;
    }

    if (outputHtml && mainCmd !== 'clear') {
      const respLine = document.createElement('div');
      respLine.className = 'term-output-line';
      respLine.innerHTML = outputHtml;
      termBody.appendChild(respLine);
    }

    termBody.scrollTop = termBody.scrollHeight;
    playUiSound(850, 'triangle', 0.05);
  }

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeCommand(termInput.value);
        termInput.value = '';
      }
    });
  }

  termPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cmd = pill.getAttribute('data-cmd');
      if (cmd && termInput) {
        termInput.value = cmd;
        executeCommand(cmd);
        termInput.value = '';
      }
    });
  });

  // ------------------------------------------------------------------------
  // CONTACT FORM & WHATSAPP REDIRECT
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast("⚠️ Mohon lengkapi semua kolom formulir.");
        return;
      }

      playUiSound(1000, 'sine', 0.12);
      showToast("🚀 Terima kasih! Pesan Anda berhasil dikirim.");
      contactForm.reset();

      // Submit to backend API asynchronously
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message })
      }).catch(() => {
        // Fallback / offline mode
      });
    });
  }

  // Copy email pill
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = DATA.profile.email;
      navigator.clipboard.writeText(email).then(() => {
        playUiSound(800);
        showToast(`📋 Email disalin: ${email}`);
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    });
  }

  // WhatsApp quick button
  const waBtn = document.getElementById('wa-quick-btn');
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      const cleanWa = DATA.profile.whatsapp.replace(/[^0-9]/g, '');
      const text = encodeURIComponent(`Halo Naufal, saya tertarik untuk mendiskusikan proyek web.`);
      window.open(`https://wa.me/${cleanWa}?text=${text}`, '_blank');
    });
  }

  // ------------------------------------------------------------------------
  // NAVBAR SCROLL & MOBILE MENU
  // ------------------------------------------------------------------------
  const navbar = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      playUiSound(600);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // ------------------------------------------------------------------------
  // LIVE JAKARTA / WIB CLOCK TICKER
  // ------------------------------------------------------------------------
  const liveClock = document.getElementById('live-clock');
  function updateClock() {
    if (!liveClock) return;
    const now = new Date();
    // Jakarta is UTC+7
    const options = {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    liveClock.textContent = `${now.toLocaleTimeString('id-ID', options)} WIB`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ------------------------------------------------------------------------
  // TOAST NOTIFICATION HELPER
  // ------------------------------------------------------------------------
  function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  window.showToast = showToast;
});
