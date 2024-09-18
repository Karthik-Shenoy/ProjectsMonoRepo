import { API } from "../../API/API";
import { GameState } from "../../App/GameState";
import { interop } from "../../Interop/Interop";
import { RTCManager } from "../../RTC/RTCManager";
import { RTCMessage, RTCMessageSubscriber } from "../../RTC/RTCTypes";
import { HTMLElementIds } from "../../Shared/Constants";

export class MainPageController implements RTCMessageSubscriber {
    private menuPageElement: HTMLDivElement;
    private lobbyPageElement: HTMLDivElement;
    private mainMenuContainer: HTMLDivElement;
    private errorOutputDiv: HTMLDivElement;

    private didCreateGame: boolean;

    constructor(private startGameCallback: () => void) {
        this.mainMenuContainer = document.getElementById(
            HTMLElementIds.mainMenuContainer
        ) as HTMLDivElement;
        this.menuPageElement = document.getElementById(HTMLElementIds.menuPage) as HTMLDivElement;
        this.lobbyPageElement = document.getElementById(HTMLElementIds.lobbyPage) as HTMLDivElement;
        this.errorOutputDiv = document.getElementById(HTMLElementIds.errorOutput) as HTMLDivElement;

        // hide lobby page
        this.hideLobbyPage();
        this.hideError();

        this.attachEventListeners();

        this.didCreateGame = false

        RTCManager.getInstance().addRTCMessageSubscriber(interop.MessageType.INIT, this);
        RTCManager.getInstance().addRTCMessageSubscriber(interop.MessageType.GAME_START_BROADCAST, this);
    }

    public dispose() {
        this.menuPageElement.style.display = "none";
        this.lobbyPageElement.style.display = "none";
        this.mainMenuContainer.style.display = "none";

        this.detachEventListeners();
    }

    public handleRTCMessage(message: RTCMessage): void {
        switch(message.messageType)
        {
            case interop.MessageType.INIT:
                this.addPlayerToList(message.userName);
                return;
            case interop.MessageType.GAME_START_BROADCAST:
                this.dispose();
                this.startGameCallback();
                return;
        }

        
    }

    private switchToLobby = (userName: string, roomCode: string) => {
        if(!this.didCreateGame)
        {
            this.hideStartGameButton();
        }

        this.hideError();

        this.hideMenuPage();
        this.showLobbyPage();

        const roomCodeSpan = document.getElementById(
            HTMLElementIds.roomCodeSpan
        ) as HTMLSpanElement;
        roomCodeSpan.innerText = roomCode;

        this.addPlayerToList(userName);
    };

    private attachEventListeners() {
        const createGameButton = document.getElementById(
            HTMLElementIds.createGameButton
        ) as HTMLButtonElement;
        const joinGameButton = document.getElementById(
            HTMLElementIds.joinGameButton
        ) as HTMLButtonElement;
        const startGameButton = document.getElementById(
            HTMLElementIds.startGameButton
        ) as HTMLButtonElement;

        createGameButton.addEventListener("click", this.createGameHandler);
        joinGameButton.addEventListener("click", this.joinGameHandler);
        startGameButton.addEventListener("click", this.startGameHandler);
    }

    private detachEventListeners() {
        const createGameButton = document.getElementById(
            HTMLElementIds.createGameButton
        ) as HTMLButtonElement;
        const joinGameButton = document.getElementById(
            HTMLElementIds.joinGameButton
        ) as HTMLButtonElement;
        const startGameButton = document.getElementById(
            HTMLElementIds.startGameButton
        ) as HTMLButtonElement;

        createGameButton.removeEventListener("click", this.createGameHandler);
        joinGameButton.removeEventListener("click", this.joinGameHandler);
        startGameButton.removeEventListener("click", this.startGameHandler);
    }

    private createGameHandler = () => {
        this.didCreateGame = true;

        const userNameInputElement = document.getElementById(
            HTMLElementIds.userNameInput
        ) as HTMLInputElement;
        const roomInputElement = document.getElementById(
            HTMLElementIds.roomInput
        ) as HTMLInputElement;
        const [userName, roomId] = [userNameInputElement.value, roomInputElement.value];

        if (userName === "" || roomId === "") {
            this.showError("Please enter a valid username and room id");
            return;
        }

        GameState.getInstance().setLocalPlayerName(userName);

        API.createGame(userName, roomId).then(
            () => {
                this.switchToLobby(userName, roomId);
                const rtcManger = RTCManager.getInstance();

                rtcManger.sendInitSignal(userName, roomId);
            },
            (error) => {
                this.showError(error);
            }
        );
    };

    private joinGameHandler = () => {
        const userNameInputElement = document.getElementById(
            HTMLElementIds.userNameInput
        ) as HTMLInputElement;
        const roomInputElement = document.getElementById(
            HTMLElementIds.roomInput
        ) as HTMLInputElement;
        const [userName, roomId] = [userNameInputElement.value, roomInputElement.value];

        if (userName === "" || roomId === "") {
            this.showError("Please enter a valid username and room id");
        }

        GameState.getInstance().setLocalPlayerName(userName);

        API.joinGame(userName, roomId).then(
            (response: interop.RoomJoinResponse) => {
                this.switchToLobby(userName, roomId);
                const rtcManger = RTCManager.getInstance();

                console.log(response);
                for (const playerName of response.playerList) {
                    this.addPlayerToList(playerName);
                }

                rtcManger.sendInitSignal(userName, roomId);
            },
            (err) => {
                this.showError(err);
            }
        );
    };

    private startGameHandler = () => {
        this.startGameCallback();

        RTCManager.getInstance().sendGameStartSignal();

        this.dispose();
    };

    private showError(error: string) {
        this.errorOutputDiv.style.display = "block";
        this.errorOutputDiv.innerText = error;
    }

    private hideError() {
        this.errorOutputDiv.style.display = "none";
    }

    private hideMenuPage() {
        this.menuPageElement.style.display = "none";
    }

    private hideStartGameButton() {
        const startGameButton = document.getElementById(
            HTMLElementIds.startGameButton
        ) as HTMLButtonElement;
        startGameButton.style.display = "none";
    }

    private addPlayerToList = (playerName: string) => {
        const playerList = document.getElementById(HTMLElementIds.playerList) as HTMLUListElement;
        playerList.appendChild(document.createElement("li")).innerText = playerName;
    };

    private hideLobbyPage() {
        this.lobbyPageElement.style.display = "none";
    }

    private showLobbyPage() {
        this.lobbyPageElement.style.display = "block";
    }
}
