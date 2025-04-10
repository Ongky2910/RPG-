let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

let player = {
  level: 1,
  xp: 0,
  health: 100,
  maxHP: 100,
  gold: 50,
  attack: 5,
  defense: 2,
  agility: 1,
  inventory: ["stick"],
};

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: "stick", power: 5 },
  { name: "dagger", power: 30 },
  { name: "claw hammer", power: 50 },
  { name: "sword", power: 100 },
];
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15,
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60,
  },
  {
    name: "dragon",
    level: 20,
    health: 300,
  },
];
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: 'You are in the town square. You see a sign that says "Store".',
  },
  {
    name: "store",
    "button text": [
      "Buy 10 health (10 gold)",
      "Buy weapon (30 gold)",
      "Go to town square",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store.",
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters.",
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster.",
  },
  {
    name: "kill monster",
    "button text": [
      "Go to town square",
      "Go to town square",
      "Go to town square",
    ],
    "button functions": [goTown, goTown, goTown],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. &#x2620;",
  },
  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;",
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!",
  },
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function levelUp() {
  player.level += 1;
  player.xp = 0;
  player.maxHP += 10;
  player.attack += 2;
  player.defense += 1;
  player.hp = player.maxHP;
  player.strength += 2;
  player.defense += 1;
  player.agility += 1;
  player.health = player.maxHP;
  showLevelUp();
  updateUI();
}

function gainXP(amount) {
  player.xp += amount;
  if (player.xp >= getXPThreshold(player.level)) {
    levelUp();
  }
  updateUI();
}

function updateUI() {
  // Update stats player
  document.getElementById("playerLevel").innerText = ` ${player.level}`;
  document.getElementById("playerXPStats").innerText = ` ${player.xp}`;
  document.getElementById("playerHP").innerText = `${player.hp} / ${player.maxHP}`;
  document.getElementById("playerHealthStats").innerText = `${player.hp} / ${player.maxHP}`;
  
  // Update monster health
  document.getElementById("monsterHealth").innerText = monsterHealth;
  
  // Update player stats
  document.getElementById("playerAttack").innerText = `Attack: ${player.attack}`;
  document.getElementById("playerDefense").innerText = `Defense: ${player.defense}`;
  document.getElementById("playerAgility").innerText = `Agility: ${player.agility}`;
  
  // Update gold and level
  document.getElementById("goldText").textContent = player.gold;
  document.getElementById("levelText").textContent = player.level;
}


function getXPThreshold(level) {
  return level * 20;
}

function showLevelUp() {
  let levelUpDiv = document.getElementById("levelUpMessage");
  levelUpDiv.classList.remove("hidden");
  levelUpDiv.classList.add("show");

  levelUpSound.play();

  setTimeout(() => {
    levelUpDiv.classList.remove("show");
    levelUpDiv.classList.add("hidden");
  }, 3000);
}

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = () => fightDragon(location.name);

// Declare a variable to keep track of the current ambient sound playing
let currentAmbientSound = null;

// Function to play the sound depending on the location or action
function playSound(locationName) {
  let sound;

  // Stop any currently playing ambient sound when changing locations
  if (currentAmbientSound) {
    currentAmbientSound.pause();
    currentAmbientSound.currentTime = 0; // Reset to start
  }
}

// Function to play sound based on location or action
function playSound(locationName) {
  let sound;
  switch (locationName) {
    case "store":
      sound = new Audio("assets/sounds/15419__pagancow__dorm-door-opening.wav");
      break;
    case "cave":
    case "fight":
      sound = new Audio("assets/inside-a-cave-effect-240264.mp3");
      currentAmbientSound = sound;
      break;
    case "win":
      sound = new Audio("assets/sounds/win_sound.mp3");
      break;
    case "lose":
      sound = new Audio("assets/sounds/lose_sound.mp3");
      break;
    default:
      return; // If no sound is needed, do nothing
  }
  if (sound) {
    sound.play();
  }
}

