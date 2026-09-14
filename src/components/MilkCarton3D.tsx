"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RotateCw, Sparkles, ShieldCheck, ThermometerSnowflake, Eye } from "lucide-react";

export type CartonVariant = "full-cream" | "low-fat" | "amasi";

interface VariantConfig {
  name: string;
  sub: string;
  badge: string;
  headerColor: string;
  accentColor: string;
  baseColor: string;
  spoutColor: string;
  fatContent: string;
}

const VARIANTS: Record<CartonVariant, VariantConfig> = {
  "full-cream": {
    name: "FULL CREAM",
    sub: "FRESH MILK • 2 LITRE",
    badge: "100% MOOI RIVER PASTURE",
    headerColor: "#0c2340", // Navy
    accentColor: "#00a8e8", // Cyan
    baseColor: "#ffffff",
    spoutColor: "#00a8e8",
    fatContent: "3.5% Milkfat",
  },
  "low-fat": {
    name: "LOW FAT",
    sub: "FRESH MILK • 2 LITRE",
    badge: "LIGHT & FRESH • 2% FAT",
    headerColor: "#00a8e8", // Cyan
    accentColor: "#0c2340", // Navy
    baseColor: "#ffffff",
    spoutColor: "#ffffff",
    fatContent: "2.0% Milkfat",
  },
  amasi: {
    name: "TRADITIONAL AMASI",
    sub: "CULTURED MILK • 2 LITRE",
    badge: "THICK-SET TRADITIONAL",
    headerColor: "#2e7d32", // Farm Green
    accentColor: "#f9a825", // Amber Gold
    baseColor: "#ffffff",
    spoutColor: "#2e7d32",
    fatContent: "Full Cream Cultured",
  },
};

