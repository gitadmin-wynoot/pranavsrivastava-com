"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ChevronLeft, ChevronRight, Maximize, Minus, Plus } from "lucide-react";
import styles from "./mountain-scene.module.css";

export interface MountainSceneProps {
  selectedStage: number | null;
  onSelectStage: (index: number) => void;
  xray: boolean;
  cutaway: boolean;
  layers: string[];
  metrics: { p95: number; queueDepth: number; reliability: number; cacheHitRate: number };
  architecture: {
    agentCount: number;
    contextTokens: number;
    parallelism: number;
    cacheEnabled: boolean;
    circuitBreakerEnabled: boolean;
    fallbackEnabled: boolean;
    retries: number;
  };
  incident: string | null;
  paused: boolean;
  reducedMotion: boolean;
  resetKey: number;
  onInspect: (kind: string, label: string) => void;
}

const STAGES = [
  { name: "Training Centre", altitude: "THE FOUNDATION", x: -6.4, z: 4.8 },
  { name: "Base Camp", altitude: "5,364 M", x: -4.7, z: 3.5 },
  { name: "Khumbu Icefall", altitude: "5,486 M", x: -3.1, z: 2.7 },
  { name: "Camp I", altitude: "6,065 M", x: -0.9, z: 3.35 },
  { name: "Camp II", altitude: "6,400 M", x: 1.0, z: 1.9 },
  { name: "Camp III", altitude: "7,200 M", x: 1.15, z: 0.25 },
  { name: "Lhotse Face", altitude: "7,500 M", x: -0.3, z: 0.65 },
  { name: "Camp IV", altitude: "7,950 M", x: -2.0, z: -0.65 },
  { name: "Hillary Step", altitude: "8,790 M", x: -1.05, z: -0.22 },
  { name: "Summit", altitude: "8,849 M", x: -0.8, z: -1.0 },
] as const;

const SERVICES = [
  { label: "Weather MCP", kind: "mcp", x: 5.6, y: 4.8, z: -0.8, camp: 5 },
  { label: "Route retrieval", kind: "retrieval", x: -5.9, y: 4.8, z: -1.8, camp: 4 },
  { label: "Model provider", kind: "model", x: 3.9, y: 7.2, z: -3.7, camp: 7 },
  { label: "Inventory tool", kind: "tool", x: 5.2, y: 2.3, z: 3.9, camp: 5 },
] as const;

const MINT = 0x8af4cc;
const AMBER = 0xf5b66e;
const BLUE = 0x89bffa;
const RED = 0xfa786f;

// Deliberately angular peaks and a broken, asymmetric ridge: a terrain surface,
// rather than a cone with objects floating around it. The route samples this
// same surface so its switchbacks stay attached to the mountain.
function terrainHeight(x: number, z: number): number {
  const peaks = [
    [-0.8, -1, 8.85, 6.5, 1.0],
    [2.9, -2.6, 5.8, 4.9, 0.81],
    [-3.9, -2.3, 4.6, 4.8, 1.0],
    [-4.6, 1.5, 2.7, 3.3, 0.95],
    [2.4, 2.5, 2.65, 3.5, 1.1],
    [5.6, -0.5, 2.7, 3.5, 0.92],
  ];
  let height = 0;
  for (const [px, pz, summit, radius, squash] of peaks) {
    const dx = x - px;
    const dz = (z - pz) * squash;
    const theta = Math.atan2(dz, dx);
    const ribs = 1 + 0.10 * Math.cos(theta * 5 + 0.7) + 0.055 * Math.sin(theta * 9);
    const distance = Math.sqrt(dx * dx + dz * dz) * ribs;
    height = Math.max(height, summit * Math.pow(Math.max(0, 1 - distance / radius), 1.25));
  }
  const roughness = (Math.sin(x * 3.5 + z * 1.3) * Math.cos(z * 3.9 - x) + Math.sin(x * 6.9 - z * 3.5) * 0.35) * 0.095;
  return Math.max(0.015, height + roughness * Math.min(1, height));
}

function stagePosition(index: number): THREE.Vector3 {
  const stage = STAGES[index];
  return new THREE.Vector3(stage.x, terrainHeight(stage.x, stage.z) + 0.14, stage.z);
}

