// Mobile menu
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

// Cart counter
let cartCount = 0;
const cartCountElement = document.getElementById("cartCount");

document.querySelectorAll(".add-btn").forEach((button) => {
  button.addEventListener("click", () => {
    cartCount++;
    cartCountElement.textContent = cartCount;

    button.textContent = "Added ✓";
    setTimeout(() => {
      button.textContent = "Add";
    }, 1200);
  });
});

// Logo moves to top-left after scrolling
window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    document.body.classList.add("scrolled");
  } else {
    document.body.classList.remove("scrolled");
  }
});

// Anime-style coffee journey canvas
const canvas = document.getElementById("coffeeCanvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let scrollProgress = 0;
let time = 0;

const stages = [
  "Coffee Plant",
  "Peel Cherries",
  "Roast Beans",
  "Grind Beans",
  "Espresso Shot"
];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress = scrollable > 0 ? window.scrollY / scrollable : 0;
}

// Anime sky/background for each stage
function drawSceneBackground(stage) {
  let topColor, bottomColor;

  if (stage === 0) {
    topColor = "#7ec8e3";
    bottomColor = "#3f7d4e";
  } else if (stage === 1) {
    topColor = "#f7c8d0";
    bottomColor = "#8c3b4a";
  } else if (stage === 2) {
    topColor = "#2b1a12";
    bottomColor = "#7a2d12";
  } else if (stage === 3) {
    topColor = "#3b3f45";
    bottomColor = "#191c1f";
  } else {
    topColor = "#1b1e22";
    bottomColor = "#3a2415";
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, topColor);
  gradient.addColorStop(1, bottomColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

// Soft anime clouds
function drawCloud(x, y, scale, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(255,255,255,.85)";

  ctx.beginPath();
  ctx.arc(x, y, 28 * scale, 0, Math.PI * 2);
  ctx.arc(x + 32 * scale, y + 6 * scale, 22 * scale, 0, Math.PI * 2);
  ctx.arc(x - 32 * scale, y + 8 * scale, 20 * scale, 0, Math.PI * 2);
  ctx.arc(x + 8 * scale, y - 16 * scale, 20 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawBean(x, y, size, rotation, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, size, size * 0.68, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(0,0,0,.45)";
  ctx.lineWidth = Math.max(2, size * 0.14);
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.68);
  ctx.quadraticCurveTo(size * 0.3, 0, 0, size * 0.68);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,.25)";
  ctx.beginPath();
  ctx.ellipse(-size * 0.3, -size * 0.25, size * 0.25, size * 0.14, -0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCherry(x, y, size) {
  ctx.save();

  ctx.fillStyle = "#e11d2e";
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,.35)";
  ctx.beginPath();
  ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.28, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#2f4a2b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + 4, y - size - 12);
  ctx.stroke();

  ctx.restore();
}

// Stage progress guide
function drawStageGuide(currentStage) {
  const guideY = height * 0.9;
  const spacing = Math.min(150, width / 6);
  const startX = width / 2 - spacing * 2;

  stages.forEach((label, index) => {
    const x = startX + index * spacing;
    const isActive = index === currentStage;

    ctx.beginPath();
    ctx.arc(x, guideY, isActive ? 11 : 7, 0, Math.PI * 2);
    ctx.fillStyle = isActive ? "#e11d2e" : "rgba(255,255,255,.35)";
    ctx.fill();

    if (isActive) {
      ctx.strokeStyle = "rgba(255,255,255,.8)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, guideY, 17, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = isActive ? "#ffffff" : "rgba(255,255,255,.55)";
    ctx.font = "600 13px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, x, guideY + 34);
  });
}

// Stage title
function drawTitle(text) {
  ctx.fillStyle = "rgba(255,255,255,.95)";
  ctx.font = "800 30px Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0,0,0,.45)";
  ctx.shadowBlur = 12;
  ctx.fillText(text, width / 2, height * 0.14);
  ctx.shadowBlur = 0;
}

// 1. Coffee plant with cherries
function drawPlantScene() {
  const cx = width / 2;
  const baseY = height * 0.82;

  drawTitle("Coffee Plant");

  // Sun
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.arc(width * 0.82, height * 0.18, 45, 0, Math.PI * 2);
  ctx.fill();

  // Moving clouds
  drawCloud(((time * 18) % (width + 250)) - 120, height * 0.2, 1, 0.9);
  drawCloud(((time * 12) % (width + 300)) - 150, height * 0.32, 0.7, 0.7);

  // Soil
  ctx.fillStyle = "#5b3a22";
  ctx.beginPath();
  ctx.ellipse(cx, baseY + 25, 220, 40, 0, 0, Math.PI * 2);
  ctx.fill();

  // Plant sway
  const sway = Math.sin(time * 1.4) * 10;

  // Stem
  ctx.strokeStyle = "#2f4a2b";
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx, baseY);
  ctx.quadraticCurveTo(cx + sway, baseY - 140, cx + sway * 1.5, baseY - 270);
  ctx.stroke();

  // Branches
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(cx + sway * 0.5, baseY - 120);
  ctx.quadraticCurveTo(cx - 60, baseY - 160, cx - 100, baseY - 200);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + sway, baseY - 160);
  ctx.quadraticCurveTo(cx + 70, baseY - 200, cx + 110, baseY - 240);
  ctx.stroke();

  // Leaves
  const leaves = [
    [-105, -205, -0.7],
    [115, -245, 0.7],
    [-70, -150, -0.5],
    [75, -190, 0.5],
    [-45, -110, -0.8],
    [50, -140, 0.8]
  ];

  leaves.forEach(([dx, dy, angle], i) => {
    const leafSway = Math.sin(time * 2 + i) * 4;

    ctx.save();
    ctx.translate(cx + dx + sway * 0.6, baseY + dy);
    ctx.rotate(angle + leafSway * 0.02);

    ctx.fillStyle = "#3f7d4e";
    ctx.beginPath();
    ctx.ellipse(0, 0, 48, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#2f4a2b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-42, 0);
    ctx.lineTo(42, 0);
    ctx.stroke();

    ctx.restore();
  });

  // Cherries
  const cherries = [
    [-85, -215], [-60, -185],
    [95, -250], [70, -220],
    [-40, -130], [45, -155],
    [-15, -250], [20, -270]
  ];

  cherries.forEach(([dx, dy], i) => {
    const cherrySway = Math.sin(time * 2.2 + i) * 4;
    drawCherry(cx + dx + sway * 0.6 + cherrySway, baseY + dy, 13);
  });
}

// 2. Peeling cherries to reveal beans
function drawPeelingScene() {
  const cx = width / 2;
  const cy = height * 0.52;

  drawTitle("Peel the Cherries");

  drawCloud(((time * 14) % (width + 250)) - 120, height * 0.2, 0.8, 0.5);

  // Big cherry
  const pulse = 1 + Math.sin(time * 2) * 0.04;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(pulse, pulse);

  ctx.fillStyle = "#e11d2e";
  ctx.beginPath();
  ctx.arc(0, 0, 110, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,.3)";
  ctx.beginPath();
  ctx.ellipse(-38, -38, 32, 20, -0.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Opening peel animation
  const open = (Math.sin(time * 1.5) + 1) / 2;

  ctx.strokeStyle = "#ff5c69";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(cx - 105, cy - 15);
  ctx.quadraticCurveTo(cx, cy - 40 - open * 25, cx + 105, cy - 15);
  ctx.stroke();

  // Beans coming out
  const beans = [
    [-45, 25], [0, 45], [45, 25]
  ];

  beans.forEach(([dx, dy], i) => {
    const float = Math.sin(time * 2 + i) * 7;
    drawBean(cx + dx, cy + dy + float, 26, Math.sin(time + i) * 0.2, "#8a5a33");
  });

  // Peel pieces flying gently
  for (let i = 0; i < 4; i++) {
    const angle = time * 0.8 + i * 1.6;
    const x = cx + Math.cos(angle) * 175;
    const y = cy + Math.sin(angle) * 90;

    ctx.fillStyle = "rgba(225,29,46,.75)";
    ctx.beginPath();
    ctx.ellipse(x, y, 18, 9, angle, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 3. Roasting beans
function drawRoastingScene() {
  const cx = width / 2;
  const cy = height * 0.55;

  drawTitle("Roast the Beans");

  // Roasting pan
  ctx.fillStyle = "#2e3438";
  ctx.beginPath();
  ctx.ellipse(cx, cy + 75, 230, 62, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#e11d2e";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 75, 230, 62, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Roasting beans
  const beans = [
    [-150, 45], [-90, 62], [-25, 42], [45, 62], [150, 45],
    [-115, 10], [-45, 18], [30, 10], [110, 18]
  ];

  beans.forEach(([dx, dy], i) => {
    const jump = Math.abs(Math.sin(time * 3 + i)) * -14;
    drawBean(
      cx + dx,
      cy + dy + jump,
      26,
      time * 1.5 + i,
      "#8a5a33"
    );
  });

  // Fire
  for (let i = 0; i < 7; i++) {
    const flameX = cx - 180 + i * 60;
    const flameHeight = 55 + Math.sin(time * 8 + i) * 20;

    ctx.fillStyle = i % 2 === 0 ? "#e11d2e" : "#ff8c1a";
    ctx.beginPath();
    ctx.moveTo(flameX - 22, cy + 145);
    ctx.quadraticCurveTo(flameX, cy + 145 - flameHeight, flameX + 22, cy + 145);
    ctx.fill();
  }

  // Heat waves
  for (let i = 0; i < 4; i++) {
    const y = cy + 20 - ((time * 35 + i * 30) % 130);

    ctx.strokeStyle = "rgba(255,140,26,.35)";
    ctx.lineWidth = 4;
    ctx.beginPath();

    for (let x = cx - 160; x <= cx + 160; x += 15) {
      ctx.lineTo(x, y + Math.sin((x * 0.03) + time * 4 + i) * 8);
    }
    ctx.stroke();
  }
}

// 4. Traditional grinding
function drawGrindingScene() {
  const cx = width / 2;
  const cy = height * 0.55;

  drawTitle("Grind the Beans");

  // Stone base
  ctx.fillStyle = "#4a5158";
  ctx.beginPath();
  ctx.ellipse(cx, cy + 120, 210, 55, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mortar
  ctx.fillStyle = "#2b3136";
  ctx.beginPath();
  ctx.ellipse(cx, cy + 45, 165, 70, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1f2428";
  ctx.beginPath();
  ctx.ellipse(cx, cy + 35, 135, 48, 0, 0, Math.PI * 2);
  ctx.fill();

  // Beans inside
  const beans = [
    [-85, 25], [-35, 40], [20, 25], [80, 40],
    [-55, 5], [10, 5], [65, 5]
  ];

  beans.forEach(([dx, dy], i) => {
    const shake = Math.sin(time * 7 + i) * 3;
    drawBean(cx + dx + shake, cy + dy, 22, time + i, "#8a5a33");
  });

  // Moving pestle
  const pestleX = Math.sin(time * 2.2) * 35;
  const pestleTilt = Math.sin(time * 2.2) * 0.18;

  ctx.save();
  ctx.translate(cx + pestleX, cy - 55);
  ctx.rotate(pestleTilt);

  ctx.fillStyle = "#565f66";
  ctx.beginPath();
  ctx.roundRect(-24, -150, 48, 230, 22);
  ctx.fill();

  ctx.fillStyle = "#e11d2e";
  ctx.beginPath();
  ctx.arc(0, -150, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Ground coffee
  for (let i = 0; i < 18; i++) {
    const x = cx - 130 + i * 15 + Math.sin(time * 3 + i) * 3;
    const y = cy + 135 + (i % 3) * 9;

    ctx.fillStyle = "#6b4226";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 5. Espresso pouring into mug
function drawEspressoScene() {
  const cx = width / 2;
  const cupTop = height * 0.45;
  const cupBottom = height * 0.8;

  drawTitle("Espresso Shot");

  // Espresso machine
  ctx.fillStyle = "#2e3438";
  ctx.beginPath();
  ctx.roundRect(cx - 130, cupTop - 210, 260, 75, 18);
  ctx.fill();

  ctx.fillStyle = "#e11d2e";
  ctx.beginPath();
  ctx.roundRect(cx - 40, cupTop - 150, 80, 30, 10);
  ctx.fill();

  // Espresso stream
  const streamBottom = cupTop + 55 + Math.sin(time * 1.5) * 12;

  ctx.strokeStyle = "#8a5a33";
  ctx.lineWidth = 16;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx, cupTop - 120);
  ctx.lineTo(cx, streamBottom);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,.2)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(cx - 4, cupTop - 120);
  ctx.lineTo(cx - 4, streamBottom);
  ctx.stroke();

  // Coffee mug
  ctx.fillStyle = "#f4f1ea";
  ctx.beginPath();
  ctx.moveTo(cx - 115, cupTop + 45);
  ctx.quadraticCurveTo(cx - 100, cupBottom, cx, cupBottom);
  ctx.quadraticCurveTo(cx + 100, cupBottom, cx + 115, cupTop + 45);
  ctx.closePath();
  ctx.fill();

  // Mug handle
  ctx.strokeStyle = "#f4f1ea";
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.arc(cx + 135, cupTop + 95, 42, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();

  // Coffee inside mug
  const coffeeLevel = cupBottom - 30 - Math.abs(Math.sin(time * 0.8)) * 25;

  ctx.fillStyle = "#4b2e1b";
  ctx.beginPath();
  ctx.ellipse(cx, coffeeLevel, 88, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Crema
  ctx.fillStyle = "#c68a4b";
  ctx.beginPath();
  ctx.ellipse(cx, coffeeLevel - 6, 78, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Steam
  for (let i = 0; i < 3; i++) {
    const steamX = cx - 35 + i * 35;
    const rise = (time * 25 + i * 30) % 110;

    ctx.strokeStyle = "rgba(255,255,255,.28)";
    ctx.lineWidth = 5;
    ctx.beginPath();

    for (let y = 0; y <= 70; y += 8) {
      ctx.lineTo(
        steamX + Math.sin((y * 0.08) + time * 3 + i) * 10,
        cupTop - 20 - rise - y
      );
    }
    ctx.stroke();
  }
}

// Main render loop
function render() {
  time += 0.016;

  // 5 clear scroll sections
  const rawStage = scrollProgress * 5;
  const stage = Math.min(4, Math.floor(rawStage));

  drawSceneBackground(stage);

  if (stage === 0) drawPlantScene();
  else if (stage === 1) drawPeelingScene();
  else if (stage === 2) drawRoastingScene();
  else if (stage === 3) drawGrindingScene();
  else drawEspressoScene();

  drawStageGuide(stage);

  requestAnimationFrame(render);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  updateScrollProgress();
});

window.addEventListener("scroll", updateScrollProgress, { passive: true });

resizeCanvas();
updateScrollProgress();
render();