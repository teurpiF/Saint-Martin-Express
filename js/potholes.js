
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { roadCenter } from './road.js';

const POTHOLE_COUNT = 5;
const RECYCLE_DISTANCE = 220;
const CAR_Z = 3;

function randomLaneOffset() {
  return (Math.random() * 4.2) - 2.1;
}

function createPothole() {
  const group = new THREE.Group();

  const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0x77736b,
    roughness: 1,
    flatShading: true
  });

  const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x242321,
    roughness: 1,
    flatShading: true
  });

  // Bord irrégulier du nid-de-poule.
  const rim = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.85, 0),
    rimMaterial
  );

  rim.scale.set(1, 0.035, 0.62);
  rim.position.y = 0.025;
  group.add(rim);

  // Centre sombre et légèrement enfoncé.
  const center = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.65, 0),
    darkMaterial
  );

  center.scale.set(1, 0.018, 0.58);
  center.position.y = 0.035;
  group.add(center);

  // Quelques éclats autour du trou.
  for (let i = 0; i < 5; i++) {
    const crack = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.025, 0.045),
      rimMaterial
    );

    crack.position.set(
      Math.cos(i * 1.25) * 0.72,
      0.045,
      Math.sin(i * 1.25) * 0.48
    );

    crack.rotation.y = i * 1.25;
    group.add(crack);
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

    const scale = 0.75 + Math.random() * 0.35;
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
