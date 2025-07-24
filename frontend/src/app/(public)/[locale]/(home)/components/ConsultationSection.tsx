import React from 'react';
import {Dialog, DialogTrigger} from "@/src/components/ui/dialog";
import {Button} from "@/src/components/ui/button";
import RequestForm from "@/src/components/shared/RequestForm";
import {useContactStore} from "@/store/contactsStore";
import {useTranslations} from "next-intl";

const ConsultationSection = () => {
    const {contact} = useContactStore();
    const [isModalBottomOpen, setIsModalBottomOpen] = React.useState(false);

    const tHome = useTranslations("HomePage")
    const tBtn = useTranslations("Buttons");

    return (
        <section
            className="bg-gradient-to-r from-primary to-amber-600 rounded-2xl p-8 text-center text-white space-y-6">
            <h2 className="text-3xl font-bold">{tHome("requestTitle")}</h2>
            <p className="max-w-2xl mx-auto text-primary-foreground/90">
                {tHome("requestText")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Dialog open={isModalBottomOpen} onOpenChange={setIsModalBottomOpen}>
                    <DialogTrigger asChild>
                        <Button variant="secondary" className="cursor-pointer duration-500 hover:scale-105"
                                size="lg">
                            {tBtn("requestBtn2")}
                        </Button>
                    </DialogTrigger>
                    <RequestForm closeModal={() => setIsModalBottomOpen(false)}/>
                </Dialog>
                <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent border-white text-white hover:bg-white/10 duration-500 hover:scale-105"
                    asChild
                >
                    <a href={contact?.phone2}>{contact?.phone2}</a>
                </Button>
            </div>
        </section>

    );
};

export default ConsultationSection;