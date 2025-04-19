let xp = 0;
let level = 1;
let maxXP = 100;
let health = 100;
let attackStat = 10;
let defenseStat = 5;
let agilityStat = 5;
let gold = 50;
let currentMonster;
let currentLocation;
let weaponIndex = 0;
const weapons = [
  { name: "Wooden Stick 🪵", power: 5 },
  { name: "Hammer 🔨", power: 10, cost: 20 },
  { name: "Axe 🪓", power: 20, cost: 40 },
  { name: "Katana ⚔️", power: 30, cost: 60 },
  { name: "Sword 🗡️", power: 50, cost: 80 },
];

const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const text = document.getElementById("text");
const xpText = document.getElementById("xpText");
const healthText = document.getElementById("healthText");
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
  document.getElementById("playerStats").classList.add("fade-in-slide");
  document.getElementById("stats").classList.add("fade-in-slide");
  document.getElementById("text").classList.add("fade-in-slide");
  document.getElementById("controls").classList.add("fade-in-slide");

  // Set initial health and XP display and stat
  document.getElementById("healthText").innerText = `${health} / 100`;
  document.getElementById("xpText").innerText = `${xp}`;
  updateStats();
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
  { name: "Dragon", level: 20, health: 300 },
];

const locations = [
  {
    name: "town square",
    buttonText: ["Go Store", "Go Cave", "Fight Dragon"],
    buttonFunctions: [goStore, goCave, fightDragon],
    text: 'You are in the town square. You see a sign that says "Store".',
    showKnight: false,
  },
  {
    name: "store",
    buttonText: ["Buy 10 Health (10 gold)", "Buy Sword (30 gold)", "Go Town"],
    buttonFunctions: [buyHealth, buySword, goTown],
    text: "You enter the store.",
    showKnight: false,
  },
  {
    name: "cave",
    buttonText: ["Fight Slime", "Fight Beast", "Go Town"],
    buttonFunctions: [() => fightMonster(0), () => fightMonster(1), goTown],
    text: "You enter the cave. You see some monsters.",
    showKnight: true,
  },
  {
    name: "fight",
    buttonText: ["Attack", "Dodge", "Run"],
    buttonFunctions: [attack, dodge, goTown],
    text: "You are fighting a monster.",
    showKnight: true,
  },
  {
    name: "kill monster",
    buttonText: ["Go Town", "Go Town", "Go Town"],
    buttonFunctions: [goTown, goTown, goTown],
    text: 'The monster screams "Arg!" as it dies. You gain experience and find gold.',
    showKnight: true,
  },
  {
    name: "lose",
    buttonText: ["REPLAY?", "REPLAY?", "REPLAY?"],
    buttonFunctions: [restart, restart, restart],
    text: "You die. ☠️",
  },
  {
    name: "win",
    buttonText: ["REPLAY?", "REPLAY?", "REPLAY?"],
    buttonFunctions: [restart, restart, restart],
    text: "You defeat the dragon! 🎉 YOU WIN THE GAME!",
  },
];

function update(location) {
  const knight = document.getElementById('knight-sprite');
  const knightIdle = document.getElementById('knight-idle');
  const slimeIdle = document.getElementById('slime-idle');
  const slimeSprite = document.getElementById('slime-sprite');
  const animationContainer = document.getElementById('animation-container');

  // Menampilkan knight dan slime tergantung pada lokasi dan keadaan
  if (location.showKnight) {
    knight.style.display = 'block';
    knightIdle.style.display = 'block';  // Menampilkan idle knight di cave
    slimeIdle.style.display = 'block';   // Menampilkan slime idle saat di cave
  } else {
    knight.style.display = 'none';
    knightIdle.style.display = 'none';  // Menyembunyikan idle knight saat bukan di cave
    slimeIdle.style.display = 'none';   // Menyembunyikan slime idle saat bukan di cave
  }

  if (location.name === "cave") {
    // Munculkan battle scene saat di cave
    animationContainer.style.visibility = 'visible';
    slimeSprite.style.visibility = 'visible';  // Pastikan slime muncul selama pertempuran
  } else {
    // Sembunyikan battle scene di lokasi lain
    animationContainer.style.visibility = 'hidden';
    slimeSprite.style.visibility = 'hidden';
  }

  // Update lokasi, teks, dan tombol
  currentLocation = location;
  text.innerText = location.text;
  button1.innerText = location.buttonText[0];
  button2.innerText = location.buttonText[1];
  button3.innerText = location.buttonText[2];
  button1.onclick = location.buttonFunctions[0];
  button2.onclick = location.buttonFunctions[1];
  button3.onclick = location.buttonFunctions[2];

  // Memainkan suara atau efek yang terkait dengan lokasi
  playSound(location.name);
}

