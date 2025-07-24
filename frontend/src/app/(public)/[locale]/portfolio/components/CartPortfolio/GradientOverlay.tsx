import { cn } from "@/src/lib/utils";
import React from "react";

interface Props {
    className?: string;
}

export const GradientOverlay: React.FC<Props> = ({className}) => (
    <div
        className={cn("absolute top-0 right-0 h-full w-0 group-hover:w-full transition-all duration-500 z-10",className)}
        style={{
            background: 'linear-gradient(to left, rgba(0,0,0,0.5), transparent)',
        }}
    />
);
