
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { roadCenter } from './road.js';

const ROAD_WIDTH = 6.4;
const VERGE_WIDTH = 1.3;

// Face du panneau : locomotive et destination.
function createSignTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 420;

  const ctx = canvas.getContext('2d');

  // Fond bleu et bordure blanche.
  ctx.fillStyle = '#174b70';
  ctx.fillRect(0, 0, 1024, 420);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 14;
  ctx.strokeRect(12, 12, 1000, 396);

  ctx.fillStyle = '#ffffff';

  // Locomotive blanche à gauche.
  // Vapeur
  ctx.beginPath();
  ctx.arc(145, 95, 32, 0, Math.PI * 2);
  ctx.arc(185, 72, 38, 0, Math.PI * 2);
  ctx.arc(225, 98, 30, 0, Math.PI * 2);
  ctx.fill();

  // Cheminée et cabine
  ctx.fillRect(125, 130, 38, 115);
  ctx.fillRect(105, 165, 110, 100);

  // Corps de la locomotive
  ctx.fillRect(190, 190, 230, 100);
  ctx.fillRect(350, 150, 100, 140);

  // Châssis
  ctx.fillRect(95, 285, 380, 32);

  // Roues
  for (const x of [165, 275, 385]) {
    ctx.beginPath();
    ctx.arc(x, 325, 32, 0, Math.PI * 2);
    ctx.fill();
  }

  // Rail
  ctx.fillRect(85, 375, 390, 10);

  // Destination
  ctx.font = 'bold 76px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GLANDERGLAND', 720, 210);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

function createDirectionSign() {
  const sign = new THREE.Group();

  const width = 2.8;
  const height = 1.15;

  // Panneau
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, 0.10),
    new THREE.MeshStandardMaterial({
      color: 0x174b70,
      roughness: 0.8
    })
  );

  board.position.y = 2.55;
  board.castShadow = true;
  sign.add(board);

  // Face imprimée
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(width - 0.04, height - 0.04),
    new THREE.MeshBasicMaterial({
      map: createSignTexture()
    })
  );

  face.position.set(0, 2.55, 0.056);
  sign.add(face);

  // Poteau
  const post = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 2.5, 0.09),
    new THREE.MeshStandardMaterial({
      color: 0x69777a,
      metalness: 0.35,
      roughness: 0.7
    })
  );

  post.position.y = 1.2;
  post.castShadow = true;
  sign.add(post);

  return sign;
}

export function createSigns(scene) {
  const sign = createDirectionSign();
  const initialZ = -75;

  scene.add(sign);

  function positionSign(z) {
    const roadside = ROAD_WIDTH / 2 + VERGE_WIDTH + 0.45;

    sign.position.set(
      roadCenter(z) + roadside,
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