function makeTerrain(): THREE.BufferGeometry {
  const vertices: number[] = [];
  const colors: number[] = [];
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const edge1 = new THREE.Vector3();
  const edge2 = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const snow = new THREE.Color("#d6e4e7");
  const shale = new THREE.Color("#4b6170");
  const rock = new THREE.Color("#293e4c");
  const color = new THREE.Color();
  const step = 0.22;
  const point = (x: number, z: number, target: THREE.Vector3) => {
    const jitterX = Math.sin(x * 39.7 + z * 89.3) * step * 0.22;
    const jitterZ = Math.cos(x * 93.1 - z * 21.7) * step * 0.22;
    target.set(x + jitterX, terrainHeight(x + jitterX, z + jitterZ), z + jitterZ);
  };
  const triangle = () => {
    const midX = (a.x + b.x + c.x) / 3;
    const midZ = (a.z + b.z + c.z) / 3;
    if (Math.hypot(midX / 9.2, midZ / 8.1) > 1) return;
    normal.crossVectors(edge1.subVectors(b, a), edge2.subVectors(c, a)).normalize();
    const midY = (a.y + b.y + c.y) / 3;
    const snowLine = midY > 2.5 ? 0.51 : 0.75;
    const snowAmount = THREE.MathUtils.clamp((Math.abs(normal.y) - snowLine) * 3.7 + midY * 0.04, 0, 1);
    color.copy(rock).lerp(shale, Math.min(1, midY / 2.5)).lerp(snow, snowAmount);
    color.multiplyScalar(0.90 + (Math.sin(midX * 80 + midZ * 31) + 1) * 0.075);
    for (const v of [a, b, c]) {
      vertices.push(v.x, v.y, v.z);
      colors.push(color.r, color.g, color.b);
    }
  };
  for (let x = -9.3; x < 9.3; x += step) {
    for (let z = -8.3; z < 8.3; z += step) {
      point(x, z, a);
      point(x, z + step, b);
      point(x + step, z, c);
      triangle();
      point(x + step, z, a);
      point(x, z + step, b);
      point(x + step, z + step, c);
      triangle();
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function makeTentGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute([
    -0.22, 0, -0.27, 0, 0.32, -0.27, 0.22, 0, -0.27,
    -0.22, 0, 0.27, 0.22, 0, 0.27, 0, 0.32, 0.27,
    -0.22, 0, -0.27, -0.22, 0, 0.27, 0, 0.32, -0.27,
    -0.22, 0, 0.27, 0, 0.32, 0.27, 0, 0.32, -0.27,
    0.22, 0, -0.27, 0, 0.32, -0.27, 0.22, 0, 0.27,
    0.22, 0, 0.27, 0, 0.32, -0.27, 0, 0.32, 0.27,
  ], 3));
  geometry.computeVertexNormals();
  return geometry;
}

type CameraCommand = "left" | "right" | "in" | "out" | "reset";

export default function MountainScene(props: MountainSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const serviceLabelsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const propsRef = useRef(props);
  propsRef.current = props;
  const commandRef = useRef<((command: CameraCommand) => void) | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const [hover, setHover] = useState<{ label: string; x: number; y: number } | null>(null);
  const [lightweight, setLightweight] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      setStatus("fallback");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.setClearColor(0x08131b, 0);
    renderer.domElement.setAttribute("aria-label", "Interactive Everest system map. Drag to orbit, scroll to zoom, or use the camera buttons. Select a labelled camp to explore it.");
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.tabIndex = 0;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x091923, 0.008);
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 150);
    const overviewTarget = new THREE.Vector3(-0.35, 3.5, 0.1);
    const overviewPosition = new THREE.Vector3(15.0, 13.5, 24.0);
    camera.position.copy(overviewPosition);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(overviewTarget);
    controls.enableDamping = true;
    controls.dampingFactor = 0.065;
    controls.minDistance = 3.6;
    controls.maxDistance = 49;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.minPolarAngle = 0.13;
    controls.rotateSpeed = 0.52;
    controls.zoomSpeed = 0.72;
    controls.panSpeed = 0.6;
    controls.screenSpacePanning = true;
    controls.update();

    scene.add(new THREE.HemisphereLight(0xe5f4ff, 0x102838, 2.65));
    const sun = new THREE.DirectionalLight(0xf5f1df, 3.25);
    sun.position.set(-9, 15, 8);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x7ea5d3, 2.8);
    rim.position.set(8, 8, -9);
    scene.add(rim);

    const terrainMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0.04, flatShading: true, transparent: true });
    const terrain = new THREE.Mesh(makeTerrain(), terrainMaterial);
    scene.add(terrain);

    const grid = new THREE.GridHelper(30, 60, 0x365563, 0x1d3543);
    grid.position.y = -0.12;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.2;
    scene.add(grid);

    // Contour rings remain understated; the physical terrain carries the view.
    const contourGroup = new THREE.Group();
    for (const radius of [10, 12.3, 14.6]) {
      const points = Array.from({ length: 129 }, (_, i) => new THREE.Vector3(Math.cos(i / 128 * Math.PI * 2) * radius, -0.11, Math.sin(i / 128 * Math.PI * 2) * radius * 0.83));
      contourGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0x608298, transparent: true, opacity: radius === 10 ? 0.21 : 0.10 })));
    }
    scene.add(contourGroup);

    const starsGeometry = new THREE.BufferGeometry();
    const stars: number[] = [];
    for (let i = 0; i < 360; i++) {
      const phase = i * 2.399963;
      const y = 9 + ((i * 73) % 210) / 7;
      stars.push(Math.cos(phase) * (22 + i % 27), y, Math.sin(phase) * (22 + i % 27));
    }
    starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(stars, 3));
    const starField = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0xc5d8e5, size: 0.027, transparent: true, opacity: 0.55, sizeAttenuation: true }));
    scene.add(starField);

    const clickables: THREE.Object3D[] = [];
    const addInteractive = (object: THREE.Object3D, kind: string, label: string, stage?: number) => {
      object.userData = { kind, label, stage };
      clickables.push(object);
    };
    const routeGroup = new THREE.Group();
    const flowGroup = new THREE.Group();
    const campGroup = new THREE.Group();
    const agentGroup = new THREE.Group();
    const toolGroup = new THREE.Group();
    const dependencyGroup = new THREE.Group();
    const telemetryGroup = new THREE.Group();
    const trustGroup = new THREE.Group();
    const latencyGroup = new THREE.Group();
    const failureGroup = new THREE.Group();
    const xrayGroup = new THREE.Group();
    scene.add(routeGroup, flowGroup, campGroup, agentGroup, toolGroup, dependencyGroup, telemetryGroup, trustGroup, latencyGroup, failureGroup, xrayGroup);

    const routeMaterial = new THREE.MeshBasicMaterial({ color: MINT, transparent: true, opacity: 0.9 });
    const routeGlowMaterial = new THREE.MeshBasicMaterial({ color: MINT, transparent: true, opacity: 0.08, depthWrite: false, blending: THREE.AdditiveBlending });
    const routePoints: THREE.Vector3[] = [];
    for (let stage = 0; stage < STAGES.length - 1; stage++) {
      const from = STAGES[stage];
      const to = STAGES[stage + 1];
      const samples: THREE.Vector3[] = [];
      for (let s = 0; s <= 24; s++) {
        const t = s / 24;
        const curve = Math.sin(t * Math.PI) * (stage < 5 ? 0.22 : 0.07);
        const x = THREE.MathUtils.lerp(from.x, to.x, t) + curve;
        const z = THREE.MathUtils.lerp(from.z, to.z, t) - curve * 0.4;
        samples.push(new THREE.Vector3(x, terrainHeight(x, z) + 0.13, z));
      }
      const curve = new THREE.CatmullRomCurve3(samples);
      const rope = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.022, 5, false), routeMaterial);
      addInteractive(rope, "route", `${from.name} → ${to.name}`, stage + 1);
      routeGroup.add(rope, new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.072, 5, false), routeGlowMaterial));
      routePoints.push(...samples.slice(stage ? 1 : 0));
    }
    const mainCurve = new THREE.CatmullRomCurve3(routePoints);
    const positions = STAGES.map((_, index) => stagePosition(index));

    const campMarkerMaterial = new THREE.MeshBasicMaterial({ color: MINT });
    const platformMaterial = new THREE.MeshStandardMaterial({ color: 0x263b43, roughness: 0.8 });
    const tentMaterials = STAGES.map(() => new THREE.MeshStandardMaterial({ color: 0xe29d5d, roughness: 0.82, side: THREE.DoubleSide, transparent: true }));
    const tentGeometry = makeTentGeometry();
    const ringGeometry = new THREE.TorusGeometry(0.23, 0.012, 6, 32);
    const platformGeometry = new THREE.CylinderGeometry(0.43, 0.47, 0.07, 8);
    const tinyBox = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const tents: THREE.Mesh[] = [];
    const markers: THREE.Mesh[] = [];
    const interiors: THREE.Group[] = [];
    const interiorSystems = [
      { kind: "agent", label: "Lead Sherpa · orchestrator", color: MINT },
      { kind: "mcp", label: "MCP radio · tool catalogue", color: BLUE },
      { kind: "security", label: "Permission board · approval gate", color: AMBER },
      { kind: "trace", label: "Request trace · execution log", color: 0xc4afff },
    ];
    positions.forEach((position, index) => {
      const camp = new THREE.Group();
      camp.position.copy(position);
      const platform = new THREE.Mesh(platformGeometry, platformMaterial);
      platform.position.y = -0.04;
      camp.add(platform);
      const tent = new THREE.Mesh(tentGeometry, tentMaterials[index]);
      tent.rotation.y = index * 0.5 + 0.4;
      addInteractive(tent, "camp", STAGES[index].name, index);
      tents.push(tent);
      camp.add(tent);
      const marker = new THREE.Mesh(ringGeometry, campMarkerMaterial);
      marker.rotation.x = -Math.PI / 2;
      marker.position.set(0, 0.015, 0.43);
      camp.add(marker);
      markers.push(marker);
      if (index === 0 || index === 1 || index === 4) {
        for (let i = 0; i < 2; i++) {
          const extra = new THREE.Mesh(tentGeometry, tentMaterials[index]);
          extra.scale.setScalar(0.72);
          extra.position.set((i ? 1 : -1) * 0.52, -0.01, 0.12);
          extra.rotation.y = 0.2 + i;
          addInteractive(extra, "camp", `${STAGES[index].name} operations tent`, index);
          camp.add(extra);
        }
      }
      if (index === 9) {
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.85, 5), new THREE.MeshBasicMaterial({ color: 0xe3ece9 }));
        mast.position.y = 0.55;
        const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.2), new THREE.MeshBasicMaterial({ color: MINT, side: THREE.DoubleSide }));
        flag.position.set(0.20, 0.83, 0);
        camp.add(mast, flag);
      }
      const interior = new THREE.Group();
      interiorSystems.forEach((system, i) => {
        const unit = new THREE.Mesh(tinyBox, new THREE.MeshStandardMaterial({ color: system.color, emissive: system.color, emissiveIntensity: 0.4, metalness: 0.2, roughness: 0.4 }));
        unit.position.set((i % 2 ? 1 : -1) * 0.17, 0.12, (i < 2 ? 1 : -1) * 0.16);
        addInteractive(unit, system.kind, system.label);
        interior.add(unit);
      });
      camp.add(interior);
      interiors.push(interior);
      campGroup.add(camp);

      const latency = new THREE.Mesh(new THREE.RingGeometry(0.34, 0.58, 28), new THREE.MeshBasicMaterial({ color: AMBER, transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false }));
      latency.position.copy(position).add(new THREE.Vector3(0, 0.025, 0));
      latency.rotation.x = -Math.PI / 2;
      addInteractive(latency, "latency", `${STAGES[index].name} latency`);
      latencyGroup.add(latency);

      const node = new THREE.Mesh(new THREE.IcosahedronGeometry(0.13, 0), new THREE.MeshBasicMaterial({ color: index === 5 ? BLUE : MINT, wireframe: true }));
      node.position.copy(position).add(new THREE.Vector3(0, -0.3, 0));
      addInteractive(node, "topology", `${STAGES[index].name} processing node`, index);
      xrayGroup.add(node);

      if (index === 1 || index === 5 || index === 7) {
        const boundary = new THREE.Mesh(new THREE.SphereGeometry(0.78, 16, 8), new THREE.MeshBasicMaterial({ color: 0xb3a2e3, transparent: true, opacity: 0.15, wireframe: true, depthWrite: false }));
        boundary.position.copy(position);
        addInteractive(boundary, "security", `${STAGES[index].name} trust boundary`);
        trustGroup.add(boundary);
      }
      const telemetry = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.7, 4), new THREE.MeshBasicMaterial({ color: BLUE }));
      telemetry.position.copy(position).add(new THREE.Vector3(0.32, 0.35, 0.05));
      const beacon = new THREE.Mesh(new THREE.OctahedronGeometry(0.06), new THREE.MeshBasicMaterial({ color: BLUE }));
      beacon.position.copy(telemetry.position).add(new THREE.Vector3(0, 0.4, 0));
      addInteractive(beacon, "trace", `${STAGES[index].name} telemetry`);
      telemetryGroup.add(telemetry, beacon);
    });

    // External services are spatial dependencies, not decorations on the route.
    const serviceCurves: THREE.CatmullRomCurve3[] = [];
    const serviceNodes: THREE.Mesh[] = [];
    const serviceMaterial = new THREE.MeshStandardMaterial({ color: BLUE, emissive: BLUE, emissiveIntensity: 0.7, roughness: 0.3, metalness: 0.15 });
    SERVICES.forEach((service, index) => {
      const position = new THREE.Vector3(service.x, service.y, service.z);
      const serviceNode = new THREE.Mesh(new THREE.OctahedronGeometry(0.23, 0), serviceMaterial.clone());
      serviceNode.position.copy(position);
      addInteractive(serviceNode, service.kind, service.label);
      serviceNodes.push(serviceNode);
      toolGroup.add(serviceNode);
      const orbit = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.012, 5, 32), new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0.55 }));
      orbit.position.copy(position);
      orbit.rotation.x = 1.05;
      toolGroup.add(orbit);
      const from = positions[service.camp].clone();
      const mid = from.clone().lerp(position, 0.5).add(new THREE.Vector3(0, 0.8 + index * 0.13, 0));
      const curve = new THREE.CatmullRomCurve3([from, mid, position]);
      serviceCurves.push(curve);
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)), new THREE.LineDashedMaterial({ color: BLUE, dashSize: 0.13, gapSize: 0.1, transparent: true, opacity: 0.5 }));
      line.computeLineDistances();
      addInteractive(line, "dependency", `${STAGES[service.camp].name} → ${service.label}`);
      dependencyGroup.add(line);
    });

    const cachedCurve = new THREE.CatmullRomCurve3([positions[3], positions[3].clone().lerp(positions[6], 0.5).add(new THREE.Vector3(-1.0, 1.2, 0.5)), positions[6]]);
    const cacheRoute = new THREE.Line(new THREE.BufferGeometry().setFromPoints(cachedCurve.getPoints(40)), new THREE.LineDashedMaterial({ color: 0xc8b6ff, dashSize: 0.08, gapSize: 0.07, transparent: true, opacity: 0.85 }));
    cacheRoute.computeLineDistances();
    addInteractive(cacheRoute, "cache", "Cache hit · bypass repeated retrieval");
    xrayGroup.add(cacheRoute);
    const fallbackCurve = new THREE.CatmullRomCurve3([positions[5], new THREE.Vector3(2.5, 7.4, 1.4), positions[8]]);
    const fallbackRoute = new THREE.Line(new THREE.BufferGeometry().setFromPoints(fallbackCurve.getPoints(40)), new THREE.LineDashedMaterial({ color: AMBER, dashSize: 0.16, gapSize: 0.09, transparent: true, opacity: 0.9 }));
    fallbackRoute.computeLineDistances();
    addInteractive(fallbackRoute, "fallback", "Rescue route · degraded service fallback");
    failureGroup.add(fallbackRoute);

    const retryCurve = new THREE.CatmullRomCurve3(Array.from({ length: 33 }, (_, i) => positions[5].clone().add(new THREE.Vector3(Math.cos(i / 32 * Math.PI * 2) * 0.55, 0.38 + Math.sin(i / 32 * Math.PI * 2) * 0.35, 0.45))), true);
    const retryRoute = new THREE.Line(new THREE.BufferGeometry().setFromPoints(retryCurve.getPoints(64)), new THREE.LineDashedMaterial({ color: RED, dashSize: 0.08, gapSize: 0.065, transparent: true, opacity: 0.8 }));
    retryRoute.computeLineDistances();
    addInteractive(retryRoute, "retry", "Retry loop · repeated dependency calls");
    failureGroup.add(retryRoute);

    const failureMarker = new THREE.Mesh(new THREE.TetrahedronGeometry(0.24), new THREE.MeshBasicMaterial({ color: RED, wireframe: true }));
    failureMarker.position.copy(positions[5]).add(new THREE.Vector3(0, 0.65, 0));
    addInteractive(failureMarker, "incident", "Production incident · inspect the blocked dependency");
    failureGroup.add(failureMarker);
    const breaker = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 0.09), new THREE.MeshBasicMaterial({ color: RED }));
    breaker.position.copy(serviceCurves[0].getPoint(0.22));
    breaker.rotation.z = 0.8;
    addInteractive(breaker, "circuit-breaker", "Circuit breaker open · repeated calls stopped");
    failureGroup.add(breaker);

    const particleGeometry = new THREE.IcosahedronGeometry(0.038, 0);
    const particles = new THREE.InstancedMesh(particleGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }), 64);
    particles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    addInteractive(particles, "request", "Active request · inspect its execution trace");
    flowGroup.add(particles);
    const queue = new THREE.InstancedMesh(new THREE.BoxGeometry(0.065, 0.065, 0.065), new THREE.MeshBasicMaterial({ color: AMBER }), 48);
    queue.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    addInteractive(queue, "queue", "Waiting requests · bottleneck queue");
    flowGroup.add(queue);
    const callParticles = new THREE.InstancedMesh(new THREE.SphereGeometry(0.045, 6, 4), new THREE.MeshBasicMaterial({ color: BLUE }), 16);
    callParticles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    addInteractive(callParticles, "tool-call", "MCP tool call · request and response");
    toolGroup.add(callParticles);

    const agents: THREE.Group[] = [];
    const backpacks: THREE.Mesh[] = [];
    const bodyGeometry = new THREE.CylinderGeometry(0.045, 0.068, 0.17, 5);
    const headGeometry = new THREE.SphereGeometry(0.055, 6, 4);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xefb578, roughness: 0.8 });
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xdce4df });
    const packMaterial = new THREE.MeshStandardMaterial({ color: 0x79bdaa });
    for (let i = 0; i < 12; i++) {
      const agent = new THREE.Group();
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.11;
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 0.24;
      const pack = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.15, 0.09), packMaterial);
      pack.position.set(0, 0.13, -0.055);
      backpacks.push(pack);
      agent.add(body, head, pack);
      addInteractive(body, "agent", `Sherpa ${i + 1} · AI agent`);
      addInteractive(pack, "context", `Sherpa ${i + 1} context backpack`);
      agentGroup.add(agent);
      agents.push(agent);
    }

    const snowGeometry = new THREE.BufferGeometry();
    const snowPositions = new Float32Array(90 * 3);
    for (let i = 0; i < 90; i++) {
      snowPositions[i * 3] = Math.sin(i * 17.3) * 8;
      snowPositions[i * 3 + 1] = (i * 1.719) % 12;
      snowPositions[i * 3 + 2] = Math.cos(i * 31.9) * 7;
    }
    snowGeometry.setAttribute("position", new THREE.BufferAttribute(snowPositions, 3));
    const weather = new THREE.Points(snowGeometry, new THREE.PointsMaterial({ color: 0xb5d2e3, size: 0.035, transparent: true, opacity: 0.6 }));
    failureGroup.add(weather);

    let width = 1;
    let height = 1;
    let frame = 0;
    let disposed = false;
    let elapsed = 0;
    let previousTime = performance.now();
    let lastLabels = 0;
    let slowFrames = 0;
    let performanceFrames = 0;
    let reducedEffects = false;
    let focusPosition: THREE.Vector3 | null = null;
    let focusTarget: THREE.Vector3 | null = null;
    let previousStage: number | null = null;
    let previousReset = propsRef.current.resetKey;
    let previousCutaway = false;
    const dummy = new THREE.Object3D();
    const temporary = new THREE.Vector3();
    const projected = new THREE.Vector3();
    const color = new THREE.Color();
    const cameraOffset = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    raycaster.params.Line = { threshold: 0.10 };
    const pointer = new THREE.Vector2();
    let pointerDown: { x: number; y: number } | null = null;
    let lastHover = 0;

    const resetCamera = () => {
      focusPosition = overviewPosition.clone();
      focusTarget = overviewTarget.clone();
    };
    const focusCamp = (index: number) => {
      const position = positions[index];
      const direction = camera.position.clone().sub(controls.target).normalize();
      direction.y = Math.max(direction.y, 0.4);
      direction.normalize();
      focusTarget = position.clone().add(new THREE.Vector3(0, 0.1, 0));
      const distance = propsRef.current.cutaway ? 4.3 : width < 700 ? 10 : 8.2;
      focusPosition = focusTarget.clone().addScaledVector(direction, distance);
    };
    commandRef.current = (command) => {
      if (command === "reset") { resetCamera(); return; }
      focusPosition = null;
      focusTarget = null;
      cameraOffset.copy(camera.position).sub(controls.target);
      if (command === "in" || command === "out") {
        cameraOffset.multiplyScalar(command === "in" ? 0.82 : 1.22);
        cameraOffset.clampLength(controls.minDistance, controls.maxDistance);
      } else cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), command === "left" ? 0.22 : -0.22);
      focusPosition = controls.target.clone().add(cameraOffset);
      focusTarget = controls.target.clone();
    };
    const cancelFocus = () => { focusPosition = null; focusTarget = null; };
    controls.addEventListener("start", cancelFocus);

    const resize = () => {
      width = host.clientWidth;
      height = host.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // Portrait devices need a wider vertical field to preserve the silhouette.
      camera.fov = width < 700 ? 47 : 34;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    const isVisible = (object: THREE.Object3D): boolean => {
      let current: THREE.Object3D | null = object;
      while (current) {
        if (!current.visible) return false;
        current = current.parent;
      }
      return true;
    };
    const intersect = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(clickables.filter(isVisible), false)[0];
    };
    const onDown = (event: PointerEvent) => { pointerDown = { x: event.clientX, y: event.clientY }; };
    const onUp = (event: PointerEvent) => {
      if (!pointerDown || Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y) > 6) { pointerDown = null; return; }
      pointerDown = null;
      const hit = intersect(event);
      if (!hit) return;
      const data = hit.object.userData;
      if (typeof data.stage === "number") {
        propsRef.current.onSelectStage(data.stage);
        focusCamp(data.stage);
      } else {
        propsRef.current.onInspect(data.kind, data.label);
        if (data.kind !== "request" && data.kind !== "tool-call" && data.kind !== "queue") {
          const objectPosition = hit.object.getWorldPosition(new THREE.Vector3());
          focusTarget = objectPosition;
          focusPosition = objectPosition.clone().add(camera.position.clone().sub(controls.target).normalize().multiplyScalar(6.0));
        }
      }
    };
    const onMove = (event: PointerEvent) => {
      if (performance.now() - lastHover < 80 || pointerDown) return;
      lastHover = performance.now();
      const hit = intersect(event);
      renderer.domElement.style.cursor = hit ? "pointer" : "grab";
      if (hit) {
        const rect = host.getBoundingClientRect();
        setHover({ label: hit.object.userData.label, x: event.clientX - rect.left, y: event.clientY - rect.top });
      } else setHover(null);
    };
    const onLeave = () => { setHover(null); pointerDown = null; };
    const onKey = (event: KeyboardEvent) => {
      const commands: Record<string, CameraCommand> = { ArrowLeft: "left", ArrowRight: "right", "+": "in", "=": "in", "-": "out", Home: "reset" };
      if (event.shiftKey && event.key.startsWith("Arrow")) {
        event.preventDefault();
        cancelFocus();
        const shift = new THREE.Vector3(event.key === "ArrowLeft" ? -0.45 : event.key === "ArrowRight" ? 0.45 : 0, event.key === "ArrowUp" ? 0.45 : event.key === "ArrowDown" ? -0.45 : 0, 0);
        shift.applyQuaternion(camera.quaternion);
        controls.target.add(shift);
        camera.position.add(shift);
      } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        cancelFocus();
        const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
        spherical.phi = THREE.MathUtils.clamp(spherical.phi + (event.key === "ArrowUp" ? -0.12 : 0.12), controls.minPolarAngle, controls.maxPolarAngle);
        camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));
      } else if (commands[event.key]) {
        event.preventDefault();
        commandRef.current?.(commands[event.key]);
      }
    };
    const onContextLost = (event: Event) => { event.preventDefault(); disposed = true; cancelAnimationFrame(frame); setStatus("fallback"); };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerleave", onLeave);
    renderer.domElement.addEventListener("keydown", onKey);
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    const placeLabel = (element: HTMLButtonElement | null, position: THREE.Vector3, visible: boolean, offset = 0, leftAligned = false) => {
      if (!element) return;
      projected.copy(position).project(camera);
      const x = (projected.x * 0.5 + 0.5) * width;
      const y = (-projected.y * 0.5 + 0.5) * height;
      const onScreen = visible && projected.z < 1 && projected.z > -1 && x > 20 && x < width - 20 && y > 20 && y < height - 35;
      element.style.transform = `translate3d(${x}px, ${y + offset}px, 0)${leftAligned ? " translateX(-100%)" : ""}`;
      element.style.opacity = onScreen ? "1" : "0";
      element.style.pointerEvents = onScreen ? "auto" : "none";
      element.style.visibility = onScreen ? "visible" : "hidden";
      element.tabIndex = onScreen ? 0 : -1;
    };

    const animate = (now: number) => {
      if (disposed) return;
      frame = requestAnimationFrame(animate);
      const delta = Math.min((now - previousTime) / 1000, 0.08);
      previousTime = now;
      const current = propsRef.current;
      if (!current.paused && !current.reducedMotion) elapsed += delta;
      if (performanceFrames < 150 && delta > 0.032) slowFrames++;
      performanceFrames++;
      if (performanceFrames === 150 && slowFrames > 65) {
        reducedEffects = true;
        renderer.setPixelRatio(1);
        starField.visible = false;
        setLightweight(true);
      }

      if (current.resetKey !== previousReset) { previousReset = current.resetKey; resetCamera(); }
      if (current.selectedStage !== previousStage) {
        previousStage = current.selectedStage;
        if (current.selectedStage !== null) focusCamp(current.selectedStage);
        else resetCamera();
      }
      if (current.cutaway !== previousCutaway) {
        previousCutaway = current.cutaway;
        if (current.selectedStage !== null) focusCamp(current.selectedStage);
      }
      if (focusPosition && focusTarget) {
        const easing = current.reducedMotion ? 1 : 1 - Math.exp(-delta * 4.4);
        camera.position.lerp(focusPosition, easing);
        controls.target.lerp(focusTarget, easing);
        if (camera.position.distanceTo(focusPosition) < 0.015) { focusPosition = null; focusTarget = null; }
      }
      controls.enableDamping = !current.reducedMotion;
      controls.update();

      const layer = (id: string) => current.layers.includes(id);
      const dependencyFailure = ["mcp-timeout", "slow-dependency", "cascading-failure"].includes(current.incident ?? "");
      const providerFailure = ["provider-outage", "provider-rate-limit"].includes(current.incident ?? "");
      const failureStage = providerFailure ? 7 : current.incident === "wrong-retrieval" ? 4 : current.incident === "context-overload" ? 3 : ["traffic-surge", "queue-overload"].includes(current.incident ?? "") ? 8 : 5;
      terrainMaterial.opacity = THREE.MathUtils.lerp(terrainMaterial.opacity, current.xray ? 0.20 : 1, current.reducedMotion ? 1 : 0.09);
      terrainMaterial.depthWrite = !current.xray;
      routeGroup.visible = layer("route");
      flowGroup.visible = layer("flow") || current.xray;
      agentGroup.visible = layer("agents");
      toolGroup.visible = layer("tools") || current.xray;
      dependencyGroup.visible = layer("dependencies") || current.xray;
      telemetryGroup.visible = layer("telemetry");
      trustGroup.visible = layer("trust");
      latencyGroup.visible = layer("latency");
      failureGroup.visible = layer("failures") && Boolean(current.incident);
      xrayGroup.visible = current.xray;
      cacheRoute.visible = current.architecture.cacheEnabled;
      fallbackRoute.visible = current.architecture.fallbackEnabled && (dependencyFailure || providerFailure);
      retryRoute.visible = dependencyFailure && current.architecture.retries > 0 && !current.architecture.circuitBreakerEnabled;
      breaker.visible = current.architecture.circuitBreakerEnabled && dependencyFailure;
      weather.visible = Boolean(current.incident) && !reducedEffects;
      failureMarker.position.copy(positions[failureStage]).add(new THREE.Vector3(0, 0.65, 0));
      failureMarker.rotation.y = elapsed * 0.5;
      weather.rotation.y = elapsed * 0.015;
      failureMarker.scale.setScalar(1 + Math.sin(elapsed * 3) * 0.13);

      tents.forEach((tent, i) => {
        const isInterior = current.cutaway && i === current.selectedStage;
        tent.position.y = THREE.MathUtils.lerp(tent.position.y, isInterior ? 0.65 : 0, current.reducedMotion ? 1 : 0.1);
        tentMaterials[i].opacity = isInterior ? 0.22 : 1;
        tentMaterials[i].depthWrite = !isInterior;
        interiors[i].visible = isInterior;
        markers[i].scale.setScalar(i === current.selectedStage ? 1.3 + Math.sin(elapsed * 2) * 0.08 : 1);
        const heat = latencyGroup.children[i] as THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
        const stressed = i === 5 || i === 6 || i === 8;
        heat.scale.setScalar(stressed ? 1 + Math.min(current.metrics.p95 / 12000, 2) : 0.75);
        heat.material.color.set(stressed && current.metrics.p95 > 5000 ? RED : stressed ? AMBER : MINT);
      });

      const particleCount = reducedEffects ? 24 : 48;
      particles.count = particleCount;
      const speed = THREE.MathUtils.clamp(1800 / Math.max(600, current.metrics.p95), 0.18, 1.4);
      for (let i = 0; i < particleCount; i++) {
        let progress = (i / particleCount + elapsed * 0.023 * speed) % 1;
        const cached = current.architecture.cacheEnabled && (i * 37 % 100) < current.metrics.cacheHitRate;
        const failed = Boolean(current.incident) && (i * 43 % 100) >= current.metrics.reliability;
        if (failed && !current.architecture.fallbackEnabled) progress = Math.min(progress, 0.63);
        if (cached && progress > 0.37 && progress < 0.67) cachedCurve.getPoint((progress - 0.37) / 0.3, temporary);
        else if (failed && current.architecture.fallbackEnabled && progress > 0.55 && progress < 0.85) fallbackCurve.getPoint((progress - 0.55) / 0.3, temporary);
        else if (failed && retryRoute.visible && progress > 0.5 && progress < 0.7) retryCurve.getPoint((elapsed * 0.15 * current.architecture.retries + i * 0.17) % 1, temporary);
        else mainCurve.getPoint(progress, temporary);
        dummy.position.copy(temporary).add(new THREE.Vector3(0, 0.065, 0));
        dummy.scale.setScalar(failed ? 1.55 : 1);
        dummy.rotation.set(0, elapsed, 0);
        dummy.updateMatrix();
        particles.setMatrixAt(i, dummy.matrix);
        particles.setColorAt(i, color.set(failed ? RED : cached ? 0xc8b6ff : MINT));
      }
      particles.instanceMatrix.needsUpdate = true;
      if (particles.instanceColor) particles.instanceColor.needsUpdate = true;

      queue.count = Math.min(48, Math.max(0, Math.ceil(current.metrics.queueDepth / 2)));
      for (let i = 0; i < queue.count; i++) {
        dummy.position.copy(positions[failureStage]).add(new THREE.Vector3(-0.46 + i % 8 * 0.095, 0.07 + Math.floor(i / 8) * 0.09, 0.51));
        dummy.scale.setScalar(1);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        queue.setMatrixAt(i, dummy.matrix);
      }
      queue.instanceMatrix.needsUpdate = true;

      for (let i = 0; i < 16; i++) {
        const serviceIndex = i % serviceCurves.length;
        const parallelCalls = THREE.MathUtils.clamp(current.architecture.parallelism, 1, 4);
        const activeBatch = Math.floor(elapsed / 2) % Math.ceil(4 / parallelCalls);
        const progress = (elapsed * 0.20 + i * 0.25) % 1;
        const held = Math.floor(serviceIndex / parallelCalls) !== activeBatch || (serviceIndex === 0 && breaker.visible);
        serviceCurves[serviceIndex].getPoint(held ? 0 : progress < 0.5 ? progress * 2 : (1 - progress) * 2, temporary);
        dummy.position.copy(temporary);
        dummy.scale.setScalar(held ? 0 : 1);
        dummy.updateMatrix();
        callParticles.setMatrixAt(i, dummy.matrix);
      }
      callParticles.instanceMatrix.needsUpdate = true;
      serviceNodes.forEach((node, i) => {
        node.rotation.y = elapsed * 0.25;
        node.scale.setScalar(1 + Math.sin(elapsed * 2 + i) * 0.08);
        (node.material as THREE.MeshStandardMaterial).color.set((i === 0 && dependencyFailure) || (i === 2 && providerFailure) || (i === 1 && current.incident === "wrong-retrieval") ? RED : BLUE);
      });

      agents.forEach((agent, i) => {
        agent.visible = i < current.architecture.agentCount;
        const progress = (0.13 + i * 0.075 + elapsed * 0.009 * speed) % 0.94;
        mainCurve.getPoint(progress, temporary);
        agent.position.copy(temporary).add(new THREE.Vector3(0.16, 0.035, 0));
        agent.rotation.y = i * 0.9;
        const packScale = THREE.MathUtils.clamp(current.architecture.contextTokens / 8000, 0.6, 3.2);
        backpacks[i].scale.set(1, packScale, Math.sqrt(packScale));
      });

      if (now - lastLabels > 40) {
        lastLabels = now;
        const overview = camera.position.distanceTo(controls.target) > 13;
        positions.forEach((position, i) => {
          const selected = current.selectedStage === i;
          const labelPosition = temporary.copy(position).add(new THREE.Vector3(0, i === 9 ? 1.02 : 0.5, 0));
          // Close-ups retain nearby camps. Every stage remains reachable in the
          // equivalent DOM navigator, including behind the mountain.
          const nearFocus = overview || position.distanceTo(controls.target) < 3.5 || selected;
          const showMinor = width > 900 || i === 0 || i === 1 || i === 5 || i === 9 || selected;
          placeLabel(labelsRef.current[i], labelPosition, nearFocus && showMinor, i === 6 ? 8 : i === 8 ? -8 : 0, i === 2 || i === 6);
        });
        SERVICES.forEach((service, i) => {
          placeLabel(serviceLabelsRef.current[i], temporary.set(service.x, service.y + 0.48, service.z), toolGroup.visible);
        });
      }
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);
    setStatus("ready");

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.removeEventListener("start", cancelFocus);
      controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerleave", onLeave);
      renderer.domElement.removeEventListener("keydown", onKey);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        const drawable = object as THREE.Mesh;
        if (drawable.geometry) geometries.add(drawable.geometry);
        if (drawable.material) {
          (Array.isArray(drawable.material) ? drawable.material : [drawable.material]).forEach((material) => materials.add(material));
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
      commandRef.current = null;
    };
  }, []);

  return (
    <div className={`${styles.scene} ${props.xray ? styles.xray : ""}`}>
      <div ref={hostRef} className={styles.canvas} />
      {status === "ready" && (
        <>
          <div className={styles.labels} aria-label="Mountain camps">
            {STAGES.map((stage, index) => (
              <button
                key={stage.name}
                ref={(element) => { labelsRef.current[index] = element; }}
                className={`${styles.campLabel} ${index === props.selectedStage ? styles.selected : ""} ${index === 9 ? styles.summit : ""} ${index === 0 || index === 1 ? styles.base : ""} ${index === 2 || index === 6 ? styles.leftLabel : ""}`}
                onClick={() => props.onSelectStage(index)}
                aria-label={`Explore ${stage.name}, ${stage.altitude}`}
                aria-pressed={index === props.selectedStage}
                style={{ opacity: 0 }}
              >
                <span className={styles.labelDot} />
                <span className={styles.labelContent}><strong>{stage.name}</strong><small>{stage.altitude}</small></span>
              </button>
            ))}
            {SERVICES.map((service, index) => (
              <button
                key={service.label}
                ref={(element) => { serviceLabelsRef.current[index] = element; }}
                className={styles.serviceLabel}
                onClick={() => props.onInspect(service.kind, service.label)}
                style={{ opacity: 0 }}
              ><span>◇</span>{service.label}</button>
            ))}
          </div>
          <div className={styles.cameraControls} role="group" aria-label="Camera controls">
            <button type="button" onClick={() => commandRef.current?.("left")} title="Rotate left" aria-label="Rotate mountain left"><ChevronLeft size={16} /></button>
            <button type="button" onClick={() => commandRef.current?.("right")} title="Rotate right" aria-label="Rotate mountain right"><ChevronRight size={16} /></button>
            <span />
            <button type="button" onClick={() => commandRef.current?.("out")} title="Zoom out" aria-label="Zoom out"><Minus size={15} /></button>
            <button type="button" onClick={() => commandRef.current?.("in")} title="Zoom in" aria-label="Zoom in"><Plus size={15} /></button>
            <span />
            <button type="button" onClick={() => commandRef.current?.("reset")} title="Mountain overview" aria-label="Reset camera to mountain overview"><Maximize size={15} /></button>
          </div>
          <div className={styles.navigationHint}>DRAG TO ORBIT <span>·</span> SCROLL TO EXPLORE <span>·</span> SHIFT + DRAG TO PAN</div>
          {props.cutaway && <div className={styles.cutawayHint}>CAMP CUTAWAY <span>The tent roof lifts to expose its systems.</span><div className={styles.cutawaySystems}>{[["agent", "Lead Sherpa"], ["mcp", "MCP radio"], ["security", "Permissions"], ["trace", "Trace log"]].map(([kind, label]) => <button key={kind} onClick={() => props.onInspect(kind, label)}>{label}</button>)}</div></div>}
          {hover && <div className={styles.tooltip} style={{ left: Math.min(hover.x + 14, Math.max(10, (hostRef.current?.clientWidth ?? 900) - 270)), top: hover.y - 35 }}>{hover.label}</div>}
          {lightweight && <span className={styles.lightweight}>Reduced effects enabled</span>}
        </>
      )}
      {status === "loading" && <div className={styles.loading}><span />Mapping the mountain…</div>}
      {status === "fallback" && (
        <div className={styles.fallback}>
          <span className={styles.fallbackEyebrow}>EVEREST / EXPEDITION MAP</span>
          <h2>Your route to production</h2>
          <p>3D is unavailable on this device. Every stage, scenario and architecture control is still available.</p>
          <ol>{STAGES.map((stage, index) => <li key={stage.name}><button onClick={() => props.onSelectStage(index)} aria-pressed={props.selectedStage === index}><span>{String(index + 1).padStart(2, "0")}</span>{stage.name}<small>{stage.altitude}</small></button></li>)}</ol>
        </div>
      )}
      <p className={styles.screenReader}>Keyboard map controls: left and right arrows rotate, up and down arrows tilt, plus and minus zoom, shift and arrow keys pan, and Home returns to the overview. {props.incident ? `Incident active: ${props.incident}. ` : ""}{props.metrics.queueDepth} requests queued. {props.xray ? "System X-ray is on." : "Expedition terrain view."}</p>
    </div>
  );
}
