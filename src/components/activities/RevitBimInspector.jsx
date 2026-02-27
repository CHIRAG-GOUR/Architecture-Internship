import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Edges } from "@react-three/drei";
import ScrollReveal from "../ScrollReveal";

const BIM_DATA = {
    wall: {
        category: "Basic Wall",
        type: "Exterior - Brick on CMU",
        cost: "$250 / sq.m",
        fireRating: "2 Hours",
        thermalResistance: "R-20",
        manufacturer: "Generic Construction",
        structural: "Yes"
    },
    window: {
        category: "Window",
        type: "Fixed - Aluminum Double Glazed",
        cost: "$850 / unit",
        fireRating: "N/A",
        thermalResistance: "U-Factor 0.28",
        manufacturer: "Pella Windows",
        structural: "No"
    },
    door: {
        category: "Door",
        type: "Single Flush Solid Core",
        cost: "$450 / unit",
        fireRating: "60 mins",
        thermalResistance: "R-5",
        manufacturer: "Masonite",
        structural: "No"
    }
};

export default function RevitBimInspector() {
    const [selectedObject, setSelectedObject] = useState(null);

    const handleSelect = (key) => (e) => {
        e.stopPropagation();
        setSelectedObject(BIM_DATA[key]);
    };

    return (
        <div className="section-gap">
            <ScrollReveal className="content-card">
                <div style={{ textAlign: "center" }}>
                    <h3 style={{ color: "#5c4033", marginBottom: "0.5rem" }}>Revit BIM Inspector</h3>
                    <p style={{ color: "#8b7355", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                        In BIM, a wall isn't just lines—it's a database containing <strong>Information</strong>. Click the elements below to inspect their embedded data properties.
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
                        {/* 3D Model */}
                        <div style={{
                            flex: "1 1 300px", height: "400px", border: "2px solid #d9c4a5", borderRadius: "8px", overflow: "hidden", background: "#f0efe9", cursor: "pointer"
                        }}>
                            <Canvas camera={{ position: [5, 3, 5], fov: 40 }} shadows>
                                <ambientLight intensity={0.6} />
                                <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />

                                <group position={[0, -1, 0]}>
                                    {/* Wall */}
                                    <mesh position={[0, 1, 0]} castShadow receiveShadow onClick={handleSelect("wall")}>
                                        <boxGeometry args={[4, 2, 0.4]} />
                                        <meshStandardMaterial color={selectedObject === BIM_DATA.wall ? "#c9a96e" : "#dfd6c8"} />
                                        <Edges color="#8b7355" />
                                    </mesh>

                                    {/* Window */}
                                    <mesh position={[-0.8, 1.2, 0.05]} castShadow receiveShadow onClick={handleSelect("window")}>
                                        <boxGeometry args={[1, 1, 0.5]} />
                                        <meshPhysicalMaterial color="#85ABAB" transmission={0.8} opacity={1} transparent roughness={0.1} emissive={selectedObject === BIM_DATA.window ? "#c9a96e" : "#000"} emissiveIntensity={0.2} />
                                        <Edges color="#1F3345" />
                                    </mesh>

                                    {/* Door */}
                                    <mesh position={[1, 0.5, 0.05]} castShadow receiveShadow onClick={handleSelect("door")}>
                                        <boxGeometry args={[0.9, 1.5, 0.45]} />
                                        <meshStandardMaterial color={selectedObject === BIM_DATA.door ? "#c9a96e" : "#8b7355"} />
                                        <Edges color="#3e2a21" />
                                    </mesh>
                                </group>

                                <OrbitControls makeDefault enableZoom={true} />
                            </Canvas>
                        </div>

                        {/* Properties Panel */}
                        <div style={{
                            flex: "1 1 300px", background: "#faf7f2", border: "1px solid #d9cbb9", borderRadius: "8px", padding: "1.5rem", textAlign: "left"
                        }}>
                            <h4 style={{ color: "#5c4033", borderBottom: "2px solid #c9a96e", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                                Properties {selectedObject ? `: ${selectedObject.category}` : "(Select an object)"}
                            </h4>

                            {selectedObject ? (
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                                    <tbody>
                                        {Object.entries(selectedObject).map(([key, val]) => (
                                            <tr key={key} style={{ borderBottom: "1px solid #ece2d2" }}>
                                                <td style={{ padding: "0.5rem 0", fontWeight: 600, color: "#8b7355", textTransform: "capitalize" }}>{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                                                <td style={{ padding: "0.5rem 0", color: "#4a3728", textAlign: "right" }}>{val}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p style={{ color: "#8b7355", fontStyle: "italic", fontSize: "0.9rem" }}>
                                    Hover and click on the Wall, Window, or Door in the 3D view to reveal its embedded building data.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    );
}
