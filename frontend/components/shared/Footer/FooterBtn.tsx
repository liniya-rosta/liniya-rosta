'use client';

import React, {useState} from 'react';
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import RequestBtn from "@/components/ui/RequestBtn";
import RequestForm from "@/components/shared/RequestForm";

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