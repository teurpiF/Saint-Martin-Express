
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { roadCenter } from './road.js';

const ROAD_WIDTH = 6.4;
const VERGE_WIDTH = 1.3;
const POST_DISTANCE = ROAD_WIDTH / 2 + VERGE_WIDTH + 0.45;

// --------------------------------------------------
// PANNEAU VERT
// --------------------------------------------------

function createSignTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 300;

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#00613f';
  ctx.fillRect(0, 0, 1200, 300);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 12;
  ctx.strokeRect(10, 10, 1180, 280);

  ctx.fillStyle = '#ffffff';

  // Locomotive
  ctx.beginPath();
  ctx.arc(125, 85, 24, 0, Math.PI * 2);
  ctx.arc(165, 65, 30, 0, Math.PI * 2);
  ctx.arc(205, 85, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillRect(120, 110, 35, 90);
  ctx.fillRect(100, 145, 110, 70);
  ctx.fillRect(190, 155, 210, 60);
  ctx.fillRect(335, 125, 85, 90);
  ctx.fillRect(90, 205, 350, 22);

  for (const x of [155, 255, 355]) {
    ctx.beginPath();
    ctx.arc(x, 235, 25, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillRect(80, 270, 380, 8);

  // Séparation
  ctx.fillRect(490, 55, 7, 190);

  // Destination
  ctx.font = 'bold 100px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GLANDERGLAND', 850, 155);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

// --------------------------------------------------
// STRUCTURE DU PORTIQUE
// --------------------------------------------------

function createDirectionSign() {
  const gantry = new THREE.Group();

  const metal = new THREE.MeshStandardMaterial({
    color: 0x899397,
    metalness: 0.7,
    roughness: 0.45
  });

  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x59666b,
    metalness: 0.65,
    roughness: 0.55
  });

  // Deux poteaux verticaux
  for (const side of [-1, 1]) {
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 6.2, 0.22),
      metal
    );

    post.position.set(side * POST_DISTANCE, 3.1, 0);
    post.castShadow = true;
    gantry.add(post);

    // Pied renforcé
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.45, 0.65),
      darkMetal
    );

    base.position.set(side * POST_DISTANCE, 0.22, 0);
    gantry.add(base);
  }

  // Traverse horizontale supérieure
  const beam = new THREE.Mesh(
    new THREE.BoxGeometry(POST_DISTANCE * 2 + 0.3, 0.28, 0.28),
    metal
  );

  beam.position.y = 5.85;
  beam.castShadow = true;
  gantry.add(beam);

  // Traverse de renfort
  const lowerBeam = new THREE.Mesh(
    new THREE.BoxGeometry(POST_DISTANCE * 2 + 0.3, 0.12, 0.16),
    darkMetal
  );

  lowerBeam.position.y = 4.35;
  gantry.add(lowerBeam);

  // Panneau suspendu
  const width = 8.8;
  const height = 1.65;

  const board = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, 0.14),
    new THREE.MeshStandardMaterial({
      color: 0x00613f,
      roughness: 0.75
    })
  );

  board.position.set(0, 5.05, 0);
  board.castShadow = true;
  gantry.add(board);

  // Face imprimée
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(width - 0.06, height - 0.06),
    new THREE.MeshBasicMaterial({
      map: createSignTexture()
    })
  );

  face.position.set(0, 5.05, 0.076);
  gantry.add(face);

  // Suspentes
  for (const x of [-3.5, 3.5]) {
    const hanger = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.45, 0.08),
      darkMetal
    );

    hanger.position.set(x, 5.98, 0);
    gantry.add(hanger);
  }

  return gantry;
}

// --------------------------------------------------
// INSTALLATION ET DÉFILEMENT
// --------------------------------------------------

export function createSigns(scene) {
  const gantry = createDirectionSign();

  const initialZ = -75;

  scene.add(gantry);

  function positionGantry(z) {
    gantry.position.set(
      roadCenter(z),
      0,
      z
    );
  }

  positionGantry(initialZ);

  return {
    update(dt, speed) {
      gantry.position.z += speed * dt;

      if (gantry.position.z > 16) {
        gantry.visible = false;
      }

      if (gantry.visible) {
        positionGantry(gantry.position.z);
      }
    }
  };
}
