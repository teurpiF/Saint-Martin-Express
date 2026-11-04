
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { roadCenter } from './road.js';

const POTHOLE_COUNT = 5;
const RECYCLE_DISTANCE = 220;
const CAR_Z = 3;
const SEGMENTS = 12;

function randomLaneOffset() {
  return (Math.random() * 4.2) - 2.1;
}

function createPothole() {
  const group = new THREE.Group();

  const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0x999990,
    roughness: 1,
    flatShading: true,
    side: THREE.DoubleSide
  });

  const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x17191a,
    roughness: 1,
    flatShading: true,
    side: THREE.DoubleSide
  });

  const crackMaterial = new THREE.MeshStandardMaterial({
    color: 0x343638,
    roughness: 1,
    flatShading: true
  });

  // Bordure irrégulière et déchirée.
  const vertices = [];
  const indices = [];

  const outer = [];
  const inner = [];

  for (let i = 0; i < SEGMENTS; i++) {
    const angle = (i / SEGMENTS) * Math.PI * 2;
    const variation = 0.82 + Math.random() * 0.36;

    outer.push({
      x: Math.cos(angle) * 1.05 * variation,
      z: Math.sin(angle) * 0.72 * variation
    });

    inner.push({
      x: Math.cos(angle) * 0.65 * variation,
      z: Math.sin(angle) * 0.43 * variation
    });
  }

  for (let i = 0; i < SEGMENTS; i++) {
    const next = (i + 1) % SEGMENTS;

    vertices.push(
      outer[i].x, 0.025, outer[i].z,
      inner[i].x, 0.025, inner[i].z
    );

    const a = i * 2;
    const b = a + 1;
    const c = next * 2;
    const d = c + 1;

    indices.push(a, b, c, b, d, c);
  }

  const rimGeometry = new THREE.BufferGeometry();
  rimGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  rimGeometry.setIndex(indices);
  rimGeometry.computeVertexNormals();

  group.add(new THREE.Mesh(rimGeometry, rimMaterial));

  // Fond noir du trou, légèrement irrégulier.
  const holeShape = new THREE.Shape();

  for (let i = 0; i < SEGMENTS; i++) {
    const p = inner[i];

    if (i === 0) {
      holeShape.moveTo(p.x, p.z);
    } else {
      holeShape.lineTo(p.x, p.z);
    }
  }

  holeShape.closePath();

  const holeGeometry = new THREE.ShapeGeometry(holeShape);
  const hole = new THREE.Mesh(holeGeometry, darkMaterial);

  hole.rotation.x = -Math.PI / 2;
  hole.position.y = 0.035;
  group.add(hole);

  // Fissures qui partent du trou.
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2 + Math.random() * 0.3;
    const length = 0.35 + Math.random() * 0.35;

    const crack = new THREE.Mesh(
      new THREE.BoxGeometry(length, 0.025, 0.045),
      crackMaterial
    );

    crack.position.set(
      Math.cos(angle) * (0.85 + length * 0.35),
      0.045,
      Math.sin(angle) * (0.58 + length * 0.35)
    );

    crack.rotation.y = -angle;
    group.add(crack);
  }

  // Quelques morceaux d'asphalte arrachés.
  for (let i = 0; i < 5; i++) {
    const chip = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.12 + Math.random() * 0.1, 0),
      rimMaterial
    );

    const angle = Math.random() * Math.PI * 2;
    const radius = 0.85 + Math.random() * 0.3;

    chip.position.set(
      Math.cos(angle) * radius,
      0.07,
      Math.sin(angle) * radius * 0.65
    );

    chip.scale.y = 0.25;
    group.add(chip);
  }

  return group;
}

function placePothole(item, z) {
  item.offset = randomLaneOffset();

  item.object.position.set(
    roadCenter(z) + item.offset,
    0,
    z
  );

  item.object.rotation.y = Math.random() * Math.PI;
  item.object.visible = true;
  item.collisionHandled = false;
}

export function createPotholes(scene) {
  const potholes = [];

  for (let i = 0; i < POTHOLE_COUNT; i++) {
    const object = createPothole();

    const scale = 0.85 + Math.random() * 0.25;
    object.scale.setScalar(scale);

    scene.add(object);

    const item = {
      object,
      offset: 0,
      collisionHandled: false,
      scale
    };

    placePothole(item, -65 - i * 45);
    potholes.push(item);
  }

  return {
    reset() {
      potholes.forEach((item, i) => {
        placePothole(item, -65 - i * 45);
      });
    },

    update(dt, speed, carX, onCollision) {
      for (const item of potholes) {
        item.object.position.z += speed * dt;

        const z = item.object.position.z;

        item.object.position.x =
          roadCenter(z) + item.offset;

        if (
          !item.collisionHandled &&
          Math.abs(z - CAR_Z) < 1.5 &&
          Math.abs(item.object.position.x - carX) < 1.15 * item.scale
        ) {
          item.collisionHandled = true;
          item.object.visible = false;
          onCollision();

          placePothole(
            item,
            -RECYCLE_DISTANCE - Math.random() * 45
          );

          continue;
        }

        if (z > 12) {
          placePothole(
            item,
            -RECYCLE_DISTANCE - Math.random() * 45
          );
        }
      }
    }
  };
}
