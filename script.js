let gameState = {
  phase: 'peace',
  countries: [
    { name: 'Country A', land: 50, population: 30, economy: 40, military: 30, diplomacy: 20 },
    { name: 'Country B', land: 60, population: 35, economy: 45, military: 25, diplomacy: 25 },
    { name: 'Country C', land: 55, population: 40, economy: 50, military: 20, diplomacy: 30 },
    { name: 'Country D', land: 65, population: 45, economy: 55, military: 15, diplomacy: 35 },
    { name: 'Country E', land: 70, population: 50, economy: 60, military: 10, diplomacy: 40 }
  ],
  player: null,
  turn: 0
};

// Start the game and select country
function startGame() {
  const countryChoice = prompt('Choose your country (A, B, C, D, E):');
  const country = gameState.countries.find(c => c.name === `Country ${countryChoice.toUpperCase()}`);
  if (country) {
    gameState.player = country;
    document.getElementById('country-selection').style.display = 'none';
    document.getElementById('gameplay').style.display = 'block';
    updateStats();
    updateActions();
    gameState.phase = 'peace';
    gameState.turn = 1;
    document.getElementById('phase').innerText = `Phase: Peace | Turn: ${gameState.turn}`;
    startTurn();
  } else {
    alert('Invalid country choice. Please choose a valid country.');
  }
}

// Update the stats display
function updateStats() {
  const stats = `
    <p><strong>Your Country: ${gameState.player.name}</strong></p>
    <p>Land: ${gameState.player.land}</p>
    <p>Population: ${gameState.player.population}</p>
    <p>Economy: ${gameState.player.economy}</p>
    <p>Military: ${gameState.player.military}</p>
    <p>Diplomacy: ${gameState.player.diplomacy}</p>
  `;
  document.getElementById('stats').innerHTML = stats;
}

// Update actions buttons
function updateActions() {
  const actions = `
    <button onclick="strengthenEconomy()">Strengthen Economy</button>
    <button onclick="boostMilitary()">Boost Military</button>
    <button onclick="improveDiplomacy()">Improve Diplomacy</button>
  `;
  document.getElementById('actions').innerHTML = actions;
}

// Start a new turn: player acts, then bots
function startTurn() {
  showBotMoves();
  setTimeout(() => {
    showPlayerMoveOptions();
  }, 2000); // Wait for bots to "finish" before the player moves
}

// Simulate bot actions (bots perform random actions)
function showBotMoves() {
  let botMoves = '';
  gameState.countries.forEach(bot => {
    if (bot !== gameState.player) {
      const action = randomBotAction(bot);
      botMoves += `<p>${bot.name} decided to ${action}</p>`;
      applyBotAction(bot, action);
    }
  });
  document.getElementById('bot-moves').innerHTML = botMoves;
}

// Random bot action selection (Economy, Military, or Diplomacy)
function randomBotAction(bot) {
  const actionType = Math.floor(Math.random() * 3); // 0: Economy, 1: Military, 2: Diplomacy
  switch (actionType) {
    case 0:
      return `strengthen the economy by 5 points`;
    case 1:
      return `boost the military by 5 points`;
    case 2:
      return `improve diplomacy by 5 points`;
    default:
      return '';
  }
}

// Apply the bot's action (randomly affecting stats)
function applyBotAction(bot, action) {
  if (action.includes('economy')) {
    bot.economy += 5;
  } else if (action.includes('military')) {
    bot.military += 5;
  } else if (action.includes('diplomacy')) {
    bot.diplomacy += 5;
  }
}

// Display player action options
function showPlayerMoveOptions() {
  document.getElementById('player-action').innerHTML = `
    <p>It's your turn. What would you like to do?</p>
    <button onclick="strengthenEconomy()">Strengthen Economy</button>
    <button onclick="boostMilitary()">Boost Military</button>
    <button onclick="improveDiplomacy()">Improve Diplomacy</button>
  `;
}

// Player actions
function strengthenEconomy() {
  gameState.player.economy += 5;
  endTurn();
}

function boostMilitary() {
  gameState.player.military += 5;
  endTurn();
}

function improveDiplomacy() {
  gameState.player.diplomacy += 5;
  endTurn();
}

// End the turn and prepare for the next
function endTurn() {
  gameState.turn++;
  if (gameState.turn > 5) {
    gameState.phase = 'war';
    document.getElementById('phase').innerText = 'Phase: War';
    alert('Peace phase is over. The war phase begins!');
    // Implement war phase logic here
  } else {
    document.getElementById('phase').innerText = `Phase: Peace | Turn: ${gameState.turn}`;
    startTurn();
  }
}
