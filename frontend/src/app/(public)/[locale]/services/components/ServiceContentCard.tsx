'use client'

import React, {useState} from 'react';
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/src/components/ui/dialog";
import {CheckCircle} from "lucide-react";
import RequestForm from "@/src/components/shared/RequestForm";

interface Props {
    title: string;
    description?: string;
}

const ServiceContentCard: React.FC<Props> = ({title, description}) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog key={title} open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div
                    className="bg-background rounded-lg p-6 flex flex-col items-center text-center cursor-pointer w-full h-full light-shadow-card"
                    onClick={() => setOpen(true)}
                >
                    <div className='min-h-[60px] flex flex-col justify-center items-center'>
                        <h3 className="text-xl font-semibold mb-2">{title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-3">{description}</p>
                    <CheckCircle className="w-6 h-6 text-highlight-light mt-auto"/>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle className="sr-only">Форма заявки</DialogTitle>
                <RequestForm closeModal={() => setOpen(false)}/>
            </DialogContent>
        </Dialog>
    );
};

export default ServiceContentCard;