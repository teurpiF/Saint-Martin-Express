import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const material = (color, roughness = 0.9) =>
new THREE.MeshStandardMaterial({
color,
roughness,
side: THREE.DoubleSide
});

export function roadCenter(z) {
return 2.1 * Math.sin(z * 0.038)
+ 0.9 * Math.sin(z * 0.09 + 1.3);
}

export function createRoad(scene) {
const asphalt = material(0x494e50);
const verge = material(0x899078);
const line = material(0xe7dcc2);
const grass = material(0x687b57);

const segments = [];
const length = 3.5;
const count = 70;

const ground = new THREE.Mesh(
new THREE.PlaneGeometry(240, 280),
grass
);
ground.rotation.x = -Math.PI / 2;
ground.position.set(0, -0.13, -75);
scene.add(ground);

for (let i = 0; i < count; i++) {
const z = 12 - i * length;
const group = new THREE.Group();
scene.add(group);

function addStrip(offset, width, y, mat) {
  const z0 = z;
  const z1 = z - length;
  const x0 = roadCenter(z0) + offset;
  const x1 = roadCenter(z1) + offset;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute([
      x0 - width / 2, y, z0,
      x1 - width / 2, y, z1,
      x0 + width / 2, y, z0,
      x0 + width / 2, y, z0,
      x1 - width / 2, y, z1,
      x1 + width / 2, y, z1
    ], 3)
  );
  geometry.computeVertexNormals();
  group.add(new THREE.Mesh(geometry, mat));
}
addStrip(0, 9.6, -0.02, asphalt);
addStrip(-5.1, 1.2, -0.03, verge);
addStrip(5.1, 1.2, -0.03, verge);
addStrip(-4.65, 0.12, 0, line);
addStrip(4.65, 0.12, 0, line);
if (i % 2 === 0) {
  addStrip(0, 0.12, 0.005, line);
}
segments.push({ group, z });

}

const trees = [];
const trunkMaterial = material(0x68513d);
const leafMaterial = material(0x59764d);
const leafMaterial2 = material(0x7b9160);

for (let i = 0; i < 48; i++) {
for (const side of [-1, 1]) {
const z = -i * 5.3 - 8;
const offset = side * (8 + Math.random() * 5);

  const tree = new THREE.Group();
  tree.position.set(roadCenter(z) + offset, 0, z);
  scene.add(tree);
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.2, 1.5, 8),
    trunkMaterial
  );
  trunk.position.y = 0.75;
  tree.add(trunk);
  for (let j = 0; j < 3; j++) {
    const crown = new THREE.Mesh(
      new THREE.ConeGeometry(0.9 - j * 0.17, 1.25, 8),
      j % 2 ? leafMaterial2 : leafMaterial
    );
    crown.position.y = 1.45 + j * 0.58;
    tree.add(crown);
  }
  trees.push({ group: tree, z, offset });
}

}

return {
update(dt, speed) {
for (const segment of segments) {
segment.z += speed * dt;

    if (segment.z > 14) {
      segment.z -= count * length;
    }
    segment.group.position.z = segment.z;
  }
  for (const tree of trees) {
    tree.z += speed * dt;
    if (tree.z > 15) {
      tree.z -= 260;
    }
    tree.group.position.z = tree.z;
    tree.group.position.x =
      roadCenter(tree.z) + tree.offset;
  }
}

};
}
