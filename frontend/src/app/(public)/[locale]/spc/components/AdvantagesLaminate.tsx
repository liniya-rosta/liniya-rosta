import AdvantageLaminateCard from "@/src/app/(public)/[locale]/spc/components/AdvantageLaminateCard";
import {Brush, ShieldCheck, Volume2, Waves} from "lucide-react";
import React from "react";
import {getTranslations} from "next-intl/server";

const AdvantagesLaminate = async () => {
    const tSpc = await getTranslations('SpcPage');

    const advantages = [
        {
            title: tSpc("advantages.waterResistance.title"),
            text: tSpc("advantages.waterResistance.text"),
            icon: <Waves size={52} strokeWidth={1} color='darkOrange'/>
        }, {
            title: tSpc("advantages.aesthetics.title"),
            text: tSpc("advantages.aesthetics.text"),
            icon: <Brush size={52} strokeWidth={1} color='darkOrange'/>
        }, {
            title: tSpc("advantages.durability.title"),
            text: tSpc("advantages.durability.text"),
            icon: <ShieldCheck size={52} strokeWidth={1} color='darkOrange'/>
        }, {
            title: tSpc("advantages.comfort.title"),
            text: tSpc("advantages.comfort.text"),
            icon: <Volume2 size={52} strokeWidth={1} color='darkOrange'/>
        },
    ];

    return (
        <div className="mb-[70px] sm:mb-[55px]">
            <h3 className="sm:text-2xl text-xl  mb-10 text-center">{tSpc("advantagesTitle")}</h3>
            <div className="flex flex-wrap justify-center gap-7">
                {
                    advantages.map((advantage, i) => (
                        <AdvantageLaminateCard key={i} text={advantage.text} title={advantage.title}
                                               icon={advantage.icon}/>
                    ))
                }
            </div>
        </div>
    );
};

export default AdvantagesLaminate;