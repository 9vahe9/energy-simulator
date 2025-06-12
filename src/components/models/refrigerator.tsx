import * as THREE from "three";

export function createRefrigerator() {
  const refrigerator = new THREE.Group();

  // Корпус
  const bodyGeometry = new THREE.BoxGeometry(0.015, 0.035, 0.015);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.2,
    roughness: 0.8,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  refrigerator.add(body);

  // Дверь (нижняя)
  const lowerDoorGeometry = new THREE.BoxGeometry(0.014, 0.017, 0.001);
  const lowerDoorMaterial = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    metalness: 0.3,
    roughness: 0.7,
  });
  const lowerDoor = new THREE.Mesh(lowerDoorGeometry, lowerDoorMaterial);
  lowerDoor.position.set(0, -0.009, -0.008);
  refrigerator.add(lowerDoor);

  // Дверь (верхняя)
  const upperDoor = lowerDoor.clone();
  upperDoor.position.set(0, 0.009, -0.008);
  refrigerator.add(upperDoor);

  // Ручки
  const handleGeometry = new THREE.BoxGeometry(0.0005, 0.004, 0.0005);
  const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });

  const handle1 = new THREE.Mesh(handleGeometry, handleMaterial);
  handle1.position.set(0.007, 0.009, -0.009);
  refrigerator.add(handle1);

  const handle2 = handle1.clone();
  handle2.position.set(0.007, -0.009, -0.009);
  refrigerator.add(handle2);
  //refrigerator.rotation.y = -Math.PI / 2;
  return refrigerator;
}
