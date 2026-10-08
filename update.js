// "New version available" pill for the home-screen app (iOS standalone mode has no reload button).
// The deploy stamps each page's <meta name="build"> and writes version.json with the same commit hash.
// When they differ, show a pill; tapping it reloads with ?v=<hash> to bypass GitHub Pages' 10-minute HTML cache.
(function () {
  const meta = document.querySelector('meta[name="build"]'), current = meta && meta.content;
  if (!current || current.startsWith('__')) return; // local dev: not stamped
  const url = new URL('version.json', document.currentScript.src).href;
  let pill = null;

  function show(latest) {
    if (pill) return;
    pill = document.createElement('button');
    pill.type = 'button';
    pill.textContent = '✨ New version · tap to update';
    pill.style.cssText = 'position:fixed;left:50%;bottom:max(16px,env(safe-area-inset-bottom));transform:translateX(-50%);' +
      'z-index:1000;border:0;border-radius:999px;padding:12px 20px;background:#fff8e7;color:#1d3557;' +
      'font:700 16px ui-rounded,"SF Pro Rounded",system-ui,-apple-system,sans-serif;' +
      'box-shadow:0 6px 20px rgba(0,0,0,.35);cursor:pointer;';
    pill.onclick = () => {
      const u = new URL(location.href); u.searchParams.set('v', latest); location.replace(u.href);
    };
    // Games can hide it mid-round by toggling body.playing; it reappears on their menu.
    const st = document.createElement('style');
    st.textContent = 'body.playing .update-pill{display:none}';
    pill.className = 'update-pill';
    document.head.appendChild(st); document.body.appendChild(pill);
  }
  async function check() {
    try {
      const r = await fetch(url, { cache: 'no-store' });
      const { v } = await r.json();
      if (v && v !== current) show(v);
    } catch (e) {}
  }
  check();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
  setInterval(check, 5 * 60 * 1000);
})();
