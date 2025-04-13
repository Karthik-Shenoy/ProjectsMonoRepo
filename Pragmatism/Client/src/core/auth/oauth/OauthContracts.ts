import { DTO } from "@src/dto/dto";

export type AuthToken = {
    payload: string;
    signature: string;
};


export type AuthCompletionResolver = (userData: DTO.User) => void;
export type AuthFailureRejector = (error: Error) => void;