export default function MilkCarton3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeVariant, setActiveVariant] = useState<CartonVariant>("full-cream");
  const [isRotating, setIsRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // References to keep Three.js instances stable
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cartonGroupRef = useRef<THREE.Group | null>(null);
  const shadowMeshRef = useRef<THREE.Mesh | null>(null);
  const bodyMeshRef = useRef<THREE.Mesh | null>(null);
  const roofMeshRef = useRef<THREE.Mesh | null>(null);
  const capMeshRef = useRef<THREE.Mesh | null>(null);
  const targetRotationRef = useRef({ x: 0.15, y: -0.45 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const isPointerDownRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });

  // Generate dynamic canvas textures for each face of the carton
  const createCartonTexture = (
    faceType: "front" | "back" | "left" | "right",
    variant: VariantConfig
  ) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Background base
    ctx.fillStyle = variant.baseColor;
    ctx.fillRect(0, 0, 1024, 1024);

    // Top Header color block
    ctx.fillStyle = variant.headerColor;
    ctx.fillRect(0, 0, 1024, 260);

    // Accent wave band
    ctx.fillStyle = variant.accentColor;
    ctx.beginPath();
    ctx.moveTo(0, 260);
    ctx.bezierCurveTo(340, 290, 680, 230, 1024, 270);
    ctx.lineTo(1024, 310);
    ctx.bezierCurveTo(680, 270, 340, 330, 0, 300);
    ctx.closePath();
    ctx.fill();

    // Bottom decorative wave
    ctx.fillStyle = variant.headerColor;
    ctx.fillRect(0, 890, 1024, 134);
    ctx.fillStyle = variant.accentColor;
    ctx.fillRect(0, 875, 1024, 15);

    if (faceType === "front" || faceType === "back") {
      // Draw Jozi Dairy Logo Badge (Red brush stroke with white caps)
      ctx.save();
      ctx.translate(512, 130);
      ctx.rotate(-0.1);

      // Red banner background
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.roundRect(-240, -70, 480, 140, 24);
      ctx.fill();

      // Badge shadow
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 6;
      ctx.stroke();

      // "JOZI"
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 68px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.letterSpacing = "4px";
      ctx.fillText("JOZI", 0, -22);

      // "DAIRY"
      ctx.font = "900 56px system-ui, -apple-system, sans-serif";
      ctx.letterSpacing = "6px";
      ctx.fillText("DAIRY", 0, 38);
      ctx.restore();

      // Product Title Section
      ctx.fillStyle = variant.headerColor;
      ctx.font = "900 64px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.letterSpacing = "2px";
      ctx.fillText(variant.name, 512, 430);

      // Subtitle
      ctx.fillStyle = "#475569";
      ctx.font = "700 36px system-ui, -apple-system, sans-serif";
      ctx.letterSpacing = "4px";
      ctx.fillText(variant.sub, 512, 490);

      // Provenance Pill Tag
      ctx.fillStyle = variant.accentColor;
      ctx.beginPath();
      ctx.roundRect(232, 530, 560, 58, 29);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "800 24px system-ui, -apple-system, sans-serif";
      ctx.letterSpacing = "2px";
      ctx.fillText(variant.badge, 512, 566);

      // Central Farm Illustration Graphic
      ctx.fillStyle = "#f1f5f9";
      ctx.beginPath();
      ctx.arc(512, 700, 100, 0, Math.PI * 2);
      ctx.fill();

      // Crisp vector bottle silhouette (zero emoji reliance)
      ctx.save();
      ctx.translate(512, 695);
      ctx.fillStyle = variant.headerColor;
      ctx.beginPath();
      ctx.roundRect(-24, -48, 48, 18, [4, 4, 0, 0]);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(-38, -26, 76, 80, [14, 14, 10, 10]);
      ctx.fill();
      // Inner fresh milk badge
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 14, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = variant.accentColor;
      ctx.beginPath();
      ctx.arc(0, 14, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Quality stamps & Volume
      ctx.fillStyle = "#0c2340";
      ctx.font = "800 32px system-ui, -apple-system, sans-serif";
      ctx.fillText("COLD-CHAIN VERIFIED • 4°C", 512, 835);

      // Bottom Bar details
      ctx.fillStyle = "#ffffff";
      ctx.font = "700 28px system-ui, -apple-system, sans-serif";
      ctx.letterSpacing = "3px";
      ctx.fillText("MIDRAND • MOOI RIVER SOURCED", 512, 955);
    } else if (faceType === "left") {
      // Nutrition Facts Panel
      ctx.fillStyle = variant.headerColor;
      ctx.font = "900 48px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("NUTRITION FACTS", 80, 380);

      ctx.fillStyle = "#64748b";
      ctx.font = "600 26px system-ui, -apple-system, sans-serif";
      ctx.fillText("Serving size: 250ml (8 servings per pack)", 80, 425);

      // Divider line
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(80, 445);
      ctx.lineTo(944, 445);
      ctx.stroke();

      const table = [
        ["Average Values", "Per 100ml", "Per 250ml"],
        ["Energy (kJ)", "268 kJ", "670 kJ"],
        ["Protein", "3.4 g", "8.5 g"],
        ["Glycemic Carbohydrate", "4.8 g", "12.0 g"],
        ["Total Fat", variant.fatContent, "7.8 g"],
        ["Calcium", "120 mg", "300 mg (38% NRV)"],
      ];

      table.forEach((row, idx) => {
        const y = 495 + idx * 52;
        ctx.fillStyle = idx === 0 ? variant.headerColor : "#334155";
        ctx.font = idx === 0 ? "800 26px system-ui" : "600 26px system-ui";
        ctx.fillText(row[0], 80, y);
        ctx.fillText(row[1], 560, y);
        ctx.fillText(row[2], 760, y);

        // light grid line
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, y + 14);
        ctx.lineTo(944, y + 14);
        ctx.stroke();
      });

      // Ingredients
      ctx.fillStyle = variant.headerColor;
      ctx.font = "800 28px system-ui";
      ctx.fillText("INGREDIENTS:", 80, 830);
      ctx.fillStyle = "#475569";
      ctx.font = "600 24px system-ui";
      ctx.fillText("Full Cream Cow's Milk. Sourced fresh from Mooi River, KZN.", 80, 865);

      // Bottom Bar
      ctx.fillStyle = "#ffffff";
      ctx.font = "700 26px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("KEEP REFRIGERATED • SHAKE WELL", 512, 955);
    } else if (faceType === "right") {
      // Company story, contact & barcode
      ctx.fillStyle = variant.headerColor;
      ctx.font = "900 44px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("JOZI DAIRY DISTRIBUTION", 512, 380);

      ctx.fillStyle = "#475569";
      ctx.font = "600 26px system-ui, -apple-system, sans-serif";
      ctx.fillText("Midrand, Johannesburg, South Africa", 512, 425);

      ctx.fillStyle = "#0c2340";
      ctx.font = "800 30px system-ui";
      ctx.fillText("Direct Orders & Delivery:", 512, 510);
      ctx.fillStyle = variant.accentColor;
      ctx.font = "800 34px system-ui";
      ctx.fillText("WhatsApp: 065 234 2460", 512, 555);
      ctx.fillStyle = "#334155";
      ctx.font = "700 28px system-ui";
      ctx.fillText("Tel: 011 805 1355", 512, 600);
      ctx.fillText("operations@jozidairy.co.za", 512, 640);

      // Barcode simulation
      ctx.fillStyle = "#0c2340";
      const startX = 220;
      const barY = 710;
      const barHeight = 85;
      const pattern = [3, 2, 6, 2, 4, 3, 7, 2, 3, 5, 2, 6, 3, 2, 4, 6, 2, 3, 7, 2, 4, 3, 6, 2, 5, 2, 4, 3];
      let currX = startX;
      for (let i = 0; i < pattern.length; i++) {
        if (i % 2 === 0) {
          ctx.fillRect(currX, barY, pattern[i] * 3, barHeight);
        }
        currX += pattern[i] * 4.2;
      }
      ctx.font = "600 20px monospace";
      ctx.fillText("6 009800 124608", 512, 825);

      // Bottom Bar
      ctx.fillStyle = "#ffffff";
      ctx.font = "700 26px system-ui";
      ctx.fillText("RECYCLE HDPE 2 • 100% RECYCLABLE", 512, 955);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  };

  // Build the 3D Gable-top Milk Carton
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 560;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 6.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Clear previous canvas if any
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.bias = -0.0001;
    scene.add(mainLight);

    const cyanRimLight = new THREE.DirectionalLight(0x00a8e8, 1.6);
    cyanRimLight.position.set(-6, 3, -4);
    scene.add(cyanRimLight);

    const bottomFillLight = new THREE.DirectionalLight(0xf4f7fb, 0.9);
    bottomFillLight.position.set(0, -5, 4);
    scene.add(bottomFillLight);

    // Master Carton Group
    const cartonGroup = new THREE.Group();
    cartonGroup.position.set(0, 0.1, 0);
    scene.add(cartonGroup);
    cartonGroupRef.current = cartonGroup;

    // Soft Shadow Plane under carton
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 115);
      grad.addColorStop(0, "rgba(12, 35, 64, 0.45)");
      grad.addColorStop(0.5, "rgba(12, 35, 64, 0.2)");
      grad.addColorStop(1, "rgba(12, 35, 64, 0)");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.88;
    scene.add(shadowMesh);
    shadowMeshRef.current = shadowMesh;

    // Dimensions
    const bW = 1.95; // width
    const bH = 2.75; // body height
    const bD = 1.95; // depth
    const roofH = 0.75; // gable roof height
    const finH = 0.28; // top pinch fin height

    const variant = VARIANTS[activeVariant];

    // Main Body Mesh with Multi-face Materials
    const bodyGeo = new THREE.BoxGeometry(bW, bH, bD);
    const bodyMats = [
      new THREE.MeshStandardMaterial({
        map: createCartonTexture("right", variant),
        roughness: 0.35,
        metalness: 0.05,
      }), // +x Right
      new THREE.MeshStandardMaterial({
        map: createCartonTexture("left", variant),
        roughness: 0.35,
        metalness: 0.05,
      }), // -x Left
      new THREE.MeshStandardMaterial({ color: variant.headerColor, roughness: 0.5 }), // +y Top interior
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }), // -y Bottom
      new THREE.MeshStandardMaterial({
        map: createCartonTexture("front", variant),
        roughness: 0.35,
        metalness: 0.05,
      }), // +z Front
      new THREE.MeshStandardMaterial({
        map: createCartonTexture("back", variant),
        roughness: 0.35,
        metalness: 0.05,
      }), // -z Back
    ];
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMats);
    bodyMesh.position.y = 0;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    cartonGroup.add(bodyMesh);
    bodyMeshRef.current = bodyMesh;

    // Gable Top Sloped Roof
    // Custom geometry for gable carton top:
    // Vertices: bottom rectangle (y = bH/2), meeting at ridge line (y = bH/2 + roofH, z = 0)
    const roofGeo = new THREE.BufferGeometry();
    const halfW = bW / 2;
    const halfD = bD / 2;
    const baseY = bH / 2;
    const ridgeY = baseY + roofH;

    // 8 vertices:
    // 0: (-halfW, baseY, halfD)  - front-left
    // 1: ( halfW, baseY, halfD)  - front-right
    // 2: ( halfW, baseY, -halfD) - back-right
    // 3: (-halfW, baseY, -halfD) - back-left
    // 4: (-halfW, ridgeY, 0)     - ridge-left
    // 5: ( halfW, ridgeY, 0)     - ridge-right
    //
    // Triangles:
    // Front slope: (0, 1, 5) and (0, 5, 4)
    // Back slope:  (2, 3, 4) and (2, 4, 5)
    // Left side triangle:  (3, 0, 4)
    // Right side triangle: (1, 2, 5)
    const vertices = new Float32Array([
      // Front slope (2 triangles)
      -halfW, baseY, halfD,
      halfW, baseY, halfD,
      halfW, ridgeY, 0,

      -halfW, baseY, halfD,
      halfW, ridgeY, 0,
      -halfW, ridgeY, 0,

      // Back slope (2 triangles)
      halfW, baseY, -halfD,
      -halfW, baseY, -halfD,
      -halfW, ridgeY, 0,

      halfW, baseY, -halfD,
      -halfW, ridgeY, 0,
      halfW, ridgeY, 0,

      // Left triangle
      -halfW, baseY, -halfD,
      -halfW, baseY, halfD,
      -halfW, ridgeY, 0,

      // Right triangle
      halfW, baseY, halfD,
      halfW, baseY, -halfD,
      halfW, ridgeY, 0,
    ]);

    roofGeo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    roofGeo.computeVertexNormals();

    const roofMat = new THREE.MeshStandardMaterial({
      color: variant.headerColor,
      roughness: 0.35,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.castShadow = true;
    cartonGroup.add(roofMesh);
    roofMeshRef.current = roofMesh;

    // Top Pinch Seal Fin
    const finGeo = new THREE.BoxGeometry(bW * 0.99, finH, 0.04);
    const finMat = new THREE.MeshStandardMaterial({
      color: variant.accentColor,
      roughness: 0.4,
    });
    const finMesh = new THREE.Mesh(finGeo, finMat);
    finMesh.position.set(0, ridgeY + finH / 2, 0);
    cartonGroup.add(finMesh);

    // Spout / Screw Cap on front sloped roof
    const capGroup = new THREE.Group();
    const capRadius = 0.22;
    const capHeight = 0.16;

    // Base collar
    const collarGeo = new THREE.CylinderGeometry(capRadius * 1.1, capRadius * 1.15, 0.06, 24);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    capGroup.add(collarMesh);

    // Main threaded cap
    const capGeo = new THREE.CylinderGeometry(capRadius, capRadius, capHeight, 24);
    const capMat = new THREE.MeshStandardMaterial({
      color: variant.spoutColor,
      roughness: 0.2,
      metalness: 0.15,
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = capHeight / 2;
    capGroup.add(capMesh);
    capMeshRef.current = capMesh;

    // Position cap on front sloped face
    const roofSlopeAngle = Math.atan2(roofH, halfD); // angle of slope
    capGroup.position.set(0.38, baseY + roofH * 0.42, halfD * 0.52);
    capGroup.rotation.x = roofSlopeAngle;
    cartonGroup.add(capGroup);

    // Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Continuous subtle idle floating bob on Y axis
      const floatOffset = Math.sin(elapsedTime * 1.8) * 0.07;
      cartonGroup.position.y = 0.08 + floatOffset;

      // Dynamic shadow scale synced to float
      if (shadowMeshRef.current) {
        const shadowScale = 1 - floatOffset * 0.8;
        shadowMeshRef.current.scale.set(shadowScale, shadowScale, 1);
        (shadowMeshRef.current.material as THREE.MeshBasicMaterial).opacity =
          0.85 - floatOffset * 0.6;
      }

      // Smooth rotation dampening
      if (isRotating && !isPointerDownRef.current) {
        targetRotationRef.current.y += 0.006;
      }

      // Cursor parallax influence
      const mouseInfluenceX = mouseRef.current.x * 0.35;
      const mouseInfluenceY = mouseRef.current.y * 0.25;

      cartonGroup.rotation.y +=
        (targetRotationRef.current.y + mouseInfluenceX - cartonGroup.rotation.y) * 0.08;
      cartonGroup.rotation.x +=
        (targetRotationRef.current.x - mouseInfluenceY - cartonGroup.rotation.x) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // Mouse / Touch Interaction Handlers
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isPointerDownRef.current = true;
      setIsDragging(true);
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevPointerRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (isPointerDownRef.current) {
        const deltaX = clientX - prevPointerRef.current.x;
        const deltaY = clientY - prevPointerRef.current.y;
        targetRotationRef.current.y += deltaX * 0.009;
        targetRotationRef.current.x = Math.max(
          -0.5,
          Math.min(0.6, targetRotationRef.current.x + deltaY * 0.009)
        );
        prevPointerRef.current = { x: clientX, y: clientY };
      } else {
        const rect = container.getBoundingClientRect();
        mouseRef.current = {
          x: ((clientX - rect.left) / rect.width) * 2 - 1,
          y: -(((clientY - rect.top) / rect.height) * 2 - 1),
        };
      }
    };

    const handlePointerUp = () => {
      isPointerDownRef.current = false;
      setIsDragging(false);
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    dom.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp);

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      dom.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      dom.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
      renderer.dispose();
    };
  }, [activeVariant]);

  const resetRotation = () => {
    targetRotationRef.current = { x: 0.15, y: -0.45 };
    setIsRotating(true);
  };

  const currentConfig = VARIANTS[activeVariant];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className={`w-full h-[460px] sm:h-[520px] lg:h-[580px] cursor-grab active:cursor-grabbing canvas-container ${
          isDragging ? "cursor-grabbing" : ""
        }`}
        title="Click & drag to rotate 360°"
      />

      {/* Floating Badges & Controls Overlay */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-jozi-navy/10 shadow-sm text-xs font-bold text-jozi-navy">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-jozi-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-jozi-cyan"></span>
          </span>
          Interactive 3D Carton
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-2 rounded-full border transition-all shadow-sm ${
              isRotating
                ? "bg-jozi-cyan text-white border-jozi-cyan shadow-glow"
                : "bg-white text-jozi-navy border-jozi-navy/10 hover:bg-slate-50"
            }`}
            title={isRotating ? "Pause auto-rotation" : "Resume auto-rotation"}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
          </button>
          <button
            onClick={resetRotation}
            className="px-2.5 py-1 rounded-full bg-white text-jozi-navy border border-jozi-navy/10 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-all"
            title="Reset to default front angle"
          >
            Reset Angle
          </button>
        </div>
      </div>

      {/* Touch/Drag hint prompt */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-2 bg-jozi-navy/85 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] text-white/90 font-medium tracking-wide shadow-md">
        <Eye className="w-3.5 h-3.5 text-jozi-cyan" />
        <span>Drag to rotate • Inspect 360° sides</span>
      </div>

      {/* Variant Selector Tabs */}
      <div className="w-full max-w-md px-4 mt-1 z-10">
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-jozi-navy/10 shadow-card flex items-center justify-between gap-1.5">
          {(["full-cream", "low-fat", "amasi"] as CartonVariant[]).map((key) => {
            const v = VARIANTS[key];
            const isActive = activeVariant === key;
            return (
              <button
                key={key}
                onClick={() => setActiveVariant(key)}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                  isActive
                    ? "bg-jozi-navy text-white shadow-md scale-[1.02]"
                    : "text-slate-600 hover:text-jozi-navy hover:bg-slate-50"
                }`}
              >
                <span>{v.name}</span>
                <span
                  className={`text-[10px] font-semibold ${
                    isActive ? "text-jozi-cyan" : "text-slate-400"
                  }`}
                >
                  {key === "amasi" ? "Cultured" : "2 Litre"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
