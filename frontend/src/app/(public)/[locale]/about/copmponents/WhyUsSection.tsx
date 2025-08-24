'use client'

import React from 'react';
import {Button} from '@/src/components/ui/button';
import {Dialog, DialogTrigger} from "@/src/components/ui/dialog";
import RequestForm from "@/src/components/shared/RequestForm";

const WhyUsSection = () => {
    const [isModalTopOpen, setIsModalTopOpen] = React.useState(false);

    return (
        <section className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <h2 className="text-4xl leading-snug text-center md:text-left">
                    <span className="font-bold block">Почему выбирают нас?</span>
                    <span className="font-normal text-foreground/60">
                        Качество, опыт и поддержка на каждом шаге
                    </span>
                </h2>

                <div className="flex flex-col gap-6">
                    <div className="p-6 space-y-6">
                        <p>
                            Мы работаем напрямую с заводами-производителями, поэтому гарантируем лучшие цены и высокое
                            качество. В нашем шоуруме вы сможете всё увидеть, потрогать, протестировать и получить консультацию
                            специалистов.
                        </p>
                        <Dialog open={isModalTopOpen} onOpenChange={setIsModalTopOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    size="lg"
                                    className="min-w-[180px] font-semibold shadow-md btn-hover-scale">
                                    Получить консультацию
                                </Button>
                            </DialogTrigger>
                            <RequestForm closeModal={() => setIsModalTopOpen(false)}/>
                        </Dialog>
                    </div>

                    <div className="p-6 space-y-6">
                        <p>
                            Для профессионалов мы проводим обучение и мастер-классы, помогаем развиваться в индустрии и
                            расширять ассортимент услуг.
                        </p>
                        <Dialog open={isModalTopOpen} onOpenChange={setIsModalTopOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    size="lg"
                                    className="min-w-[180px] font-semibold shadow-md btn-hover-scale">
                                    Пройти обучение
                                </Button>
                            </DialogTrigger>
                            <RequestForm closeModal={() => setIsModalTopOpen(false)}/>
                        </Dialog>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyUsSection;