import React from 'react';
import {cn} from "@/src/lib/utils";

interface Props {
    className?: string;
}

export const Container: React.FC<React.PropsWithChildren<Props>> = ({ className, children }) => {
    return <div className={cn('mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10', className)}>{children}</div>
};