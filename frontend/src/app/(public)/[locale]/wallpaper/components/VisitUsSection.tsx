'use client'

import React from 'react';
import {Button} from "@/src/components/ui/button";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {Dialog, DialogTrigger} from "@/src/components/ui/dialog";
import RequestForm from "@/src/components/shared/RequestForm";
import {CustomContainer} from "@/src/components/shared/CustomContainer";
import SectionAnimation from "@/src/components/shared/SectionAnimation";

const VisitUsSection = () => {
    const [isModalTopOpen, setIsModalTopOpen] = React.useState(false);
    const tBtn = useTranslations("Buttons");
    const t = useTranslations("WallpaperPage");

    return (
        <SectionAnimation className="py-20 px-6">
            <CustomContainer>
                <div className="grid gap-12 md:grid-cols-2 items-center">
                    <div>
                        <h2 className="text-18-28-1_2 font-bold mt-4 mb-6">
                            {t("VisitUsTitle")}
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-lg">
                            {t("VisitUsDescription")}
                        </p>
                        <Dialog open={isModalTopOpen} onOpenChange={setIsModalTopOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    size="lg"
                                    className="min-w-[180px] font-semibold shadow-md btn-hover-scale">
                                    {tBtn("requestBtn2")}
                                </Button>
                            </DialogTrigger>
                            <RequestForm closeModal={() => setIsModalTopOpen(false)}/>
                        </Dialog>
                    </div>

                    <div className="rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src="/images/wallpaper/wallpaper-section-img.JPG"
                            alt="Шоурум Линия Роста"
                            width={400}
                            height={200}
                            className="w-full max-h-[500px] md:max-h-none md:h-auto object-cover"
                        />
                    </div>
                </div>
            </CustomContainer>
        </SectionAnimation>
    );
};

export default VisitUsSection;