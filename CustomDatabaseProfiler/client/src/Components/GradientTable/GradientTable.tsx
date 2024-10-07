import { cn } from "@shadcn-ui/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@shadcn-ui/components/ui/table";
import * as React from "react";
import { GradientBorderWrapper } from "../GradientBorderWrapper/GradientBorderWrapper";
import { TableSkeleton } from "./Components/TableSkeleton";
import { DatabaseRecord } from "src/Interop/DatabaseResponse.types";
import { TableStatusIllustration } from "./Components/TableStatusIllustration";

export type TableState = "loading" | "success" | "error";

export type GradientTableProps = {
    className?: string;
    wrapperClassName?: string;
    tableState: TableState;
    tableData?: DatabaseRecord[];
};

export const GradientTable: React.FC<GradientTableProps> = ({
    className,
    wrapperClassName,
    tableState,
    tableData,
}) => {
    const showContent = () => {
        switch (tableState) {
            case "loading":
                return <TableSkeleton />;
            case "error":
                return <TableStatusIllustration illustration="error" />;
            case "success": {
                if (tableData?.length === 0) {
                    return <TableStatusIllustration illustration="success" />;
                }

                return (
                    <Table className={cn("bg-background rounded-sm", className)}>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="desktop:w-[150px]">Key</TableHead>
                                <TableHead className="desktop:w-[700px]">Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tableData?.map((data, index) => (
                                <TableRow key={index}>
                                    <TableCell>{data.key}</TableCell>
                                    <TableCell>
                                        <pre>{data.value}</pre>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                );
            }
            default:
                return null;
        }
    };

    return (
        <GradientBorderWrapper
            className={cn("w-full h-auto transition-all duration-700", wrapperClassName)}
        >
            {showContent()}
        </GradientBorderWrapper>
    );
};
