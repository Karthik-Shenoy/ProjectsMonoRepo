import { ComputerIcon, Cpu, Database, Network, ServerIcon } from "lucide-react";
import { Image } from "../../Components/Image/Image";
import { LayerNodeProps } from "./Components/LayerNode";

export const layeredViewData: LayerNodeProps[] = [
    {
        text: "Client App",
        icon: <ComputerIcon width={32} height={32} />,
        languageImg: <Image src="./react.png" width={32} height={32} />,
    },
    {
        text: "HTTP Layer",
        icon: <ServerIcon width={32} height={32} />,
        languageImg: <Image src="./go.svg" width={32} height={32} />,
    },
    {
        text: "UDP Layer",
        icon: <Network width={32} height={32} />,
        languageImg: <Image src="./go.svg" width={32} height={32} />,
    },
    {
        text: "UDP Layer",
        icon: <Network width={32} height={32} />,
        languageImg: <Image src="./cpp.png" width={32} height={32} />,
    },
    {
        text: "Query Parser",
        icon: <Cpu width={32} height={32} />,
        languageImg: <Image src="./cpp.png" width={32} height={32} />,
    },
    {
        text: "Database Layer",
        icon: <Database width={32} height={32} />,
        languageImg: <Image src="./cpp.png" width={32} height={32} />,
    },
    {
        text: "Storage Engine",
        icon: <Database width={32} height={32} />,
        languageImg: <Image src="./cpp.png" width={32} height={32} />,
    },
];
