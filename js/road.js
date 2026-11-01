
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// --------------------------------------------------
// MATÉRIAUX
// --------------------------------------------------

const material = (color, roughness = 0.95) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness,
    side: THREE.DoubleSide
  });

const asphalt = material(0x555758);
const grass = material(0x788966);
const whiteLine = material(0xf0eee0);
const trunkMaterial = material(0x594331);
const leafMaterials = [
  material(0x466344),
  material(0x58764b),
  material(0x718b5b),
  material(0x829567)
];

// --------------------------------------------------
// COURBURE DE LA ROUTE
// --------------------------------------------------

export function roadCenter(z) {
  return (
    2.1 * Math.sin(z * 0.038) +
    0.9 * Math.sin(z * 0.09 + 1.3)
  );
}

// --------------------------------------------------
// CRÉATION DE LA ROUTE
// --------------------------------------------------

export function createRoad(scene) {

  const segments = [];

  const segmentLength = 7;
  const segmentCount = 40;
  const totalLength = segmentLength * segmentCount;

  const roadWidth = 6.4;
  const vergeWidth = 1.4;

  // Sol général
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(260, 400),
    grass
  );

  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.13, -120);
  ground.receiveShadow = true;
  scene.add(ground);

  // --------------------------------------------------
  // CONSTRUCTION DES SEGMENTS
  // --------------------------------------------------

  function addStrip(group, z, offset, width, y, mat) {

    const center0 = roadCenter(z);
    const center1 = roadCenter(z - segmentLength);

    const x0 = center0 + offset;
    const x1 = center1 + offset;

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([
        x0 - width / 2 - center0, y, 0,
        x1 - width / 2 - center1, y, -segmentLength,
        x0 + width / 2 - center0, y, 0,

        x0 + width / 2 - center0, y, 0,
        x1 - width / 2 - center1, y, -segmentLength,
        x1 + width / 2 - center1, y, -segmentLength
      ], 3)
    );

    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, mat);
    mesh.receiveShadow = true;
    group.add(mesh);
  }

  for (let i = 0; i < segmentCount; i++) {

    const z = 12 - i * segmentLength;

    const group = new THREE.Group();

    // Chaussée
    addStrip(
      group, z,
      0, roadWidth,
      -0.02, asphalt
    );

    // Accotements herbeux
    addStrip(
      group, z,
      -(roadWidth / 2 + vergeWidth / 2),
      vergeWidth,
      -0.025, grass
    );

    addStrip(
      group, z,
      roadWidth / 2 + vergeWidth / 2,
      vergeWidth,
      -0.025, grass
    );

    // Ligne centrale discontinue
    if (i % 2 === 0) {
      addStrip(
        group, z,
        0, 0.14,
        0.005, whiteLine
      );
    }

    group.position.set(roadCenter(z), 0, z);

    scene.add(group);

    segments.push({
      group,
      z
    });
  }

  // --------------------------------------------------
  // CRÉATION DES ARBRES FEUILLUS
  // --------------------------------------------------

  function createTree() {

    const tree = new THREE.Group();

    const height = 3.5 + Math.random() * 2.2;
    const crownSize = 1.1 + Math.random() * 0.7;

    // Tronc
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.12,
        0.22,
        height * 0.48,
        7
      ),
      trunkMaterial
    );

    trunk.position.y = height * 0.24;
    trunk.castShadow = true;
    tree.add(trunk);

    // Houppier composé de volumes arrondis
    const foliage = new THREE.Group();

    const leafCount = 5 + Math.floor(Math.random() * 3);

    for (let i = 0; i < leafCount; i++) {

      const size = crownSize * (0.65 + Math.random() * 0.45);

      const crown = new THREE.Mesh(
        new THREE.IcosahedronGeometry(size, 1),
        leafMaterials[
          Math.floor(Math.random() * leafMaterials.length)
        ]
      );

      crown.position.set(
        (Math.random() - 0.5) * crownSize * 1.3,
        height * 0.52 + Math.random() * height * 0.28,
        (Math.random() - 0.5) * crownSize * 1.3
      );

      crown.scale.y = 0.8 + Math.random() * 0.5;
      crown.castShadow = true;
      foliage.add(crown);
    }

    tree.add(foliage);

    return tree;
  }

  // --------------------------------------------------
  // CRÉATION DES HAIES
  // --------------------------------------------------

  function createBush() {

    const bush = new THREE.Group();

    for (let i = 0; i < 4; i++) {

      const sphere = new THREE.Mesh(
        new THREE.IcosahedronGeometry(
          0.55 + Math.random() * 0.3,
          1
        ),
        leafMaterials[
          Math.floor(Math.random() * leafMaterials.length)
        ]
      );

      sphere.position.set(
        (Math.random() - 0.5) * 0.9,
        0.45 + Math.random() * 0.25,
        (Math.random() - 0.5) * 0.5
      );

      sphere.scale.y = 0.75;
      sphere.castShadow = true;

      bush.add(sphere);
    }

    return bush;
  }

  // --------------------------------------------------
  // INSTALLATION DES ARBRES ET HAIES
  // --------------------------------------------------

  const scenery = [];

  for (let i = 0; i < 65; i++) {

    for (const side of [-1, 1]) {

      const z = -i * 4.5 - 10;

      const distance = 5.5 + Math.random() * 8;

      const isBush = Math.random() < 0.35;

      const object = isBush
        ? createBush()
        : createTree();

      const offset = side * distance;

      object.position.set(
        roadCenter(z) + offset,
        0,
        z
      );

      // Variations de taille
      const scale = 0.8 + Math.random() * 0.65;
      object.scale.setScalar(scale);

      scene.add(object);

      scenery.push({
        object,
        z,
        offset
      });
    }
  }

  // --------------------------------------------------
  // MISE À JOUR DU DÉFILEMENT
  // --------------------------------------------------

  return {

    update(dt, speed) {

      // Défilement de la route
      for (const segment of segments) {

        segment.z += speed * dt;

        if (segment.z > 16) {
          segment.z -= totalLength;
        }

        segment.group.position.set(
          roadCenter(segment.z),
          0,
          segment.z
        );
      }

      // Défilement des arbres et de la végétation
      for (const item of scenery) {

        item.z += speed * dt;

        if (item.z > 16) {
          item.z -= 300;
        }

        item.object.position.set(
          roadCenter(item.z) + item.offset,
          0,
          item.z
        );
      }
    }
  };
}
