/* ─── iFetch Landing Page – Script ─── */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. Theme Toggle ───
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Detect system preference, then check for a manual override in localStorage
  const savedTheme = localStorage.getItem('ifetch-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  html.setAttribute('data-theme', initialTheme);

  // Listen for system theme changes (only applies if user hasn't manually toggled)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('ifetch-theme')) {
      html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('ifetch-theme', next);
    });
  }


  // ─── 2. Terminal Typing Animation ───
  const terminalOutput = document.getElementById('terminalOutput');
  if (terminalOutput) {
    const lines = [
      { text: '$ python ifetch/cli.py Documents/Photos ~/Backups/Photos', delay: 40, class: '' },
      { text: '', delay: 300, class: '' },
      { text: '======================================================================', delay: 8, class: 'dim' },
      { text: 'iCloud Drive Downloader', delay: 15, class: 'dim' },
      { text: 'Remote Path: Documents/Photos', delay: 15, class: 'dim' },
      { text: 'Local Path: /Users/you/Backups/Photos', delay: 15, class: 'dim' },
      { text: 'Parallel Workers: 4', delay: 15, class: 'dim' },
      { text: '======================================================================', delay: 8, class: 'dim' },
      { text: '', delay: 200, class: '' },
      { text: 'Authenticating with iCloud...', delay: 20, class: 'dim' },
      { text: '✓ Authentication successful!', delay: 30, class: 'green' },
      { text: '', delay: 200, class: '' },
      { text: "Downloading from 'Documents/Photos' to '~/Backups/Photos'", delay: 20, class: 'dim' },
      { text: 'This may take some time depending on the size of the content...', delay: 18, class: 'dim' },
      { text: '', delay: 400, class: '' },
      { text: 'Download Summary:', delay: 25, class: '' },
      { text: '- Total files: 247', delay: 20, class: 'cyan' },
      { text: '- Successfully downloaded: 247', delay: 20, class: 'green' },
      { text: '- Failed: 0', delay: 20, class: 'green' },
      { text: '- Total data transferred: 1,842.36 MB', delay: 20, class: 'cyan' },
      { text: '- Changed chunks: 312', delay: 20, class: 'cyan' },
      { text: '', delay: 100, class: '' },
      { text: '✓ Operation completed.', delay: 30, class: 'green' },
    ];

    const colorMap = {
      '': 'color: #a1a1a6;',
      'dim': 'color: #6e6e73;',
      'green': 'color: #32d74b;',
      'cyan': 'color: #64d2ff;',
      'red': 'color: #ff453a;',
      'yellow': 'color: #ffd60a;',
    };

    let lineIdx = 0;
    let charIdx = 0;
    let currentHTML = '';

    function typeNextChar() {
      if (lineIdx >= lines.length) return;

      const line = lines[lineIdx];

      if (charIdx === 0 && line.text === '') {
        // Empty line
        currentHTML += '\n';
        terminalOutput.innerHTML = currentHTML;
        lineIdx++;
        setTimeout(typeNextChar, line.delay);
        return;
      }

      if (charIdx === 0) {
        // Start of a new line: add colored span
        const style = colorMap[line.class] || colorMap[''];
        currentHTML += `<span style="${style}">`;
      }

      if (charIdx < line.text.length) {
        const char = line.text[charIdx];
        currentHTML += char === '<' ? '&lt;' : char === '>' ? '&gt;' : char;
        terminalOutput.innerHTML = currentHTML;
        charIdx++;
        setTimeout(typeNextChar, line.delay);
      } else {
        // End of line
        currentHTML += '</span>\n';
        terminalOutput.innerHTML = currentHTML;
        lineIdx++;
        charIdx = 0;
        setTimeout(typeNextChar, 120);
      }
    }

    // Start after a brief delay
    setTimeout(typeNextChar, 600);
  }


  // ─── 3. Usage Tabs ───
  const tabs = document.querySelectorAll('.usage-tab');
  const panels = document.querySelectorAll('.usage-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(`tab-${target}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });


  // ─── 4. Scroll Reveal ───
  const revealEls = [
    ...document.querySelectorAll('.problem-card'),
    ...document.querySelectorAll('.feature-card'),
    ...document.querySelectorAll('.install-step'),
    ...document.querySelectorAll('.section-title'),
    ...document.querySelectorAll('.section-desc'),
    ...document.querySelectorAll('.usage-layout'),
    ...document.querySelectorAll('.options-table-wrap'),
  ];

  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  revealEls.forEach(el => observer.observe(el));


  // ─── 5. Nav Scroll Effect ───
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    const theme = html.getAttribute('data-theme') || 'dark';
    if (scroll > 50) {
      nav.style.background = theme === 'dark'
        ? 'rgba(0, 0, 0, 0.88)'
        : 'rgba(255, 255, 255, 0.92)';
    } else {
      nav.style.background = theme === 'dark'
        ? 'rgba(0, 0, 0, 0.72)'
        : 'rgba(255, 255, 255, 0.72)';
    }
  }, { passive: true });


  // ─── 6. Smooth Scroll for Anchor Links ───
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
