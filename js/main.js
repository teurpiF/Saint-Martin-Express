window.addEventListener(‘error’, (event) => {
alert(’Erreur JavaScript : ’ + event.message);
});

window.addEventListener(‘unhandledrejection’, (event) => {
alert(’Erreur de chargement : ’ + event.reason);
});



import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { createRoad } from './road.js';
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
scene.fog = new THREE.Fog(0x9dc5df, 45, 150);

const camera = new THREE.PerspectiveCamera(
  48,
  window.innerWidth / window.innerHeight,
  0.1,
  250
);

scene.add(new THREE.HemisphereLight(0xe6f3ff, 0x65704e, 2));

const sunlight = new THREE.DirectionalLight(0xfff0d8, 2.5);
sunlight.position.set(-12, 22, 8);
sunlight.castShadow = true;
scene.add(sunlight);

const road = createRoad(scene);
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

const distanceElement = document.getElementById('distance');
const livesElement = document.getElementById('lives');
const startScreen = document.getElementById('start');
const pauseScreen = document.getElementById('pauseScreen');
const endScreen = document.getElementById('end');
const finalDistanceElement = document.getElementById('finalDistance');
const hint = document.getElementById('hint');

function updateHUD() {
  distanceElement.textContent = Math.floor(distance);
  livesElement.textContent =
    '♥ '.repeat(lives).trim() + (lives < 3 ? ' ♡'.repeat(3 - lives) : '');
}

function startGame() {
  distance = 0;
  lives = 3;
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
  speed = Math.min(9 + distance * 0.008, 19);

  // Direction progressive : le véhicule suit le mouvement du doigt.
  steering += (targetSteering - steering) * Math.min(1, dt * 4.5);
  car.group.position.x += steering * dt * 5.5;

  // La route défile sous le véhicule.
  car.group.position.z = 3;
  road.update(dt, speed);

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