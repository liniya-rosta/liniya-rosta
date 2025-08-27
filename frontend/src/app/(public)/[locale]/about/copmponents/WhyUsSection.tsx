'use client'

import React from 'react';
import {Button} from '@/src/components/ui/button';
import {Dialog, DialogTrigger} from "@/src/components/ui/dialog";
import RequestForm from "@/src/components/shared/RequestForm";
import {useTranslations} from "next-intl";
import SectionAnimation from '@/src/components/shared/SectionAnimation';

const WhyUsSection = () => {
    const [isModalTopOpen, setIsModalTopOpen] = React.useState(false);
    const tAboutPage = useTranslations("AboutPage");
    const tBtn = useTranslations("Buttons");

    return (
        <SectionAnimation className="py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <h2 className="text-23-40-1_2 leading-snug text-center md:text-left">
                        <span className="font-bold block">
                            {tAboutPage("WhyUsTitlePart1")}
                        </span>
                        <span className="font-normal text-foreground/60">
                            {tAboutPage("WhyUsTitlePart2")}
                        </span>
                    </h2>

                    <div className="flex flex-col gap-6">
                        <div className="p-6 space-y-6">
                            <p className="text-center md:text-left">
                                {tAboutPage("WhyUsBlock1")}
                            </p>
                            <div className="flex justify-center md:justify-start">
                                <Dialog open={isModalTopOpen} onOpenChange={setIsModalTopOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            size="lg"
                                            className="min-w-[180px] font-semibold shadow-md btn-highlight btn-hover-scale">
                                            {tBtn("requestBtn2")}
                                        </Button>
                                    </DialogTrigger>
                                    <RequestForm closeModal={() => setIsModalTopOpen(false)}/>
                                </Dialog>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <p className="text-center md:text-left">
                                {tAboutPage("WhyUsBlock2")}
                            </p>
                            <div className="flex justify-center md:justify-start">
                                <Dialog open={isModalTopOpen} onOpenChange={setIsModalTopOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            size="lg"
                                            className="min-w-[180px] font-semibold shadow-md btn-highlight btn-hover-scale">
                                            {tAboutPage("WhyUsBtn")}
                                        </Button>
                                    </DialogTrigger>
                                    <RequestForm closeModal={() => setIsModalTopOpen(false)}/>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>
        </SectionAnimation>
    );
};

export default WhyUsSection;