'use client';

import React, {useState} from 'react';
import {Dialog, DialogTrigger} from "@/src/components/ui/dialog";
import RequestBtn from "@/src/components/ui/RequestBtn";
import RequestForm from "@/src/components/shared/RequestForm";

const FooterBtn = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <RequestBtn onClick={() => setIsOpen(true)}/>
            </DialogTrigger>
            <RequestForm closeModal={() => setIsOpen(false)}/>
        </Dialog>
    );
};

export default FooterBtn;