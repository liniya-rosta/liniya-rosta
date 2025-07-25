'use client';

import React, {useState} from 'react';
import RequestForm from '@/components/shared/RequestForm';
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

export default function ClientActions() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button
                        size="lg"
                        className="mt-4 px-5 py-3 btn-hover-scale bg-highlight">
                        Оставить заявку
                    </Button>
                </DialogTrigger>
                <RequestForm closeModal={() => setIsOpen(false)}/>
            </Dialog>
        </>
    )
}