const localPlayers = [
  { name: 'Ahmed', position: 'ST', pace: 74, shooting: 72, passing: 60, dribbling: 71, defending: 38, physical: 68 },
  { name: 'Carlos', position: 'CM', pace: 62, shooting: 64, passing: 76, dribbling: 69, defending: 65, physical: 70 },
  { name: 'Jordi', position: 'CB', pace: 52, shooting: 41, passing: 61, dribbling: 55, defending: 78, physical: 77 },
  { name: 'Miquel', position: 'RW', pace: 79, shooting: 68, passing: 70, dribbling: 75, defending: 35, physical: 61 },
  { name: 'Pau', position: 'GK', pace: 40, shooting: 15, passing: 58, dribbling: 20, defending: 18, physical: 66 },
  { name: 'Rafa', position: 'LB', pace: 71, shooting: 48, passing: 66, dribbling: 67, defending: 72, physical: 69 },
  { name: 'Sergi', position: 'CAM', pace: 68, shooting: 70, passing: 74, dribbling: 73, defending: 44, physical: 63 },
  { name: 'Victor', position: 'CDM', pace: 59, shooting: 55, passing: 67, dribbling: 61, defending: 74, physical: 75 }
];

const localPracticeMatches = [
  { match_date: '2026-04-10', home_team: 'Orange', away_team: 'Green', home_score: 4, away_score: 3, notes: 'Thursday training game' },
  { match_date: '2026-04-17', home_team: 'Green', away_team: 'Orange', home_score: 2, away_score: 2, notes: 'Balanced game' }
];

const localExternalMatches = [
  { match_date: '2026-04-05', opponent_name: 'UE Example', venue: 'Home', our_score: 3, opponent_score: 1, competition: 'Friendly', notes: 'Solid home match' },
  { match_date: '2026-04-12', opponent_name: 'CF Sample', venue: 'Away', our_score: 1, opponent_score: 2, competition: 'Friendly', notes: 'Tough away fixture' }
];

const positionWeights = {
  GK:  { pace: 0.05, shooting: 0.01, passing: 0.14, dribbling: 0.02, defending: 0.28, physical: 0.10, base: 0.40 },
  CB:  { pace: 0.10, shooting: 0.03, passing: 0.12, dribbling: 0.05, defending: 0.40, physical: 0.20, base: 0.10 },
  LB:  { pace: 0.18, shooting: 0.05, passing: 0.16, dribbling: 0.12, defending: 0.27, physical: 0.12, base: 0.10 },
  RB:  { pace: 0.18, shooting: 0.05, passing: 0.16, dribbling: 0.12, defending: 0.27, physical: 0.12, base: 0.10 },
  CDM: { pace: 0.10, shooting: 0.08, passing: 0.22, dribbling: 0.10, defending: 0.28, physical: 0.14, base: 0.08 },
  CM:  { pace: 0.12, shooting: 0.12, passing: 0.24, dribbling: 0.16, defending: 0.16, physical: 0.12, base: 0.08 },
  CAM: { pace: 0.12, shooting: 0.20, passing: 0.22, dribbling: 0.22, defending: 0.06, physical: 0.08, base: 0.10 },
  LW:  { pace: 0.24, shooting: 0.22, passing: 0.14, dribbling: 0.24, defending: 0.04, physical: 0.08, base: 0.04 },
  RW:  { pace: 0.24, shooting: 0.22, passing: 0.14, dribbling: 0.24, defending: 0.04, physical: 0.08, base: 0.04 },
  ST:  { pace: 0.18, shooting: 0.30, passing: 0.10, dribbling: 0.18, defending: 0.02, physical: 0.16, base: 0.06 }
};

const config = window.APP_CONFIG || {};
const hasSupabaseConfig = Boolean(
  config.SUPABASE_URL &&
  config.SUPABASE_ANON_KEY &&
  !config.SUPABASE_URL.includes('YOUR_PROJECT')
);

const supabaseClient = hasSupabaseConfig
  ? window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY)
  : null;

let playersCache = [...localPlayers];
let practiceCache = [...localPracticeMatches];
let externalCache = [...localExternalMatches];

const $ = (id) => document.getElementById(id);

function showMessage(text, type = 'muted') {
  const box = $('admin-message');
  box.className = `result-box ${type}`;
  box.textContent = text;
}

function playerScore(player) {
  const w = positionWeights[player.position] || positionWeights.CM;
  return (
    player.pace * w.pace +
    player.shooting * w.shooting +
    player.passing * w.passing +
    player.dribbling * w.dribbling +
    player.defending * w.defending +
    player.physical * w.physical +
    100 * w.base
  );
}

