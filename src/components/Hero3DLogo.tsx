import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Hero3DLogoProps {
  className?: string;
  sceneIndex?: number;
  rotationProgress?: number;
  isWhiteBg?: boolean;
}

export const Hero3DLogo: React.FC<Hero3DLogoProps> = ({
  className = '',
  sceneIndex = 0,
  rotationProgress = 0,
  isWhiteBg = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneIndexRef = useRef(sceneIndex);
  const rotationProgressRef = useRef(rotationProgress);

  useEffect(() => {
    sceneIndexRef.current = sceneIndex;
    rotationProgressRef.current = rotationProgress;
  }, [sceneIndex, rotationProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 550;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup (Cinematic Studio Lighting with Electric Blue Rim Accents)
    const ambientLight = new THREE.AmbientLight(0xffffff, isWhiteBg ? 1.5 : 0.9);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 3.2);
    mainLight.position.set(5, 8, 7);
    scene.add(mainLight);

    // Vibrant Electric Blue Rim Light for Blue Border Luster
    const blueRimLight = new THREE.PointLight(0x3b82f6, 4.2, 16);
    blueRimLight.position.set(-5, -2, 3);
    scene.add(blueRimLight);

    // Vivid Blue Counter Accent Light
    const blueBackLight = new THREE.PointLight(0x2563eb, 3.8, 16);
    blueBackLight.position.set(5, 3, -3);
    scene.add(blueBackLight);

    // Dynamic mouse tracking specular light
    const mouseLight = new THREE.PointLight(0xffffff, 2.0, 10);
    mouseLight.position.set(0, 0, 4);
    scene.add(mouseLight);

    // 3. Central 3D Medallion Emblem Logo Group (Sleek Compact Size & Electric Blue Border)
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // 3.1 Compact Circular 3D Disc (Reduced size as requested)
    const discRadius = 1.52;
    const discDepth = 0.25;
    const discGeometry = new THREE.CylinderGeometry(discRadius, discRadius, discDepth, 64);

    // Premium Dark Obsidian Chrome Material
    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.9,
      roughness: 0.16,
    });
    const discMesh = new THREE.Mesh(discGeometry, chromeMaterial);
    discMesh.rotation.x = Math.PI / 2; // Circular face faces camera
    logoGroup.add(discMesh);

    // 3.2 Outer Beveled Cybernetic Rim Ring in Electric Cyber Blue
    const outerRingGeometry = new THREE.TorusGeometry(discRadius + 0.02, 0.065, 16, 96);
    const blueRimMaterial = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8, // Vibrant electric blue (Tailwind blue-700)
      emissive: 0x2563eb, // Glowing vivid blue (Tailwind blue-600)
      emissiveIntensity: 0.75,
      metalness: 0.85,
      roughness: 0.15,
    });
    const outerRing = new THREE.Mesh(outerRingGeometry, blueRimMaterial);
    logoGroup.add(outerRing);

    // 3.2.1 Front & Back Bevel Rings (Electric Blue Accent Perimeter Border)
    const bevelRingGeo = new THREE.TorusGeometry(discRadius - 0.015, 0.028, 16, 96);
    const bevelBlueMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.65,
      metalness: 0.9,
      roughness: 0.12,
    });
    const frontBevelRing = new THREE.Mesh(bevelRingGeo, bevelBlueMat);
    frontBevelRing.position.z = discDepth / 2;
    logoGroup.add(frontBevelRing);

    const backBevelRing = new THREE.Mesh(bevelRingGeo, bevelBlueMat);
    backBevelRing.position.z = -discDepth / 2;
    logoGroup.add(backBevelRing);

    // 3.3 Authentic KFC Code Chaser Logo Front & Back Plaques on Circular Disc
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load('/kfc_codechaser_logo.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      renderer.render(scene, camera);
    });

    // Proportional logo sizing for the compact disc
    const planeW = discRadius * 1.62;
    const planeH = planeW * (383 / 503);
    const plaqueGeometry = new THREE.PlaneGeometry(planeW, planeH);
    const plaqueMaterial = new THREE.MeshStandardMaterial({
      map: logoTexture,
      metalness: 0.1,
      roughness: 0.2,
      transparent: true,
      alphaTest: 0.05,
    });
    const frontPlaque = new THREE.Mesh(plaqueGeometry, plaqueMaterial);
    frontPlaque.position.z = discDepth / 2 + 0.01;
    logoGroup.add(frontPlaque);

    // Back Plaque on Circular Disc
    const backPlaque = new THREE.Mesh(plaqueGeometry, plaqueMaterial);
    backPlaque.position.z = -discDepth / 2 - 0.01;
    backPlaque.rotateY(Math.PI);
    logoGroup.add(backPlaque);

    // 3.4 Orbiting Gyroscope Cybernetic Ring 1 (Electric Blue Orbit)
    const gyroRing1Geo = new THREE.TorusGeometry(1.75, 0.028, 16, 80);
    const gyroMat1 = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.5,
      metalness: 0.92,
      roughness: 0.12,
      transparent: true,
      opacity: 0.85,
    });
    const gyroRing1 = new THREE.Mesh(gyroRing1Geo, gyroMat1);
    gyroRing1.rotation.x = Math.PI / 4;
    gyroRing1.rotation.y = Math.PI / 6;
    scene.add(gyroRing1);

    // 3.5 Orbiting Gyroscope Cybernetic Ring 2 (Sleek Deep Blue-Grey Chrome)
    const gyroRing2Geo = new THREE.TorusGeometry(2.05, 0.024, 16, 80);
    const gyroMat2 = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.95,
      roughness: 0.15,
      transparent: true,
      opacity: 0.75,
    });
    const gyroRing2 = new THREE.Mesh(gyroRing2Geo, gyroMat2);
    gyroRing2.rotation.x = -Math.PI / 3;
    gyroRing2.rotation.z = Math.PI / 4;
    scene.add(gyroRing2);

    // 3.6 Ambient Spatial Depth Particle Field (Warm Amber & White Tech Atmosphere)
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.035,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // 4. Mouse & Scene Interactive Coordinates
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;
    let currentSceneRotY = 0;
    let currentPosX = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      targetRotationY = relX * 0.9;
      targetRotationX = -relY * 0.7;

      mouseLight.position.x = relX * 8;
      mouseLight.position.y = -relY * 6;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });

    // 5. Render Loop with Kinetic Scene Rotation
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth Lerp rotation towards mouse position
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      // Smooth kinetic rotation towards current scene angle (slow & elegant rotation like alche.studio)
      const targetSceneRotY = (sceneIndexRef.current || 0) * 0.95 + (rotationProgressRef.current || 0) * 0.75;
      currentSceneRotY += (targetSceneRotY - currentSceneRotY) * 0.05;

      // Centered horizontal positioning; slightly lower in card scenes to peek beneath curved card like in the photo
      const basePosY = (sceneIndexRef.current === 0 ? 0 : -0.26) + Math.sin(elapsedTime * 1.5) * 0.09;
      logoGroup.position.x = 0;
      logoGroup.position.y = basePosY;
      gyroRing1.position.x = 0;
      gyroRing1.position.y = basePosY;
      gyroRing2.position.x = 0;
      gyroRing2.position.y = basePosY;

      // Orbiting rings rotation and kinetic acceleration during scene transitions
      const isTransitioning = Math.abs(targetSceneRotY - currentSceneRotY) > 0.03;
      const spinSpeed = isTransitioning ? 2.4 : 1.0;
      const transitionTiltX = isTransitioning ? Math.sin((targetSceneRotY - currentSceneRotY) * 1.2) * 0.18 : 0;
      const scalePulse = isTransitioning ? 1.03 : 1.0;

      // Base idle floating animation combined with 3D scene rotation & kinetic tilt
      logoGroup.rotation.x = currentRotationX + transitionTiltX + Math.sin(elapsedTime * 0.8) * 0.04;
      logoGroup.rotation.y = currentSceneRotY + currentRotationY + Math.cos(elapsedTime * 0.6) * 0.06;
      logoGroup.scale.set(scalePulse, scalePulse, scalePulse);

      gyroRing1.rotation.z += 0.005 * spinSpeed;
      gyroRing1.rotation.x += 0.003 * spinSpeed;

      gyroRing2.rotation.y -= 0.006 * spinSpeed;
      gyroRing2.rotation.z -= 0.004 * spinSpeed;

      // Slow particle float
      particlePoints.rotation.y = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 550;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('resize', handleResize);

      // Disposal of geometries and materials
      discGeometry.dispose();
      chromeMaterial.dispose();
      outerRingGeometry.dispose();
      blueRimMaterial.dispose();
      bevelRingGeo.dispose();
      bevelBlueMat.dispose();
      plaqueGeometry.dispose();
      plaqueMaterial.dispose();
      gyroRing1Geo.dispose();
      gyroMat1.dispose();
      gyroRing2Geo.dispose();
      gyroMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      logoTexture.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};
