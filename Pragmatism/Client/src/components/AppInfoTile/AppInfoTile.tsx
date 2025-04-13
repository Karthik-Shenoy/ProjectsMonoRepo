import { CloudAlertIcon, InfoIcon } from "lucide-react"
import { FlexDiv, FlexItem } from "../FlexBox"
import { Typography } from "../Typography"

export enum TileType {
    Error,
    NoData,
}

export type TileSize = 8 | 16 | 32 | 64 | 96 | 128 | 256

export type AppInfoTileProps = {
    tileType: TileType
    description?: string
    size: TileSize
}

export const AppInfoTile: React.FC<AppInfoTileProps> = ({ tileType, description, size }) => {
    let icon = <InfoIcon />

    switch (tileType) {
        case TileType.Error:
            icon = <CloudAlertIcon size={size} className="text-red-700" />;
            break;
        case TileType.NoData:
            icon = <InfoIcon size={size} />;
            break;
    }

    return (
        <>
            <FlexDiv horizontal={false} className="justify-center items-center gap-y-3">
                <FlexItem>
                    {icon}
                </FlexItem>
                <FlexItem>
                    {description &&
                        <Typography variant="caption">
                            {description}
                        </Typography>
                    }
                </FlexItem>
            </FlexDiv>
        </>
    )
}