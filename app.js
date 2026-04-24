const localPlayers = [
  { id: 1, name: 'Ahmed', position: 'ST', pace: 74, shooting: 72, passing: 60, dribbling: 71, defending: 38, physical: 68 },
  { id: 2, name: 'Carlos', position: 'CM', pace: 62, shooting: 64, passing: 76, dribbling: 69, defending: 65, physical: 70 },
  { id: 3, name: 'Jordi', position: 'CB', pace: 52, shooting: 41, passing: 61, dribbling: 55, defending: 78, physical: 77 },
  { id: 4, name: 'Miquel', position: 'RW', pace: 79, shooting: 68, passing: 70, dribbling: 75, defending: 35, physical: 61 },
  { id: 5, name: 'Pau', position: 'GK', pace: 40, shooting: 15, passing: 58, dribbling: 20, defending: 18, physical: 66 },
  { id: 6, name: 'Rafa', position: 'LB', pace: 71, shooting: 48, passing: 66, dribbling: 67, defending: 72, physical: 69 }
];

const localPracticeMatches = [
  { id: 1, match_date: '2026-04-10', home_team: 'Orange', away_team: 'Green', home_score: 4, away_score: 3, notes: 'Thursday training game' },
  { id: 2, match_date: '2026-04-17', home_team: 'Green', away_team: 'Orange', home_score: 2, away_score: 2, notes: 'Balanced game' }
];

const localExternalMatches = [
  { id: 1, match_date: '2026-04-05', opponent_name: 'UE Example', venue: 'Home', our_score: 3, opponent_score: 1, competition: 'Friendly', notes: 'Solid home match' },
  { id: 2, match_date: '2026-04-12', opponent_name: 'CF Sample', venue: 'Away', our_score: 1, opponent_score: 2, competition: 'Friendly', notes: 'Tough away fixture' }
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
const hasSupabaseConfig = Boolean(config.SUPABASE_URL && config.SUPABASE_ANON_KEY && !config.SUPABASE_URL.includes('YOUR_PROJECT'));
const supabaseClient = hasSupabaseConfig ? window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY) : null;

let playersCache = [...localPlayers];
let homeTeam = [];
let awayTeam = [];
let practiceCache = [...localPracticeMatches];
let externalCache = [...localExternalMatches];

const $ = (id) => document.getElementById(id);
const exists = (id) => Boolean($(id));
const isAdminPage = exists('admin-panels');

function playerKey(player) {
  return String(player?.id ?? '');
}

function findPlayerById(playerId) {
  const id = String(playerId);
  return playersCache.find((p) => playerKey(p) === id);
}

function showMessage(text, type = 'muted') {
  const box = $('admin-message');
  if (!box) return;
  box.className = `result-box ${type}`;
  box.textContent = text;
}

function updateAuthUI(user) {
  if (exists('auth-status')) {
    $('auth-status').textContent = user?.email ? `Signed in as ${user.email}` : 'Not signed in';
  }
  if (exists('admin-panels')) {
    $('admin-panels').classList.toggle('hidden', !user);
  }
}

function playerScore(player) {
  const w = positionWeights[player.position] || positionWeights.CM;

  const base =
    Number(player.pace || 0) * w.pace +
    Number(player.shooting || 0) * w.shooting +
    Number(player.passing || 0) * w.passing +
    Number(player.dribbling || 0) * w.dribbling +
    Number(player.defending || 0) * w.defending +
    Number(player.physical || 0) * w.physical +
    100 * w.base;

  let performanceBoost = 0;

  if (player.last_score !== null && player.last_score !== undefined && player.last_score !== '') {
    performanceBoost = (Number(player.last_score) - 5) * 2;
  }

  return base + performanceBoost;
}

function teamStrength(players) {
  if (!players.length) return 0;

  const scores = players.map(playerScore);
  const avg = scores.reduce((a, b) => a + b, 0) / players.length;

  const hasGK = players.some(p => p.position === 'GK');
  const defenders = players.filter(p => ['CB','LB','RB'].includes(p.position)).length;
  const midfielders = players.filter(p => ['CM','CDM','CAM'].includes(p.position)).length;
  const attackers = players.filter(p => ['LW','RW','ST'].includes(p.position)).length;

  let structureScore = 0;

  if (hasGK) structureScore += 5;
  if (defenders >= 2) structureScore += 4;
  if (midfielders >= 2) structureScore += 3;
  if (attackers >= 1) structureScore += 2;

  if (!hasGK) structureScore -= 8;

  const diversity = new Set(players.map(p => p.position)).size;
  const chemistry = diversity >= 5 ? 2 : 0;

  return avg + structureScore + chemistry;
}

