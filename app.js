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

const localGoalScorers = [
  { id: 1, match_type: 'practice', match_id: 1, player_name: 'Ahmed', goals: 2 },
  { id: 2, match_type: 'practice', match_id: 1, player_name: 'Carlos', goals: 1 },
  { id: 3, match_type: 'external', match_id: 1, player_name: 'Rafa', goals: 1 }
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

const currentLang = document.documentElement.lang && document.documentElement.lang.startsWith('es') ? 'es' : 'en';
const i18n = {
  en: {
    signedInAs: 'Signed in as',
    notSignedIn: 'Not signed in',
    deleteText: 'Delete',
    noPlayers: 'No players yet.',
    noPractice: 'No practice matches yet.',
    noClub: 'No club matches yet.',
    noScorers: 'No goal scorers recorded yet.',
    loginFailed: 'Login failed',
    loginSuccess: 'Login successful. You can now manage club data.',
    logoutSuccess: 'You have been logged out.',
    needConfig: 'Supabase is not configured yet. Add your project URL and anon key in config.js first.',
    enterCredentials: 'Enter your admin email and password first.',
    mustLogin: 'You must log in first.',
    couldNotSave: 'Could not save to',
    couldNotDelete: 'Could not delete from',
    deleted: 'Entry deleted.',
    deleteConfirm: 'Delete this entry?',
    demoMode: 'Site is running in demo mode. Create config.js and connect Supabase to enable real data and admin login.',
    signInManage: 'Sign in to manage club data.',
    selectBoth: 'Select players for both teams first.',
    strength: 'Strength',
    probabilities: 'Probabilities',
    win: 'win',
    draw: 'Draw',
    playerSaved: 'Player saved.',
    practiceSaved: 'Practice match saved.',
    clubSaved: 'Club match saved.'
  },
  es: {
    signedInAs: 'Sesión iniciada como',
    notSignedIn: 'Sesión no iniciada',
    deleteText: 'Eliminar',
    noPlayers: 'Todavía no hay jugadores.',
    noPractice: 'Todavía no hay partidos de entrenamiento.',
    noClub: 'Todavía no hay partidos del club.',
    noScorers: 'Todavía no hay goleadores registrados.',
    loginFailed: 'Error al iniciar sesión',
    loginSuccess: 'Inicio de sesión correcto. Ya puedes gestionar los datos del club.',
    logoutSuccess: 'Has cerrado sesión.',
    needConfig: 'Supabase todavía no está configurado. Añade la URL del proyecto y la anon key en config.js.',
    enterCredentials: 'Introduce el correo y la contraseña de administrador.',
    mustLogin: 'Primero debes iniciar sesión.',
    couldNotSave: 'No se pudo guardar en',
    couldNotDelete: 'No se pudo eliminar de',
    deleted: 'Entrada eliminada.',
    deleteConfirm: '¿Eliminar esta entrada?',
    demoMode: 'El sitio está en modo demo. Crea config.js y conecta Supabase para activar datos reales y el acceso de administración.',
    signInManage: 'Inicia sesión para gestionar los datos del club.',
    selectBoth: 'Coloca jugadores en ambos equipos primero.',
    strength: 'Fuerza',
    probabilities: 'Probabilidades',
    win: 'gana',
    draw: 'Empate',
    playerSaved: 'Jugador guardado.',
    practiceSaved: 'Partido de entrenamiento guardado.',
    clubSaved: 'Partido del club guardado.'
  }
};
const txt = (key) => (i18n[currentLang] && i18n[currentLang][key]) || i18n.en[key] || key;

function practiceDisplayNames() {
  return currentLang === 'es'
    ? { home: 'Naranja', away: 'Verde' }
    : { home: 'Orange', away: 'Green' };
}

function practiceHomeScore(match) {
  return match.home_score ?? match.orange_score ?? 0;
}

function practiceAwayScore(match) {
  return match.away_score ?? match.green_score ?? 0;
}

const config = window.APP_CONFIG || {};
const hasSupabaseConfig = Boolean(config.SUPABASE_URL && config.SUPABASE_ANON_KEY && !config.SUPABASE_URL.includes('YOUR_PROJECT'));
const supabaseClient = hasSupabaseConfig ? window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY) : null;

