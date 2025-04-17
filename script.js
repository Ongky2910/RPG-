let xp = 0;
let level = 1;
let maxXP = 100; 
let health = 100;
let gold = 50;
let currentMonster;
let currentLocation;
let weaponIndex = 0;
const weapons = [
  { name: "Wooden Stick", power: 5 },
  { name: "Hammer", power: 10, cost: 20 },
  { name: "Axe", power: 20, cost: 40 },
  { name: "Katana", power: 30, cost: 60 },
  { name: "Sword", power: 50, cost: 80 }
];


const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const text = document.getElementById("text");
const xpText = document.getElementById("xpText");
const healthText = document.getElementById('healthText');
healthText.innerText = `${health} / 100`;
const goldText = document.getElementById("goldText");
const monsterStats = document.getElementById("monsterStats");
const monsterName = document.getElementById("monsterName");
const monsterHealth = document.getElementById("monsterHealth");
const weaponText = document.createElement("div");
weaponText.id = "weaponText";
weaponText.innerText = `Weapon: ${weapons[weaponIndex].name}`;
document.getElementById("stats").appendChild(weaponText);

window.onload = () => {
  // Set initial health and XP display
  document.getElementById('healthText').innerText = `${health} / 100`;
  document.getElementById('xpText').innerText = `${xp}`;
  goTown();
};

// LevelUp function
const levelText = document.createElement("span");
levelText.id = "levelText";
levelText.innerText = `Level: ${level}`;
document.getElementById("stats").appendChild(levelText);

// XP progress wrapper
const xpBarWrapper = document.createElement("div");
xpBarWrapper.style.height = "20px";
xpBarWrapper.style.width = "100%";
xpBarWrapper.style.background = "#333";
xpBarWrapper.style.marginTop = "5px";
xpBarWrapper.style.position = "relative";
xpBarWrapper.style.borderRadius = "5px";

// Inner bar (progress)
const xpProgress = document.createElement("div");
xpProgress.id = "xpProgress";
xpProgress.style.height = "100%";
xpProgress.style.width = "0%";
xpProgress.style.background = "#4caf50";
xpProgress.style.borderRadius = "5px";
xpProgress.style.transition = "width 0.3s ease";

// Text di dalam bar
const xpLabel = document.createElement("span");
xpLabel.id = "xpLabel";
xpLabel.innerText = `XP: ${xp} / ${maxXP}`;
xpLabel.style.position = "absolute";
xpLabel.style.left = "50%";
xpLabel.style.top = "50%";
xpLabel.style.transform = "translate(-50%, -50%)";
xpLabel.style.color = "#fff";
xpLabel.style.fontSize = "12px";
xpLabel.style.fontWeight = "bold";

xpBarWrapper.appendChild(xpProgress);
xpBarWrapper.appendChild(xpLabel);
document.getElementById("stats").appendChild(xpBarWrapper);


const monsters = [
  { name: "Slime", level: 2, health: 15 },
  { name: "Fanged Beast", level: 8, health: 60 },
  { name: "Dragon", level: 20, health: 300 }
];

