import { createTractorModel } from './tractor.js';
import { createRocks } from './rocks.js';
import { createPotholes } from './potholes.js';
import { createRoad, roadCenter } from './road.js';


import { createSigns } from './signs.js?v=3';
import { createSaintMartin } from './saintMartin.js';
import { createBonuses } from './bonuses.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';


import { createFollowCamera } from './camera.js';
import { createVivaro } from './vivaro.js';

const container = document.getElementById('scene');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9dc5df);
scene.fog = new THREE.Fog(0x9dc5df, 80, 300);

const camera = new THREE.PerspectiveCamera(
  48,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);

scene.add(new THREE.HemisphereLight(0xe6f3ff, 0x65704e, 2));

const sunlight = new THREE.DirectionalLight(0xfff0d8, 2.5);
sunlight.position.set(-12, 22, 8);
sunlight.castShadow = true;
scene.add(sunlight);

const road = createRoad(scene);

const signs = createSigns(scene);
const saintMartin = createSaintMartin(scene);
const rocks = createRocks(scene);

const potholes = createPotholes(scene);
const bonuses = createBonuses(scene);


// Tracteur mobile : obstacle dans la voie de droite.
let tractorObstacle = null;
let nextTractorDistance = 0;

function spawnTractor() {
  if (tractorObstacle) {
    scene.remove(tractorObstacle);
  }

  // Nouveau modèle : couleur choisie aléatoirement.
  tractorObstacle = createTractorModel();
  tractorObstacle.scale.setScalar(0.55);

  tractorObstacle.position.set(
    roadCenter(-18) + 1.65,
    0,
    -18
  );

  tractorObstacle.visible = true;
  scene.add(tractorObstacle);
}

// Première apparition.
spawnTractor();



const car = createVivaro(scene);
const updateCamera = createFollowCamera(camera);

let running = false;
let paused = false;
let gameOver = false;
let distance = 0;
let lives = 3;
let speed = 9;
let steering = 0;
let targetSteering = 0;
let elapsed = 0;
let lastTime = 0;
let animationId = null;
let speedBoostEndDistance = 0;
let immunityEndDistance = 0;

const SPEED_MULTIPLIER = 1.5;

function isImmune() {
  return distance < immunityEndDistance;
}

const distanceElement = document.getElementById('distance');
const livesElement = document.getElementById('lives');


const offroadBar = document.getElementById('offroadBar');

let offroad = 100;
let offroadDamageTimer = 0;



const startScreen = document.getElementById('start');
const pauseScreen = document.getElementById('pauseScreen');
const endScreen = document.getElementById('end');
const finalDistanceElement = document.getElementById('finalDistance');
const hint = document.getElementById('hint');



const bangEffect = document.getElementById('bangEffect');

function showBang() {
  bangEffect.classList.remove('show');
  void bangEffect.offsetWidth;
  bangEffect.classList.add('show');
}

bangEffect.addEventListener('animationend', () => {
  bangEffect.classList.remove('show');
});





function updateHUD() {
  distanceElement.textContent = Math.floor(distance);

  livesElement.textContent =
    '♥ '.repeat(lives).trim() + (lives < 3 ? ' ♡'.repeat(3 - lives) : '');

  offroadBar.style.width = offroad + '%';

  if (offroad > 50) {
    offroadBar.style.background = '#75c879';
  } else if (offroad > 20) {
    offroadBar.style.background = '#ffc56c';
  } else {
    offroadBar.style.background = '#ff554d';
  }
}




function updateOffroad(dt) {

  const roadPosition = roadCenter(3);

  const distanceFromRoad = Math.abs(
    car.group.position.x - roadPosition
  );

  // Le véhicule commence à quitter la chaussée.
  const isOffroad = distanceFromRoad > 2.2;

  if (isOffroad) {

    offroad = Math.max(0, offroad - 40 * dt);

    if (offroad <= 0) {

      offroadDamageTimer -= dt;

if (offroadDamageTimer <= 0 && !isImmune()) {
        lives--;
        offroadDamageTimer = 2;

        updateHUD();

        if (lives <= 0) {
          endGame();
        }
      }
    }

  } else {

    offroad = Math.min(100, offroad + 25 * dt);
    offroadDamageTimer = 0;
  }
}










function startGame() {
  distance = 0;
  lives = 3;
  speedBoostEndDistance = 0;
immunityEndDistance = 0;
car.group.visible = true;

offroad = 100;
offroadDamageTimer = 0;
  
  speed = 9;
  steering = 0;
  targetSteering = 0;
  elapsed = 0;
  running = true;
  paused = false;
  gameOver = false;

  startScreen.classList.add('hidden');
  pauseScreen.classList.add('hidden');
  endScreen.classList.add('hidden');
  hint.classList.remove('hidden');

car.group.position.set(0, 0, 3);
signs.reset();
saintMartin.reset();
rocks.reset();
potholes.reset();
bonuses.reset();
spawnTractor();

nextTractorDistance =
  [2, 3, 4][Math.floor(Math.random() * 3)] * 120;

  
bangEffect.classList.remove('show');
  
updateHUD();
  

  lastTime = performance.now();
  if (animationId !== null) cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(animate);
}

