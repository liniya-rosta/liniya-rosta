import React from 'react';
import {cn} from "@/lib/utils";
import {ChevronLeftIcon, ChevronRightIcon} from "lucide-react";
import {Button} from "@/components/ui/button";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    className?: string;
    isLeft?: boolean;
    classNameIcon?: string;
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
}

export const BtnArrow:  React.FC<React.PropsWithChildren<Props>> = (
    {className, isLeft=false, classNameIcon, children, variant="default", ...props}) => {
    return (
        <Button variant={variant} className={cn("text-lg font-medium", className)} {...props}>
            {isLeft ?
                    <>
                        <ChevronLeftIcon className={cn(classNameIcon)}/>{children}
                    </>
                        :
                    <>
                        {children} <ChevronRightIcon className={cn(classNameIcon)}/>
                    </>
            }
        </Button>
    );
};