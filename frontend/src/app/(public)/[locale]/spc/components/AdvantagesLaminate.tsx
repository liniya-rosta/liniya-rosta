import AdvantageLaminateCard from "@/src/app/(public)/[locale]/spc/components/AdvantageLaminateCard";
import {Brush, ShieldCheck, Volume2, Waves} from "lucide-react";
import React from "react";
import {getTranslations} from "next-intl/server";
import SectionAnimation from "@/src/components/shared/SectionAnimation";

const AdvantagesLaminate = async () => {
    const tSpc = await getTranslations('SpcPage');

    const advantages = [
        {
            title: tSpc("advantages.waterResistance.title"),
            text: tSpc("advantages.waterResistance.text"),
            icon: <Waves size={52} strokeWidth={1} className="text-highlight"/>
        }, {
            title: tSpc("advantages.aesthetics.title"),
            text: tSpc("advantages.aesthetics.text"),
            icon: <Brush size={52} strokeWidth={1} className="text-highlight"/>
        }, {
            title: tSpc("advantages.durability.title"),
            text: tSpc("advantages.durability.text"),
            icon: <ShieldCheck size={52} strokeWidth={1} className="text-highlight"/>
        }, {
            title: tSpc("advantages.comfort.title"),
            text: tSpc("advantages.comfort.text"),
            icon: <Volume2 size={52} strokeWidth={1} className="text-highlight"/>
        },
    ];

    return (
        <SectionAnimation className="mb-[70px] sm:mb-[55px]">
            <h3 className="sm:text-2xl text-xl  mb-10 text-center">{tSpc("advantagesTitle")}</h3>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4 w-full">
                {advantages.map((advantage, i) => (
                    <AdvantageLaminateCard key={i} {...advantage} />
                ))}
            </div>
        </SectionAnimation>
    );
};

export default AdvantagesLaminate;