function predictMatch(homePlayers, awayPlayers) {
  const hs = teamStrength(homePlayers);
  const as = teamStrength(awayPlayers);

  const diff = (hs - as) / 10;

  const homeRaw = 1 / (1 + Math.exp(-diff));
  const awayRaw = 1 - homeRaw;
  const drawRaw = Math.max(0.15, 1 - Math.abs(diff));

  const total = homeRaw + awayRaw + drawRaw;

  return {
    homeStrength: hs.toFixed(1),
    awayStrength: as.toFixed(1),
    pHome: ((homeRaw / total) * 100).toFixed(1),
    pDraw: ((drawRaw / total) * 100).toFixed(1),
    pAway: ((awayRaw / total) * 100).toFixed(1)
  };
}

function sortByDateDesc(items, key = 'match_date') {
  return [...items].sort((a, b) => new Date(b[key]) - new Date(a[key]));
}

function renderPlayers(players) {
  if (exists('players-body')) {
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
  }

  if (exists('admin-players-list')) {
    $('admin-players-list').innerHTML = players.map((p) => `
      <div class="manage-item">
        <h4>${p.name} (${p.position})</h4>
        <p>PAC ${p.pace} · SHO ${p.shooting} · PAS ${p.passing} · DRI ${p.dribbling} · DEF ${p.defending} · PHY ${p.physical}</p>
        <div class="item-actions"><button class="btn danger delete-btn" data-table="players" data-id="${p.id}">Delete</button></div>
      </div>
    `).join('') || '<p class="muted">No players yet.</p>';
  }

  if (exists('players-count')) $('players-count').textContent = players.length;

  if (exists('home-lineup') && exists('away-lineup')) {
    splitPlayersBetweenTeams(players);
    renderLineups();
  }
}

function splitPlayersBetweenTeams(players) {
  homeTeam = [];
  awayTeam = [];
  players.forEach((p, i) => {
    if (i % 2 === 0) homeTeam.push(p);
    else awayTeam.push(p);
  });
}

function renderLineups() {
  const homeBox = $('home-lineup');
  const awayBox = $('away-lineup');
  if (!homeBox || !awayBox) return;

  homeBox.innerHTML = homeTeam.map(createPlayerCardHTML).join('');
  awayBox.innerHTML = awayTeam.map(createPlayerCardHTML).join('');
}

function createPlayerCardHTML(player) {
  return `
    <div class="player-card" draggable="true" data-player-id="${playerKey(player)}">
      <strong>${player.name}</strong>
      <span>${player.position}</span>
    </div>
  `;
}

function movePlayer(playerId, targetBoxId) {
  const id = String(playerId);
  const player = findPlayerById(id);
  if (!player) return;

  // Remove the player from both teams first. This guarantees no duplicates.
  homeTeam = homeTeam.filter(p => playerKey(p) !== id);
  awayTeam = awayTeam.filter(p => playerKey(p) !== id);

  if (targetBoxId === 'home-lineup') {
    homeTeam.push(player);
  } else if (targetBoxId === 'away-lineup') {
    awayTeam.push(player);
  }

  renderLineups();
}

function selectedPlayers(selectId) {
  return selectId === 'home-lineup' ? homeTeam : awayTeam;
}

function autoFillPracticeLineups() {
  if (!exists('home-lineup') || !exists('away-lineup')) return;
  splitPlayersBetweenTeams(playersCache);
  renderLineups();

  const result = $('prediction-result');
  if (result) result.textContent = 'Orange vs Green lineups have been auto-filled.';
}

// Drag-and-drop is attached once at document level.
// This survives every renderLineups() call and works with numeric IDs and Supabase IDs.
document.addEventListener('dragstart', (event) => {
  const card = event.target.closest('.player-card');
  if (!card) return;

  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', card.dataset.playerId);
  card.classList.add('dragging');
});

document.addEventListener('dragend', (event) => {
  const card = event.target.closest('.player-card');
  if (card) card.classList.remove('dragging');
  document.querySelectorAll('.lineup-box.drag-over').forEach(box => box.classList.remove('drag-over'));
});

document.addEventListener('dragover', (event) => {
  const box = event.target.closest('.lineup-box');
  if (!box) return;

  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  box.classList.add('drag-over');
});

document.addEventListener('dragleave', (event) => {
  const box = event.target.closest('.lineup-box');
  if (!box) return;
  if (event.relatedTarget && box.contains(event.relatedTarget)) return;
  box.classList.remove('drag-over');
});