function endBattle(winner) {
  // Sembunyikan elemen setelah pertempuran selesai
  const slimeSprite = document.getElementById('slime-sprite');
  const knightSprite = document.getElementById('knight-sprite');
  const animationContainer = document.getElementById('animation-container');
  
  // Sembunyikan battle setelah selesai
  slimeSprite.style.visibility = 'hidden';
  knightSprite.style.visibility = 'hidden';
  animationContainer.style.visibility = 'hidden';

  // Tampilkan pesan kemenangan atau kekalahan
  if (winner === 'knight') {

  } else {
    // Logika kalah
    alert('You were defeated by the monster!');
  }
}


function playSound(name) {
  const fightSound = document.getElementById("fightSound");
  const goldSound = document.getElementById("goldSound");
  const levelUpSound = document.getElementById("levelUpSound");

  console.log("playSound called with:", name);

  if (name === "kill monster") {
    goldSound.play();
  }
  if (name === "fight") {
    fightSound.play();
  }
  if (name === "level up") {
    levelUpSound.play();
  }
}

levelUpSound.addEventListener("play", () =>
  console.log("levelUpSound is playing")
);

function goTown() {
  update(locations[0]);
}
function goStore() {
  const weapon = weapons[weaponIndex + 1];
  update({
    name: "store",
    buttonText: [
      "Buy 10 Health (10 gold)",
      weapon
        ? `Buy ${weapon.name} (${weapon.cost} gold)`
        : "Max Weapon Reached",
      "Go Town",
    ],
    buttonFunctions: [
      buyHealth,
      weapon
        ? buyWeapon
        : () => (text.innerText = "You already have the best weapon!"),
      goTown,
    ],
    text: "You enter the store.",
  });
}

function updateWeaponStats() {
  const weapon = weapons[weaponIndex];
  const icon = weaponIcons[weapon.name] || "🛠️"; 
  const weaponStats = document.getElementById("weaponStats");

  weaponStats.innerText = `${icon} ${weapon.name} (Power +${weapon.power})`;
}
function buyWeapon() {
  const nextWeapon = weapons[weaponIndex + 1];
  if (gold >= nextWeapon.cost) {
    gold -= nextWeapon.cost;
    weaponIndex++;
    goldText.innerText = `Gold: ${gold}`;

    // Update weapon text
    weaponText.innerText = `Weapon: ${weapons[weaponIndex].name}`;

    // Tampilkan pesan upgrade dan animasi
    text.innerText = `🔥 You upgraded to ${weapons[weaponIndex].name}!`;
    text.classList.add("show");

    setTimeout(() => {
      text.classList.remove("show");
    }, 3000);
    // Animasi dan suara untuk upgrade senjata
    animateWeaponUpgrade();

    // Kembali ke toko
    goStore();
  } else {
    text.innerText = "Not enough gold!";
  } 
}

function animateWeaponUpgrade() {
  const weaponTextEl = document.getElementById("weaponText");

  // Tambah animasi (memperbesar dan memberi warna gold pada teks)
  weaponTextEl.classList.add("weapon-animate");

  // Hapus animasi setelah selesai
  setTimeout(() => {
    weaponTextEl.classList.remove("weapon-animate");
  }, 600);

  // Efek suara upgrade senjata
  const upgradeSound = new Audio("assets/sounds/upgrade.mp3"); // Pastikan file suara ada
  upgradeSound.play();
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
  attackStat += 5;
  defenseStat += 3;
  agilityStat += 2;

  healthText.innerText = ` ${health}`;
  levelText.innerText = `Level: ${level}`;
  text.innerText = `🎉 Level Up! You are now Level ${level}`;
  // Level up message animation
  const levelUpMessage = document.getElementById("levelUpMessage");
  levelUpMessage.classList.add("show");

  setTimeout(() => {
    levelUpMessage.classList.remove("show");
  }, 5000);

  playSound("level up");

  updateStats();
}

function updateStats() {
  let statsText = document.getElementById("statsText");
  if (!statsText) {
    statsText = document.createElement("div");
    statsText.id = "statsText";
    document.getElementById("stats").appendChild(statsText);
  }

  document.getElementById("attackStat").innerText = attackStat;
  document.getElementById("defenseStat").innerText = defenseStat;
  document.getElementById("agilityStat").innerText = agilityStat;
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
    // Menambahkan efek pada health
    document.getElementById("healthText").classList.add("upgraded");
    document.getElementById("playerHealthStats").classList.add("upgraded");

    // Menghilangkan efek setelah beberapa detik
    setTimeout(() => {
      document.getElementById("healthText").classList.remove("upgraded");
      document.getElementById("playerHealthStats").classList.remove("upgraded");
    }, 1000);

    // Memberikan feedback
    text.innerText = `💖 You bought health! Your health is now ${health} / 100.`;
    text.classList.add("show");
    setTimeout(() => {
      text.classList.remove("show");
    }, 3000);
  } else {
    text.innerText = "Not enough gold for health!";
    text.classList.add("show");
    setTimeout(() => {
      text.classList.remove("show");
    }, 3000);
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

  const knight = document.getElementById('knight-sprite');
  knight.style.display = 'block'; 
  update(locations[3]);
}

