/* Hamburger */
document.getElementById('hamburgerBtn').addEventListener('click', () => {
  document.getElementById('mobNav').classList.toggle('open');
});

/* Shortener */
const linkInput  = document.getElementById('linkInput');
const errTxt     = document.getElementById('errTxt');
const shortenBtn = document.getElementById('shortenBtn');
const results    = document.getElementById('results');

function isUrl(s) { try { return Boolean(new URL(s)); } catch { return false; } }

async function shorten() {
  const val = linkInput.value.trim();

  if (!val || !isUrl(val)) {
    linkInput.classList.add('error');
    errTxt.textContent = val ? 'Please enter a valid URL' : 'Please add a link';
    errTxt.classList.remove('d-none');
    return;
  }

  linkInput.classList.remove('error');
  errTxt.classList.add('d-none');

  // Disable button and show loading state
  shortenBtn.disabled = true;
  shortenBtn.textContent = 'Shortening...';

  try {
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(val)}`);

    if (!response.ok) throw new Error('Failed to shorten URL');

    const short = await response.text();

    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <span class="res-original" title="${val}">${val}</span>
      <div class="res-right">
        <a class="res-short" href="${short}" target="_blank" rel="noopener">${short}</a>
        <button class="btn-copy" data-url="${short}">Copy</button>
      </div>`;

    card.querySelector('.btn-copy').addEventListener('click', function () {
      navigator.clipboard.writeText(this.dataset.url).catch(() => {});
      document.querySelectorAll('.btn-copy').forEach(b => {
        b.textContent = 'Copy';
        b.classList.remove('copied');
      });
      this.textContent = 'Copied!';
      this.classList.add('copied');
    });

    results.prepend(card);
    linkInput.value = '';

  } catch (error) {
    errTxt.textContent = 'Something went wrong. Please try again.';
    errTxt.classList.remove('d-none');
  } finally {
    // Re-enable button regardless of success or failure
    shortenBtn.disabled = false;
    shortenBtn.textContent = 'Shorten It!';
  }
}

shortenBtn.addEventListener('click', shorten);
linkInput.addEventListener('keydown', e => { if (e.key === 'Enter') shorten(); });
linkInput.addEventListener('input', () => {
  linkInput.classList.remove('error');
  errTxt.classList.add('d-none');
});