function teamStrength(players) {
  if (!players.length) return 0;
  const avg = players.reduce((sum, p) => sum + playerScore(p), 0) / players.length;
  const hasKeeper = players.some((p) => p.position === 'GK');
  const defenders = players.filter((p) => ['CB', 'LB', 'RB', 'CDM'].includes(p.position)).length;
  const attackers = players.filter((p) => ['CAM', 'LW', 'RW', 'ST'].includes(p.position)).length;
  const midfielders = players.filter((p) => ['CM', 'CDM', 'CAM'].includes(p.position)).length;
  const shapeBonus = defenders >= 2 && attackers >= 2 && midfielders >= 1 ? 2.5 : 0;
  const keeperBonus = hasKeeper ? 3 : 0;
  return avg + shapeBonus + keeperBonus;
}

function softmax3(home, draw, away) {
  const exps = [home, draw, away].map(Math.exp);
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((value) => value / sum);
}

function predictMatch(homePlayers, awayPlayers) {
  const hs = teamStrength(homePlayers);
  const as = teamStrength(awayPlayers);
  const diff = (hs - as) / 12;
  const [pHome, pDraw, pAway] = softmax3(diff + 0.18, -Math.abs(diff) * 0.35, -diff);
  return {
    homeStrength: hs.toFixed(1),
    awayStrength: as.toFixed(1),
    pHome: (pHome * 100).toFixed(1),
    pDraw: (pDraw * 100).toFixed(1),
    pAway: (pAway * 100).toFixed(1)
  };
}

function sortByDateDesc(items, key = 'match_date') {
  return [...items].sort((a, b) => new Date(b[key]) - new Date(a[key]));
}

function renderPlayers(players) {
  $('players-body').innerHTML = players.map((p) => `
    <tr>
      <td>${p.name}</td>
      <td>${p.position}</td>
      <td>${p.pace}</td>
      <td>${p.shooting}</td>
      <td>${p.passing}</td>
      <td>${p.dribbling}</td>
      <td>${p.defending}</td>
      <td>${p.physical}</td>
    </tr>
  `).join('');

  const options = players.map((p, i) => `<option value="${i}">${p.name} (${p.position})</option>`).join('');
  $('home-lineup').innerHTML = options;
  $('away-lineup').innerHTML = options;
  $('players-count').textContent = players.length;
}

function renderPractice(matches) {
  const sorted = sortByDateDesc(matches);
  $('practice-body').innerHTML = sorted.map((m) => `
    <tr>
      <td>${m.match_date}</td>
      <td>${m.home_team}</td>
      <td>${m.home_score} - ${m.away_score}</td>
      <td>${m.away_team}</td>
      <td>${m.notes || ''}</td>
    </tr>
  `).join('');
  $('practice-count').textContent = sorted.length;
}

function renderExternal(matches) {
  const sorted = sortByDateDesc(matches);
  $('external-body').innerHTML = sorted.map((m) => `
    <tr>
      <td>${m.match_date}</td>
      <td>${m.opponent_name}</td>
      <td>${m.venue}</td>
      <td>${m.our_score} - ${m.opponent_score}</td>
      <td>${m.competition || ''}</td>
    </tr>
  `).join('');
  $('external-count').textContent = sorted.length;
}

