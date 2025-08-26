'use client'

import React from 'react';
import Image from "next/image";
import {Button} from "@/src/components/ui/button";
import {useTranslations} from "next-intl";
import {Dialog, DialogTrigger} from "@/src/components/ui/dialog";
import RequestForm from "@/src/components/shared/RequestForm";

const HeroWallpaperSection = () => {
    const [isModalTopOpen, setIsModalTopOpen] = React.useState(false);
    const tBtn = useTranslations("Buttons");
    const t = useTranslations("WallpaperPage");

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 -mt-8">
            <div className="hidden md:flex items-center justify-center bg-primary px-6 py-12">
                <Image
                    src="/images/wallpaper/main-bg-wallpaper.jpeg"
                    alt="Шоурум"
                    width={800}
                    height={800}
                    className="max-h-[800px] w-auto h-auto object-contain rounded-2xl shadow-lg"
                />
            </div>

            <div className="flex flex-col items-center bg-beige justify-center text-center px-6 py-20">
                <h1 className="relative text-30-48-1_2 font-bold mb-6 max-w-3xl z-10">
                    <span className="text-highlight">{t("titlePart1")}</span> {t("titlePart2")}
                </h1>
                <p className="relative text-lg text-foreground/60 max-w-2xl mb-8 z-10">
                    {t("description")}
                </p>
                <Dialog open={isModalTopOpen} onOpenChange={setIsModalTopOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="lg"
                            className="min-w-[180px] font-semibold shadow-md btn-highlight btn-hover-scale">
                            {tBtn("requestBtn3")}
                        </Button>
                    </DialogTrigger>
                    <RequestForm closeModal={() => setIsModalTopOpen(false)}/>
                </Dialog>
            </div>
        </section>
    );
};

export default HeroWallpaperSection;