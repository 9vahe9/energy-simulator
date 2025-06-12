import * as THREE from "three";

export function createVacuumCleaner() {
  const vacuum = new THREE.Group();

  // Корпус
  const bodyGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.015, 32);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.5,
    roughness: 0.4,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.rotation.z = Math.PI / 2;
  vacuum.add(body);

  // Ручка
  const handleGeometry = new THREE.CylinderGeometry(0.002, 0.002, 0.03, 16);
  const handleMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    metalness: 0.7,
    roughness: 0.3,
  });
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  handle.position.set(0.015, 0.015, 0); // ближе к корпусу
  handle.rotation.z = Math.PI / 4; // наклон ручки
  vacuum.add(handle);

  // Колёса
  const wheelGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.002, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.6,
    roughness: 0.5,
  });

  const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheel1.position.set(0, -0.0075, 0.007); // ближе к центру
  wheel1.rotation.x = Math.PI / 2;
  vacuum.add(wheel1);

  const wheel2 = wheel1.clone();
  wheel2.position.set(0, -0.0075, -0.007);
  vacuum.add(wheel2);

  return vacuum;
}
