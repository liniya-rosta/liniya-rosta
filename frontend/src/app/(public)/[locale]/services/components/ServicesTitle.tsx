import React from 'react';
import {Check} from "lucide-react";
import {getTranslations} from "next-intl/server";
import AnimatedEntrance from "@/src/components/shared/AnimatedEntrance";

const ServicesTitle = async () => {
    const tServices = await getTranslations("ServicesPage");

    return (
        <AnimatedEntrance className="text-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] bg-white rounded-2xl p-8 backdrop-blur-sm">
            <h1 className="text-30-48-1_2 font-bold mb-8">
                Линия роста —{' '}
                <span  className="text-highlight">{tServices("slogan.part1")}</span>,{' '}
                <span>{tServices("slogan.part2")}</span>
            </h1>

            <h2 className="text-18-28-1_2 font-semibold mb-4">{tServices("advantagesTitle")}</h2>
            <ul className="space-y-4">
                {[
                    tServices("advantages.largeProduction"),
                    tServices("advantages.highQuality"),
                    tServices("advantages.uniqueTechnology"),
                    tServices("advantages.idealSPC")].map((text) => (
                    <li key={text} className="flex items-center space-x-3">
                        <Check className="w-6 h-6 text-highlight flex-shrink-0"/>
                        <span>{text}</span>
                    </li>
                ))}
            </ul>
        </AnimatedEntrance>
    );
};

export default ServicesTitle;