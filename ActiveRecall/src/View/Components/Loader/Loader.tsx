import * as React from "react";
import { Loader2 } from "lucide-react";

interface LoaderProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = "md", className = "" }) => {
    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-12 h-12", 
        lg: "w-16 h-16"
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        </div>
    );
};

export const LoaderWithText: React.FC<LoaderProps & { text?: string }> = ({ 
    size = "md", 
    className = "", 
    text = "Loading..." 
}) => {
    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <Loader size={size} />
            <p className="text-muted-foreground text-sm font-medium">{text}</p>
        </div>
    );
};
