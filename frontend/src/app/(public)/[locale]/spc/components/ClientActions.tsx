'use client';

import React, {useState} from 'react';
import RequestForm from '@/src/components/shared/RequestForm';
import {Dialog, DialogTrigger} from "@/src/components/ui/dialog";
import {Button} from "@/src/components/ui/button";

export default function ClientActions() {
    const [isOpen, setIsOpen] = useState(false);

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
                        Оставить заявку
                    </Button>
                </DialogTrigger>
                <RequestForm closeModal={() => setIsOpen(false)}/>
            </Dialog>
        </>
    )
}