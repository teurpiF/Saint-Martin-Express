
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// --------------------------------------------------
// MATÉRIAUX
// --------------------------------------------------

const asphalt = new THREE.MeshStandardMaterial({
  color: 0x555758,
  roughness: 0.95,
  side: THREE.DoubleSide
});

const grass = new THREE.MeshStandardMaterial({
  color: 0x788966,
  roughness: 1,
  side: THREE.DoubleSide
});

const whiteLine = new THREE.MeshStandardMaterial({
  color: 0xf0eee0,
  roughness: 1,
  side: THREE.DoubleSide
});

const trunkMaterial = new THREE.MeshStandardMaterial({
  color: 0x594331
});

const leafMaterials = [
  new THREE.MeshStandardMaterial({ color: 0x466344 }),
  new THREE.MeshStandardMaterial({ color: 0x58764b }),
  new THREE.MeshStandardMaterial({ color: 0x718b5b }),
  new THREE.MeshStandardMaterial({ color: 0x829567 })
];

// --------------------------------------------------
// PARAMÈTRES
// --------------------------------------------------

const SEGMENT_LENGTH = 8;
const SEGMENT_COUNT = 40;
const TOTAL_LENGTH = SEGMENT_LENGTH * SEGMENT_COUNT;

const ROAD_WIDTH = 6.4;
const VERGE_WIDTH = 1.3;

const TREE_COUNT = 64;
const TREE_SPACING = 5;

// Courbure périodique : le raccord reste continu
// lorsque les éléments sont recyclés.

export function roadCenter(z) {
  return (
    1.5 * Math.sin((Math.PI * 2 * z) / TOTAL_LENGTH) +
    0.6 * Math.sin((Math.PI * 4 * z) / TOTAL_LENGTH + 1.3)
  );
}

// --------------------------------------------------
// CRÉATION D'UNE BANDE DE ROUTE
// --------------------------------------------------

function createStrip(group, offset, width, length, material) {

  const geometry = new THREE.BufferGeometry();

  const positions = new Float32Array([
    offset - width / 2, 0, 0,
    offset - width / 2, 0, -length,
    offset + width / 2, 0, 0,

    offset + width / 2, 0, 0,
    offset - width / 2, 0, -length,
    offset + width / 2, 0, -length
  ]);

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  );

  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  group.add(mesh);

  return mesh;
}

// Actualise la géométrie pour suivre la courbure.

function updateStrip(mesh, delta, offset, width) {

  const positions = mesh.geometry.attributes.position.array;

  const left = offset - width / 2;
  const right = offset + width / 2;

  // Bord gauche au début
  positions[0] = left;

  // Bord gauche à la fin
  positions[3] = delta + left;
  positions[12] = delta + left;

  // Bord droit au début
  positions[6] = right;
  positions[9] = right;

  // Bord droit à la fin
  positions[15] = delta + right;

  mesh.geometry.attributes.position.needsUpdate = true;
  mesh.geometry.computeVertexNormals();
}







  

// --------------------------------------------------
// CRÉATION DES SAPINS
// --------------------------------------------------

function createFirTree() {

  const tree = new THREE.Group();

  const height = 3.8 + Math.random() * 2;
  const radius = 1 + Math.random() * 0.45;

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.18, height * 0.3, 7),
    trunkMaterial
  );

  trunk.position.y = height * 0.15;
  tree.add(trunk);

  // Trois étages de branches coniques.

  for (let i = 0; i < 3; i++) {

    const coneHeight = height * 0.38;
    const coneRadius = radius * (1 - i * 0.24);

    const branches = new THREE.Mesh(
      new THREE.ConeGeometry(coneRadius, coneHeight, 7),
      leafMaterials[
        Math.floor(Math.random() * leafMaterials.length)
      ]
    );

    branches.position.y =
      height * 0.35 + i * height * 0.21;

    branches.castShadow = true;
    tree.add(branches);
  }

  return tree;
}

// --------------------------------------------------
// CRÉATION DE LA ROUTE ET DU DÉCOR
// --------------------------------------------------

