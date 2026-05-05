let currentCategory = 'Any';
let jokeCount = 0;
let currentJoke = null;

function setCategory(btn, category) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentCategory = category;
  getJoke();
}

async function getJoke() {
  showLoader();
  hideReactions();

  try {
    const url = `https://v2.jokeapi.dev/joke/${currentCategory}?safe-mode`;
    const res  = await fetch(url);
    const data = await res.json();

    currentJoke = data;
    jokeCount++;
    document.getElementById('countText').textContent =
      `${jokeCount} joke${jokeCount !== 1 ? 's' : ''} fetched`;

    displayJoke(data);
  } catch (err) {
    showError();
  }
}

function displayJoke(data) {
  const loader  = document.getElementById('loader');
  const content = document.getElementById('jokeContent');
  const typeEl  = document.getElementById('jokeType');
  const setupEl = document.getElementById('jokeSetup');
  const punchlineReveal = document.getElementById('punchlineReveal');
  const punchlineEl     = document.getElementById('jokePunchline');

  loader.style.display  = 'none';
  content.style.display = 'block';

  typeEl.textContent = data.category;

  if (data.type === 'single') {
    setupEl.textContent = data.joke;
    punchlineReveal.style.display = 'none';
  } else {
    setupEl.textContent = data.setup;
    punchlineEl.textContent = data.delivery;
    punchlineEl.style.display = 'none';
    punchlineReveal.style.display = 'flex';

    const revealBtn = document.querySelector('.reveal-btn');
    revealBtn.style.display = 'block';
    revealBtn.textContent = 'Reveal Punchline 👇';
  }

  document.getElementById('reactions').style.display = 'flex';
}

function revealPunchline() {
  const punchlineEl = document.getElementById('jokePunchline');
  const revealBtn   = document.querySelector('.reveal-btn');

  punchlineEl.style.display = 'block';
  revealBtn.style.display   = 'none';
}

function showLoader() {
  document.getElementById('loader').style.display  = 'flex';
  document.getElementById('jokeContent').style.display = 'none';
}

function hideReactions() {
  document.getElementById('reactions').style.display = 'none';
  document.getElementById('reactionMsg').textContent = '';
}

function showError() {
  const loader  = document.getElementById('loader');
  const content = document.getElementById('jokeContent');
  loader.style.display  = 'none';
  content.style.display = 'block';
  document.getElementById('jokeSetup').textContent =
    'Could not fetch joke. Check your internet and try again!';
  document.getElementById('jokeType').textContent = 'Error';
  document.getElementById('punchlineReveal').style.display = 'none';
}

const reactionMessages = {
  '😂': 'Haha! That was funny!',
  '😐': 'Meh... not your best.',
  '🤦': 'That was terrible 😅',
  '👏': 'That deserves applause!'
};

function react(emoji) {
  document.getElementById('reactionMsg').textContent =
    reactionMessages[emoji] || '';
}

function copyJoke() {
  if (!currentJoke) return;

  let text = '';
  if (currentJoke.type === 'single') {
    text = currentJoke.joke;
  } else {
    text = currentJoke.setup + '\n' + currentJoke.delivery;
  }

  navigator.clipboard.writeText(text).then(() => {
    document.getElementById('reactionMsg').textContent = '✓ Joke copied!';
    setTimeout(() => {
      document.getElementById('reactionMsg').textContent = '';
    }, 2000);
  });
}

getJoke();