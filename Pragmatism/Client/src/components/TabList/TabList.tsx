import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@shadcn/components/ui/tabs";
import { FlexDiv, FlexItem } from "../FlexBox";

export type TabProps = {
    icon: React.ReactNode;
    label: string;
}

export type TabListProps = {
    tabs: TabProps[];
    className?: string;
    defaultValue?: string
}

export const TabList: React.FC<React.PropsWithChildren<TabListProps>> = ({ tabs, children, className, defaultValue }) => {
    return (
        <Tabs defaultValue={defaultValue} className={className}>
            <TabsList className="bg-background h-12 py-2 px-3 gap-x-2 ">
                {
                    tabs.map((tab) => (
                        <TabsTrigger value={tab.label} key={tab.label} className="">
                            <FlexDiv horizontal className="justify-center items-center gap-x-1">
                                <FlexItem>
                                    {tab.icon}
                                </FlexItem>
                                <FlexItem>
                                    {tab.label}
                                </FlexItem>
                            </FlexDiv>
                        </TabsTrigger>
                    ))

                }
            </TabsList>
            {children}
        </Tabs>
    )
}