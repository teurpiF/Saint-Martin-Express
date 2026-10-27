import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

export function createVivaro(scene) {
  const van = new THREE.Group();

  van.position.set(0, 0, 3);
  scene.add(van);

  const loader = new GLTFLoader();

  loader.load(
    '../models/passenger-van-with-side-windows.glb',

    (gltf) => {
      const model = gltf.scene;

      // Calculer les dimensions du modèle
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // Centrer le modèle
      model.position.sub(center);

      // Adapter la taille du véhicule
      const maxDimension = Math.max(
        size.x,
        size.y,
        size.z
      );

      const scale = 4.3 / maxDimension;
      model.scale.setScalar(scale);

      // Poser le véhicule sur le sol
      const scaledBox = new THREE.Box3().setFromObject(model);
      model.position.y -= scaledBox.min.y;

      // Activer les ombres
      model.traverse((object) => {
        if (object.isMesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });

      // Ajouter le modèle au jeu
      van.add(model);

      console.log('Modèle du Vivaro chargé');
    },

    undefined,

    (error) => {
      console.error(
        'Erreur de chargement du Vivaro :',
        error
      );
    }
  );

  return {
    group: van,

    update(dt, steering, speed) {
      const targetYaw = -steering * 0.12;

      van.rotation.y +=
        (targetYaw - van.rotation.y) *
        (1 - Math.exp(-dt * 3));
    }
  };
}
