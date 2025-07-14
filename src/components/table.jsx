import React, { useEffect, useRef } from "react";  // Import React and hooks for component setup
import * as THREE from "three";  // Import Three.js for 3D rendering
import "./Table3D.css";  // Import custom styles for the 3D scene

const Table3D = () => {
  const mountRef = useRef(null);  // Create a reference for the DOM element that will contain the 3D scene

  useEffect(() => {
    const mount = mountRef.current;  // Get the DOM element to mount the Three.js scene

    // === Scene Setup ===
    const scene = new THREE.Scene();  // Create a new 3D scene
    scene.background = new THREE.Color(0x000000);  // Set the background color of the scene to black
    scene.fog = new THREE.Fog(0x000000, 10, 25);  // Add fog for depth effect

    // === Camera Setup ===
    const camera = new THREE.PerspectiveCamera(
      50, // Field of view: Higher number = wider view, lower = zoomed in
      1, // Aspect ratio: Will be updated on window resize
      0.1, // Near plane: Anything closer than 0.1 units will be clipped
      1000 // Far plane: Anything farther than 1000 units will be clipped
    );
    camera.position.set(0, 3, 5); // Set camera position in 3D space (x, y, z)
    camera.lookAt(0, 1, 0);  // Set the camera to look at the center of the table

    // === Renderer Setup ===
    const renderer = new THREE.WebGLRenderer({ antialias: true });  // Initialize the renderer with anti-aliasing for smoother edges
    renderer.setSize(mount.clientWidth, mount.clientHeight);  // Set renderer size to match the container size
    renderer.shadowMap.enabled = true;  // Enable real-time shadows for more realism
    mount.appendChild(renderer.domElement);  // Append the renderer's canvas to the DOM

    // === Ambient Light ===
    const ambient = new THREE.AmbientLight(0xFFFFFF, 0.5);  // Add ambient light with a white color and 0.5 intensity (global light)
    scene.add(ambient);  // Add the ambient light to the scene

    // === SpotLight Setup ===
    const spotLight = new THREE.SpotLight(
      0xffffff, // Light color: White
      10, // Intensity: Light strength
      15, // Distance: Maximum reach of the light
      Math.PI / 6, // Angle: The light's cone opening, wider cone with higher value
      1, // Penumbra: Softness of light's edges (increase for softer shadows)
      2  // Decay: How quickly light fades over distance
    );
    spotLight.position.set(0, 3, 0);  // Position the light above the table
    spotLight.target.position.set(0, 1, 0);  // Set the light's target to the center of the table
    spotLight.castShadow = true;  // Enable shadows for this light
    scene.add(spotLight);  // Add the spotlight to the scene
    scene.add(spotLight.target);  // Add the target of the spotlight to the scene

    // === Table Top with Gradient ===
    const gradientShader = {
      uniforms: {
        color1: { value: new THREE.Color(0x8B4513) },  // Brown color for one end of the gradient
        color2: { value: new THREE.Color(0x008080) },  // Teal color for the other end of the gradient
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;  // Pass UV coordinates to fragment shader
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        void main() {
          gl_FragColor = vec4(mix(color1, color2, vUv.x), 1.0);  // Linear interpolation between brown and teal based on the X axis
        }
      `
    };

    const topGeo = new THREE.BoxGeometry(6, 0.2, 2);  // Create a rectangular box for the table top (width, height, depth)
    const topMat = new THREE.ShaderMaterial(gradientShader);  // Use custom shader for the gradient effect

    const top = new THREE.Mesh(topGeo, topMat);  // Combine the geometry and material to create a mesh for the table top
    top.position.y = 1;  // Position the table top above the ground
    top.castShadow = true;  // Enable the table top to cast shadows
    top.receiveShadow = true;  // Enable the table top to receive shadows
    scene.add(top);  // Add the table top to the scene

    // === Table Legs ===
    const legGeo = new THREE.BoxGeometry(0.2, 1.1, 0.2);  // Create a simple box geometry for the table legs
    const legMat = new THREE.MeshStandardMaterial({
      color: "#5C4033",  // Darker brown for the legs
      roughness: 0.5,    // Roughness for a matte look
      metalness: 0.1,    // Low metalness for a wooden appearance
    });

    // Positions of the four legs
    const legPositions = [
      [-2.3, 0.5, -0.8], // Front-left
      [2.3, 0.5, -0.8], // Front-right
      [-2.3, 0.5, 0.8], // Back-left
      [2.3, 0.5, 0.8], // Back-right
    ];

    // Loop to create each leg
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);  // Create a leg mesh
      leg.position.set(x, y, z);  // Set the position of each leg based on the coordinates
      leg.castShadow = true;  // Enable shadows for the legs
      leg.receiveShadow = true;  // Enable legs to receive shadows
      scene.add(leg);  // Add the leg to the scene
    });

    // === Ground Plane ===
    const groundGeo = new THREE.PlaneGeometry(50, 50);  // Create a large plane for the ground
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.25 });  // Use a shadow material to display the shadows more subtly
    const ground = new THREE.Mesh(groundGeo, groundMat);  // Combine geometry and material for the ground mesh
    ground.rotation.x = -Math.PI / 2;  // Rotate the ground so it's flat (facing upward)
    ground.position.y = 0;  // Position the ground at y = 0 (ground level)
    ground.receiveShadow = true;  // Enable the ground to receive shadows
    scene.add(ground);  // Add the ground to the scene

    // === Magazine (Texture from Image) ===
    const textureLoader = new THREE.TextureLoader();  // Create a loader for textures (like images)
    const magazineTexture = textureLoader.load("/src/components/cover.png");  // Load the magazine image as a texture

    const magGeo = new THREE.BoxGeometry(1, 0.03, 1.3);  // Create the geometry for the magazine (thin box)
    const magMat = new THREE.MeshStandardMaterial({
      map: magazineTexture,  // Apply the loaded image texture to the material
    });

    const magazine = new THREE.Mesh(magGeo, magMat);  // Create the magazine mesh using geometry and material
    magazine.position.set(0, 1.13, 0);  // Position the magazine above the table surface
    magazine.rotation.y = Math.PI / 32;  // Rotate the magazine slightly for realism
    magazine.castShadow = true;  // Enable shadows for the magazine
    scene.add(magazine);  // Add the magazine to the scene

    // === Resize Handling ===
    const handleResize = () => {
      const { width, height } = mount.getBoundingClientRect();  // Get the new dimensions of the container
      camera.aspect = width / height;  // Update the camera's aspect ratio based on new dimensions
      camera.updateProjectionMatrix();  // Update the camera's projection matrix (necessary after changing aspect ratio)
      renderer.setSize(width, height);  // Resize the renderer to fit the new container dimensions
    };

    handleResize();  // Set initial resize
    window.addEventListener("resize", handleResize);  // Add event listener for window resizing

    // === Animation Loop ===
    const animate = () => {
      renderer.render(scene, camera);  // Render the scene from the perspective of the camera
      requestAnimationFrame(animate);  // Continue the animation loop
    };
    animate();  // Start the animation loop

    // === Cleanup on Unmount ===
    return () => {
      window.removeEventListener("resize", handleResize);  // Remove resize event listener when component is unmounted
      mount.removeChild(renderer.domElement);  // Remove the renderer from the DOM
      renderer.dispose();  // Dispose of the renderer to free up GPU resources
    };
  }, []);  // Empty dependency array means this effect runs once on component mount

  // Render the div container to hold the 3D scene
  return <div className="table-container" ref={mountRef} />;
};

export default Table3D;  // Export the Table3D component for use in other parts of the app
