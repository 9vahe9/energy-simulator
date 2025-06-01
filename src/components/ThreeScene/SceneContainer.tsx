// import React, { useRef, useEffect } from "react";
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// const ThreeScene: React.FC = () => {
//   const mountRef = useRef<HTMLDivElement | null>(null);
//   const roomModelRef = useRef<THREE.Group | null>(null);
//   useEffect(() => {
//     const container = mountRef.current;
//     if (!container) return;

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xf0f0f0);

//     const camera = new THREE.PerspectiveCamera(
//       75,
//       container.clientWidth / container.clientHeight,
//       0.1,
//       1000
//     );
//     camera.position.set(0.5, 1.5, 5);

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(container.clientWidth, container.clientHeight);
//     container.appendChild(renderer.domElement);

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.enableZoom = true;
//     controls.minDistance = 0.5;
//     controls.maxDistance = 5;
//     controls.target.set(0.5, 1, 0.2);
//     controls.update();

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     directionalLight.position.set(5, 10, 7.5);
//     scene.add(directionalLight);

//     const loader = new GLTFLoader();
//     loader.load(
//       "/models/emptyroom.glb",
//       (gltf) => {
//         const model = gltf.scene;
//         model.scale.set(1, 1, 1);
//         model.position.set(0, 0, 0);
//         scene.add(model);
//         roomModelRef.current = model;
//         const box = new THREE.Box3().setFromObject(model);
//         const center = new THREE.Vector3();
//         box.getCenter(center);
//         controls.target.copy(center);
//         controls.update();
//       },
//       undefined, //потом добавить  лоадер , если картинка тяжелая
//       (error) => {
//         console.error("download error", error);
//       }
//     );
//     const handleResize = () => {
//       if (!container) return;
//       camera.aspect = container.clientWidth / container.clientHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(container.clientWidth, container.clientHeight);
//     };
//     const handleAddDevice = (e: Event) => {
//       const { type } = (e as CustomEvent).detail;
//       console.log("type =", type, e);
//       let cylinder;

//       switch (type) {
//         case 14:
//           if (roomModelRef.current) {
//             cylinder = new THREE.Mesh(
//               new THREE.CylinderGeometry(0.01, 0.02, 0.01, 18, 1),
//               new THREE.MeshStandardMaterial({ color: 0xffd700 })
//             );
//             cylinder.position.set(0, 0, 0);
//             roomModelRef.current.add(cylinder);
//             break;
//           }
//       }
//     };
//     function onWindowResize() {
//       if (!container) return;
//       camera.aspect = container.clientWidth / container.clientHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(container.clientWidth, container.clientHeight);
//     }
//     window.addEventListener("resize", handleResize);
//     window.addEventListener("resize", onWindowResize);
//     handleResize();
//     window.addEventListener("addDevice", handleAddDevice);

//     const animate = () => {
//       requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     return () => {
//       window.removeEventListener("addDevice", handleAddDevice);
//       window.removeEventListener("resize", handleResize);
//       window.removeEventListener("resize", onWindowResize);
//       container.removeChild(renderer.domElement);
//       renderer.dispose();
//     };
//   }, []);

//   return <div ref={mountRef} style={{ width: "70%", height: "500px" }} />;
// };

// export default ThreeScene;
