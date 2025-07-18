import React from 'react';
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import RequestForm from "@/components/shared/RequestForm";
import {useContactStore} from "@/store/contactsStore";
import { CopyPhoneButton } from '@/components/ui/CopyPhoneButton';

const ConsultationSection = () => {
    const {contact} = useContactStore();
    const [isModalBottomOpen, setIsModalBottomOpen] = React.useState(false);

    return (
        <section
            className="bg-gradient-to-r from-[#b9c8d6] to-[#e68210] rounded-2xl p-8 text-center text-white space-y-6">
            <h2 className="text-3xl font-bold">Хотите начать ремонт?</h2>
            <p className="max-w-2xl mx-auto text-primary-foreground/90">
                Свяжитесь с нами — мы проконсультируем и подберём решения под ваш бюджет.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Dialog open={isModalBottomOpen} onOpenChange={setIsModalBottomOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="secondary"
                            className="border-white text-white btn-hover-scale"
                            size="lg">
                            Получить консультацию
                        </Button>
                    </DialogTrigger>
                    <RequestForm closeModal={() => setIsModalBottomOpen(false)}/>
                </Dialog>
                {contact && <CopyPhoneButton phone={contact?.phone2 || contact?.phone1}/>}
            </div>
        </section>

    );
};

export default ConsultationSection;