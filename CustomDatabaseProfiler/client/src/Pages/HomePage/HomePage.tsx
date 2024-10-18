import React from "react";
import { FlexDiv, FlexItem } from "../../Components/FlexBox";
import { Combobox } from "../../Components/Combobox";
import { GradientButton } from "../../Components/Buttons/GradientButton/GradientButton";
import { registerClient } from "../../lib/ClientRegistration";
import { useAppContext } from "../../Contexts/AppContext/AppContext";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../Components/Loader/Loader";

export const HomePage: React.FC = () => {
    const [selectedEngine, setSelectedEngine] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");
    const { clientId, storageEngine, setClientId, setStorageEngine } = useAppContext();
    const navigate = useNavigate();

    const onSpawnDBClicked = async () => {
        if (!selectedEngine) {
            setError("Please select a storage engine.");
            return;
        }
        // clear error
        setError("");

        // client registration logic
        try {
            setIsLoading(true);
            const clientId = await registerClient({ selectedEngine, setError });
            setIsLoading(false);
            if (!clientId) {
                return;
            }
            setClientId(clientId);
            setStorageEngine(selectedEngine);

            navigate("/db");
        } catch (error) {
            setError("Some error occurred registering client, please try again.");
        }
    };

    React.useEffect(() => {
        setIsLoading(false);
        if (clientId && storageEngine) {
            navigate("/db");
        }
    }, [clientId, storageEngine]);

    return (
        <div>
            <FlexDiv className="justify-center items-center gap-y-8 transition-all duration-300">
                <FlexItem className="flex flex-col justify-center items-center">
                    <h1 className="text-6xl font-sans font-bold">Custom Database</h1>
                    <h1 className="text-2xl font-sans font-light">
                        Welcome to your personalized database experience. Choose the storage engine
                        that best fits your needs.
                    </h1>
                </FlexItem>
                <FlexDiv horizontal className="gap-x-4">
                    <FlexItem className="flex flex-col items-center justify-center">
                        <Combobox
                            onChange={(value) => {
                                setSelectedEngine(value);
                            }}
                        />
                    </FlexItem>
                    <GradientButton text="Spawn DB" onClick={onSpawnDBClicked}></GradientButton>
                </FlexDiv>
                {error && <p className="text-red-500 text-lg">{error}</p>}
                {isLoading && <Loader height={60} width={60} />}
            </FlexDiv>
        </div>
    );
};
