'use client';

import React, {useState} from 'react';
import RequestForm from '@/components/shared/RequestForm';
import {Dialog, DialogTrigger} from "@/components/ui/dialog";

export default function ClientActions() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <button
                        className="mt-4 px-5 py-3 font-bold text-orange-500 rounded-full bg-transparent border border-orange-500 hover:bg-orange-100 cursor-pointer transition-colors duration-500">
                        Оставить заявку
                    </button>
                </DialogTrigger>
                <RequestForm closeModal={() => setIsOpen(false)}/>
            </Dialog>
        </>
    )
}