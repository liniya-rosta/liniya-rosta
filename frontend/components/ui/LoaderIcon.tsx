import { Loader2Icon } from "lucide-react"
import {cn} from "@/lib/utils";
import React from "react";

interface Props {
    className?: string;
}

const LoaderIcon: React.FC<Props> = ({className})=> {
    return (
        <Loader2Icon className={cn("animate-spin", className)} />
    )
};
export default LoaderIcon;