let playersCache = [...localPlayers];
let homeTeam = [];
let awayTeam = [];
let practiceCache = [...localPracticeMatches];
let externalCache = [...localExternalMatches];
let goalScorersCache = [...localGoalScorers];

const $ = (id) => document.getElementById(id);
const exists = (id) => Boolean($(id));
const isAdminPage = exists('admin-panels');
const playerKey = (player) => String(player?.id ?? player?.name ?? '');

function showMessage(text, type = 'muted') {
  const box = $('admin-message');
  if (!box) return;
  box.className = `result-box ${type}`;
  box.textContent = text;
}

function updateAuthUI(user) {
  if (exists('auth-status')) {
    $('auth-status').textContent = user?.email ? `${txt('signedInAs')} ${user.email}` : txt('notSignedIn');
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

  if (
    player.last_score !== null &&
    player.last_score !== undefined &&
    player.last_score !== ''
  ) {
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

function splitPlayersEvenly(players) {
  homeTeam = [];
  awayTeam = [];
  players.forEach((p, i) => {
    if (i % 2 === 0) homeTeam.push(p);
    else awayTeam.push(p);
  });
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

  if (exists('home-lineup') && exists('away-lineup')) {
    splitPlayersEvenly(players);
    renderLineups();
  }

  if (exists('players-count')) $('players-count').textContent = players.length;

  if (exists('admin-players-list')) {
    $('admin-players-list').innerHTML = players.map((p) => `
      <div class="manage-item">
        <h4>${p.name} (${p.position})</h4>
        <p>PAC ${p.pace} · SHO ${p.shooting} · PAS ${p.passing} · DRI ${p.dribbling} · DEF ${p.defending} · PHY ${p.physical}</p>
        <div class="item-actions"><button class="btn danger delete-btn" data-table="players" data-id="${p.id}">${txt('deleteText')}</button></div>
      </div>
    `).join('') || `<p class="muted">${txt('noPlayers')}</p>`;
  }
}

function renderLineups() {
  const homeBox = $('home-lineup');
  const awayBox = $('away-lineup');
  if (!homeBox || !awayBox) return;

  homeBox.innerHTML = '';
  awayBox.innerHTML = '';

  homeTeam.forEach(player => homeBox.appendChild(createPlayerCard(player)));
  awayTeam.forEach(player => awayBox.appendChild(createPlayerCard(player)));

  setupDropZone('home-lineup');
  setupDropZone('away-lineup');
}

function createPlayerCard(player) {
  const div = document.createElement('div');
  div.className = 'player-card';
  div.draggable = true;
  div.dataset.id = playerKey(player);
  div.textContent = `${player.name} (${player.position})`;

  div.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text/plain', div.dataset.id);
    event.dataTransfer.effectAllowed = 'move';
    div.classList.add('dragging');
  });

  div.addEventListener('dragend', () => {
    div.classList.remove('dragging');
  });

  return div;
}

function setupDropZone(boxId) {
  const box = $(boxId);
  if (!box) return;

  box.ondragover = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    box.classList.add('drag-over');
  };

  box.ondragenter = (event) => {
    event.preventDefault();
    box.classList.add('drag-over');
  };

  box.ondragleave = (event) => {
    if (!box.contains(event.relatedTarget)) box.classList.remove('drag-over');
  };

  box.ondrop = (event) => {
    event.preventDefault();
    box.classList.remove('drag-over');
    const draggedId = event.dataTransfer.getData('text/plain');
    movePlayer(draggedId, boxId);
  };
}

