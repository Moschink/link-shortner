
  /* Hamburger */
  document.getElementById('hamburgerBtn').addEventListener('click', () => {
    document.getElementById('mobNav').classList.toggle('open');
  });

  /* Shortener */
  const linkInput = document.getElementById('linkInput');
  const errTxt    = document.getElementById('errTxt');
  const shortenBtn= document.getElementById('shortenBtn');
  const results   = document.getElementById('results');
  const hosts = ['rel.ink','shor.ty','lnk.do','bit.sh'];
  let n = 0;

  function isUrl(s) { try { return Boolean(new URL(s)); } catch { return false; } }

  function genShort() {
    const h = hosts[n % hosts.length];
    const c = Math.random().toString(36).slice(2,8);
    return `https://${h}/${c}`;
  }

  function shorten() {
    const val = linkInput.value.trim();
    if (!val || !isUrl(val)) {
      linkInput.classList.add('error');
      errTxt.textContent = val ? 'Please enter a valid URL' : 'Please add a link';
      errTxt.classList.add('show');
      return;
    }
    linkInput.classList.remove('error');
    errTxt.classList.remove('show');
    const short = genShort(); n++;

    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <span class="res-original" title="${val}">${val}</span>
      <div class="res-right">
        <a class="res-short" href="${short}" target="_blank" rel="noopener">${short}</a>
        <button class="btn-copy" data-url="${short}">Copy</button>
      </div>`;
    card.querySelector('.btn-copy').addEventListener('click', function() {
      navigator.clipboard.writeText(this.dataset.url).catch(()=>{});
      document.querySelectorAll('.btn-copy').forEach(b => { b.textContent='Copy'; b.classList.remove('copied'); });
      this.textContent = 'Copied!';
      this.classList.add('copied');
    });
    results.prepend(card);
    linkInput.value = '';
  }

  shortenBtn.addEventListener('click', shorten);
  linkInput.addEventListener('keydown', e => { if (e.key==='Enter') shorten(); });
  linkInput.addEventListener('input', () => {
    linkInput.classList.remove('error');
    errTxt.classList.remove('show');
  });