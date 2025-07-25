'use client';

import React, {useState} from 'react';
import RequestForm from '@/src/components/shared/RequestForm';
import {Dialog, DialogTrigger} from "@/src/components/ui/dialog";
import {Button} from "@/src/components/ui/button";
import {useTranslations} from "next-intl";

const ClientActions = () => {
    const [isOpen, setIsOpen] = useState(false);

    const tBtn = useTranslations("Buttons")

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button
                        size="lg"
                        className="mt-4 px-5 py-3 font-bold text-[darkOrange]
                        bg-transparent border border-[darkOrange]
                        cursor-pointer hover:bg-black/20 transition-transform
                        duration-200 hover:scale-105">
                        {tBtn("requestBtn1")}
                    </Button>
                </DialogTrigger>
                <RequestForm closeModal={() => setIsOpen(false)}/>
            </Dialog>
        </>
    )
}

export default ClientActions