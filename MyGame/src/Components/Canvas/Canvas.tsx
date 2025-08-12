import * as React from 'react';


export const Canvas: React.FC = () => {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const canvasDivRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const canvasDiv = canvasDivRef.current;

        if (!canvas || !canvasDiv) {
            throw Error("CanvasInitializationFailed")
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw Error("CanvasContextInitializationFailed")
        }

        // Set the canvas size
        canvas.width = canvasDiv.clientWidth;
        canvas.height = canvasDiv.clientHeight;
        
        // Initialize the game renderer
        import('../../Game/Core/Core').then(({ initializeGame }) => {
            initializeGame(canvas);
        }).catch((error) => {
            console.error("Error initializing the game:", error);
        });

    }, [])

    return (
        <div className="w-11/12 h-11/12" id="canvas-div" ref={canvasDivRef}>
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}