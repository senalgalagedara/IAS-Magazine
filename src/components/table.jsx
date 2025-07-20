// RoomScene.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/Table3D.css";

gsap.registerPlugin(ScrollTrigger);

const RoomScene = ({ onScrollComplete }) => {
  const mountRef = useRef(null);
  const containerRef = useRef(null);
  const triggeredRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // === SCENE ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050a1f"); // Dark bluish background

    // === CAMERA ===
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 1, 0);

    // === RENDERER ===
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // === LIGHTING ===
    scene.add(new THREE.AmbientLight(0x404060, 0.6)); // Soft ambient light

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(5, 10, 7.5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1.5, 20, Math.PI / 6, 0.3, 2);
    spotLight.position.set(0, 5, 5);
    spotLight.castShadow = true;
    scene.add(spotLight);
    scene.add(spotLight.target);

    // === TEXTURE LOADER ===
    const textureLoader = new THREE.TextureLoader();

    // === TABLE TOP ===
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.15, 2),
      new THREE.MeshStandardMaterial({
        color: 0x000823, // Wooden brown
        roughness: 0.4,
        metalness: 0.1,
      })
    );
    top.position.y = 1;
    top.castShadow = true;
    top.receiveShadow = true;
    scene.add(top);

    // === TABLE LEGS ===
    const legMat = new THREE.MeshStandardMaterial({
      color: "#666",    // Steel gray
      metalness: 0.8,
      roughness: 0.3,
    });
    const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.1, 32);
    const legPositions = [
      [-2.3, 0.5, -0.8],
      [2.3, 0.5, -0.8],
      [-2.3, 0.5, 0.8],
      [2.3, 0.5, 0.8],
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      leg.receiveShadow = true;
      scene.add(leg);
    });

    // === GROUND (Floor) ===
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 4),
      new THREE.MeshStandardMaterial({ color: "#000000", side: THREE.DoubleSide }) // Dark gray
    );
    floor.rotation.x = -Math.PI / 2; // Lay flat
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // === MAGAZINE ON TABLE ===
    const magazineTexture = textureLoader.load("/src/components/resouses/cover.jpg", (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
    });

    const magazine = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.03, 1.3),
      new THREE.MeshStandardMaterial({
        map: magazineTexture,
        roughness: 0.6,
        metalness: 0.05,
      })
    );
    magazine.position.set(0, 1.1, 0);
    magazine.castShadow = true;
    scene.add(magazine);

    // === WALLS (Each with Different Color) ===
    const roomWidth = 7;
    const roomHeight = 4;
    const roomDepth = 4;

    // Back wall (deep blue)
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomWidth, roomHeight),
      new THREE.MeshStandardMaterial({ color: "#000000", side: THREE.DoubleSide })
    );
    backWall.position.set(0, roomHeight / 2, -roomDepth / 2);
    scene.add(backWall);

    // Left wall (red)
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDepth, roomHeight),
      new THREE.MeshStandardMaterial({ color: "#000000", side: THREE.DoubleSide })
    );
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
    scene.add(leftWall);

    // Right wall (green)
    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDepth, roomHeight),
      new THREE.MeshStandardMaterial({ color: "#000000", side: THREE.DoubleSide })
    );
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(roomWidth / 2, roomHeight / 2, 0);
    scene.add(rightWall);

    // Ceiling (purple)
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(roomWidth, roomDepth),
      new THREE.MeshStandardMaterial({ color: "#000000", side: THREE.DoubleSide })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = roomHeight;
    scene.add(ceiling);

    // === NEON LIGHT STRIP ===
    const neonLight = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.05, 0.2),
      new THREE.MeshStandardMaterial({
        emissive: new THREE.Color(0x2e5eff),
        emissiveIntensity: 3,
        color: 0x000000,
      })
    );
    neonLight.position.set(0, 3.5, 0); // Just below ceiling
    scene.add(neonLight);

    // === WINDOW RESIZE HANDLING ===
    const handleResize = () => {
      const { width, height } = mount.getBoundingClientRect();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // === RENDER LOOP ===
    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // === SCROLLTRIGGER CAMERA ANIMATION ===
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;

        camera.position.z = 5.5 - 4.9 * progress;
        camera.position.y = 2.4 + 0.4 * progress;
        camera.lookAt(0, 1, 0);

        if (progress > 0.99 && typeof onScrollComplete === "function" && !triggeredRef.current) {
          triggeredRef.current = true;
          onScrollComplete();
        }
      },
    });

    // === CLEANUP ===
    return () => {
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [onScrollComplete]);

  // === SCROLL ZONE + STICKY CANVAS ===
  return (
    <div ref={containerRef} style={{ height: "200vh" }}>
      <div
        className="table-container"
        ref={mountRef}
        style={{ position: "sticky", top: 0, height: "100vh", width: "100%" }}
      ></div>
    </div>
  );
};

export default RoomScene;
