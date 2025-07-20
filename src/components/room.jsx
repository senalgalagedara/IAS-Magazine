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

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050a1f");

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 1, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0x404060, 0.6));

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(5, 10, 7.5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1.5, 20, Math.PI / 6, 0.3, 2);
    spotLight.position.set(0, 5, 5);
    spotLight.castShadow = true;
    scene.add(spotLight);
    scene.add(spotLight.target);

    // Textures
    const textureLoader = new THREE.TextureLoader();
    const woodTexture = textureLoader.load("/textures/wood.jpg");
    woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
    woodTexture.repeat.set(1, 1);

    // Table Top
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.15, 2),
      new THREE.MeshStandardMaterial({
        map: woodTexture,
        roughness: 0.4,
        metalness: 0.1,
      })
    );
    top.position.y = 1;
    top.castShadow = true;
    top.receiveShadow = true;
    scene.add(top);

    // Table Legs
    const legMat = new THREE.MeshStandardMaterial({
      color: "#666",
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

    // Ground
    const groundMat = new THREE.MeshStandardMaterial({
      color: "#0a0a0a",
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      groundMat
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Magazine
    const magazineTexture = textureLoader.load("/src/components/cover.png", (tex) => {
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

    // Dark Room Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: "#0d0d17",
      roughness: 1,
      metalness: 0.1,
      side: THREE.BackSide,
    });
    const roomSize = 20;

    const wallGeo = new THREE.PlaneGeometry(roomSize, roomSize);

    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.set(0, roomSize / 2, -roomSize / 2);
    scene.add(backWall);

    const leftWall = new THREE.Mesh(wallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-roomSize / 2, roomSize / 2, 0);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeo, wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(roomSize / 2, roomSize / 2, 0);
    scene.add(rightWall);

    const ceiling = new THREE.Mesh(wallGeo, wallMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, roomSize, 0);
    scene.add(ceiling);

    // Optional Neon Light
    const neonLight = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.05, 0.2),
      new THREE.MeshStandardMaterial({
        emissive: new THREE.Color(0x2e5eff),
        emissiveIntensity: 3,
        color: 0x000000,
      })
    );
    neonLight.position.set(0, 4.5, 0);
    scene.add(neonLight);

    // Resize
    const handleResize = () => {
      const { width, height } = mount.getBoundingClientRect();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // ScrollTrigger
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

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [onScrollComplete]);

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
