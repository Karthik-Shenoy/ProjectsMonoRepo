import * as React from "react"
import { PracticeScreen, HistoryScreen } from "./Screens";
import { ControllerComponentIds } from "src/Controllers/SharedConstants";
import { IAppController } from "src/Controllers/Contracts/IAppController";
import { BaseScreenProps, ScreenNames } from "src/ViewControllerInterop/SharedTypes";
import { PracticeScreenProps } from "./Screens/PracticeScreen/PracticeScreen.props";
import { HistoryScreenProps } from "./Screens/HistoryScreen/HistoryScreen.props";
import { AppContext, AppContextConsumer, AppContextType } from "./AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shadcn/components/ui/tabs"
import { FlexItem } from "./Components/FlexBox";
import { LoaderWithText } from "./Components/Loader/Loader";

export const AppEntryPoint = React.forwardRef<IAppController>((_props, ref) => {
    const [contextInit, setContextInit] = React.useState<AppContextType>({
        currentScreenName: undefined,
        screenPropsMap: {
            [ScreenNames.Practice]: undefined,
            [ScreenNames.History]: undefined
        },
        setCurrentScreenProps: () => { }
    });

    const handleTabChange = (value: string) => {
        const screenName = value as ScreenNames;
        setContextInit(prev => ({
            ...prev,
            currentScreenName: screenName
        }));

        // Trigger screen navigation based on tab selection
        // This could be enhanced to request data from services
        if (screenName === ScreenNames.History) {
            // In a real implementation, you would call the HistoryManagerService here
            console.log("Switching to History tab");
        } else if (screenName === ScreenNames.Practice) {
            console.log("Switching to Practice tab");
        }
    };

    React.useImperativeHandle(ref, () => {
        return {
            showScreen: (props: BaseScreenProps) => {
                setContextInit(prev => ({
                    ...prev, currentScreenName: props.id,
                    screenPropsMap: {
                        ...prev.screenPropsMap,
                        [props.id]: props
                    }
                }));
            },
            updateProps: (props: BaseScreenProps) => {
                setContextInit(prev => ({
                    ...prev,
                    screenPropsMap: {
                        ...prev.screenPropsMap,
                        [props.id]: props
                    }
                }));
            },
        };
    }, [contextInit])


    return (
        <AppContext.Provider value={{ ...contextInit, setCurrentScreenProps: contextInit.setCurrentScreenProps }}>
            <div className="dark font-mono font-bold w-full h-full flex items-center justify-center flex-col" id={ControllerComponentIds.ControllerBoundary}>
                <Tabs
                    value={contextInit.currentScreenName || ScreenNames.Practice}
                    onValueChange={handleTabChange}
                    className="w-full h-full flex flex-col"
                >
                    <FlexItem className="self-start">
                        <TabsList className="gap-x-2 p-4 bg-background h-12">
                            <TabsTrigger value={ScreenNames.Practice} className={` ${contextInit.currentScreenName === ScreenNames.Practice ? "text-background! bg-foreground!" : ""}`}>Practice</TabsTrigger>
                            <TabsTrigger value={ScreenNames.History} className={` ${contextInit.currentScreenName === ScreenNames.History ? "text-background! bg-foreground!" : ""}`}>History</TabsTrigger>
                        </TabsList>
                    </FlexItem>

                    <div className="flex-1 w-full">
                        <AppContextConsumer>
                            {({ screenPropsMap, currentScreenName }) => {
                                const currentScreenProps = currentScreenName ? screenPropsMap[currentScreenName] : undefined;

                                if (!currentScreenName) {
                                    return (
                                        <div className="flex-1 flex items-center justify-center h-full">
                                            <LoaderWithText
                                                size="lg"
                                                text="Initializing Active Recall..."
                                                className="text-center"
                                            />
                                        </div>
                                    );
                                }

                                return currentScreenProps ? (
                                    <ShowScreen {...currentScreenProps} />
                                ) : (
                                    <div className="flex-1 flex items-center justify-center h-full">
                                        <LoaderWithText
                                            size="md"
                                            text="Loading screen..."
                                            className="text-center"
                                        />
                                    </div>
                                );
                            }}
                        </AppContextConsumer>
                    </div>
                </Tabs>
            </div>
        </AppContext.Provider>
    );
})

const ShowScreen: React.FC<BaseScreenProps> = (props: BaseScreenProps) => {
    switch (props.id) {
        case ScreenNames.Practice:
            return <PracticeScreen {...props as PracticeScreenProps} />;
        case ScreenNames.History:
            return <HistoryScreen {...props as HistoryScreenProps} />;
        default:
            return <></>;
    }
}
