import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, TorusKnot, Edges } from "@react-three/drei";
import ScrollReveal from "../ScrollReveal";

export default function RhinoNurbsDemo() {
    const [tube, setTube] = useState(0.4);
    const [tubularSegments, setTubularSegments] = useState(64);
    const [p, setP] = useState(2);
    const [q, setQ] = useState(3);

    return (
        <div className="section-gap">
            <ScrollReveal className="content-card">
                <div style={{ textAlign: "center" }}>
                    <h3 style={{ color: "#5c4033", marginBottom: "0.5rem" }}>Rhino NURBS Sculptor</h3>
                    <p style={{ color: "#8b7355", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                        Unlike CAD's straight lines, Rhino uses <strong>NURBS</strong> to mathematically calculate perfect, smooth organic surfaces. Adjust the parameters below to sculpt the form.
                    </p>

                    {/* Controls */}
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                        <label style={{ display: "flex", flexDirection: "column", fontSize: "0.85rem", fontWeight: 600, color: "#8b7355" }}>
                            Thickness
                            <input type="range" min="0.1" max="1" step="0.1" value={tube} onChange={e => setTube(parseFloat(e.target.value))} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", fontSize: "0.85rem", fontWeight: 600, color: "#8b7355" }}>
                            Complexity (P)
                            <input type="range" min="1" max="5" step="1" value={p} onChange={e => setP(parseInt(e.target.value))} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", fontSize: "0.85rem", fontWeight: 600, color: "#8b7355" }}>
                            Twists (Q)
                            <input type="range" min="1" max="10" step="1" value={q} onChange={e => setQ(parseInt(e.target.value))} />
                        </label>
                    </div>

                    <div style={{
                        height: "400px", border: "2px solid #d9c4a5", borderRadius: "8px", overflow: "hidden", background: "#fdfbf7"
                    }}>
                        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[10, 10, 10]} intensity={1} />
                            <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#c9a96e" />

                            <TorusKnot args={[2, tube, tubularSegments, 16, p, q]}>
                                <meshPhysicalMaterial
                                    color="#ffffff"
                                    roughness={0.1}
                                    metalness={0.1}
                                    clearcoat={1}
                                    transmission={0.5}
                                    thickness={0.5}
                                />
                                {/* Show the underlying NURBS grid mathematically */}
                                <Edges scale={1.0} color="#85ABAB" threshold={15} />
                            </TorusKnot>

                            <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} />
                        </Canvas>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    );
}
