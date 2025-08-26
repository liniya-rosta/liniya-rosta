import React, {useCallback, useState} from 'react';
import AnimatedEntrance from "@/src/components/shared/AnimatedEntrance";
import {Button} from "@/src/components/ui/button";
import {MessageCircle, Phone} from "lucide-react";
import {Dialog, DialogHeader} from "@/src/components/ui/dialog";
import {DialogTitle} from "@radix-ui/react-dialog";
import RequestForm from "@/src/components/shared/RequestForm";
import {useTranslations} from "next-intl";


const BasicInfoProductPage = () => {
    const [showConsultationModal, setShowConsultationModal] = useState<boolean>(false);
    const tCeilings = useTranslations("CeilingsPage");
    const tBtn = useTranslations("Buttons");

    const openConsultationModal = useCallback(() => {
        setShowConsultationModal(true);
    }, []);

    return (
        <>
            <div className="border-b bg-card">
                <div className="pb-6 flex flex-col md:flex-row md:justify-between gap-4">
                    <AnimatedEntrance className="text-center md:text-left">
                        <h1 className="text-23-30-1_5 font-bold">{tCeilings("title")}</h1>
                        <p className="text-muted-foreground mt-1">{tCeilings("subTitle")}</p>
                    </AnimatedEntrance>

                    <AnimatedEntrance direction="right" className="flex gap-3 justify-center">
                        <Button onClick={openConsultationModal} className="btn-hover-scale">
                            <Phone className="h-4 w-4"/>
                            {tBtn("requestBtn1")}
                        </Button>
                        <Button asChild variant="secondary" className="btn-hover-scale">
                            <a href="https://wa.me/996552088988" target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="h-4 w-4"/>
                                WhatsApp
                            </a>
                        </Button>
                    </AnimatedEntrance>
                </div>
            </div>
            {showConsultationModal && (
                <Dialog open={showConsultationModal} onOpenChange={setShowConsultationModal}>
                    <DialogHeader>
                        <DialogTitle className="text-center">Форма заявки</DialogTitle>
                    </DialogHeader>
                    <RequestForm closeModal={() => setShowConsultationModal(false)}/>
                </Dialog>
            )}
        </>
    );
};

export default BasicInfoProductPage;