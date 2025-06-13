import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { IRoomDevice } from "../types/device";

const useThreeScene = (
  roomId: string | undefined,
  initialDevices: IRoomDevice[] = [],
  deleteFunction: (id: number) => void,
  roomPath: string = "emptyroom.glb"
) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const roomModelRef = useRef<THREE.Group | null>(null);
  const [, setLoadedFlag] = useState(false);
  const interactableObjects = useRef<THREE.Object3D[]>([]);
  const previouslySelected = useRef<THREE.Mesh | null>(null);
  const [devices] = useState(initialDevices);

  const [selectedObjectInfo, setSelectedObjectInfo] = useState<{
    name: string;
    object: THREE.Object3D;
  } | null>(null);

  const hasInitialized = useRef(false);
  console.log(initialDevices, "initialDevices");
  const handleAddDevice = (type: IRoomDevice) => {
    if (!roomModelRef.current) return;
    console.log(type, "typetype");
    const loadGLB = (modelPath: string, name: string) => {
      const loader = new GLTFLoader();
      console.log(type, "type");
      loader.load(`/models/${modelPath}`, (gltf) => {
        const device = gltf.scene;
        device.name = `device-${type.deviceId}`;
        device.position.set(
          device.position.x,
          device.position.y,
          device.position.z
        );
        device.deviceId = type.deviceId;
        const box = new THREE.Box3().setFromObject(device);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 0.1 / maxDim;
        device.scale.setScalar(scaleFactor);

        roomModelRef.current!.add(device);
        interactableObjects.current.push(device);
        console.log(interactableObjects, "interactableObjects");
      });
    };

    switch (type.type) {
      case 1:
        loadGLB("refreg.glb", type.name);
        break;
      case 2:
        loadGLB("vacuum_cleaner.glb", type.name);
        break;
      case 3:
        loadGLB("aire_acondicionado_-_rafael_blanco_est_usb_im.glb", type.name);
        break;
      case 4:
        loadGLB("tv.glb", type.name);
        break;
      case 5:
        loadGLB("phone-1.glb", type.name);
        break;
      case 6:
        loadGLB("all-in-one_desktop_computer_and_smartphone.glb", type.name);
        break;
      case 7:
        loadGLB("printer.glb", type.name);
        break;
      case 8:
        loadGLB("printer.glb", type.name);
        break;
      case 9:
        loadGLB("hair_dryer.glb", type.name);
        break;
      case 10:
        loadGLB("simple_heater.glb", type.name);
        break;
      case 11:
        loadGLB("humidifier.glb", type.name);
        break;
      case 12:
        loadGLB("lamp.glb", type.name);
        break;
      case 13:
        loadGLB("microwave_-_sharp_34l.glb", type.name);
        break;
      case 14:
        loadGLB("czajnik_elektrycznyelectric_kettle.glb", type.name);
        break;
      case 15:
        loadGLB("dishwasher.glb", type.name);
        break;
      case 16:
        loadGLB("mixer.glb", type.name);
        break;
      case 17:
        loadGLB("stove_with_hood.glb", type.name);
        break;
      default:
        loadGLB("ref.glb", type.name);
    }
  };

  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const controls = useRef<OrbitControls | null>(null);
  const scene = useRef<THREE.Scene>();
  const roomBoundsRef = useRef<THREE.Box3 | null>(null);

  useEffect(() => {
    console.log(1);
    const container = mountRef.current;
    const mountNode = mountRef.current;
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
    controls.current.minDistance = 0.5;
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
      roomPath.startsWith("blob:") ? roomPath : `/models/${roomPath}`,
      (gltf) => {
        if (roomModelRef.current) scene.current?.remove(roomModelRef.current);

        const room = gltf.scene;

        const box = new THREE.Box3().setFromObject(room);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 1;
        if (maxDim > 0) {
          const scale = targetSize / maxDim;
          room.scale.setScalar(scale);
        }

        scene.current?.add(room);
        roomModelRef.current = room;

        roomBoundsRef.current = new THREE.Box3().setFromObject(room);
        const center = roomBoundsRef.current.getCenter(new THREE.Vector3());
        controls.current!.target.copy(center);
        controls.current!.update();
      },
      undefined,
      (error) => console.error("Error loading model:", error)
    );
    if (!hasInitialized.current) {
      console.log(initialDevices, "initialDevices");
      if (initialDevices.length > 0) {
        initialDevices.forEach((device) => handleRerenderDevice(device));
      }
      hasInitialized.current = true;
    }
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

      const rect = renderer.current.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera.current);
      const intersects = raycaster.intersectObjects(
        interactableObjects.current,
        true
      );

      if (intersects.length > 0) {
        let clicked = intersects[0].object as THREE.Object3D;

        while (clicked.parent && clicked.parent !== roomModelRef.current) {
          clicked = clicked.parent;
        }

        setSelectedObjectInfo({
          name: clicked.name || "No name",
          object: clicked,
        });

        if (
          previouslySelected.current &&
          previouslySelected.current !== clicked
        ) {
          previouslySelected.current.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              (mesh.material as THREE.MeshStandardMaterial).color.set(0x0000ff);
            }
          });
        }

        clicked.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            (mesh.material as THREE.MeshStandardMaterial).color.set(0xff0000);
          }
        });

        previouslySelected.current = clicked as THREE.Mesh;
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
        let object = intersects[0].object;
        while (
          object.parent &&
          object.parent !== roomModelRef.current &&
          !object.name
        ) {
          object = object.parent;
        }
        tooltip.innerText = object.name || "no name";
        while (object.parent && object.parent !== roomModelRef.current) {
          object = object.parent;
        }
        selectedObject = object;
        if (controls.current) {
          controls.current.enableRotate = false;
        }
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

        const box = new THREE.Box3().setFromObject(selectedObject);
        const size = new THREE.Vector3();
        box.getSize(size);

        if (roomBoundsRef.current) {
          const roomMin = roomBoundsRef.current.min;
          const roomMax = roomBoundsRef.current.max;

          const halfWidth = size.x / 2;
          const halfHeight = size.y / 2;
          const halfDepth = size.z / 2;

          newPos.x = Math.max(
            roomMin.x + halfWidth,
            Math.min(roomMax.x - 2 * halfWidth, newPos.x)
          );
          newPos.y = Math.max(
            roomMin.y + halfHeight,
            Math.min(roomMax.y - 2 * halfHeight, newPos.y)
          );
          newPos.z = Math.max(
            roomMin.z + halfDepth,
            Math.min(roomMax.z - 2 * halfDepth, newPos.z)
          );
          console.log(roomMin, roomMax, "roomMax");
        }

        selectedObject.position.copy(newPos);
        selectedObject.position.set(newPos.x, newPos.y, newPos.z);
        interactableObjects.current.push(selectedObject);
        console.log(newPos, "newPos");
      }
    }
    function onMouseUp() {
      selectedObject = null;
      if (controls.current) {
        controls.current.enableRotate = true;
      }
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
        let object = intersects[0].object;
        while (
          object.parent &&
          object.parent !== roomModelRef.current &&
          !object.name
        ) {
          object = object.parent;
        }

        tooltip.style.left = `${event.clientX + 10}px`;
        tooltip.style.top = `${event.clientY + 10}px`;
        tooltip.innerText = object.name || "no name";
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
      if (renderer.current && mountNode) {
        mountNode?.removeChild(renderer.current.domElement);
      }
      renderer.current?.domElement.removeEventListener(
        "mousemove",
        handlePointerMove
      );
      document.body.removeChild(tooltip);
    };
  }, [roomPath]);
  const handleDeleteSelectedObject = () => {
    if (selectedObjectInfo?.object && roomModelRef.current) {
      roomModelRef.current.remove(selectedObjectInfo.object);
      interactableObjects.current = interactableObjects.current.filter(
        (obj) => obj !== selectedObjectInfo.object
      );
      setSelectedObjectInfo(null);
    }
  };
  const getUpdatedDevicesPositions = () => {
    console.log(
      "getUpdatedDevicesPositions",
      devices,
      scene,
      roomModelRef.current?.children
    );
    return roomModelRef.current?.children;
  };
  const handleRerenderDevice = (device) => {
    console.log("device", device);
    const loadGLB = (modelPath: string, name: string) => {
      const loader = new GLTFLoader();
      console.log(device.type, "type");
      loader.load(`/models/${modelPath}`, (gltf) => {
        const model = gltf.scene;
        model.name = name;
        model.position.set(
          device.position.x,
          device.position.y,
          device.position.z
        );

        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 0.1 / maxDim;
        model.scale.setScalar(scaleFactor);

        roomModelRef.current!.add(model);
        interactableObjects.current.push(model);
      });
    };

    switch (device.type) {
      case 1:
        loadGLB("refreg.glb", device.name);
        break;
      case 2:
        loadGLB("vacuum_cleaner.glb", device.name);
        break;
      case 3:
        loadGLB(
          "aire_acondicionado_-_rafael_blanco_est_usb_im.glb",
          device.name
        );
        break;
      case 4:
        loadGLB("tv.glb", device.name);
        break;
      case 5:
        loadGLB("phone-1.glb", device.name);
        break;
      case 6:
        loadGLB("all-in-one_desktop_computer_and_smartphone.glb", device.name);
        break;
      case 7:
        loadGLB("printer.glb", device.name);
        break;
      case 8:
        loadGLB("printer.glb", device.name);
        break;
      case 9:
        loadGLB("hair_dryer.glb", device.name);
        break;
      case 10:
        loadGLB("simple_heater.glb", device.name);
        break;
      case 11:
        break;
      case 12:
        loadGLB("lamp.glb", device.name);
        break;
      case 13:
        loadGLB("microwave_-_sharp_34l.glb", device.name);
        break;
      case 14:
        loadGLB("czajnik_elektrycznyelectric_kettle.glb", device.name);
        break;
      case 15:
        loadGLB("dishwasher.glb", device.name);
        break;
      case 16:
        loadGLB("mixer.glb", device.name);
        break;
      case 17:
        loadGLB("stove_with_hood.glb", device.name);
        break;
      default:
        loadGLB("ref.glb", device.name);
    }
  };

  return {
    handleAddDevice,
    handleDeleteSelectedObject,
    getUpdatedDevicesPositions,
    threeScene: (
      <>
        <div
          className="canvas_area"
          ref={mountRef}
          style={{ width: "70vw", height: "100vh" }}
        />
        {selectedObjectInfo && (
          <div
            style={{
              position: "absolute",
              right: 20,
              bottom: 20,
              background: "#fff",
              padding: "15px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              zIndex: 10,
              minWidth: "200px",
            }}
          >
            <p>
              <strong>Name:</strong> {selectedObjectInfo.name}
            </p>
            <button
              onClick={handleDeleteSelectedObject}
              style={{ marginRight: "10px" }}
            >
              Delete Device
            </button>
            {/* <button onClick={() => alert("Editing feature under development")}>
              Edit
            </button> */}
          </div>
        )}
      </>
    ),
  };
};

export default useThreeScene;
