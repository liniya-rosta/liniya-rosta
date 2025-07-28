'use client';

import React, {useState} from 'react';
import {Dialog, DialogTrigger} from "@/src/components/ui/dialog";
import RequestForm from "@/src/components/shared/RequestForm";
import {Button} from "@/src/components/ui/button";

const FooterBtn = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={() => setIsOpen(true)}
                    variant="secondary"
                    className="rounded-full btn-hover-scale px-7 py-4"
                >
                    Оставить заявку
                </Button>
            </DialogTrigger>
            <RequestForm closeModal={() => setIsOpen(false)}/>
        </Dialog>
    );
};

export default FooterBtn;