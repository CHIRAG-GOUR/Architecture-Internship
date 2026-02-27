import { useState, useRef, useEffect } from "react";
import ScrollReveal from "../ScrollReveal";

export default function CanvasCADSimulator() {
    const canvasRef = useRef(null);
    const [lines, setLines] = useState([]); // [{x1, y1, x2, y2}]
    const [commandLog, setCommandLog] = useState(["AutoCAD Web Simulator initialized."]);
    const [currentInput, setCurrentInput] = useState("");
    const [state, setState] = useState("IDLE"); // IDLE, WAIT_P1, WAIT_P2
    const [p1, setP1] = useState(null);

    // Draw the CAD grid and lines
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;

        // Black background
        ctx.fillStyle = "#1e1e1e";
        ctx.fillRect(0, 0, w, h);

        // Grid (dark grey)
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 50) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 0; y < h; y += 50) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // Draw saved lines (AutoCAD green)
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 2;
        lines.forEach(l => {
            ctx.beginPath();
            ctx.moveTo(l.x1, h - l.y1); // Invert Y to match CAD coords (0,0 at bottom left)
            ctx.lineTo(l.x2, h - l.y2);
            ctx.stroke();
        });

        // Draw axis icon
        ctx.strokeStyle = "#ff0000"; // X red
        ctx.beginPath(); ctx.moveTo(20, h - 20); ctx.lineTo(50, h - 20); ctx.stroke();
        ctx.strokeStyle = "#00ff00"; // Y green
        ctx.beginPath(); ctx.moveTo(20, h - 20); ctx.lineTo(20, h - 50); ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.font = "10px monospace";
        ctx.fillText("X", 55, h - 17);
        ctx.fillText("Y", 17, h - 55);

    }, [lines]);

    const handleCommand = (e) => {
        if (e.key === "Enter") {
            const val = currentInput.trim().toUpperCase();
            setCurrentInput("");

            const newLog = [...commandLog, `Command: ${val}`];

            if (state === "IDLE") {
                if (val === "LINE" || val === "L") {
                    setState("WAIT_P1");
                    newLog.push("Specify first point (x,y):");
                } else if (val === "CLEAR") {
                    setLines([]);
                    newLog.push("Canvas cleared.");
                } else {
                    newLog.push(`Unknown command "${val}". Try "LINE" or "CLEAR".`);
                }
            } else if (state === "WAIT_P1") {
                const coords = val.split(",");
                if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                    setP1({ x: parseFloat(coords[0]), y: parseFloat(coords[1]) });
                    setState("WAIT_P2");
                    newLog.push("Specify next point (x,y):");
                } else {
                    newLog.push("Invalid point. Format must be X,Y (e.g., 50,50):");
                }
            } else if (state === "WAIT_P2") {
                const coords = val.split(",");
                if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                    const p2 = { x: parseFloat(coords[0]), y: parseFloat(coords[1]) };
                    setLines([...lines, { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y }]);
                    setState("IDLE");
                    newLog.push("Line added.");
                } else {
                    newLog.push("Invalid point. Format must be X,Y:");
                }
            }

            setCommandLog(newLog.slice(-5)); // Keep last 5 logs
        }
    };

    return (
        <div className="section-gap">
            <ScrollReveal className="content-card">
                <div style={{ textAlign: "center" }}>
                    <h3 style={{ color: "#5c4033", marginBottom: "0.5rem" }}>AutoCAD Web Simulator</h3>
                    <p style={{ color: "#8b7355", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                        Experience geometry-based drafting. Type <strong>LINE</strong> in the command prompt below, then enter coordinates like <code>50,50</code> and <code>250,250</code> to draw.
                    </p>

                    <div style={{
                        border: "2px solid #555",
                        borderRadius: "8px",
                        overflow: "hidden",
                        background: "#1e1e1e",
                        display: "flex",
                        flexDirection: "column",
                        maxWidth: "600px",
                        margin: "0 auto"
                    }}>
                        {/* Drawing Canvas */}
                        <canvas
                            ref={canvasRef}
                            width={600}
                            height={400}
                            style={{ width: "100%", height: "auto", display: "block", cursor: "crosshair" }}
                        />

                        {/* Command Line Interface */}
                        <div style={{ background: "#252526", borderTop: "2px solid #333", padding: "0.5rem", textAlign: "left", fontFamily: "monospace", fontSize: "0.9rem", color: "#d4d4d4" }}>
                            {commandLog.map((log, i) => (
                                <div key={i} style={{ opacity: i === commandLog.length - 1 ? 1 : 0.6 }}>{log}</div>
                            ))}
                            <div style={{ display: "flex", marginTop: "0.5rem" }}>
                                <span style={{ marginRight: "0.5rem", color: "#569cd6" }}>Command:</span>
                                <input
                                    type="text"
                                    value={currentInput}
                                    onChange={(e) => setCurrentInput(e.target.value)}
                                    onKeyDown={handleCommand}
                                    style={{
                                        background: "transparent", border: "none", color: "#fff", outline: "none",
                                        fontFamily: "monospace", fontSize: "0.9rem", flex: 1
                                    }}
                                    placeholder="Type LINE or CLEAR here..."
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    );
}
