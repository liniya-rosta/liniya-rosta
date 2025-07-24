import React from 'react';
import {Button} from "@/src/components/ui/button";
import {useTranslations} from "next-intl";

interface Props {
    onClick: () => void;
}

const RequestBtn: React.FC<Props> = ({onClick}) => {
    const tBtn = useTranslations("Buttons");

    return (
        <>
            <Button
                onClick={onClick}
                className="mt-4 px-5 py-3 text-white rounded-full bg-transparent border border-white hover:animate-pulse cursor-pointer">
                {tBtn('requestBtn1')}
            </Button>
        </>
    );
};

export default RequestBtn;