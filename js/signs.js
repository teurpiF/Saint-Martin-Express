
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { roadCenter } from './road.js';

const ROAD_WIDTH = 6.4;
const VERGE_WIDTH = 1.3;
const POST_DISTANCE = ROAD_WIDTH / 2 + VERGE_WIDTH + 0.45;

const SIGN_WIDTH = 6.8;
const SIGN_HEIGHT = 1.7;
const SIGN_SPACING = 120;
const FIRST_SIGN_Z = -75;

const destinations = [
  ['GLANDERGLAND', 'train'],
  ['GRANDSON', 'manneken'],
  ['PORT-ROULANT', 'shirt'],
  ['BOUDEVILLIERS', 'fuel'],
  ['LA CHAUX-DE-FONDS', 'arches'],
  ['SAIGNELÉGIER', 'money'],
  ['LE BÉMONT', 'wine'],
  ['PORRENTRUY', 'horse'],
  ['COEUVE !', 'pig'],
  ['DAMPHREUX', 'crown'],
  ['LUGNEZ', 'football'],
  ['ZEKILLA !!!', 'sombrero']
];

function drawIcon(ctx, type) {
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (type === 'train') {
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
  }

  if (type === 'manneken') {
    // Tête
    ctx.beginPath();
    ctx.arc(190, 55, 29, 0, Math.PI * 2);
    ctx.fill();

    // Corps
    ctx.beginPath();
    ctx.moveTo(165, 95);
    ctx.lineTo(215, 95);
    ctx.lineTo(225, 175);
    ctx.lineTo(155, 175);
    ctx.closePath();
    ctx.fill();

    // Jambes
    ctx.beginPath();
    ctx.moveTo(160, 165);
    ctx.lineTo(190, 165);
    ctx.lineTo(175, 265);
    ctx.lineTo(145, 265);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(195, 165);
    ctx.lineTo(225, 165);
    ctx.lineTo(250, 265);
    ctx.lineTo(220, 265);
    ctx.closePath();
    ctx.fill();

    // Bras et jet d'eau
    ctx.beginPath();
    ctx.moveTo(165, 110);
    ctx.lineTo(135, 175);
    ctx.lineTo(145, 205);
    ctx.moveTo(215, 110);
    ctx.lineTo(265, 155);
    ctx.lineTo(295, 155);
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([5, 13]);
    ctx.lineWidth = 10;
    ctx.moveTo(300, 155);
    ctx.quadraticCurveTo(350, 165, 405, 225);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  if (type === 'shirt') {
    ctx.beginPath();
    ctx.moveTo(145, 65);
    ctx.lineTo(95, 100);
    ctx.lineTo(125, 155);
    ctx.lineTo(155, 140);
    ctx.lineTo(155, 265);
    ctx.lineTo(365, 265);
    ctx.lineTo(365, 140);
    ctx.lineTo(395, 155);
    ctx.lineTo(425, 100);
    ctx.lineTo(375, 65);
    ctx.lineTo(320, 85);
    ctx.lineTo(200, 85);
    ctx.closePath();
    ctx.fill();
  }

  if (type === 'fuel') {
    ctx.lineWidth = 22;
    ctx.strokeRect(120, 65, 190, 205);
    ctx.fillRect(145, 90, 140, 80);
    ctx.beginPath();
    ctx.moveTo(310, 115);
    ctx.lineTo(360, 145);
    ctx.lineTo(360, 225);
    ctx.quadraticCurveTo(360, 250, 390, 250);
    ctx.stroke();
    ctx.fillRect(110, 265, 220, 20);
  }

  if (type === 'arches') {
    ctx.lineWidth = 34;
    for (const x of [155, 290]) {
      ctx.beginPath();
      ctx.moveTo(x - 55, 265);
      ctx.quadraticCurveTo(x - 35, 40, x, 40);
      ctx.quadraticCurveTo(x + 35, 40, x + 55, 265);
      ctx.stroke();
    }
  }

  if (type === 'money') {
    ctx.strokeRect(90, 75, 350, 190);
    ctx.beginPath();
    ctx.arc(265, 170, 65, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = 'bold 95px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CHF', 265, 200);
    ctx.beginPath();
    ctx.moveTo(200, 275);
    ctx.lineTo(245, 225);
    ctx.lineTo(290, 275);
    ctx.fill();
  }

  if (type === 'wine') {
    ctx.beginPath();
    ctx.moveTo(145, 55);
    ctx.lineTo(385, 55);
    ctx.lineTo(360, 150);
    ctx.quadraticCurveTo(350, 215, 265, 215);
    ctx.quadraticCurveTo(180, 215, 170, 150);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(252, 210, 26, 65);
    ctx.beginPath();
    ctx.ellipse(265, 280, 95, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (type === 'horse') {
    // Corps
    ctx.beginPath();
    ctx.moveTo(105, 145);
    ctx.quadraticCurveTo(110, 105, 185, 105);
    ctx.lineTo(285, 115);
    ctx.quadraticCurveTo(315, 95, 330, 55);
    ctx.lineTo(370, 65);
    ctx.lineTo(390, 100);
    ctx.lineTo(430, 105);
    ctx.lineTo(410, 135);
    ctx.lineTo(365, 145);
    ctx.lineTo(330, 175);
    ctx.lineTo(160, 180);
    ctx.closePath();
    ctx.fill();

    // Tête et oreilles
    ctx.beginPath();
    ctx.moveTo(350, 65);
    ctx.lineTo(355, 30);
    ctx.lineTo(375, 65);
    ctx.lineTo(395, 45);
    ctx.lineTo(395, 95);
    ctx.fill();

    // Jambes
    for (const [x, y, w] of [
      [145, 165, 30],
      [205, 165, 30],
      [290, 160, 30],
      [335, 145, 30]
    ]) {
      ctx.fillRect(x, y, w, 100);
    }

    // Queue et crinière
    ctx.beginPath();
    ctx.moveTo(110, 125);
    ctx.quadraticCurveTo(65, 145, 90, 205);
    ctx.moveTo(300, 105);
    ctx.lineTo(320, 80);
    ctx.lineTo(330, 110);
    ctx.stroke();
  }

  if (type === 'pig') {
    // Corps et tête
    ctx.beginPath();
    ctx.ellipse(240, 165, 145, 88, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(370, 145, 65, 58, 0, 0, Math.PI * 2);
    ctx.fill();

    // Groin
    ctx.beginPath();
    ctx.ellipse(425, 165, 35, 27, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#00613f';
    ctx.beginPath();
    ctx.ellipse(415, 160, 6, 11, 0, 0, Math.PI * 2);
    ctx.ellipse(438, 160, 6, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';

    // Oreilles
    ctx.beginPath();
    ctx.moveTo(325, 105);
    ctx.lineTo(310, 55);
    ctx.lineTo(365, 90);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(375, 100);
    ctx.lineTo(415, 55);
    ctx.lineTo(420, 120);
    ctx.closePath();
    ctx.fill();

    // Pattes
    ctx.fillRect(145, 215, 38, 65);
    ctx.fillRect(225, 220, 38, 60);
    ctx.fillRect(300, 215, 38, 65);

    // Queue
    ctx.beginPath();
    ctx.arc(90, 145, 25, 0, Math.PI * 1.8);
    ctx.stroke();
  }

  if (type === 'crown') {
    ctx.beginPath();
    ctx.moveTo(90, 245);
    ctx.lineTo(110, 115);
    ctx.lineTo(200, 185);
    ctx.lineTo(265, 65);
    ctx.lineTo(330, 185);
    ctx.lineTo(420, 115);
    ctx.lineTo(440, 245);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(100, 260, 330, 28);

    for (const x of [110, 265, 420]) {
      ctx.beginPath();
      ctx.arc(x, x === 265 ? 55 : 105, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (type === 'football') {
    ctx.beginPath();
    ctx.arc(265, 165, 120, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#00613f';
    ctx.beginPath();
    ctx.moveTo(265, 95);
    ctx.lineTo(310, 130);
    ctx.lineTo(292, 180);
    ctx.lineTo(238, 180);
    ctx.lineTo(220, 130);
    ctx.closePath();
    ctx.fill();

    for (const [x, y] of [
      [265, 35], [365, 100], [330, 245],
      [165, 245], [150, 100]
    ]) {
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (type === 'sombrero') {
    // Bord large
    ctx.beginPath();
    ctx.moveTo(65, 205);
    ctx.quadraticCurveTo(265, 155, 465, 205);
    ctx.quadraticCurveTo(265, 285, 65, 205);
    ctx.closePath();
    ctx.fill();

    // Couronne du sombrero
    ctx.beginPath();
    ctx.moveTo(165, 190);
    ctx.quadraticCurveTo(175, 55, 265, 35);
    ctx.quadraticCurveTo(355, 55, 365, 190);
    ctx.closePath();
    ctx.fill();

    // Bande décorative
    ctx.strokeStyle = '#00613f';
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.moveTo(170, 165);
    ctx.quadraticCurveTo(265, 185, 360, 165);
    ctx.stroke();
  }
}

function createSignTexture(label, iconType) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 300;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#00613f';
  ctx.fillRect(0, 0, 1200, 300);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 12;
  ctx.strokeRect(10, 10, 1180, 280);

  drawIcon(ctx, iconType);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(490, 55, 7, 190);

  ctx.font = 'bold 78px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let fontSize = 78;
  while (ctx.measureText(label).width > 650 && fontSize > 42) {
    fontSize -= 2;
    ctx.font = `bold ${fontSize}px Arial`;
  }

  ctx.fillText(label, 850, 155);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createDirectionSign(label, iconType) {
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

  // Deux poteaux
  for (const side of [-1, 1]) {
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 6.2, 0.22),
      metal
    );
    post.position.set(side * POST_DISTANCE, 3.1, 0);
    post.castShadow = true;
    gantry.add(post);

    const base = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.45, 0.65),
      darkMetal
    );
    base.position.set(side * POST_DISTANCE, 0.22, 0);
    gantry.add(base);
  }

  // Traverse supérieure
  const beam = new THREE.Mesh(
    new THREE.BoxGeometry(POST_DISTANCE * 2 + 0.3, 0.28, 0.28),
    metal
  );
  beam.position.y = 5.85;
  beam.castShadow = true;
  gantry.add(beam);

  // Traverse inférieure
  const lowerBeam = new THREE.Mesh(
    new THREE.BoxGeometry(POST_DISTANCE * 2 + 0.3, 0.12, 0.16),
    darkMetal
  );
  lowerBeam.position.y = 4.35;
  gantry.add(lowerBeam);

  // Panneau
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(SIGN_WIDTH, SIGN_HEIGHT, 0.14),
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
    new THREE.PlaneGeometry(SIGN_WIDTH - 0.06, SIGN_HEIGHT - 0.06),
    new THREE.MeshBasicMaterial({
      map: createSignTexture(label, iconType)
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

export function createSigns(scene) {
  const signs = destinations.map(([label, icon], index) => {
    const gantry = createDirectionSign(label, icon);
    scene.add(gantry);

    return {
      object: gantry,
      initialZ: FIRST_SIGN_Z - index * SIGN_SPACING
    };
  });

  function reset() {
    for (const item of signs) {
      item.object.visible = true;
      item.object.position.set(
        roadCenter(item.initialZ),
        0,
        item.initialZ
      );
    }
  }

  reset();

  return {
    reset,

    update(dt, speed) {
      for (const item of signs) {
        if (!item.object.visible) continue;

        const z = item.object.position.z + speed * dt;

        if (z > 16) {
          item.object.visible = false;
          continue;
        }

        item.object.position.set(
          roadCenter(z),
          0,
          z
        );
      }
    }
  };
}
