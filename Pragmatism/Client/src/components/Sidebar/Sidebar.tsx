import React from "react";

export const Sidebar: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <div className="w-[30%] h-full  bg-background/30  flex flex-col p-4 border-r-2 border-accent">
            {children}
        </div>
    );
};
