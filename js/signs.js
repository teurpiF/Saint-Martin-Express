
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

// --------------------------------------------------
// PICTOGRAMMES
// --------------------------------------------------

function drawIcon(ctx, type) {
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 18;
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
    // Silhouette du Manneken-Pis
    ctx.beginPath();
    ctx.arc(175, 65, 28, 0, Math.PI * 2);
    ctx.fill();

    // Corps et jambes
    ctx.beginPath();
    ctx.moveTo(155, 105);
    ctx.lineTo(205, 105);
    ctx.lineTo(215, 175);
    ctx.lineTo(185, 190);
    ctx.lineTo(155, 175);
    ctx.closePath();
    ctx.fill();

    ctx.fillRect(155, 175, 22, 75);
    ctx.fillRect(190, 175, 22, 75);

    // Bras
    ctx.beginPath();
    ctx.moveTo(155, 120);
    ctx.lineTo(115, 165);
    ctx.lineTo(95, 145);
    ctx.moveTo(205, 120);
    ctx.lineTo(245, 145);
    ctx.stroke();

    // Jet d'eau
    ctx.beginPath();
    ctx.setLineDash([8, 12]);
    ctx.lineWidth = 12;
    ctx.moveTo(245, 145);
    ctx.quadraticCurveTo(320, 160, 390, 230);
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
    ctx.moveTo(145, 65);
    ctx.lineTo(385, 65);
    ctx.lineTo(355, 175);
    ctx.quadraticCurveTo(265, 265, 175, 175);
    ctx.closePath();
    ctx.fill();

    ctx.fillRect(250, 200, 30, 75);
    ctx.fillRect(190, 270, 150, 18);
  }

  if (type === 'horse') {
    // Silhouette simplifiée d'un cheval
    ctx.beginPath();
    ctx.moveTo(100, 145);
    ctx.lineTo(150, 105);
    ctx.lineTo(275, 105);
    ctx.lineTo(330, 125);
    ctx.lineTo(380, 85);
    ctx.lineTo(420, 100);
    ctx.lineTo(395, 155);
    ctx.lineTo(340, 175);
    ctx.lineTo(305, 160);
    ctx.lineTo(290, 245);
    ctx.lineTo(265, 245);
    ctx.lineTo(260, 165);
    ctx.lineTo(190, 165);
    ctx.lineTo(170, 245);
    ctx.lineTo(145, 245);
    ctx.lineTo(150, 155);
    ctx.closePath();
    ctx.fill();
  }

  if (type === 'pig') {
    ctx.beginPath();
    ctx.ellipse(250, 170, 155, 90, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(395, 165, 55, 48, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(435, 175, 28, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillRect(150, 225, 35, 65);
    ctx.fillRect(300, 225, 35, 65);

    ctx.beginPath();
    ctx.arc(100, 150, 28, 0, Math.PI * 2);
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

    // Motif classique du ballon
    ctx.beginPath();
    ctx.moveTo(265, 95);
    ctx.lineTo(310, 130);
    ctx.lineTo(292, 180);
    ctx.lineTo(238, 180);
    ctx.lineTo(220, 130);
    ctx.closePath();
    ctx.fill();

    const panels = [
      [265, 35], [365, 100], [330, 245],
      [165, 245], [150, 100]
    ];

    for (const [x, y] of panels) {
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (type === 'sombrero') {
    // Chapeau
    ctx.beginPath();
    ctx.ellipse(265, 175, 190, 55, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(175, 165);
    ctx.quadraticCurveTo(190, 35, 265, 35);
    ctx.quadraticCurveTo(340, 35, 355, 165);
    ctx.closePath();
    ctx.fill();

    // Décoration du bord
    ctx.strokeStyle = '#00613f';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(105, 175);
    ctx.quadraticCurveTo(265, 230, 425, 175);
    ctx.stroke();
  }
}

// --------------------------------------------------
// TEXTURE DU PANNEAU
// --------------------------------------------------

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

  // Séparation verticale
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(490, 55, 7, 190);

  // Texte
  ctx.font = 'bold 78px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Ajustement automatique pour les noms longs
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

// --------------------------------------------------
// CRÉATION D'UN PORTIQUE
// --------------------------------------------------

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

  // Poteaux
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

// --------------------------------------------------
// INSTALLATION ET DÉFILEMENT DES 12 PANNEAUX
// --------------------------------------------------

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
