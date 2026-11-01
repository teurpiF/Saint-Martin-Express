import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';


export function createVivaro(scene) {
  alert('TEST : vivaro.js est bien exécuté');
  const van = new THREE.Group();

  van.position.set(0, 0, 3);
  scene.add(van);

  const loader = new GLTFLoader();

  loader.load(
'https://teurpif.github.io/Saint-Martin-Express/models/passenger-van-with-side-windows.glb',


    
    (gltf) => {
      const model = gltf.scene;

      // Calculer les dimensions du modèle
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
     
      alert(
  'Dimensions du Vivaro :\n' +
  'X : ' + size.x.toFixed(2) + '\n' +
  'Y : ' + size.y.toFixed(2) + '\n' +
  'Z : ' + size.z.toFixed(2)
);
      
      
      
      
      
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



      model.rotation.y = Math.PI / 2;

      
      // Ajouter le modèle au jeu
      van.add(model);





      // Charger le conducteur 2D
      const textureLoader = new THREE.TextureLoader();

      textureLoader.load(
        'https://teurpif.github.io/Saint-Martin-Express/models/conducteur.png',

        (texture) => {
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false
          });


const geometry = new THREE.PlaneGeometry(0.52, 0.72);
const driver = new THREE.Mesh(geometry, material);

// Conducteur ajusté dans l'habitacle
driver.position.set(0.35, 1.67, 1.85);



          


          van.add(driver);

          console.log('Conducteur chargé');
        },

        undefined,

        (error) => {
          console.error('Erreur conducteur :', error);
        }
      );





      
      
      
      alert('DIAGNOSTIC : le modèle 3D est chargé !');
    
    
    },

    undefined,

    (error) => {
      


alert('ERREUR DE CHARGEMENT DU VAN : ' + error);

      
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
