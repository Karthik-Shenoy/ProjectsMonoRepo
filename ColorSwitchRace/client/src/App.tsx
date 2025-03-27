import * as React from "react";
import { GameRenderer } from "./Core/GameRenderer";
import { GameOverDialog } from "./Components/Dialogs/GameOverDialog/GameOverDialog";

function App() {
    React.useEffect(() => {
        const renderer = GameRenderer.getInstance();
        renderer.render();
    }, []);
    return (
        <>
            <div className="w-screen h-screen">
                <GameOverDialog />
                <canvas id="game-canvas"></canvas>
            </div>
        </>
    );
}

export default App;
