import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { roadCenter } from './road.js';

const OBSTACLES = [
  { name: 'chien_noir', file: 'chien_noir.png' },
  { name: 'autostoppeuse', file: 'autostoppeuse.png' },
  { name: 'fetard_vomit', file: 'fetard_vomit.png' },
  { name: 'zombie', file: 'zombie.png', deadly: true },
  { name: 'lama_platre', file: 'lama_platre.png' },
  { name: 'crucifixion', file: 'crucifixion.png' },
  { name: 'heineken_pack', file: 'heineken_pack.png' }
];

const IMAGE_HEIGHT = 2.8;
const SPAWN_Z = -30;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function shuffle(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function getDifficulty(distance) {
  if (distance < 360) return [220, 280];
  if (distance < 720) return [150, 190];
  if (distance < 1080) return [90, 125];
  if (distance < 1320) return [45, 70];

  const intensity = Math.min((distance - 1320) / 300, 1);

  return [
    35 - intensity * 15,
    45 - intensity * 20
  ];
}

export function createSaintMartin(scene) {
  const loader = new THREE.TextureLoader();

  const textures = OBSTACLES.map(item => {
    const texture = loader.load(
      `models/${item.file}`
    );

    texture.colorSpace = THREE.SRGBColorSpace;

    return {
      ...item,
      texture
    };
  });

  let currentObstacle = null;
  let nextSpawnDistance = 0;
  let obstacleOrder = [];
  let previousObstacle = null;

  function getNextObstacle() {
    if (obstacleOrder.length === 0) {
      obstacleOrder = shuffle(textures);

      if (
        obstacleOrder[0].name === previousObstacle &&
        obstacleOrder.length > 1
      ) {
        [obstacleOrder[0], obstacleOrder[1]] =
          [obstacleOrder[1], obstacleOrder[0]];
      }
    }

    const selected = obstacleOrder.shift();
    previousObstacle = selected.name;

    return selected;
  }

  function spawn(distance) {
    if (currentObstacle) {
      scene.remove(currentObstacle.sprite);
    }

    const item = getNextObstacle();

    const material = new THREE.SpriteMaterial({
      map: item.texture,
      transparent: true,
      alphaTest: 0.02,
      depthWrite: false
    });

    const sprite = new THREE.Sprite(material);

    const image = item.texture.image;
    const aspect = image && image.height
      ? image.width / image.height
      : 1;

    sprite.scale.set(
      IMAGE_HEIGHT * aspect,
      IMAGE_HEIGHT,
      1
    );

    const direction = Math.random() < 0.5 ? -1 : 1;

sprite.material.rotation = randomBetween(-0.18, 0.18);

    const offset = randomBetween(-1.8, 1.8);

    sprite.position.set(
      roadCenter(SPAWN_Z) + offset,
      IMAGE_HEIGHT / 2,
      SPAWN_Z
    );

    scene.add(sprite);

currentObstacle = {
  sprite,
  item,
  direction,
  offset,
  baseOffset: offset,
  phase: randomBetween(0, Math.PI * 2),
  amplitude: randomBetween(0.5, 1.5),
  lateralSpeed: randomBetween(0.5, 1.1),
  hit: false
};

    const [min, max] = getDifficulty(distance);
    nextSpawnDistance = distance + randomBetween(min, max);
  }

  function reset() {
    if (currentObstacle) {
      scene.remove(currentObstacle.sprite);
      currentObstacle.sprite.material.dispose();
      currentObstacle = null;
    }

    obstacleOrder = shuffle(textures);
    previousObstacle = null;
    nextSpawnDistance = randomBetween(220, 280);
  }

  function update(dt, speed, distance, carX, onCollision) {
    if (!currentObstacle) {
      if (distance >= nextSpawnDistance) {
        spawn(distance);
      }
      return;
    }

    const obstacle = currentObstacle;
    const sprite = obstacle.sprite;

    sprite.position.z += speed * dt;

    const wave =
      Math.sin(distance * obstacle.lateralSpeed * 0.025 + obstacle.phase);

    obstacle.offset = THREE.MathUtils.clamp(
  obstacle.baseOffset +
    wave * obstacle.direction * obstacle.amplitude,
  -2.7,
  2.7
);

    sprite.position.x =
      roadCenter(sprite.position.z) + obstacle.offset;

    const distanceZ = Math.abs(
      sprite.position.z - 3
    );

    const distanceX = Math.abs(
      sprite.position.x - carX
    );

    if (
      !obstacle.hit &&
      distanceZ < 1.5 &&
      distanceX < 1.1
    ) {
      obstacle.hit = true;
      onCollision(obstacle.item.deadly === true);
    }

    if (sprite.position.z > 8) {
      scene.remove(sprite);
      sprite.material.dispose();
      currentObstacle = null;
    }
  }

  reset();

  return {
    reset,
    update
  };
}
