import * as THREE from ‘https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js’;

export function createFollowCamera(camera) {
const desired = new THREE.Vector3();
const look = new THREE.Vector3();

return function updateCamera(car, dt, aspect) {
const portrait = aspect < 0.8;

// Caméra placée derrière et au-dessus du Vivaro.
desired.set(
  car.position.x + 0.35,
  portrait ? 9.5 : 8.2,
  portrait ? 18.5 : 17
);
// Déplacement progressif de la caméra.
camera.position.lerp(
  desired,
  1 - Math.exp(-Math.max(dt, 0.001) * 2.6)
);
// Regarder le véhicule et la route devant lui.
look.set(
  car.position.x,
  1.2,
  portrait ? -10 : -12
);
camera.lookAt(look);
// Champ de vision adapté à l'écran du téléphone.
camera.fov = portrait ? 48 : 42;
camera.updateProjectionMatrix();

};
}