import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { IRoomDevice } from "../types/device";

const useThreeScene = (initialDevices: IRoomDevice[] = [], deleteFunction: (id: number) => void) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const roomModelRef = useRef<THREE.Group | null>(null);
  const [loadedFlag, setLoadedFlag] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const interactableObjects = useRef<THREE.Object3D[]>([]);
  const previouslySelected = useRef<THREE.Mesh | null>(null);

  const hasInitialized = useRef(false);


  const handleAddDevice = (type: IRoomDevice) => {
    if (!roomModelRef.current) return;

    if (type.type === 14 || type.type === 18) {
      const cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.02, 0.01, 18, 1),
        new THREE.MeshStandardMaterial({ color: 0xffd700 })
      );
      cylinder.position.set(0, 0, 0);
      cylinder.name = type.name;
      roomModelRef.current.add(cylinder);
      interactableObjects.current.push(cylinder);
      return;
    }

    const fridge = new THREE.Mesh(
      new THREE.BoxGeometry(0.015, 0.03, 0.01),
      new THREE.MeshStandardMaterial({ color: 0x0000ff })
    );
    fridge.name = type.name;
    fridge.position.set(0, -0.15, 0.03);
    fridge.scale.set(3, 3, 3);

    roomModelRef.current.add(fridge);
    interactableObjects.current.push(fridge);
  };

  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const controls = useRef<OrbitControls | null>(null);
  const scene = useRef<THREE.Scene>();
  const roomBoundsRef = useRef<THREE.Box3 | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    const tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.background = "#333";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "5px 10px";
    tooltip.style.borderRadius = "5px";
    tooltip.style.pointerEvents = "none";
    tooltip.style.fontSize = "12px";
    tooltip.style.display = "none";
    document.body.appendChild(tooltip);
    if (!container) {
      setLoadedFlag(true);
      return;
    }
    if (!scene.current) {
      scene.current = new THREE.Scene();
    }
    scene.current.background = new THREE.Color(0xf0f0f0);

    camera.current = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.current.position.set(0.3, 0.4, 0.2);

    renderer.current = new THREE.WebGLRenderer({ antialias: true });
    renderer.current.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.current.domElement);

    controls.current = new OrbitControls(
      camera.current,
      renderer.current.domElement
    );
    controls.current.enableDamping = true;
    controls.current.enableZoom = true;
    controls.current.minDistance = 0.1;
    controls.current.maxDistance = 5;
    controls.current.target.set(0.5, 1, 0.2);
    controls.current.update();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.current.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load(
      "/models/emptyroom.glb",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0, 0, 0);
        //model.rotation.set(-Math.PI / 22, Math.PI, 0);
        model.traverse((child) => {
          child.userData.isRoom = true;
        });
        scene.current!.add(model);
        roomModelRef.current = model;

        roomBoundsRef.current = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        roomBoundsRef.current.getCenter(center);
        controls.current!.target.copy(center);
        controls.current!.update();

             if (!hasInitialized.current) {
          initialDevices.forEach((device) => {
            handleAddDevice(device);
          });
          hasInitialized.current = true;
        }


      },

  

      undefined,
      (error) => console.error("Error loading model:", error)
    );

    let isRotateEnabled = false;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        isRotateEnabled = true;
        if (controls.current) {
          controls.current.enableRotate = true;
          controls.current.update();
          console.log(controls, "controls");
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        isRotateEnabled = false;
        if (controls.current) {
          controls.current.enableRotate = false;
          controls.current.update();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const handleClick = (event: MouseEvent) => {
      if (!renderer.current || !camera.current) return;
      controls.current.enableRotate = false;
      const rect = renderer.current.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera.current);
      const intersects = raycaster.intersectObjects(
        interactableObjects.current,
        true
      );

      if (intersects.length > 0) {
        const clicked = intersects[0].object as THREE.Mesh;

        if (
          previouslySelected.current &&
          previouslySelected.current !== clicked
        ) {
          const material = previouslySelected.current
            .material as THREE.MeshStandardMaterial;
          material.color.set(0x0000ff);
        }

        if (clicked.material) {
          (clicked.material as THREE.MeshStandardMaterial).color.set(0xff0000);
        }

        previouslySelected.current = clicked;
        console.log("Click on", clicked.name);
      }
    };

    let selectedObject: THREE.Object3D | null = null;
    const dragOffset = new THREE.Vector3();
    const plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);

    function onMouseDown(event: MouseEvent) {
      if (!renderer.current || !camera.current) return;

      const rect = renderer.current.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera.current);
      const intersects = raycaster.intersectObjects(
        interactableObjects.current,
        true
      );

      if (intersects.length > 0) {
        selectedObject = intersects[0].object;
        plane.setFromNormalAndCoplanarPoint(
          camera.current
            .getWorldDirection(new THREE.Vector3())
            .clone()
            .negate(),
          selectedObject.position
        );

        const intersectionPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersectionPoint);

        dragOffset.copy(selectedObject.position).sub(intersectionPoint);
      }
    }

    function onMouseMove(event: MouseEvent) {
      if (!selectedObject || !renderer.current || !camera.current) return;

      const rect = renderer.current.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera.current);

      plane.setFromNormalAndCoplanarPoint(
        camera.current.getWorldDirection(new THREE.Vector3()).clone().negate(),
        selectedObject.position
      );

      const intersectionPoint = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(plane, intersectionPoint)) {
        const newPos = intersectionPoint.clone().add(dragOffset);

        // check box area
        if (roomBoundsRef.current) {
          const roomMin = roomBoundsRef.current.min;
          const roomMax = roomBoundsRef.current.max;

          newPos.x = Math.max(roomMin.x, Math.min(roomMax.x, newPos.x));
          newPos.y = Math.max(roomMin.y, Math.min(roomMax.y, newPos.y));
          newPos.z = Math.max(roomMin.z, Math.min(roomMax.z, newPos.z));
        }

        selectedObject.position.copy(newPos);
      }
    }

    function onMouseUp() {
      selectedObject = null;
    }

    renderer.current.domElement.addEventListener("mousedown", onMouseDown);
    renderer.current.domElement.addEventListener("mousemove", onMouseMove);
    renderer.current.domElement.addEventListener("mouseup", onMouseUp);
    renderer.current.domElement.addEventListener("click", handleClick);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.current?.update();
      renderer.current?.render(scene.current!, camera.current!);
    };

    animate();

    const handleResize = () => {
      if (!container || !camera.current || !renderer.current) return;
      camera.current.aspect = container.clientWidth / container.clientHeight;
      camera.current.updateProjectionMatrix();
      renderer.current.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    const handlePointerMove = (event: MouseEvent) => {
      if (!camera.current || !renderer.current) return;

      const rect = renderer.current.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera.current);
      const intersects = raycaster.intersectObjects(
        interactableObjects.current,
        true
      );

      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        tooltip.style.left = `${event.clientX + 10}px`;
        tooltip.style.top = `${event.clientY + 10}px`;
        tooltip.innerText = intersected.name || "Без названия";
        tooltip.style.display = "block";
      } else {
        tooltip.style.display = "none";
      }
    };
    renderer.current.domElement.addEventListener(
      "mousemove",
      handlePointerMove
    );
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);

      renderer.current?.domElement.removeEventListener(
        "mousedown",
        onMouseDown
      );
      renderer.current?.domElement.removeEventListener(
        "mousemove",
        onMouseMove
      );
      renderer.current?.domElement.removeEventListener("mouseup", onMouseUp);
      renderer.current?.domElement.removeEventListener("click", handleClick);
      if (renderer.current && mountRef.current) {
        mountRef.current.removeChild(renderer.current.domElement);
      }
      renderer.current?.domElement.removeEventListener(
        "mousemove",
        handlePointerMove
      );
      document.body.removeChild(tooltip);
    };
  }, [loadedFlag]);

  return {
    handleAddDevice,
    threeScene: (
      <div
        className="oooo"
        ref={mountRef}
        style={{ width: "70%", height: "500px" }}
      />
    ),
  };
};

export default useThreeScene;