// Fight Dragon function (Now receives location name)
function fightDragon(locationName) {
  // Play the battle sound when dragon is fought, regardless of location
  playSound("fight");

  // Add logic for dragon fight here (e.g., damage, health change, etc.)
  player.health -= 10;
  updateUI();
}
function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;

  // Play the sound for the current location
  playSound(location.name);
}

// Event listeners for button clicks (now simplified)
document.getElementById("button3").addEventListener("click", () => {
  // Check if the action is to fight dragon
  if (location.name === "fight") {
    playSound("fight");
  }
});

document.getElementById("button1").addEventListener("click", () => {
  // Determine location based on the game context and play sound accordingly
  if (location.name === "store") {
    playSound("store");
  } else if (location.name === "cave" || location.name === "fight") {
    playSound("fight");
  } else if (location.name === "win") {
    playSound("win");
  } else if (location.name === "lose") {
    playSound("lose");
  }
});

function collectReward(amount) {
  player.gold += amount;
  let collectSound = new Audio(
    "assets/sounds/536071__eminyildirim__coin-collect.wav"
  );
  collectSound.play();
}

function playGameOverSound() {
  let gameOverSound = new Audio(
    "assets/564046__baltiyar13__game-over-again.mp3"
  );
  gameOverSound.play();
}

function playWinningGameSound() {
  let winningGameSound = new Audio("assets/medieval-fanfare-6826.mp3");
  winningGameSound.play();
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  // Menangani serangan monster
  let monsterDamage = getMonsterAttackValue(monsters[fighting].level);
  player.hp -= monsterDamage;

  // Pastikan HP pemain tidak kurang dari 0
  if (player.hp <= 0) {
    player.hp = 0;
    lose();
    return;
  }

  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText +=
    " You attack it with your " + weapons[currentWeapon].name + ".";

  // Perhitungan serangan pemain
  if (isMonsterHit()) {
    let damage =
      weapons[currentWeapon].power +
      player.attack +
      Math.floor(Math.random() * player.attack);
    monsterHealth -= damage;

    updateUI();
    text.innerText += " You hit the " + monsters[fighting].name + "!";
  } else {
    text.innerText += " You miss.";
  }

  healthText.innerText = `HP: ${player.hp}`;
  monsterHealthText.innerText = `Monster HP: ${monsterHealth}`;

  // Cek apakah monster kalah
  if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame(); // Menang melawan dragon
    } else {
      defeatMonster(); // Menang melawan monster lainnya
    }
  }
}

// Handle weapon breakage
if (Math.random() <= 0.1 && inventory.length !== 1) {
  let brokenWeapon = inventory.pop(); // Senjata rusak
  text.innerText += " Your " + brokenWeapon + " breaks.";
  if (currentWeapon >= inventory.length) {
    currentWeapon = inventory.length - 1;
  }
}

// Update health UI after battle
healthText.innerText = `HP: ${player.health}`;
monsterHealthText.innerText = `Monster HP: ${monsterHealth}`;

// Fungsi untuk mendapatkan serangan monster berdasarkan level
function getMonsterAttackValue(level) {
  const hit = Math.max(
    level * 5 - player.defense - Math.floor(Math.random() * player.agility),
    0
  );
  console.log(hit);
  return hit;
}

if (monsterHealth <= 0) {
  if (fighting === 2) {
    winGame(); // Jika melawan dragon
  } else {
    defeatMonster(); // Jika melawan monster lainnya
  }
}

function getMonsterAttackValue(level) {
  const hit = Math.max(
    level * 5 - player.defense - Math.floor(Math.random() * player.agility),
    0
  );
  console.log(hit);
  return hit;
}

function isMonsterHit() {
  return Math.random() > 0.2 || player.health < 20;
}

function dodge() {
  if (Math.random() < 0.5 + player.agility * 0.1) {
    // Probability dodge based on agility
    text.innerText = "You dodge the attack from the " + monsters[fighting].name;
    return true;
  } else {
    text.innerText = "You failed to dodge!";
    return false;
  }
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
  collectReward();
}

function lose() {
  playGameOverSound();
  update(locations[5]);
}

function winGame() {
  playWinningGameSound();
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
