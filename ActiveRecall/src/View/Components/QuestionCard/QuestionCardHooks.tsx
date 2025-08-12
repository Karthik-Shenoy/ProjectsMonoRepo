import * as React from "react";


export function useMCQ<T extends string | number>(ids: T[]): [T[], (index: T, checked: boolean) => void] {
    const [chosenData, setChosenData] = React.useState<T[]>(ids);

    const onCheckedChange = (index: T, checked: boolean) => {
        if (checked) {
            setChosenData(prev => [...prev, index]);
        } else {
            setChosenData(prev => prev.filter(id => id !== index));
        }
    }

    return [chosenData, onCheckedChange];
}