const locations = [
  {
    name: "town square",
    buttonText: ["Go Store", "Go Cave", "Fight Dragon"],
    buttonFunctions: [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    buttonText: ["Buy 10 Health (10 gold)", "Buy Sword (30 gold)", "Go Town"],
    buttonFunctions: [buyHealth, buySword, goTown],
    text: "You enter the store."
  },
  {
    name: "cave",
    buttonText: ["Fight Slime", "Fight Beast", "Go Town"],
    buttonFunctions: [() => fightMonster(0), () => fightMonster(1), goTown],
    text: "You enter the cave. You see some monsters."
  },
  {
    name: "fight",
    buttonText: ["Attack", "Dodge", "Run"],
    buttonFunctions: [attack, dodge, goTown],
    text: "You are fighting a monster."
  },
  {
    name: "kill monster",
    buttonText: ["Go Town", "Go Town", "Go Town"],
    buttonFunctions: [goTown, goTown, goTown],
    text: 'The monster screams "Arg!" as it dies. You gain experience and find gold.'
  },
  {
    name: "lose",
    buttonText: ["REPLAY?", "REPLAY?", "REPLAY?"],
    buttonFunctions: [restart, restart, restart],
    text: "You die. ☠️"
  },
  {
    name: "win",
    buttonText: ["REPLAY?", "REPLAY?", "REPLAY?"],
    buttonFunctions: [restart, restart, restart],
    text: "You defeat the dragon! 🎉 YOU WIN THE GAME!"
  }
];

function update(location) {
  currentLocation = location;
  text.innerText = location.text;
  button1.innerText = location.buttonText[0];
  button2.innerText = location.buttonText[1];
  button3.innerText = location.buttonText[2];
  button1.onclick = location.buttonFunctions[0];
  button2.onclick = location.buttonFunctions[1];
  button3.onclick = location.buttonFunctions[2];
  playSound(location.name);
}

function playSound(name) {
  const fightSound = document.getElementById("fightSound");
  const goldSound = document.getElementById("goldSound");
  if (name === "kill monster") goldSound.play();
  if (name === "fight") fightSound.play();
}

function goTown() {
  update(locations[0]);
}
function goStore() {
  const weapon = weapons[weaponIndex + 1];
  update({
    name: "store",
    buttonText: [
      "Buy 10 Health (10 gold)",
      weapon ? `Buy ${weapon.name} (${weapon.cost} gold)` : "Max Weapon Reached",
      "Go Town"
    ],
    buttonFunctions: [
      buyHealth,
      weapon ? buyWeapon : () => text.innerText = "You already have the best weapon!",
      goTown
    ],
    text: "You enter the store."
  });
}

function animateWeaponUpgrade() {
  weaponText.style.transition = "transform 0.3s, color 0.3s";
  weaponText.style.transform = "scale(1.3)";
  weaponText.style.color = "#ffcc00";
  setTimeout(() => {
    weaponText.style.transform = "scale(1)";
    weaponText.style.color = "#fff";
  }, 300);
}

function buyWeapon() {
  const nextWeapon = weapons[weaponIndex + 1];
  if (gold >= nextWeapon.cost) {
    gold -= nextWeapon.cost;
    weaponIndex++;
    goldText.innerText = `Gold: ${gold}`;
    weaponText.innerText = `Weapon: ${weapons[weaponIndex].name}`;
    text.innerText = `🔥 You upgraded to ${weapons[weaponIndex].name}!`;
    animateWeaponUpgrade();
    goStore(); 
  } else {
    text.innerText = "Not enough gold!";
  }
}

function goCave() {
  update(locations[2]);
}

function gainXP(amount) {
  xp += amount;
  while (xp >= maxXP) {
    xp -= maxXP;
    levelUp();
  }
  updateXPBar();
}

function levelUp() {
  level++;
  maxXP = Math.floor(maxXP * 1.25); 
  health += 20;
  healthText.innerText = `Health: ${health}`;
  levelText.innerText = `Level: ${level}`;
  text.innerText = `🎉 Level Up! You are now Level ${level}`;
}


function updateXPBar() {
  const progress = (xp / maxXP) * 100;
  xpProgress.style.width = `${progress}%`;
  xpLabel.innerText = `XP: ${xp} / ${maxXP}`;
}


function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = `Gold: ${gold}`;
    healthText.innerText = `Health: ${health}`;
  } else {
    text.innerText = "Not enough gold!";
  }
}
function buySword() {
  if (gold >= 30) {
    gold -= 30;
    goldText.innerText = `Gold: ${gold}`;
    text.innerText = "You bought a sword!";
  } else {
    text.innerText = "Not enough gold!";
  }
}
function fightMonster(index) {
  currentMonster = { ...monsters[index] };
  monsterStats.style.display = "block";
  monsterName.innerText = currentMonster.name;
  monsterHealth.innerText = currentMonster.health;
  update(locations[3]);
}

function attack() {
  animateAttack();

  const playerDamage = Math.floor(Math.random() * 10 + 1);
  // Mengurangi health monster
  currentMonster.health -= Math.floor(Math.random() * 10 + 1);
  monsterHealth.innerText = currentMonster.health;

  // Jika monster mati
  if (currentMonster.health <= 0) {
    gainXP(currentMonster.level * 10);
    gold += Math.floor(currentMonster.level * 3.5);
    goldText.innerText = `Gold: ${gold}`;
    updateXPBar();
    text.innerText = `You attacked for ${playerDamage} damage and defeated the monster!`;
    update(locations[4]);  // Update lokasi setelah mengalahkan monster
  } else {
    // Jika monster masih hidup, monster menyerang balik
    const monsterDamage = currentMonster.level * 5; // Damage monster berdasarkan level
    takeDamage(monsterDamage);  // Player menerima damage
  // Mengecek apakah player masih hidup
  if (health <= 0) {
    text.innerText = `You attacked for ${playerDamage} damage.\nBut the ${currentMonster.name} counterattacked for ${monsterDamage} damage.\nYou died. ☠️`;
    update(locations[5]);
  } else {
    text.innerText = `You attacked the ${currentMonster.name} for ${playerDamage} damage.\nThe ${currentMonster.name} hit you back for ${monsterDamage} damage.`;
  }
}
}


// Fungsi untuk mengurangi health player saat menerima damage
function takeDamage(damage) {
  health -= damage;

  // Pastikan health tidak kurang dari 0
  if (health <= 0) {
    health = 0;
    document.getElementById('healthText').innerText = `0 / 100`;
    alert("Game Over! Kamu mati!");
    return;
  }

  // Update health text di UI
  const healthText = document.getElementById('healthText');
  const playerHealthStats = document.getElementById('playerHealthStats');

  healthText.innerText = `${health} / 100`;
  playerHealthStats.innerText = `${health}`;
}

function animateAttack() {
  text.style.transition = "transform 0.1s";
  text.style.transform = "scale(1.1)";
  setTimeout(() => {
    text.style.transform = "scale(1)";
  }, 100);
}

function dodge() {
  text.innerText = "You dodged the attack!";
}
function fightDragon() {
  currentMonster = { ...monsters[2] };
  monsterStats.style.display = "block";
  monsterName.innerText = currentMonster.name;
  monsterHealth.innerText = currentMonster.health;
  update(locations[3]);
}

function restart() {
  xp = 0;
  level = 1;
  maxXP = 100;
  health = 100;
  gold = 50;

  xpText.innerText = `${xp}`;
  healthText.innerText = `${health} / 100`;
  goldText.innerText = `Gold: ${gold}`;
  levelText.innerText = `Level: ${level}`;
  monsterStats.style.display = "none";
  updateXPBar();
  goTown();
}


window.onload = () => {
  goTown();
};
