import React from 'react';
import {Lamp, Wallpaper, Paintbrush, Ruler} from "lucide-react"
import Link from "next/link";
import {getTranslations} from "next-intl/server";
import SectionAnimation from "@/src/components/shared/SectionAnimation";

const OffersSection = async () => {
    const tAboutPage = await getTranslations("AboutPage");

    const offers = [
        {
            title: tAboutPage("OffersCardTitleLighting"),
            description: tAboutPage("OffersCardDescriptionLighting"),
            icon: Lamp,
            color: "text-highlight",
            link: "/ceilings",
        },
        {
            title: tAboutPage("OffersCardTitleWallpaper"),
            description: tAboutPage("OffersCardDescriptionWallpaper"),
            icon: Wallpaper,
            color: "text-highlight",
            link: "/wallpaper",
        },
        {
            title: tAboutPage("OffersCardTitleCeilings"),
            description: tAboutPage("OffersCardDescriptionCeilings"),
            icon: Paintbrush,
            color: "text-highlight",
            link: "/ceilings",
        },
        {
            title: tAboutPage("OffersCardTitleSpc"),
            description: tAboutPage("OffersCardDescriptionSpc"),
            icon: Ruler,
            color: "text-highlight",
            link: "/spc",
        },
    ];
    return (
        <SectionAnimation>
            <h2 className="text-23-30-1_5 font-bold w-max mx-auto mb-12 border-b-highlight">
                {tAboutPage("OffersTitle")}
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {offers.map((offer, index) => (
                    <div key={index} className="light-shadow-card border border-foreground/10 px-6 py-10">
                        <Link href={offer.link} >
                            <div className="flex items-center gap-3 mb-3">
                                <offer.icon className={`w-8 h-8 ${offer.color}`}/>
                                <h4 className="font-bold text-primary">
                                    {offer.title}
                                </h4>
                            </div>
                            <div className="text-foreground/60">{offer.description}</div>
                        </Link>
                    </div>
                ))}
            </div>

        </SectionAnimation>
    );
};

export default OffersSection;