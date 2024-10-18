import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@shadcn-ui/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@shadcn-ui/components/ui/chart";
import React from "react";
import { gradientBorderTailwindClass } from "../../../../SharedConstants";
import { useAppContext } from "../../../../Contexts/AppContext/AppContext";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

const GradientLineChart: React.FC<{}> = () => {
    const appContextData = useAppContext();

    const chartData = appContextData.queyProfiles.map((profile, index) => ({
        index: index,
        time: profile.queryParseTime + profile.queryExecutionTime,
    }));

    const sumExecutionTime = appContextData.queyProfiles.reduce((prev, current) => {
        return prev + current.queryParseTime + current.queryExecutionTime;
    }, 0);
    const averageExecutionTime = `${
        sumExecutionTime / (appContextData.queyProfiles.length || 1)
    } \u00B5s`;

    return (
        <div className={gradientBorderTailwindClass}>
            <Card className={"bg-background rounded-sm"}>
                <CardHeader>
                    <CardTitle>Query Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                top: 20,
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="index"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                                formatter={(value: number) => `${value}  \u00B5s`}
                            />
                            <Line
                                dataKey="time"
                                type="natural"
                                stroke="var(--color-desktop)"
                                strokeWidth={2}
                                dot={{
                                    fill: "var(--color-desktop)",
                                }}
                                activeDot={{
                                    r: 6,
                                }}
                            >
                                <LabelList
                                    position="top"
                                    offset={12}
                                    className="fill-foreground"
                                    fontSize={12}
                                />
                            </Line>
                        </LineChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                        Average Time: <span>{averageExecutionTime}</span>{" "}
                        <TrendingUp className="h-4 w-4" />
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default GradientLineChart;
