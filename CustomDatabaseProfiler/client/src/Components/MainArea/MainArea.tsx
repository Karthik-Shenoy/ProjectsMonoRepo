import * as React from "react";
import { FlexDiv } from "../FlexBox/FlexDiv";
import { GradientButton } from "../Buttons/GradientButton/GradientButton";
import { GradientInput } from "../GradientInput/GradientInput";
import { Label } from "@shadcn-ui/components/ui/label";
import { GradientTable, TableState } from "../GradientTable/GradientTable";
import { useAppContext } from "../../Contexts/AppContext/AppContext";
import {
    DatabaseResponse,
    DatabaseRecord,
    QueryResponse,
    QueryMessage,
} from "../../Interop/DatabaseResponse.types";
import { serverUri } from "../../SharedConstants";

export const MainArea: React.FC = ({}) => {
    const [tableState, setTableState] = React.useState<TableState>("loading");
    const [queryResponse, setQueryResponse] = React.useState<DatabaseRecord[]>([]);

    const queryInput = React.useRef<HTMLInputElement>(null);
    const appContextData = useAppContext();

    const onClick = () => {
        console.log("cookie:", document.cookie);
        setTableState("loading");
        if (queryInput.current) {
            fetch(`${serverUri}/query`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: queryInput.current.value,
                    clientId: appContextData.clientId,
                } as QueryMessage),
            })
                .then((res) => {
                    return res.json() as Promise<DatabaseResponse>;
                })
                .then((data) => {
                    const profiles = [...appContextData.queyProfiles];
                    profiles.push(data);
                    appContextData.setQueryProfiles(profiles);

                    const queryResponse = JSON.parse(data.queryResponse) as QueryResponse;
                    if (queryResponse.successful === true) {
                        setQueryResponse(() =>
                            queryResponse.record ? [queryResponse.record] : []
                        );
                        setTableState("success");
                    }

                    if (queryResponse.successful === false) {
                        setTableState("error");
                    }
                });
        }
    };

    return (
        <div className="flex flex-col w-9/12 h-screen items-center justify-start">
            <FlexDiv className="gap-y-4 mt-[100px] transition-all duration-700">
                <Label htmlFor="query-input" className="text-xl">
                    Enter DB Query
                </Label>
                <FlexDiv horizontal className="items-center gap-x-4">
                    <GradientInput
                        placeholder="DB Query"
                        wrapperClassName="w-[400px]"
                        className="text-lg"
                        id="query-input"
                        ref={queryInput}
                    />
                    <GradientButton text="Query DB" className="px-4 py-2" onClick={onClick} />
                </FlexDiv>
                <GradientTable
                    wrapperClassName="w-full"
                    tableState={tableState}
                    tableData={queryResponse}
                />
            </FlexDiv>
        </div>
    );
};
