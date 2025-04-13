import { Button } from "@shadcn/components/ui/button";
import { useNavigate } from "react-router";

const HomePage = () => {
    const navigate = useNavigate()

    const onStartSolvingClicked = () => {
        navigate("/tasks")
    }

    return (
        <div 
            className="relative flex flex-col items-center justify-center h-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_rgba(76,29,149,0.6),_rgba(100,40,0,0.1))]">
           

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
