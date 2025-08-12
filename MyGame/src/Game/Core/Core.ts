import { Player } from "../Objects/Player";
import { GameRenderer } from "../Renderer/Renderer";
import { GameState } from "./GameState";
import { InputsManager } from "./InputsManager";
import { MeteorManager } from "./MeteorManager";

export function initializeGame(canvas: HTMLCanvasElement) {
    const player = new Player();

    // initialize the overarching Managers
    const inputsManager = InputsManager.getInstance();
    inputsManager.addHandler(player);

    const meteorManager = new MeteorManager(canvas.width, canvas.height);

    // Initialize the game state
    GameState.instance.updateCanvasDimensions(canvas);
    GameState.instance.addTickHandler(inputsManager);

    // Initialize the game renderer
    GameRenderer.initAndInstance(canvas).addObjectsToDraw(player);
    GameRenderer.getInstance().addRenderDelegate(meteorManager);
    GameRenderer.getInstance().renderLoop();
}