function movePlayer(id, targetBoxId) {
  const draggedId = String(id);
  const player = playersCache.find(p => playerKey(p) === draggedId);
  if (!player) return;

  homeTeam = homeTeam.filter(p => playerKey(p) !== draggedId);
  awayTeam = awayTeam.filter(p => playerKey(p) !== draggedId);

  if (targetBoxId === 'home-lineup') homeTeam.push(player);
  if (targetBoxId === 'away-lineup') awayTeam.push(player);

  renderLineups();
}

function renderPractice(matches) {
  const sorted = sortByDateDesc(matches);
  const names = practiceDisplayNames();

  if (exists('practice-body')) {
    $('practice-body').innerHTML = sorted.map((m) => `
      <tr><td>${m.match_date}</td><td>${names.home}</td><td>${practiceHomeScore(m)} - ${practiceAwayScore(m)}</td><td>${names.away}</td><td>${m.notes || ''}</td></tr>
    `).join('');
  }

  if (exists('practice-count')) $('practice-count').textContent = sorted.length;
  if (exists('hero-practice-count')) $('hero-practice-count').textContent = sorted.length;

  if (exists('admin-practice-list')) {
    $('admin-practice-list').innerHTML = sorted.map((m) => `
      <div class="manage-item">
        <h4>${names.home} ${practiceHomeScore(m)}-${practiceAwayScore(m)} ${names.away}</h4>
        <p>${m.match_date}</p>
        <p>${m.notes || ''}</p>
        <div class="item-actions"><button class="btn danger delete-btn" data-table="practice_matches" data-id="${m.id}">${txt('deleteText')}</button></div>
      </div>
    `).join('') || `<p class="muted">${txt('noPractice')}</p>`;
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
        <h4>Associació Futbol Veterans la Devesa ${m.our_score}-${m.opponent_score} ${m.opponent_name}</h4>
        <p>${m.match_date} · ${m.venue}</p>
        <p>${m.competition || ''}</p>
        <div class="item-actions"><button class="btn danger delete-btn" data-table="external_matches" data-id="${m.id}">${txt('deleteText')}</button></div>
      </div>
    `).join('') || `<p class="muted">${txt('noClub')}</p>`;
  }
}

function renderScorersChart(scorers) {
  if (!exists('scorers-chart')) return;

  const totals = new Map();

  scorers.forEach((row) => {
    const name = String(row.player_name || '').trim();
    const goals = Number(row.goals || 0);
    if (!name || goals <= 0) return;
    totals.set(name, (totals.get(name) || 0) + goals);
  });

  const rows = Array.from(totals.entries())
    .map(([name, goals]) => ({ name, goals }))
    .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name))
    .slice(0, 10);

  if (!rows.length) {
    $('scorers-chart').innerHTML = `<p class="muted">${txt('noScorers')}</p>`;
    return;
  }

  const maxGoals = Math.max(...rows.map(row => row.goals));

  $('scorers-chart').innerHTML = rows.map((row) => {
    const width = Math.max(8, (row.goals / maxGoals) * 100);
    return `
      <div class="bar-row">
        <div class="bar-label">${row.name}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${width}%"></div></div>
        <div class="bar-value">${row.goals}</div>
      </div>
    `;
  }).join('');
}

function updateSummaryCards() {
  const names = practiceDisplayNames();
  const all = [
    ...practiceCache.map((m) => ({
      date: m.match_date,
      text: `${names.home} ${practiceHomeScore(m)}-${practiceAwayScore(m)} ${names.away}`
    })),
    ...externalCache.map((m) => ({
      date: m.match_date,
      text: `Associació Futbol Veterans la Devesa ${m.our_score}-${m.opponent_score} ${m.opponent_name}`
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (exists('latest-result')) $('latest-result').textContent = all.length ? all[0].text : '-';
}

async function fetchRows(table, fallback, orderCol, asc=false) {
  if (!supabaseClient) return fallback;
  const { data, error } = await supabaseClient.from(table).select('*').order(orderCol, { ascending: asc });
  if (error) { console.error(`Fetch ${table} error:`, error); return fallback; }
  return data || fallback;
}

async function loadAllData() {
  playersCache = await fetchRows('players', localPlayers, 'name', true);
  practiceCache = await fetchRows('practice_matches', localPracticeMatches, 'match_date', false);
  externalCache = await fetchRows('external_matches', localExternalMatches, 'match_date', false);
  goalScorersCache = await fetchRows('goal_scorers', localGoalScorers, 'created_at', false);

  renderPlayers(playersCache);
  renderPractice(practiceCache);
  renderExternal(externalCache);
  renderScorersChart(goalScorersCache);
  updateSummaryCards();
}

function selectedPlayers(selectId) {
  return selectId === 'home-lineup' ? homeTeam : awayTeam;
}

function autoFillPracticeLineups() {
  if (!exists('home-lineup') || !exists('away-lineup')) return;
  splitPlayersEvenly(playersCache);
  renderLineups();
}

async function loginAdmin() {
  if (!supabaseClient) { showMessage(txt('needConfig'), 'error'); return; }
  const email = ($('admin-email')?.value || '').trim();
  const password = ($('admin-password')?.value || '').trim();
  if (!email || !password) { showMessage(txt('enterCredentials'), 'error'); return; }
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) { showMessage(`${txt('loginFailed')}: ${error.message}`, 'error'); updateAuthUI(null); return; }
  const { data: sessionData } = await supabaseClient.auth.getSession();
  updateAuthUI(sessionData?.session?.user || null);
  showMessage(txt('loginSuccess'), 'success');
}

async function logoutAdmin() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  updateAuthUI(null);
  showMessage(txt('logoutSuccess'), 'muted');
}

function formToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function castNumericFields(obj, fields) {
  const copy = { ...obj };
  fields.forEach((field) => {
    if (copy[field] !== undefined && copy[field] !== '') copy[field] = Number(copy[field]);
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
  if (!user) { showMessage(txt('mustLogin'), 'error'); return false; }
  const { error } = await supabaseClient.from(table).insert(row);
  if (error) { showMessage(`${txt('couldNotSave')} ${table}: ${error.message}`, 'error'); return false; }
  return true;
}

async function insertRowReturning(table, row) {
  const user = await requireUser();
  if (!user) { showMessage(txt('mustLogin'), 'error'); return null; }

  const { data, error } = await supabaseClient
    .from(table)
    .insert(row)
    .select()
    .single();

  if (error) {
    showMessage(`${txt('couldNotSave')} ${table}: ${error.message}`, 'error');
    return null;
  }

  return data;
}

function parseGoalScorers(rawText) {
  const text = String(rawText || '').trim();
  if (!text) return [];

  return text
    .split(',')
    .map(part => part.trim())
    .filter(Boolean)
    .map((part) => {
      const pieces = part.split(':');
      const playerName = String(pieces[0] || '').trim();
      const goals = pieces.length > 1 ? Number(pieces[1]) : 1;
      return {
        player_name: playerName,
        goals: Number.isFinite(goals) && goals > 0 ? Math.floor(goals) : 1
      };
    })
    .filter(row => row.player_name);
}

async function saveGoalScorers(matchType, matchId, rawText) {
  const scorers = parseGoalScorers(rawText);
  if (!scorers.length) return true;

  const rows = scorers.map((scorer) => ({
    match_type: matchType,
    match_id: matchId,
    player_name: scorer.player_name,
    goals: scorer.goals
  }));

  const { error } = await supabaseClient.from('goal_scorers').insert(rows);
  if (error) {
    showMessage(`${txt('couldNotSave')} goal_scorers: ${error.message}`, 'error');
    return false;
  }
  return true;
}

async function deleteRelatedGoalScorers(table, id) {
  if (!supabaseClient) return;
  if (table !== 'practice_matches' && table !== 'external_matches') return;

  const matchType = table === 'practice_matches' ? 'practice' : 'external';
  const { error } = await supabaseClient
    .from('goal_scorers')
    .delete()
    .eq('match_type', matchType)
    .eq('match_id', id);

  if (error) console.error('Could not delete related goal scorers:', error);
}

async function deleteRow(table, id) {
  const user = await requireUser();
  if (!user) { showMessage(txt('mustLogin'), 'error'); return false; }

  await deleteRelatedGoalScorers(table, id);

  const { error } = await supabaseClient.from(table).delete().eq('id', id);
  if (error) { showMessage(`${txt('couldNotDelete')} ${table}: ${error.message}`, 'error'); return false; }
  showMessage(txt('deleted'), 'success');
  await loadAllData();
  return true;
}

function cleanMatchRow(row) {
  const copy = { ...row };
  delete copy.goal_scorers;
  return copy;
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
      if (!homePlayers.length || !awayPlayers.length) { $('prediction-result').innerHTML = `<strong>${txt('selectBoth')}</strong>`; return; }
      const result = predictMatch(homePlayers, awayPlayers);
      $('prediction-result').innerHTML = `<strong>${homeName} vs ${awayName}</strong><br>${txt('strength')}: ${homeName} ${result.homeStrength} · ${awayName} ${result.awayStrength}<br>${txt('probabilities')}: ${homeName} ${txt('win')} ${result.pHome}% · ${txt('draw')} ${result.pDraw}% · ${awayName} ${txt('win')} ${result.pAway}%`;
    });
  }

  if (exists('player-form')) $('player-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const row = castNumericFields(formToObject(event.target), ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical']);
    const ok = await insertRow('players', row);
    if (ok) { event.target.reset(); showMessage(txt('playerSaved'), 'success'); await loadAllData(); }
  });

  if (exists('practice-form')) $('practice-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const raw = formToObject(event.target);
    const goalScorersText = raw.goal_scorers || '';

    const row = castNumericFields({
      match_date: raw.match_date,
      home_team: 'Orange',
      away_team: 'Green',
      home_score: raw.home_score,
      away_score: raw.away_score,
      notes: raw.notes || ''
    }, ['home_score', 'away_score']);

    const insertedMatch = await insertRowReturning('practice_matches', row);
    if (insertedMatch) {
      await saveGoalScorers('practice', insertedMatch.id, goalScorersText);
      event.target.reset();
      showMessage(txt('practiceSaved'), 'success');
      await loadAllData();
    }
  });

  if (exists('external-form')) $('external-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const raw = formToObject(event.target);
    const goalScorersText = raw.goal_scorers || '';
    const row = cleanMatchRow(castNumericFields(raw, ['our_score', 'opponent_score']));
    const insertedMatch = await insertRowReturning('external_matches', row);
    if (insertedMatch) {
      await saveGoalScorers('external', insertedMatch.id, goalScorersText);
      event.target.reset();
      showMessage(txt('clubSaved'), 'success');
      await loadAllData();
    }
  });

  document.addEventListener('click', async (event) => {
    const btn = event.target.closest('.delete-btn');
    if (!btn) return;
    const table = btn.dataset.table;
    const id = btn.dataset.id;
    const confirmed = window.confirm(txt('deleteConfirm'));
    if (!confirmed) return;
    await deleteRow(table, id);
  });
}

async function init() {
  bindEvents();
  await loadAllData();
  autoFillPracticeLineups();
  if (!supabaseClient) {
    updateAuthUI(null);
    showMessage(txt('demoMode'), 'muted');
    return;
  }
  const { data } = await supabaseClient.auth.getSession();
  updateAuthUI(data?.session?.user || null);
  if (isAdminPage && !data?.session?.user) showMessage(txt('signInManage'), 'muted');
  supabaseClient.auth.onAuthStateChange((_event, session) => updateAuthUI(session?.user || null));
}

init();
