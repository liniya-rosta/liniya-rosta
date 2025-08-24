'use client'

import React from 'react';
import {CustomContainer} from "@/src/components/shared/CustomContainer";
import {Button} from "@/src/components/ui/button";
import {Dialog, DialogTrigger} from "@/src/components/ui/dialog";
import RequestForm from "@/src/components/shared/RequestForm";
import {useTranslations} from "next-intl";

const HeroAboutSection = () => {
    const [isModalTopOpen, setIsModalTopOpen] = React.useState(false);
    const tBtn = useTranslations("Buttons");
    const tAboutPage = useTranslations("AboutPage");

    return (
        <section className="bg-[#f7f3ed] flex rounded-xl md:h-[500px] items-center justify-center px-9 py-20 md:py-0">
            <CustomContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 justify-around items-center">
                    <div className="hidden md:flex flex-col items-center">
                        <div className="w-40 h-40 bg-card-foreground"></div>
                        <div className="relative mt-[-10px] text-[24px] tracking-wider font-sans
                                [writing-mode:vertical-rl] rotate-180 flex justify-center">
                            ЛИНИЯ<br/>РОСТА
                        </div>
                    </div>

                    <div className="space-y-6 text-center md:text-left">
                        <h1 className="text-30-48-1_2 font-bold">
                            {tAboutPage("title")}
                        </h1>
                        <p className="text-lg text-foreground/60">
                            {tAboutPage("description")}
                        </p>
                        <Dialog open={isModalTopOpen} onOpenChange={setIsModalTopOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    size="lg"
                                    className="min-w-[180px] font-semibold shadow-md btn-highlight btn-hover-scale">
                                    {tBtn("requestBtn1")}
                                </Button>
                            </DialogTrigger>
                            <RequestForm closeModal={() => setIsModalTopOpen(false)}/>
                        </Dialog>
                    </div>
                </div>
            </CustomContainer>
        </section>
    );
};

export default HeroAboutSection;