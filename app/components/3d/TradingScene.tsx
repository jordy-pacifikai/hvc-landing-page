"use client";

import { Suspense, useRef, useMemo, useCallback, Component, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ============ ERROR BOUNDARY ============ */
class SceneErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

/* ============ SIMPLEX NOISE (3D) ============ */
// Compact 3D simplex noise for curl noise flow field
const F3 = 1 / 3;
const G3 = 1 / 6;
const grad3 = [
  [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1],
];

function buildPerm() {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod12[i] = perm[i] % 12;
  }
  return { perm, permMod12 };
}

const { perm, permMod12 } = buildPerm();

function noise3D(x: number, y: number, z: number): number {
  const s = (x + y + z) * F3;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const k = Math.floor(z + s);
  const t = (i + j + k) * G3;
  const X0 = i - t, Y0 = j - t, Z0 = k - t;
  const x0 = x - X0, y0 = y - Y0, z0 = z - Z0;

  let i1: number, j1: number, k1: number;
  let i2: number, j2: number, k2: number;

  if (x0 >= y0) {
    if (y0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0; }
    else if (x0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1; }
    else { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1; }
  } else {
    if (y0 < z0) { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1; }
    else if (x0 < z0) { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1; }
    else { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0; }
  }

  const x1 = x0-i1+G3, y1 = y0-j1+G3, z1 = z0-k1+G3;
  const x2 = x0-i2+2*G3, y2 = y0-j2+2*G3, z2 = z0-k2+2*G3;
  const x3 = x0-1+3*G3, y3 = y0-1+3*G3, z3 = z0-1+3*G3;

  const ii = i & 255, jj = j & 255, kk = k & 255;

  let n = 0;
  let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
  if (t0 > 0) { t0 *= t0; const gi = permMod12[ii+perm[jj+perm[kk]]]; n += t0*t0*(grad3[gi][0]*x0+grad3[gi][1]*y0+grad3[gi][2]*z0); }
  let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
  if (t1 > 0) { t1 *= t1; const gi = permMod12[ii+i1+perm[jj+j1+perm[kk+k1]]]; n += t1*t1*(grad3[gi][0]*x1+grad3[gi][1]*y1+grad3[gi][2]*z1); }
  let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
  if (t2 > 0) { t2 *= t2; const gi = permMod12[ii+i2+perm[jj+j2+perm[kk+k2]]]; n += t2*t2*(grad3[gi][0]*x2+grad3[gi][1]*y2+grad3[gi][2]*z2); }
  let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
  if (t3 > 0) { t3 *= t3; const gi = permMod12[ii+1+perm[jj+1+perm[kk+1]]]; n += t3*t3*(grad3[gi][0]*x3+grad3[gi][1]*y3+grad3[gi][2]*z3); }

  return 32 * n;
}

/* ============ CURL NOISE ============ */
const EPS = 0.0001;

function curlNoise(x: number, y: number, z: number): [number, number, number] {
  const dnzy = noise3D(x, y, z + EPS) - noise3D(x, y, z - EPS);
  const dnyz = noise3D(x, y + EPS, z) - noise3D(x, y - EPS, z);
  const dnxz = noise3D(x + EPS, y, z) - noise3D(x - EPS, y, z);
  const dnzx = noise3D(x, y, z + EPS) - noise3D(x, y, z - EPS);
  const dnyx = noise3D(x, y + EPS, z) - noise3D(x, y - EPS, z);
  const dnxy = noise3D(x + EPS, y, z) - noise3D(x - EPS, y, z);

  const e = 1 / (2 * EPS);
  return [
    (dnzy - dnyz) * e,
    (dnxz - dnzx) * e,
    (dnyx - dnxy) * e,
  ];
}

/* ============ FLOW FIELD PARTICLES ============ */
const VERTEX_SHADER = `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aAlpha;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (100.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float glow = 1.0 - smoothstep(0.0, 0.5, d);
    glow = pow(glow, 1.2);
    gl_FragColor = vec4(vColor, vAlpha * glow);
  }
`;

