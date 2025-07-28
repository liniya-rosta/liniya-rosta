import React from 'react';
import {cn} from "@/src/lib/utils";
import {XIcon} from "lucide-react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    className?: string;
}

export const BtnClose:  React.FC<React.PropsWithChildren<Props>> = (
    {className, ...props}) => {
    return (
        <button
            aria-label="Закрыть"
            className={cn(
                "p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-black/10 transition-colors",
                className
            )}
            {...props}
        >
            <XIcon />
        </button>
    );
};