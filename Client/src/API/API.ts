import { interop } from "../Interop/Interop";
import { GAME_SERVER_URL } from "../Shared/Constants";

export namespace API {
    export const createGame = async (userName: string, roomId: string) => {
        const response = await fetch(`${GAME_SERVER_URL}/create-room`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName,
                roomId,
            }),
        });
        switch (response.status) {
            case 200: {
                return response;
            }
            case 400: {
                throw new Error("Room already exists");
            }
            default: {
                throw new Error("Some network issue occurred");
            }
        }
    };

    export const joinGame = async (
        userName: string,
        roomId: string
    ): Promise<interop.RoomJoinResponse> => {
        const response = await fetch(`${GAME_SERVER_URL}/join-room`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName,
                roomId,
            }),
        });
        switch (response.status) {
            case 200: {
                return await response.json() as interop.RoomJoinResponse;
            }
            case 400: {
                throw new Error("Room does not exist");
            }
            default: {
                throw new Error("Some network issue occurred");
            }
        }
    };

    export const isWordValid = async (
        word: string,
    ): Promise<interop.IsWordValidResponse> => {
        const response = await fetch(`${GAME_SERVER_URL}/isWordValid`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                word
            }),
        });
        switch (response.status) {
            case 200: {
                return await response.json() as interop.IsWordValidResponse;
            }
            default: {
                throw new Error("Some network issue occurred");
            }
        }
    };
}