document.addEventListener('drop', (event) => {
  const box = event.target.closest('.lineup-box');
  if (!box) return;

  event.preventDefault();
  box.classList.remove('drag-over');

  const playerId = event.dataTransfer.getData('text/plain');
  if (!playerId) return;

  movePlayer(playerId, box.id);
});

function renderPractice(matches) {
  const sorted = sortByDateDesc(matches);
  if (exists('practice-body')) {
    $('practice-body').innerHTML = sorted.map((m) => `
      <tr><td>${m.match_date}</td><td>${m.home_team}</td><td>${m.home_score} - ${m.away_score}</td><td>${m.away_team}</td><td>${m.notes || ''}</td></tr>
    `).join('');
  }
  if (exists('practice-count')) $('practice-count').textContent = sorted.length;
  if (exists('hero-practice-count')) $('hero-practice-count').textContent = sorted.length;
  if (exists('admin-practice-list')) {
    $('admin-practice-list').innerHTML = sorted.map((m) => `
      <div class="manage-item">
        <h4>${m.home_team} ${m.home_score}-${m.away_score} ${m.away_team}</h4>
        <p>${m.match_date}</p>
        <p>${m.notes || ''}</p>
        <div class="item-actions"><button class="btn danger delete-btn" data-table="practice_matches" data-id="${m.id}">Delete</button></div>
      </div>
    `).join('') || '<p class="muted">No practice matches yet.</p>';
  }
}

function renderExternal(matches) {
  const sorted = sortByDateDesc(matches);
  if (exists('external-body')) {
    $('external-body').innerHTML = sorted.map((m) => `
      <tr><td>${m.match_date}</td><td>${m.opponent_name}</td><td>${m.venue}</td><td>${m.our_score} - ${m.opponent_score}</td><td>${m.competition || ''}</td></tr>
    `).join('');
  }
  if (exists('external-count')) $('external-count').textContent = sorted.length;
  if (exists('hero-external-count')) $('hero-external-count').textContent = sorted.length;
  if (exists('admin-external-list')) {
    $('admin-external-list').innerHTML = sorted.map((m) => `
      <div class="manage-item">
        <h4>VdlD ${m.our_score}-${m.opponent_score} ${m.opponent_name}</h4>
        <p>${m.match_date} · ${m.venue}</p>
        <p>${m.competition || ''}</p>
        <div class="item-actions"><button class="btn danger delete-btn" data-table="external_matches" data-id="${m.id}">Delete</button></div>
      </div>
    `).join('') || '<p class="muted">No club matches yet.</p>';
  }
}

