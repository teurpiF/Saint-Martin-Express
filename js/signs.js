
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { roadCenter } from './road.js';

// --------------------------------------------------
// PARAMÈTRES
// --------------------------------------------------

const ROAD_WIDTH = 6.4;
const SIGN_DISTANCE = 3.2;

// --------------------------------------------------
// CRÉATION DU PICTOGRAMME LOCOMOTIVE
// --------------------------------------------------

function createTrainTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#20343b';
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = '#f5f0df';

  // Roues
  for (const x of [150, 245, 340]) {
    ctx.beginPath();
    ctx.arc(x, 345, 34, 0, Math.PI * 2);
    ctx.fill();
  }

  // Châssis
  ctx.fillRect(105, 290, 270, 35);

  // Corps de la locomotive
  ctx.fillRect(125, 215, 230, 85);
  ctx.fillRect(285, 185, 90, 115);

  // Cabine
  ctx.fillRect(115, 185, 75, 115);

  // Cheminée
  ctx.fillRect(155, 130, 30, 75);
  ctx.fillRect(145, 120, 50, 18);

  // Vapeur
  ctx.beginPath();
  ctx.arc(180, 95, 30, 0, Math.PI * 2);
  ctx.arc(215, 75, 38, 0, Math.PI * 2);
  ctx.arc(250, 95, 30, 0, Math.PI * 2);
  ctx.arc(225, 115, 28, 0, Math.PI * 2);
  ctx.fill();

  // Rail
  ctx.fillRect(75, 390, 350, 12);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

// --------------------------------------------------
// CRÉATION DU PANNEAU
// --------------------------------------------------

function createDirectionSign() {
  const sign = new THREE.Group();

  const boardWidth = 5.2;
  const boardHeight = 2.5;

  const boardMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.8
  });

  const board = new THREE.Mesh(
    new THREE.BoxGeometry(boardWidth, boardHeight, 0.18),
    boardMaterial
  );

  board.position.y = 4.1;
  board.castShadow = true;
  board.receiveShadow = true;
  sign.add(board);

  // Face avant du panneau
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(boardWidth - 0.12, boardHeight - 0.12),
    new THREE.MeshBasicMaterial({
      map: createTrainTexture()
    })
  );

  face.position.set(0, 4.1, 0.101);
  sign.add(face);

  // Texte du panneau
  const textCanvas = document.createElement('canvas');
  textCanvas.width = 1024;
  textCanvas.height = 256;

  const ctx = textCanvas.getContext('2d');

  ctx.fillStyle = '#20343b';
  ctx.fillRect(0, 0, 1024, 256);

  ctx.fillStyle = '#f5f0df';
  ctx.font = 'bold 100px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GLANDERGLAND', 512, 128);

  const textTexture = new THREE.CanvasTexture(textCanvas);
  textTexture.colorSpace = THREE.SRGBColorSpace;

  const text = new THREE.Mesh(
    new THREE.PlaneGeometry(4.8, 1.2),
    new THREE.MeshBasicMaterial({ map: textTexture })
  );

  text.position.set(0, 4.1, 0.11);
  sign.add(text);

  // Poteau
  const post = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 4.1, 0.16),
    new THREE.MeshStandardMaterial({
      color: 0x69777a,
      metalness: 0.55,
      roughness: 0.65
    })
  );

  post.position.y = 1.95;
  post.castShadow = true;
  sign.add(post);

  return sign;
}

// --------------------------------------------------
// INSTALLATION ET DÉFILEMENT
// --------------------------------------------------

export function createSigns(scene) {
  const sign = createDirectionSign();

  const initialZ = -75;

  scene.add(sign);

  function positionSign(z) {
    sign.position.set(
      roadCenter(z) + ROAD_WIDTH / 2 + SIGN_DISTANCE,
      0,
      z
    );
  }

  positionSign(initialZ);

  return {
    update(dt, speed) {
      sign.position.z += speed * dt;

      if (sign.position.z > 16) {
        sign.visible = false;
      }

      if (sign.visible) {
        positionSign(sign.position.z);
      }
    }
  };
}

