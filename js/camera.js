

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export function createFollowCamera(camera) {
  const desired = new THREE.Vector3();
  const look = new THREE.Vector3();

  return function updateCamera(car, dt, aspect) {
    const portrait = aspect < 0.8;

    // Caméra face au Vivaro, légèrement surélevée.
    desired.set(
      car.position.x,
      portrait ? 7 : 6,
      portrait ? 11.8 : 10.7
    );

    // Suivi fluide.
    camera.position.lerp(
      desired,
      1 - Math.exp(-Math.max(dt, 0.001) * 3)
    );

    // Regarder directement le véhicule.
    look.set(
      car.position.x,
      2.8,
      car.position.z - 2
    );

    camera.lookAt(look);

    camera.fov = portrait ? 48 : 42;
    camera.updateProjectionMatrix();
  };
}
