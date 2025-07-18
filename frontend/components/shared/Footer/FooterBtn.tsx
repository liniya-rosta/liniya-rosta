'use client';

import React, {useState} from 'react';
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import RequestForm from "@/components/shared/RequestForm";
import {Button} from "@/components/ui/button";

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