function endGame() {
  running = false;
  gameOver = true;
  finalDistanceElement.textContent = Math.floor(distance);
  endScreen.classList.remove('hidden');
  hint.classList.add('hidden');
}

function togglePause() {
  if (!running || gameOver) return;

  paused = !paused;
  pauseScreen.classList.toggle('hidden', !paused);

  if (!paused) {
    lastTime = performance.now();
    animationId = requestAnimationFrame(animate);
  }
}

function animate(now) {
  if (!running || paused) return;

  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  elapsed += dt;

  distance += speed * dt;
  
 
  if (tractorObstacle.visible) {
    // Le tracteur avance à 50 % de la vitesse du Vivaro.
    tractorObstacle.position.z += speed * 0.5 * dt;

    // Il suit la courbure de la route dans la voie droite.
    tractorObstacle.position.x =
      roadCenter(tractorObstacle.position.z) + 1.65;

    // Détection de collision avec le Vivaro.
    const distanceZ = Math.abs(
      tractorObstacle.position.z - car.group.position.z
    );

    const distanceX = Math.abs(
      tractorObstacle.position.x - car.group.position.x
    );

if (distanceZ < 1.7 && distanceX < 1.35) {
  tractorObstacle.visible = false;

  if (!isImmune()) {
    lives--;
    showBang();
    updateHUD();

    if (lives <= 0) {
      endGame();
      return;
    }
  }
}


    // Le tracteur disparaît après avoir dépassé le Vivaro.
    if (tractorObstacle.position.z > car.group.position.z + 3) {
      tractorObstacle.visible = false;
    }
  }

  // Réapparition après 2, 3 ou 4 espacements de panneaux.
  if (!tractorObstacle.visible && distance >= nextTractorDistance) {
    spawnTractor();

    nextTractorDistance =
      distance + [2, 3, 4][Math.floor(Math.random() * 3)] * 120;
  }

  
const baseSpeed = Math.min(9 + distance * 0.008, 19);

speed = distance < speedBoostEndDistance
  ? baseSpeed * SPEED_MULTIPLIER
  : baseSpeed;

  // Direction progressive : le véhicule suit le mouvement du doigt.
  steering += (targetSteering - steering) * Math.min(1, dt * 4.5);
  car.group.position.x += steering * dt * 5.5;

  updateOffroad(dt);

if (gameOver) return;


  
  // La route défile sous le véhicule.
  car.group.position.z = 3;
  road.update(dt, speed, car.group.position.x, () => {
  lives--;
  showBang();
  updateHUD();

  if (lives <= 0) {
    endGame();
  }
});



  
  signs.update(dt, speed);

  saintMartin.update(dt, speed, distance, car.group.position.x, (deadly) => {
    if (isImmune()) return;
    if (deadly) {
    lives = 0;
    updateHUD();
    endGame();
    return;
  }

  lives--;
  showBang();
  updateHUD();

  if (lives <= 0) {
    endGame();
  }
});
if (gameOver) return;
  
rocks.update(dt, speed, car.group.position.x, () => {
   if (isImmune()) return; 
  lives--;
  showBang();
  updateHUD();

  if (lives <= 0) {
    endGame();
  }
});

potholes.update(dt, speed, car.group.position.x, () => {
  lives--;
  showBang();
  updateHUD();

  if (lives <= 0) {
    endGame();
  }
});

  
bonuses.update(dt, speed, distance, car.group.position.x, (type) => {
  if (type === 'sponge') {
    lives = Math.min(3, lives + 1);
    updateHUD();
  }

  if (type === 'suze') {
    speedBoostEndDistance = distance + 100;
    immunityEndDistance = distance + 120;
  }
});
  
  car.update(dt, steering, speed);
  updateCamera(car.group, dt, window.innerWidth / window.innerHeight);

  // Petite inclinaison dans les virages.
  car.group.rotation.z = -steering * 0.045;

  // Pour le moment, la distance est le score.
  updateHUD();

  renderer.render(scene, camera);
  animationId = requestAnimationFrame(animate);
}

let pointerActive = false;
let pointerStartX = 0;
let steeringStart = 0;

renderer.domElement.addEventListener('pointerdown', (event) => {
  pointerActive = true;
  pointerStartX = event.clientX;
  steeringStart = targetSteering;
  renderer.domElement.setPointerCapture(event.pointerId);
});

renderer.domElement.addEventListener('pointermove', (event) => {
  if (!pointerActive || !running || paused) return;

  const delta = (event.clientX - pointerStartX) / (window.innerWidth * 0.28);
  targetSteering = THREE.MathUtils.clamp(steeringStart + delta, -1, 1);
});

function stopPointer() {
  pointerActive = false;
  targetSteering = 0;
}

renderer.domElement.addEventListener('pointerup', stopPointer);
renderer.domElement.addEventListener('pointercancel', stopPointer);

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') targetSteering = -1;
  if (event.key === 'ArrowRight') targetSteering = 1;
  if (event.key === 'Escape') togglePause();
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    targetSteering = 0;
  }
});

document.getElementById('play').addEventListener('click', startGame);
document.getElementById('again').addEventListener('click', startGame);
document.getElementById('pause').addEventListener('click', togglePause);
document.getElementById('resume').addEventListener('click', togglePause);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

updateHUD();
renderer.render(scene, camera);
