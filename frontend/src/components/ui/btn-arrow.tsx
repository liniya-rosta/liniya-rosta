import React from 'react';
import {cn} from "@/src/lib/utils";
import {ChevronLeftIcon, ChevronRightIcon} from "lucide-react";
import {Button} from "@/src/components/ui/button";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    className?: string;
    isLeft?: boolean;
    classNameIcon?: string;
}

export const BtnArrow:  React.FC<React.PropsWithChildren<Props>> = (
    {className, isLeft=false, classNameIcon, children, ...props}) => {
    return (
        <Button className={cn("text-lg font-medium", className)} {...props}>
            {
                isLeft ?
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