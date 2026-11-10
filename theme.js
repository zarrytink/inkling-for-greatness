(() => {
  const button = document.querySelector('.theme-toggle');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;

  try {
    const saved = localStorage.getItem('inkling-theme');
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch (_) {
    // The toggle still works for this page when storage is unavailable.
  }

  function update() {
    if (preference) document.documentElement.dataset.theme = preference;
    else delete document.documentElement.dataset.theme;
    const dark = preference ? preference === 'dark' : systemTheme.matches;
    button.textContent = dark ? 'Light mode' : 'Dark mode';
    button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  button.addEventListener('click', () => {
    const dark = preference ? preference === 'dark' : systemTheme.matches;
    preference = dark ? 'light' : 'dark';
    try { localStorage.setItem('inkling-theme', preference); } catch (_) {}
    update();
  });
  systemTheme.addEventListener('change', update);
  update();
})();
