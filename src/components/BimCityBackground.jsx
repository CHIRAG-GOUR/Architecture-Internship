import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

// Colors for the "Digital BIM" theme
const GRID_COLOR = "#569cd6";
const BG_COLOR = "#1e1e1e";
const LINE_COLOR = "#4ec9b0";
const HIGHLIGHT = "#c586c0";
const WALL_SOLID = "#252526";

// A large digital floor plane
function DigitalGrid() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[100, 100, 50, 50]} />
            <meshBasicMaterial color={BG_COLOR} />
            <meshBasicMaterial color={GRID_COLOR} wireframe={true} transparent opacity={0.2} />
        </mesh>
    );
}

// A digital house model that looks like a BIM massing
function BimHouse({ position = [0, 0, 0], scale = 1, delay = 0 }) {
    const groupRef = useRef();

    useFrame((state) => {
        // Subtle floating effect based on delay to make the digital city feel alive
        if (groupRef.current) {
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={position} scale={scale}>
            <mesh position={[0, 1, 0]} castShadow>
                <boxGeometry args={[4, 2, 6]} />
                <meshStandardMaterial color={WALL_SOLID} roughness={0.5} metalness={0.5} />
                <Edges scale={1.01} color={LINE_COLOR} />
            </mesh>

            {/* Glowing data nodes on the house */}
            <mesh position={[2, 2, 3]}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshBasicMaterial color={HIGHLIGHT} />
            </mesh>
            <mesh position={[-2, 2, -3]}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshBasicMaterial color={HIGHLIGHT} />
            </mesh>
        </group>
    );
}

// A dense city of overlapping BIM massings
function BimCity() {
    const cityData = useMemo(() => {
        const houses = [];
        for (let i = 0; i < 40; i++) {
            const x = (Math.random() - 0.5) * 60;
            const z = (Math.random() - 0.5) * 60;
            const scale = 0.5 + Math.random() * 1.5;
            const delay = Math.random() * Math.PI * 2;
            houses.push({ position: [x, 0, z], scale, delay });
        }
        return houses;
    }, []);

    const groupRef = useRef();
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.02; // Very slow pan
        }
    });

    return (
        <group ref={groupRef}>
            {cityData.map((data, i) => (
                <BimHouse key={i} {...data} />
            ))}
        </group>
    );
}

export default function BimCityBackground() {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: -1, // Keep it behind the content
                background: "radial-gradient(circle at center, #2d2d30 0%, #1e1e1e 100%)", // Dark IDE theme
                pointerEvents: "none",
            }}
        >
            <Canvas
                shadows
                // Isometric orthographic camera
                orthographic
                camera={{ position: [20, 20, 20], zoom: 30, near: -100, far: 500 }}
            >
                <fog attach="fog" args={["#1e1e1e", 30, 100]} />

                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[10, 20, 10]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                    color="#ffffff"
                />
                <directionalLight position={[-10, 10, -10]} intensity={0.5} color="#569cd6" />

                <group position={[0, -5, 0]}>
                    <DigitalGrid />
                    <BimCity />
                </group>
            </Canvas>
        </div>
    );
}