function shakeMonster() {
  const monsterStats = document.getElementById("monsterStats");

  monsterStats.classList.add("shake");

  // Hapus class shake setelah animasi selesai (dalam 600ms)
  setTimeout(() => {
    monsterStats.classList.remove("shake");
  }, 600);
}

function attack() {
  animateAttack();
  showAttackAnimation();

  const playerDamage = Math.floor(Math.random() * 10 + 1);
  // Mengurangi health monster
  currentMonster.health -= playerDamage;
  monsterHealth.innerText = currentMonster.health;

  shakeMonster();

  // Jika monster mati
  if (currentMonster.health <= 0) {
    gainXP(currentMonster.level * 10);
    gold += Math.floor(currentMonster.level * 3.5);
    goldText.innerText = `Gold: ${gold}`;
    updateXPBar();

    text.innerText = `You attacked for ${playerDamage} damage and defeated the monster!`;
    update(locations[4]); 
    endBattle('knight'); 

    resetBattleAnimations();
    return;
  } else {
    // Jika monster masih hidup, monster menyerang balik
    const monsterDamage = currentMonster.level * 5; // Damage monster berdasarkan level
    takeDamage(monsterDamage); 
    
    // Mengecek apakah player masih hidup
    if (health <= 0) {
      text.innerText = `You attacked for ${playerDamage} damage.\nBut the ${currentMonster.name} counterattacked for ${monsterDamage} damage.\nYou died. ☠️`;
      update(locations[5]);
      endBattle('slime');
      resetBattleAnimations();
    } else {
      text.innerText = `You attacked the ${currentMonster.name} for ${playerDamage} damage.\nThe ${currentMonster.name} hit you back for ${monsterDamage} damage.`;
    }
  }
}

function showAttackAnimation() {
  const animContainer = document.getElementById("animation-container");
  const sprite = document.getElementById("knight-sprite");

  animContainer.style.display = "flex";
  sprite.style.animation = "none"; // reset animasi
  void sprite.offsetWidth; // trigger reflow
  sprite.style.animation = "knightAttack 0.6s steps(4) 1"; // jalanin animasi
  console.log("🌀 Animasi jalan!");
  
  // setelah 0.6 detik, sembunyikan
  setTimeout(() => {
    animContainer.style.display = "none";
  }, 600);
}

// Fungsi untuk mengurangi health saat diserang monster
function takeDamage(damage) {
  health -= damage;

  // Pastikan health tidak kurang dari 0
  if (health <= 0) {
    health = 0;
    document.getElementById('healthText').innerText = `0 / 100`;

    // Menambahkan efek merah saat diserang dan health habis
    document.getElementById('healthText').classList.add('damaged');

    // Menghilangkan efek setelah beberapa detik
    setTimeout(() => {
      document.getElementById('healthText').classList.remove('damaged');
    }, 1000);  // Efek hilang setelah 1 detik

    alert("Game Over! Kamu mati!");
    return;
  }

  // Update health text di UI
  const healthText = document.getElementById("healthText");

  healthText.innerText = `${health} / 100`;

  // Menambahkan efek merah saat diserang
  healthText.classList.add('damaged');

  // Menghilangkan efek setelah beberapa detik
  setTimeout(() => {
    healthText.classList.remove('damaged');
  }, 1000);  // Efek hilang setelah 1 detik
}


// Fungsi untuk menangani serangan monster
function monsterAttack() {
  const playerHealth = document.getElementById("playerHealthStats");

  // Kurangi darah pemain
  let currentHealth = parseInt(playerHealth.textContent);
  currentHealth -= 10; // Misalnya monster menyerang dengan damage 10
  playerHealth.textContent = currentHealth; // Update tampilan darah

  // Panggil efek "damaged" untuk menambahkan kelas
  damagePlayer(); // Menambahkan efek merah saat pemain terkena damage
}

// Fungsi yang menambahkan kelas "damaged" dan menghapusnya setelah 1 detik
function damagePlayer() {
  const playerHealthText = document.getElementById("healthText");
  let currentHealth = parseInt(playerHealthText.textContent);

  // Mengurangi darah pemain
  currentHealth -= 10;
  playerHealthText.textContent = `${currentHealth} / 100`;

  // Menambahkan efek merah sementara
  playerHealthText.classList.add("damaged");

  // Menghapus kelas "damaged" setelah 1 detik
  setTimeout(() => {
    playerHealthText.classList.remove("damaged");
  }, 1000);
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
  console.log("Restarting game...");
  xp = 0;
  level = 1;
  maxXP = 100;
  health = 100;
  gold = 50;

  xp.innerText = `${xp}`;
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
