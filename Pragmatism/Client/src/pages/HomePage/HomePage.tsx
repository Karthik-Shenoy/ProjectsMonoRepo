import { Button } from "@shadcn/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const HomePage = () => {
    const navigate = useNavigate()

    const [positions, setPositions] = useState([
        { top: 20, left: 10 },
        { top: 50, left: 70 },
        { top: 90, left: 80 },
    ]);
    const [directions, setDirections] = useState([
        { dx: 0.05, dy: 0.05 },
        { dx: -0.05, dy: 0.05 },
        { dx: 0.05, dy: -0.05 },
    ])

    useEffect(() => {
        const updatePositions = () => {
            setPositions((positions) => {
                return positions.map((pos, index) => {
                    const direction = directions[index];
                    let newTop = pos.top + direction.dy * 2; // Adjust speed as needed
                    let newLeft = pos.left + direction.dx * 2;
                    if (newTop <= 0 || newTop >= 100) {
                        newTop = Math.max(0, Math.min(100, newTop));
                    }
                    if (newLeft <= 0 || newLeft >= 100) {
                        newLeft = Math.max(0, Math.min(100, newLeft));
                    }
                    return { top: newTop, left: newLeft };
                });
            });

            setDirections((directions) => {
                return directions.map((dir, index) => {
                    const newDir = { ...dir };
                    // Reverse direction if hitting edges and ensure movement away from edges
                    if (positions[index].top <= 0 || positions[index].top >= 100) {
                        newDir.dy = positions[index].top <= 0 ? Math.abs(newDir.dy) : -Math.abs(newDir.dy);
                        newDir.dy = newDir.dy === 0 ? (Math.random() * 0.01 + 0.01) : newDir.dy; // Ensure non-zero
                    }
                    if (positions[index].left <= 0 || positions[index].left >= 100) {
                        newDir.dx = positions[index].left <= 0 ? Math.abs(newDir.dx) : -Math.abs(newDir.dx);
                        newDir.dx = newDir.dx === 0 ? (Math.random() * 0.01 + 0.01) : newDir.dx; // Ensure non-zero
                    }
                    return newDir;
                });
            })
        };

        const interval = setInterval(updatePositions, 24); // Adjust interval as needed
        return () => clearInterval(interval);
    }, [directions]);

    const onStartSolvingClicked = () => {
        navigate("/tasks")
    }

    return (
        <div className="relative flex flex-col items-center justify-center h-full overflow-hidden bg-gradient-to-br from-background via-purple-900 to-background">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-50"
                    style={{
                        top: `${positions[0].top}%`,
                        left: `${positions[0].left}%`,
                        transform: "translate(-50%, -50%)",
                    }}
                ></div>
                <div
                    className="absolute w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-50"
                    style={{
                        top: `${positions[1].top}%`,
                        left: `${positions[1].left}%`,
                        transform: "translate(-50%, -50%)",
                    }}
                ></div>
                <div
                    className="absolute w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-50"
                    style={{
                        top: `${positions[2].top}%`,
                        left: `${positions[2].left}%`,
                        transform: "translate(-50%, -50%)",
                    }}
                ></div>
            </div>
            {/* Hero Section */}
            <div className="relative text-center max-w-4xl p-8 pointer-events-auto">
                <h1 className="text-5xl font-bold text-white">
                    Master System Design with Pragmatism!
                </h1>
                <p className="mt-4 text-lg text-white">
                    Solve problems inspired by real-world scenarios and system design concepts.
                    Enhance your skills and prepare for interviews with hands-on challenges.
                </p>
                <div className="mt-6 flex justify-center space-x-4">
                    <Button size="lg" className="cursor-pointer" onClick={onStartSolvingClicked}>
                        Start solving!
                    </Button>
                    <Button variant="outline" size="lg" className="cursor-pointer">
                        Learn More
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
