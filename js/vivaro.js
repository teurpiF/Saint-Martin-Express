import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export function createVivaro(scene) {
const van = new THREE.Group();

const paint = new THREE.MeshStandardMaterial({
color: 0xf2f2ee,
roughness: 0.38,
metalness: 0.12
});

const black = new THREE.MeshStandardMaterial({
color: 0x171b1e,
roughness: 0.75
});

const glass = new THREE.MeshStandardMaterial({
color: 0x344e59,
roughness: 0.2,
metalness: 0.1,
side: THREE.DoubleSide
});

const rubber = new THREE.MeshStandardMaterial({
color: 0x151515,
roughness: 0.95
});

const metal = new THREE.MeshStandardMaterial({
color: 0xb8bec0,
metalness: 0.75,
roughness: 0.25
});

const headlight = new THREE.MeshStandardMaterial({
color: 0xfff5d6,
emissive: 0xffe5a0,
emissiveIntensity: 0.4
});

const red = new THREE.MeshStandardMaterial({
color: 0xb51e24
});

const skin = new THREE.MeshStandardMaterial({
color: 0xd6a17d,
roughness: 0.9
});

const clothes = [
new THREE.MeshStandardMaterial({ color: 0x253b49 }),
new THREE.MeshStandardMaterial({ color: 0x554239 })
];

function box(parent, w, h, d, x, y, z, mat) {
const mesh = new THREE.Mesh(
new THREE.BoxGeometry(w, h, d),
mat
);

mesh.position.set(x, y, z);
parent.add(mesh);
return mesh;

}

// Châssis et carrosserie principale.
box(van, 2.12, 0.55, 4.25, 0, 0.85, 0, paint);

// Habitacle surélevé.
box(van, 2.02, 0.78, 2.65, 0, 1.45, 0.42, paint);

// Capot et pare-chocs avant.
box(van, 1.98, 0.27, 1.0, 0, 1.13, -1.62, paint);
box(van, 2.1, 0.2, 0.2, 0, 0.62, -2.1, black);

// Calandre avant.
box(van, 0.94, 0.27, 0.055, 0, 0.91, -2.13, black);

for (let i = 0; i < 4; i++) {
box(
van, 0.78, 0.025, 0.018,
0, 0.82 + i * 0.06, -2.165,
metal
);
}

// Phares, feux et rétroviseurs.
for (const side of [-1, 1]) {
box(
van, 0.38, 0.18, 0.06,
side * 0.76, 1.13, -2.14,
headlight
);

box(
  van, 0.23, 0.09, 0.05,
  side * 0.84, 0.73, -2.14,
  red
);
box(
  van, 0.18, 0.12, 0.19,
  side * 1.13, 1.58, -1.13,
  black
);
box(
  van, 0.11, 0.065, 0.08,
  side * 1.19, 1.59, -1.14,
  glass
);

}

// Pare-brise incliné pour voir les occupants.
const windshield = new THREE.Mesh(
new THREE.PlaneGeometry(1.72, 0.63),
glass
);

windshield.position.set(0, 1.69, -0.94);
windshield.rotation.x = -0.16;
van.add(windshield);

// Vitres latérales.
for (const side of [-1, 1]) {
box(
van, 0.025, 0.47, 1.0,
side * 1.015, 1.68, -0.15,
glass
);

box(
  van, 0.025, 0.44, 0.8,
  side * 1.015, 1.68, 0.95,
  glass
);

}

// Sièges avant.
for (const x of [-0.45, 0.45]) {
box(van, 0.4, 0.5, 0.32, x, 1.02, -0.05, black);
box(van, 0.4, 0.28, 0.12, x, 1.36, 0.08, black);
}

// Deux occupants.
for (let i = 0; i < 2; i++) {
const x = i === 0 ? -0.43 : 0.43;
const person = new THREE.Group();

const torso = new THREE.Mesh(
  new THREE.BoxGeometry(0.33, 0.42, 0.22),
  clothes[i]
);
torso.position.y = 1.49;
person.add(torso);
const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.14, 16, 12),
  skin
);
head.position.set(0, 1.81, -0.015);
person.add(head);
const hair = new THREE.Mesh(
  new THREE.SphereGeometry(
    0.145, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2
  ),
  black
);
hair.position.set(0, 1.87, -0.015);
person.add(hair);
person.position.x = x;
van.add(person);

}

// Roues et jantes.
const wheels = [];

for (const x of [-1.06, 1.06]) {
for (const z of [-1.42, 1.38]) {
const wheel = new THREE.Group();
wheel.position.set(x, 0.52, z);
van.add(wheel);

  const tire = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.34, 0.19, 24),
    rubber
  );
  tire.rotation.z = Math.PI / 2;
  wheel.add(tire);
  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.2, 16),
    metal
  );
  hub.rotation.z = Math.PI / 2;
  wheel.add(hub);
  wheels.push(wheel);
}

}

// Plaque avant.
box(van, 0.42, 0.08, 0.025, 0, 0.72, -2.16, paint);

van.position.set(0, 0, 3);
scene.add(van);

return {
group: van,
wheels,

update(dt, steering, speed) {
  // Inclinaison progressive de la carrosserie.
  const targetYaw = -steering * 0.12;
  van.rotation.y +=
    (targetYaw - van.rotation.y) *
    (1 - Math.exp(-dt * 3));
  // Rotation des roues.
  for (const wheel of wheels) {
    wheel.rotation.x += speed * dt * 0.7;
  }
}

};
}