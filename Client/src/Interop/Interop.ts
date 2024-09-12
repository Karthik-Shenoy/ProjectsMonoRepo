export namespace interop {
    export enum MessageType {
        INIT = 0,
        GAME_START,
        WORD,
        DEATH,
        GAME_START_BROADCAST,
    }

    export interface InitMessage {
        messageType: MessageType.INIT;
        userName: string;
        roomId: string;
    }

    export interface GameStartMessage {
        messageType: MessageType.GAME_START;
    }

    export interface WordMessage {
        messageType: MessageType.WORD;
        word: string;
        userName: string;
    }

    export interface DeathMessage {
        messageType: MessageType.DEATH;
    }

    export interface GameStartBroadcastMessage {
        messageType: MessageType.GAME_START_BROADCAST;
        positionMap: {
            [key: string]: number
        };
    }

    export interface RoomJoinResponse {
        playerList: string[];
    }

    export interface IsWordValidResponse {
        isValid: boolean;
    }
}
