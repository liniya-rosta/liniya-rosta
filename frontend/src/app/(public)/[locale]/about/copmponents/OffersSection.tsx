import React from 'react';
import {Lamp, Wallpaper, Paintbrush, Ruler} from "lucide-react"
import {Card, CardHeader, CardTitle, CardContent} from "@/src/components/ui/card"

const offers = [
    {
        title: "Освещение",
        description: "Трековые системы, световые линии, декоративная и функциональная подсветка.",
        icon: Lamp,
        color: "text-highlight",
    },
    {
        title: "Натяжные обои",
        description: "Антивандальные, шумопоглощающие, монтаж без грязи.",
        icon: Wallpaper,
        color: "text-highlight",
    },
    {
        title: "Натяжные потолки",
        description: "От классических матовых до дизайнерских с подсветкой.",
        icon: Paintbrush,
        color: "text-highlight",
    },
    {
        title: "SPC-ламинат",
        description: "Влагостойкий, износоустойчивый, с текстурой дерева.",
        icon: Ruler,
        color: "text-highlight",
    },
]

const OffersSection = () => {
    return (
        <section className="py-20">
            <h2 className="text-23-30-1_5 font-bold text-center mb-12">Что мы предлагаем</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {offers.map((offer, index) => (
                    <Card key={index} className="hover:shadow-lg transition">
                        <CardHeader className="flex items-center gap-3">
                            <offer.icon className={`w-8 h-8 ${offer.color}`}/>
                            <CardTitle>{offer.title}</CardTitle>
                        </CardHeader>
                        <CardContent>{offer.description}</CardContent>
                    </Card>
                ))}
            </div>

        </section>
    );
};

export default OffersSection;