function updateSummaryCards() {
  const all = [
    ...practiceCache.map((m) => ({ date: m.match_date, text: `${m.home_team} ${m.home_score}-${m.away_score} ${m.away_team}` })),
    ...externalCache.map((m) => ({ date: m.match_date, text: `VdlD ${m.our_score}-${m.opponent_score} ${m.opponent_name}` }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  $('latest-result').textContent = all.length ? all[0].text : '-';
}

async function fetchPlayers() {
  if (!supabaseClient) return localPlayers;
  const { data, error } = await supabaseClient.from('players').select('*').order('name');
  if (error) return localPlayers;
  return data;
}

async function fetchPracticeMatches() {
  if (!supabaseClient) return localPracticeMatches;
  const { data, error } = await supabaseClient.from('practice_matches').select('*').order('match_date', { ascending: false });
  if (error) return localPracticeMatches;
  return data;
}

async function fetchExternalMatches() {
  if (!supabaseClient) return localExternalMatches;
  const { data, error } = await supabaseClient.from('external_matches').select('*').order('match_date', { ascending: false });
  if (error) return localExternalMatches;
  return data;
}

function selectedPlayers(selectId) {
  return Array.from($(selectId).selectedOptions)
    .map((option) => playersCache[Number(option.value)])
    .filter(Boolean);
}

function updateAuthUI(user) {
  $('auth-status').textContent = user ? `Signed in as ${user.email}` : 'Not signed in';
  $('admin-panels').classList.toggle('hidden', !user);
}

async function loadAllData() {
  playersCache = await fetchPlayers();
  practiceCache = await fetchPracticeMatches();
  externalCache = await fetchExternalMatches();
  renderPlayers(playersCache);
  renderPractice(practiceCache);
  renderExternal(externalCache);
  updateSummaryCards();
}

function autoFillPracticeLineups() {
  const homeSelect = $('home-lineup');
  const awaySelect = $('away-lineup');
  const half = Math.ceil(playersCache.length / 2);
  Array.from(homeSelect.options).forEach((option, idx) => { option.selected = idx < half; });
  Array.from(awaySelect.options).forEach((option, idx) => { option.selected = idx >= half; });
}

async function loginAdmin() {
  if (!supabaseClient) {
    showMessage('Supabase is not configured yet. Add your project URL and anon key in config.js first.', 'error');
    return;
  }

  const email = $('admin-email').value.trim();
  const password = $('admin-password').value.trim();

  if (!email || !password) {
    showMessage('Enter your admin email and password first.', 'error');
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) {
    showMessage(`Login failed: ${error.message}`, 'error');
    return;
  }

  updateAuthUI(data.user);
  showMessage('Login successful. You can now use the admin forms.', 'success');
}

async function logoutAdmin() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  updateAuthUI(null);
  showMessage('You have been logged out.', 'muted');
}

function formToObject(form) {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}

function castNumericFields(obj, fields) {
  const copy = { ...obj };
  fields.forEach((field) => {
    if (copy[field] !== undefined) copy[field] = Number(copy[field]);
  });
  return copy;
}

async function insertRow(table, row) {
  if (!supabaseClient) {
    showMessage('Supabase is not configured yet. Add config.js first.', 'error');
    return false;
  }

  const { error } = await supabaseClient.from(table).insert(row);

  if (error) {
    showMessage(`Could not save to ${table}: ${error.message}`, 'error');
    return false;
  }

  return true;
}

$('refresh-players').addEventListener('click', loadAllData);

$('run-prediction').addEventListener('click', () => {
  const homePlayers = selectedPlayers('home-lineup');
  const awayPlayers = selectedPlayers('away-lineup');
  const homeName = $('home-team-name').value || 'Team 1';
  const awayName = $('away-team-name').value || 'Team 2';

  if (!homePlayers.length || !awayPlayers.length) {
    $('prediction-result').innerHTML = '<strong>Select players for both teams first.</strong>';
    return;
  }

  const result = predictMatch(homePlayers, awayPlayers);
  $('prediction-result').innerHTML = `
    <strong>${homeName} vs ${awayName}</strong><br>
    Strength: ${homeName} ${result.homeStrength} · ${awayName} ${result.awayStrength}<br>
    Probabilities: ${homeName} win ${result.pHome}% · Draw ${result.pDraw}% · ${awayName} win ${result.pAway}%
  `;
});

$('fill-practice-lineups').addEventListener('click', autoFillPracticeLineups);
$('login-btn').addEventListener('click', loginAdmin);
$('logout-btn').addEventListener('click', logoutAdmin);

$('player-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const row = castNumericFields(formToObject(event.target), ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical']);
  const ok = await insertRow('players', row);
  if (ok) {
    event.target.reset();
    showMessage('Player saved.', 'success');
    await loadAllData();
  }
});

$('practice-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const row = castNumericFields(formToObject(event.target), ['home_score', 'away_score']);
  const ok = await insertRow('practice_matches', row);
  if (ok) {
    event.target.reset();
    showMessage('Practice match saved.', 'success');
    await loadAllData();
  }
});

$('external-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const row = castNumericFields(formToObject(event.target), ['our_score', 'opponent_score']);
  const ok = await insertRow('external_matches', row);
  if (ok) {
    event.target.reset();
    showMessage('Club match saved.', 'success');
    await loadAllData();
  }
});

async function init() {
  await loadAllData();
  autoFillPracticeLineups();

  if (!supabaseClient) {
    showMessage('Site is running in demo mode. Create config.js and connect Supabase to enable real data and admin login.', 'muted');
    updateAuthUI(null);
    return;
  }

  const { data } = await supabaseClient.auth.getSession();
  updateAuthUI(data.session?.user || null);

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    updateAuthUI(session?.user || null);
  });
}

init();
