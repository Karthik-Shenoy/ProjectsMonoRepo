import * as React from "react";
import { MainArea } from "../../Components/MainArea/MainArea";
import { SidePane } from "../../Components/SidePane/SidePane";
import { useAppContext } from "../../Contexts/AppContext/AppContext";
import { useNavigate } from "react-router-dom";

export const DatabasePage: React.FC = () => {
    const { clientId, storageEngine } = useAppContext();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!clientId || !storageEngine) {
            navigate("/");
        }
    }, [clientId, storageEngine]);

    return (
        <>
            {/* main area */}
            <MainArea />
            <SidePane />
        </>
    );
};
