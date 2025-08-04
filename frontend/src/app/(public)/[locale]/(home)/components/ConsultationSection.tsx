import React from 'react';
import {Dialog, DialogTrigger} from "@/src/components/ui/dialog";
import {Button} from "@/src/components/ui/button";
import RequestForm from "@/src/components/shared/RequestForm";
import {useContactStore} from "@/store/contactsStore";
import {useTranslations} from "next-intl";
import SectionAnimation from "@/src/components/shared/SectionAnimation";
import { CopyPhoneButton } from '@/src/app/(public)/[locale]/(home)/components/CopyPhoneButton';

const ConsultationSection = () => {
    const {contact} = useContactStore();
    const [isModalBottomOpen, setIsModalBottomOpen] = React.useState(false);

    const tHome = useTranslations("HomePage")
    const tBtn = useTranslations("Buttons");

    return (
        <SectionAnimation
            className="bg-secondary rounded-2xl p-8 text-center text-white space-y-6">
            <h2 className="text-23-30-1_5 main-section-title">{tHome("requestTitle")}</h2>
            <p className="max-w-2xl mx-auto">
                {tHome("requestText")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Dialog open={isModalBottomOpen} onOpenChange={setIsModalBottomOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="secondary"
                            className="btn-highlight btn-hover-scale"
                            size="lg">
                            {tBtn("requestBtn2")}
                        </Button>
                    </DialogTrigger>
                    <RequestForm closeModal={() => setIsModalBottomOpen(false)}/>
                </Dialog>
                {contact && <CopyPhoneButton phone={contact?.phone2 || contact?.phone1}/>}
            </div>
        </SectionAnimation>
    );
};

export default ConsultationSection;