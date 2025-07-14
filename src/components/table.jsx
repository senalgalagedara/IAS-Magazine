import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Table3D.css";

gsap.registerPlugin(ScrollTrigger);

const Table3D = ({ onScrollComplete }) => {
  const mountRef = useRef(null);              // DOM reference to mount canvas
  const triggeredRef = useRef(false);         // Prevent multiple triggers

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // === Scene ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // === Camera ===
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);  // Start from angled view
    camera.lookAt(0, 1, 0);

    // === Renderer ===
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // === Lights ===
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const spotLight = new THREE.SpotLight(0xffffff, 10, 15, Math.PI / 6, 1, 2);
    spotLight.position.set(0, 5, 5);
    spotLight.castShadow = true;
    scene.add(spotLight);
    scene.add(spotLight.target);

    // === Table Top ===
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.2, 2),
      new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    );
    top.position.y = 1;
    top.castShadow = true;
    top.receiveShadow = true;
    scene.add(top);

    // === Table Legs ===
    const legMat = new THREE.MeshStandardMaterial({ color: "#5C4033" });
    const legGeo = new THREE.BoxGeometry(0.2, 1.1, 0.2);
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

    // === Ground ===
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.ShadowMaterial({ opacity: 0.3 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // === Magazine ===
    const textureLoader = new THREE.TextureLoader();
    const magazineTexture = textureLoader.load("/src/components/cover.png"); // Adjust path if needed

    const magazine = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.03, 1.3),
      new THREE.MeshStandardMaterial({ map: magazineTexture })
    );
    magazine.position.set(0, 1.1, 0);
    magazine.castShadow = true;
    scene.add(magazine);

    // === Resize Handler ===
    const handleResize = () => {
      const { width, height } = mount.getBoundingClientRect();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // === Animation Loop ===
    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // === Scroll Camera Transition ===
    ScrollTrigger.create({
      trigger: ".scroll-zone",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;

        // Zoom in & tilt camera to top-down
        camera.position.z = 5.5 - 4.9 * progress;  // 5.5 → 0.6
        camera.position.y = 2.4 + 0.4 * progress;  // 2.4 → 2.8
        camera.lookAt(0, 1, 0);

        // Fire only once when scroll reaches bottom
        if (progress > 0.99 && typeof onScrollComplete === "function" && !triggeredRef.current) {
          triggeredRef.current = true;
          onScrollComplete();
        }
      },
    });

    // === Cleanup ===
    return () => {
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [onScrollComplete]);

  return (
    <div className="scroll-zone">
      <div className="table-container" ref={mountRef}></div>
    </div>
  );
};

export default Table3D;
