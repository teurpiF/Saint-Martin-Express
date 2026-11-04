
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { roadCenter } from './road.js';

const BONUS_TYPES = [
  {
    type: 'sponge',
    file: 'eponge_geante.png',
    height: 1.8
  },
  {
    type: 'suze',
    file: 'suze_bottle.png',
    height: 2.2
  }
];

const SPAWN_Z = -35;
const BONUS_MIN_DISTANCE = 180;
const BONUS_MAX_DISTANCE = 280;

export function createBonuses(scene) {
  const loader = new THREE.TextureLoader();

  let bonus = null;
  let nextSpawnDistance = 100;
  let currentBonusType = null;

  const textures = {};

  BONUS_TYPES.forEach((item) => {
    textures[item.type] = loader.load(`models/${item.file}`);
    textures[item.type].colorSpace = THREE.SRGBColorSpace;
  });

  function scheduleNext(distance) {
    nextSpawnDistance =
      distance +
      BONUS_MIN_DISTANCE +
      Math.random() * (BONUS_MAX_DISTANCE - BONUS_MIN_DISTANCE);
  }

  function spawn(distance) {
    if (bonus) {
      scene.remove(bonus);
      bonus = null;
    }

    const item = BONUS_TYPES[
      Math.floor(Math.random() * BONUS_TYPES.length)
    ];

    currentBonusType = item.type;

    const texture = textures[item.type];
    const aspect = texture.image
      ? texture.image.width / texture.image.height
      : 1;

    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.02,
        depthWrite: false
      })
    );

    sprite.scale.set(
      item.height * aspect,
      item.height,
      1
    );

        const lateralOffset = Math.random() * 3 - 1.5;

    sprite.position.set(
      roadCenter(SPAWN_Z) + lateralOffset,
      item.height / 2,
      SPAWN_Z
    );

    sprite.userData.lateralOffset = lateralOffset;
    sprite.userData.baseScale = sprite.scale.clone();

    bonus = sprite;
    scene.add(bonus);

    scheduleNext(distance);
  }

  function reset() {
    if (bonus) {
      scene.remove(bonus);
      bonus = null;
    }

    nextSpawnDistance = 100;
    currentBonusType = null;
  }

  function update(dt, speed, distance, carX, onCollect) {
    if (!bonus) {
      if (distance >= nextSpawnDistance) {
        spawn(distance);
      }
      return;
    }

    bonus.position.z += speed * dt;
        bonus.position.x =
      roadCenter(bonus.position.z) + bonus.userData.lateralOffset;

    // Scintillement et légère pulsation.
    const pulse = 0.65 + 0.35 * Math.sin(distance * 0.18);
    bonus.material.opacity = pulse;

    const scale = bonus.userData.baseScale;
    bonus.scale.set(
      scale.x * (1 + 0.08 * Math.sin(distance * 0.15)),
      scale.y * (1 + 0.08 * Math.sin(distance * 0.15)),
      1
    );

    // Collecte du bonus.
    const distanceZ = Math.abs(bonus.position.z - 3);
    const distanceX = Math.abs(bonus.position.x - carX);

    if (distanceZ < 1.8 && distanceX < 1.3) {
      const collectedType = currentBonusType;

      scene.remove(bonus);
      bonus = null;
      currentBonusType = null;

      onCollect(collectedType);
      return;
    }

    // Le bonus disparaît lorsqu'il est dépassé.
    if (bonus.position.z > 8) {
      scene.remove(bonus);
      bonus = null;
      currentBonusType = null;
    }
  }

  return {
    reset,
    update
  };
}
