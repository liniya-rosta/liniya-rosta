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
                        variant="secondary"
                        className="btn-highlight btn-hover-scale"
                        size="lg">
                        {tBtn("requestBtn1")}
                    </Button>
                </DialogTrigger>
                <RequestForm closeModal={() => setIsOpen(false)}/>
            </Dialog>
        </>
    )
}

export default ClientActions