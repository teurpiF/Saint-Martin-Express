
function addWheel(group, x, y, z, radius, width) {
  const wheel = new THREE.Group();
  wheel.position.set(x, y, z);
  group.add(wheel);

  // Pneu : cylindre orienté sur l'axe transversal du tracteur.
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
    new THREE.CylinderGeometry(radius * 0.48, radius * 0.48, width + 0.025, 12),
    material(0x303438)
  );

  sidewall.rotation.z = Math.PI / 2;
  sidewall.position.x = Math.sign(x) * 0.01;
  wheel.add(sidewall);

  // Moyeu métallique.
  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.27, radius * 0.27, width + 0.045, 10),
    material(0x85898d)
  );

  hub.rotation.z = Math.PI / 2;
  hub.position.x = Math.sign(x) * 0.02;
  wheel.add(hub);

  // Centre du moyeu.
  const center = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.12, radius * 0.12, width + 0.06, 8),
    material(0x292d31)
  );

  center.rotation.z = Math.PI / 2;
  center.position.x = Math.sign(x) * 0.03;
  wheel.add(center);

  return wheel;
}
