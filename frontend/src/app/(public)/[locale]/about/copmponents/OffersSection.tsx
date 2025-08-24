import React from 'react';
import {Lamp, Wallpaper, Paintbrush, Ruler} from "lucide-react"
import {Card, CardHeader, CardTitle, CardContent} from "@/src/components/ui/card"
import Link from "next/link";
import {getTranslations} from "next-intl/server";

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
        <section>
            <h2 className="text-23-30-1_5 font-bold text-center mb-12">
                {tAboutPage("OffersTitle")}
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {offers.map((offer, index) => (
                    <Card key={index} className="light-shadow-card">
                        <Link href={offer.link}>
                            <CardHeader className="flex items-center gap-3 mb-3">
                                <offer.icon className={`w-8 h-8 ${offer.color}`}/>
                                <CardTitle>{offer.title}</CardTitle>
                            </CardHeader>
                            <CardContent>{offer.description}</CardContent>
                        </Link>
                    </Card>
                ))}
            </div>

        </section>
    );
};

export default OffersSection;