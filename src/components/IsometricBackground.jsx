import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

// Colors that match the "parchment blueprint" theme
const GRID_COLOR = "#c9a96e";
const BG_COLOR = "#e8dfd5";
const LINE_COLOR = "#8b7355";
const HIGHLIGHT = "#5c4033";
const WALL_SOLID = "#dfd6c8";

// A large floor plane with a grid texture mimicking parchment paper
function ParchmentGrid() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[50, 50, 50, 50]} />
            <meshBasicMaterial color={BG_COLOR} />
            <meshBasicMaterial color={GRID_COLOR} wireframe={true} transparent opacity={0.3} />
        </mesh>
    );
}

// Drifting "architectural blueprints" scattered on the floor
function FloorPlans() {
    const plansInfo = useMemo(() => [
        { pos: [-4, -0.49, -2], rot: 0.2, size: [4, 6] },
        { pos: [5, -0.49, 1], rot: -0.15, size: [5, 4] },
        { pos: [-1, -0.49, 8], rot: 0.05, size: [7, 5] },
    ], []);

    return (
        <group>
            {plansInfo.map((p, i) => (
                <mesh key={i} position={[p.pos[0], p.pos[1], p.pos[2]]} rotation={[-Math.PI / 2, 0, p.rot]}>
                    <planeGeometry args={p.size} />
                    <meshBasicMaterial color="#f8f4ec" />
                    {/* Add a subtle dark blue sketch bounding box to look like drafted paper */}
                    <Edges scale={1} color="#1F3345" />
                </mesh>
            ))}
        </group>
    );
}

// A house model that is "half wireframe, half solid", representing construction
function UnderConstructionHouse() {
    const groupRef = useRef();

    useFrame((state) => {
        // Very slow, majestic rotation to show off the isometric 3D depth
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Solid First Floor Walls */}
            <mesh position={[0, 0, 0]} castShadow>
                <boxGeometry args={[4, 2, 6]} />
                <meshStandardMaterial color={WALL_SOLID} roughness={0.9} />
                <Edges scale={1.01} color={LINE_COLOR} />
            </mesh>

            {/* Wireframe Second Floor extending up */}
            <group position={[0, 2, 0]}>
                <mesh>
                    <boxGeometry args={[4, 2, 6]} />
                    <meshStandardMaterial color={HIGHLIGHT} wireframe transparent opacity={0.3} />
                </mesh>

                {/* Construction beams */}
                {[[-1.9, -1.9], [1.9, -1.9], [-1.9, 1.9], [1.9, 1.9], [1.9, 2.9], [-1.9, 2.9]].map((pos, i) => (
                    <mesh key={i} position={[pos[0], 0, pos[1]]}>
                        <boxGeometry args={[0.1, 2, 0.1]} />
                        <meshStandardMaterial color={HIGHLIGHT} />
                    </mesh>
                ))}
            </group>

            {/* Floating Roof Wireframe */}
            <mesh position={[0, 4, 0]} rotation={[0, 0, 0]}>
                <coneGeometry args={[4.5, 2, 4]} />
                <meshStandardMaterial color={LINE_COLOR} wireframe />
            </mesh>

            {/* Glass Box Element */}
            <mesh position={[2, 1, 0.5]} castShadow>
                <boxGeometry args={[1.5, 2, 1.5]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.4}
                    roughness={0.1}
                    transmission={0.9}
                    thickness={0.5}
                />
            </mesh>
        </group>
    );
}

export default function IsometricBackground() {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: -1, // Keep it behind the content
                background: "linear-gradient(135deg, #e8dfd5 0%, #d9cbb9 100%)", // Warm parchment base
                pointerEvents: "none",
            }}
        >
            <Canvas
                shadows
                // Orthographic camera is crucial for true isometric/axonometric projection
                orthographic
                camera={{ position: [20, 20, 20], zoom: 50, near: -100, far: 500 }}
            >
                <fog attach="fog" args={["#d9cbb9", 20, 100]} />

                <ambientLight intensity={0.7} />
                <directionalLight
                    position={[10, 20, 10]}
                    intensity={1.5}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />
                <directionalLight position={[-10, 10, -10]} intensity={0.5} />

                <group position={[0, -2, 0]}>
                    <ParchmentGrid />
                    <FloorPlans />
                    <UnderConstructionHouse />
                </group>
            </Canvas>
        </div>
    );
}