function updateSummaryCards() {
  const all = [
    ...practiceCache.map((m) => ({ date: m.match_date, text: `${m.home_team} ${m.home_score}-${m.away_score} ${m.away_team}` })),
    ...externalCache.map((m) => ({ date: m.match_date, text: `VdlD ${m.our_score}-${m.opponent_score} ${m.opponent_name}` }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (exists('latest-result')) $('latest-result').textContent = all.length ? all[0].text : '-';
}

async function fetchRows(table, fallback, orderCol, asc = false) {
  if (!supabaseClient) return fallback;
  const { data, error } = await supabaseClient.from(table).select('*').order(orderCol, { ascending: asc });
  if (error) {
    console.error(`Fetch ${table} error:`, error);
    return fallback;
  }
  return data || fallback;
}

async function loadAllData() {
  playersCache = await fetchRows('players', localPlayers, 'name', true);
  practiceCache = await fetchRows('practice_matches', localPracticeMatches, 'match_date', false);
  externalCache = await fetchRows('external_matches', localExternalMatches, 'match_date', false);

  renderPlayers(playersCache);
  renderPractice(practiceCache);
  renderExternal(externalCache);
  updateSummaryCards();
}

async function loginAdmin() {
  if (!supabaseClient) {
    showMessage('Supabase is not configured yet. Add your project URL and anon key in config.js first.', 'error');
    return;
  }

  const email = ($('admin-email')?.value || '').trim();
  const password = ($('admin-password')?.value || '').trim();

  if (!email || !password) {
    showMessage('Enter your admin email and password first.', 'error');
    return;
  }

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) {
    showMessage(`Login failed: ${error.message}`, 'error');
    updateAuthUI(null);
    return;
  }

  const { data: sessionData } = await supabaseClient.auth.getSession();
  updateAuthUI(sessionData?.session?.user || null);
  showMessage('Login successful. You can now manage club data.', 'success');
}

async function logoutAdmin() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  updateAuthUI(null);
  showMessage('You have been logged out.', 'muted');
}

function formToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function castNumericFields(obj, fields) {
  const copy = { ...obj };
  fields.forEach((field) => {
    if (copy[field] !== undefined) copy[field] = Number(copy[field]);
  });
  return copy;
}

async function requireUser() {
  if (!supabaseClient) return null;
  const { data } = await supabaseClient.auth.getSession();
  const user = data?.session?.user || null;
  updateAuthUI(user);
  return user;
}

async function insertRow(table, row) {
  const user = await requireUser();
  if (!user) {
    showMessage('You must log in first.', 'error');
    return false;
  }

  const { error } = await supabaseClient.from(table).insert(row);
  if (error) {
    showMessage(`Could not save to ${table}: ${error.message}`, 'error');
    return false;
  }
  return true;
}

async function deleteRow(table, id) {
  const user = await requireUser();
  if (!user) {
    showMessage('You must log in first.', 'error');
    return false;
  }

  const { error } = await supabaseClient.from(table).delete().eq('id', id);
  if (error) {
    showMessage(`Could not delete from ${table}: ${error.message}`, 'error');
    return false;
  }

  showMessage('Entry deleted.', 'success');
  await loadAllData();
  return true;
}

function bindEvents() {
  if (exists('refresh-players')) $('refresh-players').addEventListener('click', loadAllData);
  if (exists('refresh-admin-data')) $('refresh-admin-data').addEventListener('click', loadAllData);
  if (exists('fill-practice-lineups')) $('fill-practice-lineups').addEventListener('click', autoFillPracticeLineups);
  if (exists('login-btn')) $('login-btn').addEventListener('click', loginAdmin);
  if (exists('logout-btn')) $('logout-btn').addEventListener('click', logoutAdmin);

  if (exists('run-prediction')) {
    $('run-prediction').addEventListener('click', () => {
      const homePlayers = selectedPlayers('home-lineup');
      const awayPlayers = selectedPlayers('away-lineup');
      const homeName = $('home-team-name').value || 'Team 1';
      const awayName = $('away-team-name').value || 'Team 2';

      if (!homePlayers.length || !awayPlayers.length) {
        $('prediction-result').innerHTML = '<strong>Both teams need at least one player.</strong>';
        return;
      }

      const result = predictMatch(homePlayers, awayPlayers);
      $('prediction-result').innerHTML = `<strong>${homeName} vs ${awayName}</strong><br>Strength: ${homeName} ${result.homeStrength} · ${awayName} ${result.awayStrength}<br>Probabilities: ${homeName} win ${result.pHome}% · Draw ${result.pDraw}% · ${awayName} win ${result.pAway}%`;
    });
  }

  if (exists('player-form')) $('player-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const row = castNumericFields(formToObject(event.target), ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical']);
    const ok = await insertRow('players', row);
    if (ok) {
      event.target.reset();
      showMessage('Player saved.', 'success');
      await loadAllData();
    }
  });

  if (exists('practice-form')) $('practice-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const row = castNumericFields(formToObject(event.target), ['home_score', 'away_score']);
    const ok = await insertRow('practice_matches', row);
    if (ok) {
      event.target.reset();
      showMessage('Practice match saved.', 'success');
      await loadAllData();
    }
  });

  if (exists('external-form')) $('external-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const row = castNumericFields(formToObject(event.target), ['our_score', 'opponent_score']);
    const ok = await insertRow('external_matches', row);
    if (ok) {
      event.target.reset();
      showMessage('Club match saved.', 'success');
      await loadAllData();
    }
  });

  document.addEventListener('click', async (event) => {
    const btn = event.target.closest('.delete-btn');
    if (!btn) return;

    const table = btn.dataset.table;
    const id = btn.dataset.id;
    const confirmed = window.confirm('Delete this entry?');

    if (!confirmed) return;
    await deleteRow(table, id);
  });
}

async function init() {
  bindEvents();
  await loadAllData();

  if (!supabaseClient) {
    updateAuthUI(null);
    showMessage('Site is running in demo mode. Create config.js and connect Supabase to enable real data and admin login.', 'muted');
    return;
  }

  const { data } = await supabaseClient.auth.getSession();
  updateAuthUI(data?.session?.user || null);

  if (isAdminPage && !data?.session?.user) showMessage('Sign in to manage club data.', 'muted');

  supabaseClient.auth.onAuthStateChange((_event, session) => updateAuthUI(session?.user || null));
}

init();