function FlowFieldParticles({ count = 6000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));

  const { viewport } = useThree();

  const onPointerMove = useCallback((e: { clientX: number; clientY: number }) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  // Listen to pointer move on the window
  useMemo(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("pointermove", onPointerMove);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("pointermove", onPointerMove);
      }
    };
  }, [onPointerMove]);

  const { positions, velocities, sizes, colors, alphas } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const col = new Float32Array(count * 3);
    const alp = new Float32Array(count);

    // Color palette: deep indigo → blue → cyan
    const palette = [
      new THREE.Color("#1e1b4b"), // deep indigo
      new THREE.Color("#3730a3"), // indigo-800
      new THREE.Color("#4f46e5"), // indigo-500
      new THREE.Color("#6366f1"), // indigo-400
      new THREE.Color("#818cf8"), // indigo-300
      new THREE.Color("#2563EB"), // blue-600
      new THREE.Color("#60A5FA"), // blue-400
      new THREE.Color("#22d3ee"), // cyan-400
    ];

    for (let i = 0; i < count; i++) {
      // Spawn in a wide ellipsoidal volume
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.5) * 4;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 1.4;
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.8;
      pos[i * 3 + 2] = r * Math.cos(phi) * 0.6;

      vel[i * 3] = 0;
      vel[i * 3 + 1] = 0;
      vel[i * 3 + 2] = 0;

      sz[i] = 0.3 + Math.random() * 0.7;

      // Random color from palette
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      alp[i] = 0.2 + Math.random() * 0.5;
    }

    return { positions: pos, velocities: vel, sizes: sz, colors: col, alphas: alp };
  }, [count]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime * 0.15;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    const colArr = pointsRef.current.geometry.attributes.aColor.array as Float32Array;

    // Mouse position in world space (approx)
    const mx = mouseRef.current.x * viewport.width * 0.5;
    const my = mouseRef.current.y * viewport.height * 0.5;

    const noiseScale = 0.18;
    const flowStrength = 0.008;
    const damping = 0.97;
    const mouseRadius = 2.5;
    const mouseForce = 0.08;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const x = arr[ix];
      const y = arr[ix + 1];
      const z = arr[ix + 2];

      // Curl noise velocity
      const [cx, cy, cz] = curlNoise(
        x * noiseScale + t,
        y * noiseScale + t * 0.7,
        z * noiseScale + t * 0.3
      );

      velocities[ix] += cx * flowStrength;
      velocities[ix + 1] += cy * flowStrength;
      velocities[ix + 2] += cz * flowStrength;

      // Mouse repulsion
      const dx = x - mx;
      const dy = y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouseRadius && dist > 0.01) {
        const force = (1 - dist / mouseRadius) * mouseForce;
        velocities[ix] += (dx / dist) * force;
        velocities[ix + 1] += (dy / dist) * force;
      }

      // Damping
      velocities[ix] *= damping;
      velocities[ix + 1] *= damping;
      velocities[ix + 2] *= damping;

      // Update position
      arr[ix] += velocities[ix];
      arr[ix + 1] += velocities[ix + 1];
      arr[ix + 2] += velocities[ix + 2];

      // Soft boundary — respawn if too far
      const r = Math.sqrt(arr[ix] * arr[ix] + arr[ix+1] * arr[ix+1] + arr[ix+2] * arr[ix+2]);
      if (r > 5.5) {
        const angle = Math.random() * Math.PI * 2;
        const rr = Math.random() * 1.5;
        arr[ix] = Math.cos(angle) * rr;
        arr[ix + 1] = Math.sin(angle) * rr * 0.6;
        arr[ix + 2] = (Math.random() - 0.5) * 1.5;
        velocities[ix] = 0;
        velocities[ix + 1] = 0;
        velocities[ix + 2] = 0;
      }

      // Speed-based color shift — fast particles glow brighter/cyan
      const speed = Math.sqrt(
        velocities[ix] * velocities[ix] +
        velocities[ix+1] * velocities[ix+1] +
        velocities[ix+2] * velocities[ix+2]
      );
      const speedFactor = Math.min(speed * 40, 1);
      // Lerp toward cyan when fast
      colArr[ix] = colArr[ix] * 0.98 + (0.13 + speedFactor * 0.1) * 0.02;
      colArr[ix+1] = colArr[ix+1] * 0.98 + (0.39 + speedFactor * 0.44) * 0.02;
      colArr[ix+2] = colArr[ix+2] * 0.98 + (0.95) * 0.02;
    }

    posAttr.needsUpdate = true;
    pointsRef.current.geometry.attributes.aColor.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} count={count} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} count={count} />
        <bufferAttribute attach="attributes-aAlpha" args={[alphas, 1]} count={count} />
      </bufferGeometry>
    </points>
  );
}

/* ============ MAIN SCENE ============ */
export default function TradingScene() {
  return (
    <SceneErrorBoundary>
      <div className="w-full h-full relative">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: false,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <FlowFieldParticles count={6000} />
          </Suspense>
        </Canvas>
      </div>
    </SceneErrorBoundary>
  );
}
