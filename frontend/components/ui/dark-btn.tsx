
import React from 'react';
import {cn} from "@/lib/utils";

interface Props {
    className?: string;
}

export const DarkBtn: React.FC<React.PropsWithChildren<Props>> = ({ className, children }) => {
    return <button className={cn
    ("px-4 py-2 text-sm font-semibold text-white bg-black/70 rounded-md backdrop-blur-sm transition hover:bg-black", className)}
    >{children}</button>;
};