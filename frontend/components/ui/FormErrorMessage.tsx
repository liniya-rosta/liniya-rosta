import React, {PropsWithChildren} from "react";
import {cn} from "@/lib/utils";

interface Props {
    className?: string
}

const FormErrorMessage: React.FC<PropsWithChildren<Props>> = ({children, className}) => {
    return (
        <p className={cn("text-red-500 text-sm mb-4", className)}>{children}</p>
    )
}
export default FormErrorMessage