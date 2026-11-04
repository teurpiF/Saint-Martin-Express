
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// Couleurs possibles de la carrosserie.
const TRACTOR_COLORS = [
  0xffcc22, // Jaune
  0xd93636, // Rouge
  0x2876d2, // Bleu
  0x36a653, // Vert
  0xe77bb8  // Rose
];

function material(color, roughness = 0.85) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    flatShading: true
  });
}

function addBox(group, width, height, depth, color, x, y, z) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    material(color)
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);

  return mesh;
}

function addCylinder(group, radius, length, color, x, y, z) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, length, 10),
    material(color)
  );

  // Axe du cylindre orienté sur la largeur du tracteur.
  mesh.rotation.z = Math.PI / 2;
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);

  return mesh;
}

// Roues corrigées : pneus réguliers et axe transversal.
function addWheel(group, x, y, z, radius, width) {
  const wheel = new THREE.Group();
  wheel.position.set(x, y, z);
  group.add(wheel);

  // Pneu.
  const tire = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, width, 16),
    material(0x17191b)
  );

  tire.rotation.z = Math.PI / 2;
  tire.castShadow = true;
  tire.receiveShadow = true;
  wheel.add(tire);

  // Flanc légèrement marqué.
  const sidewall = new THREE.Mesh(
    new THREE.CylinderGeometry(
      radius * 0.48,
      radius * 0.48,
      width + 0.025,
      12
    ),
    material(0x303438)
  );

  sidewall.rotation.z = Math.PI / 2;
  sidewall.position.x = Math.sign(x) * 0.01;
  wheel.add(sidewall);

  // Moyeu métallique.
  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(
      radius * 0.27,
      radius * 0.27,
      width + 0.045,
      10
    ),
    material(0x85898d)
  );

  hub.rotation.z = Math.PI / 2;
  hub.position.x = Math.sign(x) * 0.02;
  wheel.add(hub);

  // Centre du moyeu.
  const center = new THREE.Mesh(
    new THREE.CylinderGeometry(
      radius * 0.12,
      radius * 0.12,
      width + 0.06,
      8
    ),
    material(0x292d31)
  );

  center.rotation.z = Math.PI / 2;
  center.position.x = Math.sign(x) * 0.03;
  wheel.add(center);

  return wheel;
}

function createTractorBody(group, bodyMaterial) {
  // Châssis inférieur.
  addBox(group, 1.55, 0.55, 2.25, 0x34383b, 0, 0.95, 0);

  // Capot arrière et carrosserie.
  const rearBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.15, 0.85, 1.0),
    bodyMaterial
  );

  rearBody.position.set(0, 1.55, 0.35);
  rearBody.castShadow = true;
  rearBody.receiveShadow = true;
  group.add(rearBody);

  // Ailes au-dessus des grandes roues.
  for (const side of [-1, 1]) {
    const fender = addBox(
      group, 0.48, 0.18, 1.65,
      bodyMaterial.color,
      side * 1.0, 1.72, 0.15
    );

    fender.rotation.x = -0.04;

    // Support des ailes.
    addBox(
      group, 0.12, 0.45, 0.65,
      0x393d40,
      side * 1.0, 1.43, 0.15
    );
  }

  // Cabine.
  const cabinFrame = material(0x252a2d);
  const glass = new THREE.MeshStandardMaterial({
    color: 0x547887,
    roughness: 0.25,
    metalness: 0.15,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide
  });

  // Montants arrière et latéraux.
  for (const side of [-1, 1]) {
    addBox(group, 0.12, 1.65, 0.13, 0x252a2d, side * 0.66, 2.65, 0.82);
    addBox(group, 0.12, 1.65, 0.13, 0x252a2d, side * 0.66, 2.65, -0.45);

    // Rétroviseurs.
    addBox(group, 0.08, 0.08, 0.55, 0x252a2d, side * 0.86, 2.85, 0.55);
    addBox(group, 0.12, 0.32, 0.25, 0x353b40, side * 1.12, 2.82, 0.82);
    addBox(group, 0.025, 0.24, 0.18, 0x73909b, side * 1.19, 2.82, 0.82);
  }

  // Vitre arrière.
  const rearWindow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.18, 1.25),
    glass
  );

  rearWindow.position.set(0, 2.65, 0.89);
  rearWindow.castShadow = false;
  group.add(rearWindow);

  // Encadrement horizontal de la vitre.
  addBox(group, 1.35, 0.12, 0.12, cabinFrame, 0, 3.38, 0.88);
  addBox(group, 1.35, 0.12, 0.12, cabinFrame, 0, 1.95, 0.88);

  // Siège visible derrière la vitre.
  addBox(group, 0.48, 0.65, 0.25, 0x333a40, 0, 2.45, 0.58);

  // Toit.
  addBox(group, 1.75, 0.22, 1.9, bodyMaterial.color, 0, 3.55, 0.15);

  // Bordure sombre du toit.
  addBox(group, 1.82, 0.09, 1.95, 0x25292c, 0, 3.42, 0.15);

  // Feux de travail sur le toit.
  for (const side of [-1, 1]) {
    addBox(group, 0.18, 0.12, 0.12, 0xf1eee0, side * 0.58, 3.42, 0.95);
  }

  // Feux arrière rouges.
  for (const side of [-1, 1]) {
    addBox(group, 0.35, 0.22, 0.09, 0x222629, side * 0.78, 1.48, 0.87);
    addBox(group, 0.25, 0.12, 0.035, 0xe53c35, side * 0.78, 1.49, 0.925);
    addBox(group, 0.25, 0.045, 0.04, 0xf0e9d8, side * 0.78, 1.41, 0.925);
  }

  // Attelage trois points arrière.
  addBox(group, 0.18, 0.75, 0.18, 0x60666b, 0, 0.65, 1.05);

  for (const side of [-1, 1]) {
    const arm = addBox(
      group, 0.13, 0.72, 0.13,
      0x747a7f,
      side * 0.42, 0.48, 1.12
    );

    arm.rotation.x = -0.35;
    arm.rotation.z = side * 0.18;
  }

  addBox(group, 0.7, 0.13, 0.14, 0x555b60, 0, 0.16, 1.35);
}

export function createTractorModel() {
  const group = new THREE.Group();

  const selectedColor =
    TRACTOR_COLORS[Math.floor(Math.random() * TRACTOR_COLORS.length)];

  const bodyMaterial = material(selectedColor);

  // Carrosserie et cabine.
  createTractorBody(group, bodyMaterial);

  // Grandes roues arrière.
  for (const side of [-1, 1]) {
    addWheel(group, side * 1.0, 0.95, 0.15, 0.92, 0.48);
  }

  // Roues avant plus petites.
  for (const side of [-1, 1]) {
    addWheel(group, side * 0.78, 0.48, -1.05, 0.43, 0.30);
  }

  // Petit capot avant.
  addBox(group, 1.25, 0.42, 0.75, selectedColor, 0, 1.05, -1.0);

  // Feux avant visibles sur les côtés.
  for (const side of [-1, 1]) {
    addBox(group, 0.16, 0.12, 0.12, 0xf5e7bd, side * 0.62, 1.12, -1.38);
  }

  // Échappement.
  addCylinder(group, 0.07, 0.8, 0x34383b, 0.48, 1.8, -0.65);

  group.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

  group.userData.color = selectedColor;

  return group;
}
