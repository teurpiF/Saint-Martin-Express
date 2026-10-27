import * as THREE from ‘three’;
import { GLTFLoader } from ‘https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js’;

export function createVivaro(scene) {
const van = new THREE.Group();
van.position.set(0, 0, 3);
scene.add(van);

const loader = new GLTFLoader();

loader.load(
‘./models/passenger-van-with-side-windows.glb’,
(gltf) => {
const model = gltf.scene;

  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
  const maxDimension = Math.max(size.x, size.y, size.z);
  const scale = 4.3 / maxDimension;
  model.scale.setScalar(scale);
  const scaledBox = new THREE.Box3().setFromObject(model);
  model.position.y -= scaledBox.min.y;
  model.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  van.add(model);
  console.log('Modele du vehicule charge !');
},
undefined,
(error) => {
  console.error('Erreur de chargement du vehicule :', error);
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
