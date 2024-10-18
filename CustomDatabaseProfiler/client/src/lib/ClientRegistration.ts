import { HeartbeatMessage } from "..//Interop/DatabaseResponse.types";
import { generateRandomNumber } from "./utils";
import { serverUri } from "../SharedConstants";

export type RegisterClientProps = {
    selectedEngine: string;
    setError: (error: string) => void;
};

export const registerClient = async ({
    selectedEngine,
    setError,
}: RegisterClientProps): Promise<string | undefined> => {
    // client registration logic
    try {
        const clientId = (Date.now() + generateRandomNumber(1000000, 2000000)).toString();
        await fetch(`${serverUri}/register`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                clientId,
            } as HeartbeatMessage),
        });

        console.log(selectedEngine);
        setError("");

        return clientId;
    } catch (error) {
        setError("Error registering client");
        return undefined;
    }
};
