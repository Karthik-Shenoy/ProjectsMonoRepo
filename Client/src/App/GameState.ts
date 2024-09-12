import { IDrawable } from "../Contracts/RendererContracts";
import { PlayerController } from "../Controllers/PlayerController";
import { RoundController } from "../Controllers/RoundController";
import { interop } from "../Interop/Interop";
import { GameRenderer } from "../Renderer/GameRenderer";
import { RTCManager } from "../RTC/RTCManager";
import { RTCMessage, RTCMessageSubscriber } from "../RTC/RTCTypes";
import { App } from "./App";

/**
 * - Holds the state of the entire game
 * - Synced with the server
 */
export class GameState implements RTCMessageSubscriber {
    private static instance: GameState | undefined;
    private localPlayerController: PlayerController | null;

    private _drawableObjectsList: IDrawable[];

    public static getInstance() {
        if (!this.instance) {
            throw Error("Game state is not initialized");
        }
        return this.instance;
    }

    public static init(roundController: RoundController, localPlayerUsername: string) {
        this.instance = new GameState(roundController, localPlayerUsername);
    }

    public get drawableObjectsList() {
        return this._drawableObjectsList;
    }

    public get canvasDimensions() {
        return GameRenderer.getInstance().canvasDimensions;
    }

    public addDrawableObject(drawableObject: IDrawable) {
        this._drawableObjectsList.push(drawableObject);
    }

    public addPlayer(playerController: PlayerController) {
        this.addDrawableObject(playerController);
        this.roundController.addPlayer(playerController);
    }

    public setLocalPlayerName(userName: string) {
        this.localPlayerUsername = userName;
        this.localPlayerController?.setUserName(userName);
    }

    public getLocalPlayerName(): string {
        return this.localPlayerUsername;
    }

    public handleRTCMessage(message: RTCMessage) {
        if (message.messageType === interop.MessageType.GAME_START_BROADCAST) {
            Object.keys(message.positionMap).forEach(() => {
                const remotePlayerController = new PlayerController();
                remotePlayerController.setRemotePlayer();
                this.addPlayer(remotePlayerController);
            });

            Object.keys(message.positionMap).forEach((username) => {
                const position = message.positionMap[username];
                if (username == this.localPlayerUsername) {
                    this.localPlayerController = this.roundController.getPlayerAtPosition(position);
                    this.localPlayerController.setLocalPlayer();
                }
                this.roundController.getPlayerAtPosition(position).setUserName(username);
            });
        }
        // start round and rendering
        this.roundController.startRound();
        GameRenderer.getInstance().render();
    }

    private constructor(
        private roundController: RoundController,
        private localPlayerUsername: string
    ) {
        this._drawableObjectsList = [];
        this.localPlayerController = null;

        RTCManager.getInstance().addRTCMessageSubscriber(
            interop.MessageType.GAME_START_BROADCAST,
            this
        );
    }
}
