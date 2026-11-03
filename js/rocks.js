

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { roadCenter } from './road.js';

const ROCK_COUNT = 6;
const RECYCLE_DISTANCE = 220;
const CAR_Z = 3;

function randomLaneOffset() {
  return (Math.random() * 4.2) - 2.1;
}

function placeRock(rock, z) {
  rock.userData.offset = randomLaneOffset();

  rock.position.set(
    roadCenter(z) + rock.userData.offset,
    rock.userData.radius * 0.72,
    z
  );

  rock.rotation.set(
    Math.random() * 0.5,
    Math.random() * Math.PI * 2,
    Math.random() * 0.5
  );

  rock.visible = true;
}

export function createRocks(scene) {
  const rocks = [];

  for (let i = 0; i < ROCK_COUNT; i++) {
    const radius = 0.55 + Math.random() * 0.35;

    const geometry = new THREE.IcosahedronGeometry(radius, 0);

    const material = new THREE.MeshStandardMaterial({
      color: [0x77736b, 0x686b68, 0x898176][i % 3],
      roughness: 1,
      flatShading: true
    });

    const rock = new THREE.Mesh(geometry, material);

    rock.castShadow = true;
    rock.receiveShadow = true;
    rock.userData.radius = radius;

    scene.add(rock);

    placeRock(rock, -45 - i * 38);
    rocks.push(rock);
  }

  return {
    reset() {
      rocks.forEach((rock, i) => {
        placeRock(rock, -45 - i * 38);
      });
    },

    update(dt, speed, carX, onCollision) {
      for (const rock of rocks) {
        rock.position.z += speed * dt;

        const z = rock.position.z;

        rock.position.x =
          roadCenter(z) + rock.userData.offset;

        if (z > CAR_Z - 2.1 && z < CAR_Z + 2.1) {
          const collisionDistance =
            0.85 + rock.userData.radius * 0.45;

          if (
            Math.abs(rock.position.x - carX) <
            collisionDistance
          ) {
            rock.visible = false;
            onCollision();

            placeRock(
              rock,
              -RECYCLE_DISTANCE - Math.random() * 45
            );

            continue;
          }
        }

        if (z > 12) {
          placeRock(
            rock,
            -RECYCLE_DISTANCE - Math.random() * 45
          );
        }
      }
    }
  };
}
