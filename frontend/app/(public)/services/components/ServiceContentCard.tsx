'use client'

import React, {useState} from 'react';
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {CheckCircle} from "lucide-react";
import RequestForm from "@/components/shared/RequestForm";

interface Props {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

const ServiceContentCard: React.FC<Props> = ({title, description, icon}) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog key={title} open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div
                    className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-yellow-400/50 transition-shadow duration-300 cursor-pointer w-full h-full"
                    onClick={() => setOpen(true)}
                >
                    <div className="mb-4">{icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
                    <p className="text-gray-700">{description}</p>
                    <CheckCircle className="w-6 h-6 text-yellow-400 mt-4"/>
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