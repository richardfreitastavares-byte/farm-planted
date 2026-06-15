// Jogo de Fazenda Melhorado em P5.js
// Richard, copie este código no editor P5.js

let playerCoins = 100;
let seeds = {basic:0, premium:0};
let farm = [];
let tileSize = 50;
let cols, rows;
let selectedTool = "hand"; // hand, water, cut
let growthTime = 5000;

function setup() {
  createCanvas(700, 500);
  cols = width / tileSize;
  rows = (height - 120) / tileSize;
  for (let i = 0; i < cols; i++) {
    farm[i] = [];
    for (let j = 0; j < rows; j++) {
      farm[i][j] = { stage: 0, timer: 0, watered:false, type:"none" };
    }
  }
}

function draw() {
  background(120, 200, 120);
  drawFarm();
  drawHUD();
  updateFarm();
}

function drawFarm() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * tileSize;
      let y = j * tileSize;
      stroke(0);
      fill(160, 120, 60);
      rect(x, y, tileSize, tileSize);

      let plant = farm[i][j];
      if (plant.stage > 0) {
        if (plant.type === "basic") {
          if (plant.stage === 1) fill(0, 200, 0);
          if (plant.stage === 2) fill(0, 150, 0);
          if (plant.stage === 3) fill(255, 200, 0);
        } else if (plant.type === "premium") {
          if (plant.stage === 1) fill(100, 200, 250);
          if (plant.stage === 2) fill(50, 150, 200);
          if (plant.stage === 3) fill(255, 100, 200);
        }
        ellipse(x + tileSize / 2, y + tileSize / 2, tileSize / 2);
      }
      if (plant.watered) {
        fill(0,0,255,100);
        ellipse(x+tileSize/2, y+tileSize/2, 10);
      }
    }
  }
}

function drawHUD() {
  fill(50);
  rect(0, height - 120, width, 120);
  fill(255);
  textSize(16);
  text("Moedas: " + playerCoins, 20, height - 90);
  text("Sementes básicas: " + seeds.basic, 20, height - 60);
  text("Sementes premium: " + seeds.premium, 20, height - 30);

  text("Ferramenta: " + selectedTool, 250, height - 90);
  text("Teclas: [1] Mão | [2] Regar | [3] Cortar | [S] Loja", 250, height - 60);
  text("Clique no campo para usar a ferramenta", 250, height - 30);
}

function mousePressed() {
  let i = floor(mouseX / tileSize);
  let j = floor(mouseY / tileSize);
  if (j < rows) {
    let plant = farm[i][j];
    if (selectedTool === "hand") {
      if (plant.stage === 0 && seeds.basic > 0) {
        plant.stage = 1;
        plant.timer = millis();
        plant.type = "basic";
        plant.watered = false;
        seeds.basic--;
      } else if (plant.stage === 0 && seeds.premium > 0) {
        plant.stage = 1;
        plant.timer = millis();
        plant.type = "premium";
        plant.watered = false;
        seeds.premium--;
      } else if (plant.stage === 3) {
        playerCoins += (plant.type === "basic" ? 20 : 40);
        plant.stage = 0;
        plant.type = "none";
      }
    } else if (selectedTool === "water") {
      plant.watered = true;
    } else if (selectedTool === "cut") {
      if (plant.stage > 0) {
        playerCoins += 5; // cortar dá menos moedas
        plant.stage = 0;
        plant.type = "none";
      }
    }
  }
}

function keyPressed() {
  if (key === '1') selectedTool = "hand";
  if (key === '2') selectedTool = "water";
  if (key === '3') selectedTool = "cut";
  if (key === 's' || key === 'S') openShop();
}

function updateFarm() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let plant = farm[i][j];
      if (plant.stage > 0 && plant.stage < 3 && plant.watered) {
        if (millis() - plant.timer > growthTime) {
          plant.stage++;
          plant.timer = millis();
          plant.watered = false; // precisa regar de novo
        }
      }
    }
  }
}

function openShop() {
  if (playerCoins >= 10) {
    playerCoins -= 10;
    seeds.basic++;
  }
  if (playerCoins >= 20) {
    playerCoins -= 20;
    seeds.premium++;
  }
}