export function createRoad(scene) {

  // Sol général continu.

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(260, 420),
    grass
  );

  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.14, -150);
  ground.receiveShadow = true;

  scene.add(ground);

  // ------------------------------------------------
  // SEGMENTS DE ROUTE
  // ------------------------------------------------

  const segments = [];

  for (let i = 0; i < SEGMENT_COUNT; i++) {

    const group = new THREE.Group();

    const roadMesh = createStrip(
      group,
      0,
      ROAD_WIDTH,
      SEGMENT_LENGTH,
      asphalt
    );

    const leftVerge = createStrip(
      group,
      -(ROAD_WIDTH / 2 + VERGE_WIDTH / 2),
      VERGE_WIDTH,
      SEGMENT_LENGTH,
      grass
    );

    const rightVerge = createStrip(
      group,
      ROAD_WIDTH / 2 + VERGE_WIDTH / 2,
      VERGE_WIDTH,
      SEGMENT_LENGTH,
      grass
    );

    // Ligne centrale : 4 mètres de peinture,
    // puis 4 mètres sans peinture.

    let centerLine = null;

    if (i % 2 === 0) {
      centerLine = createStrip(
        group,
        0,
        0.14,
        SEGMENT_LENGTH / 2,
        whiteLine
      );

      centerLine.position.y = 0.012;
    }

    scene.add(group);

    segments.push({
      group,
      roadMesh,
      leftVerge,
      rightVerge,
      centerLine,
      z: 12 - i * SEGMENT_LENGTH
    });
  }

  // ------------------------------------------------
  // VÉGÉTATION
  // ------------------------------------------------

  const scenery = [];

  for (let i = 0; i < TREE_COUNT; i++) {

    const z = -12 - i * TREE_SPACING;

    for (const side of [-1, 1]) {

      const tree = createFirTree();

      const distance =
        ROAD_WIDTH / 2 + 2.5 + Math.random() * 6;

      const offset = side * distance;

      tree.scale.setScalar(
        0.85 + Math.random() * 0.4
      );

      scene.add(tree);

      scenery.push({
  object: tree,
  z,
  offset,
  collisionHandled: false
});
    }
  }

  // ------------------------------------------------
  // MISE À JOUR DU DÉFILEMENT
  // ------------------------------------------------

  return {

update(dt, speed, carX, onTreeCollision) {

      // Distance parcourue pendant cette image.
      // Route et végétation utilisent exactement
      // le même déplacement.

      const movement = speed * dt;

      // --------------------------------------------
      // ROUTE
      // --------------------------------------------

      for (const segment of segments) {

        segment.z += movement;

        // Recyclage loin derrière le véhicule.
        if (segment.z > 16) {
          segment.z -= TOTAL_LENGTH;
        }

        const center0 = roadCenter(segment.z);

        const center1 = roadCenter(
          segment.z - SEGMENT_LENGTH
        );

        const delta = center1 - center0;

        segment.group.position.set(
          center0,
          0,
          segment.z
        );

        updateStrip(
          segment.roadMesh,
          delta,
          0,
          ROAD_WIDTH
        );

        updateStrip(
          segment.leftVerge,
          delta,
          -(ROAD_WIDTH / 2 + VERGE_WIDTH / 2),
          VERGE_WIDTH
        );

        updateStrip(
          segment.rightVerge,
          delta,
          ROAD_WIDTH / 2 + VERGE_WIDTH / 2,
          VERGE_WIDTH
        );

        if (segment.centerLine) {

          const lineEnd = roadCenter(
            segment.z - SEGMENT_LENGTH / 2
          );

          updateStrip(
            segment.centerLine,
            lineEnd - center0,
            0,
            0.14
          );
        }
      }

      // --------------------------------------------
      // SAPINS
      // --------------------------------------------

      for (const item of scenery) {

        item.z += movement;

        if (item.z > 16) {
          item.z -= TOTAL_LENGTH;
        }

        item.object.position.set(
          roadCenter(item.z) + item.offset,
          0,
          item.z
        );

const treeX = roadCenter(item.z) + item.offset;

// Détection d'une collision avec un sapin.
if (
  !item.collisionHandled &&
  Math.abs(item.z - 3) < 1.6 &&
  Math.abs(treeX - carX) < 1.35
) {
  item.collisionHandled = true;
  onTreeCollision();
}

// Réarmer la collision après le passage du sapin.
if (item.z > 5.5) {
  item.collisionHandled = false;
}

        
      }
    }
  };
}
