import { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Edges, OrbitControls, DragControls } from "@react-three/drei";
import * as THREE from "three";
import ScrollReveal from "../ScrollReveal";

function SandboxItem({ type, position, color, size }) {
    if (type === "tree") {
        return (
            <group position={position}>
                {/* Trunk */}
                <mesh position={[0, 0.5, 0]} castShadow>
                    <cylinderGeometry args={[0.2, 0.2, 1]} />
                    <meshStandardMaterial color="#5c4033" />
                </mesh>
                {/* Leaves */}
                <mesh position={[0, 1.5, 0]} castShadow>
                    <coneGeometry args={[1, 1.5, 4]} />
                    <meshStandardMaterial color="#2e7d32" roughness={0.9} />
                    <Edges scale={1.01} color="#1b5e20" />
                </mesh>
            </group>
        );
    }

    if (type === "house") {
        return (
            <group position={position}>
                {/* Base */}
                <mesh position={[0, 0.75, 0]} castShadow>
                    <boxGeometry args={[2, 1.5, 2]} />
                    <meshStandardMaterial color={color} roughness={0.7} />
                    <Edges scale={1.01} color="#3e2a21" />
                </mesh>
                {/* Roof */}
                <mesh position={[0, 2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
                    <coneGeometry args={[1.8, 1, 4]} />
                    <meshStandardMaterial color="#8b7355" roughness={0.8} />
                    <Edges scale={1.01} color="#3e2a21" />
                </mesh>
            </group>
        );
    }

    // Default: Box
    const [w, h, d] = size || [2, 1, 2];
    return (
        <group position={position}>
            <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[w, h, d]} />
                <meshStandardMaterial color={color} roughness={0.7} transparent opacity={0.9} />
                <Edges scale={1.01} color="#3e2a21" />
            </mesh>
        </group>
    );
}

export default function IsometricExtruder() {
    const [orbitEnabled, setOrbitEnabled] = useState(true);
    const [items, setItems] = useState([
        { id: "1", type: "box", position: [-2, 0, 2], size: [2, 1.5, 3], color: "#85ABAB" },
        { id: "2", type: "house", position: [2, 0, -2], color: "#e0a96d" },
        { id: "3", type: "tree", position: [-3, 0, -3], color: "#2e7d32" }
    ]);

    const handleDragStart = () => setOrbitEnabled(false);
    const handleDragEnd = () => setOrbitEnabled(true);

    const spawnItem = (type) => {
        const colors = ["#85ABAB", "#e0a96d", "#c97a7e", "#8b7355", "#dfd6c8"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setItems([
            ...items,
            {
                id: Math.random().toString(),
                type,
                position: [0, 0, 0], // Spawn in center
                color: type === "tree" ? "#2e7d32" : randomColor,
                size: [2, 1 + Math.random(), 2]
            }
        ]);
    };

    return (
        <div className="section-gap">
            <ScrollReveal className="content-card">
                <div style={{ textAlign: "center" }}>
                    <h3 style={{ color: "#5c4033", marginBottom: "0.5rem" }}>Isometric Sandbox</h3>
                    <p style={{ color: "#8b7355", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                        Drag and drop items to build your own <strong>Plan Oblique</strong> 3D neighborhood.
                        Notice how the forms retain their true shape on the grid!
                    </p>

                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
                        <button
                            onClick={() => spawnItem("box")}
                            style={{ padding: "0.5rem 1rem", background: "#f0efe9", border: "2px solid #c9a96e", borderRadius: "6px", color: "#5c4033", fontWeight: "bold", cursor: "pointer" }}
                        >
                            + Add Box Volume
                        </button>
                        <button
                            onClick={() => spawnItem("house")}
                            style={{ padding: "0.5rem 1rem", background: "#f0efe9", border: "2px solid #e0a96d", borderRadius: "6px", color: "#5c4033", fontWeight: "bold", cursor: "pointer" }}
                        >
                            + Add House Form
                        </button>
                        <button
                            onClick={() => spawnItem("tree")}
                            style={{ padding: "0.5rem 1rem", background: "#e8f5e9", border: "2px solid #81c784", borderRadius: "6px", color: "#2e7d32", fontWeight: "bold", cursor: "pointer" }}
                        >
                            + Add Tree
                        </button>
                    </div>

                    <div
                        style={{
                            height: "500px",
                            border: "2px solid #d9c4a5",
                            borderRadius: "8px",
                            overflow: "hidden",
                            background: "#dfd6c8",
                            position: "relative"
                        }}
                    >
                        <Canvas orthographic camera={{ position: [10, 10, 10], zoom: 50, near: -100, far: 500 }} shadows>
                            <ambientLight intensity={0.7} />
                            <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />

                            {/* Grid Floor */}
                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
                                <planeGeometry args={[30, 30]} />
                                <meshBasicMaterial color="#d9cbb9" />
                                <gridHelper args={[30, 30, "#c9a96e", "#e8dfd5"]} rotation={[Math.PI / 2, 0, 0]} />
                            </mesh>

                            <DragControls
                                axisLock="y"         // Keep items on the floor (disable Y drag)
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            >
                                {items.map((item) => (
                                    <SandboxItem key={item.id} {...item} />
                                ))}
                            </DragControls>

                            <OrbitControls
                                enabled={orbitEnabled}
                                enableZoom={true}
                                enablePan={false}
                                minPolarAngle={Math.PI / 6}
                                maxPolarAngle={Math.PI / 3}
                            />
                        </Canvas>

                        <div style={{
                            position: "absolute", bottom: "1rem", left: "50%", transform: "translateX(-50%)",
                            background: "rgba(255,255,255,0.7)", padding: "0.5rem 1rem", borderRadius: "20px",
                            fontSize: "0.85rem", color: "#5c4033", pointerEvents: "none", fontWeight: 600
                        }}>
                            Click &amp; Drag objects to move them!
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    );
}
