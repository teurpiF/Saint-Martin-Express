
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export function createFollowCamera(camera) {
  const desired = new THREE.Vector3();
  const look = new THREE.Vector3();

  return function updateCamera(car, dt, aspect) {
    const portrait = aspect < 0.8;

    // Caméra plus basse et plus proche du Vivaro.
    desired.set(
      car.position.x + 0.2,
      portrait ? 5.5 : 4.8,
      portrait ? 10 : 9
    );

    // Déplacement fluide de la caméra.
    camera.position.lerp(
      desired,
      1 - Math.exp(-Math.max(dt, 0.001) * 3)
    );

    // Regarder le véhicule et la route devant lui.
    look.set(
      car.position.x,
      1.1,
      portrait ? -5 : -6
    );

    camera.lookAt(look);

    camera.fov = portrait ? 48 : 42;
    camera.updateProjectionMatrix();
  };
}
