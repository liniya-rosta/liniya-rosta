import React from 'react';
import {Check} from "lucide-react";
import {getTranslations} from "next-intl/server";

const ServicesTitle = async () => {
    const tServices = await getTranslations("ServicesPage");

    return (
        <div className="max-w-lg text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
            <h1 className="text-4xl font-bold mb-8">
                Линия роста —{' '}
                <span className="text-yellow-400">{tServices("slogan.part1")}</span>,{' '}
                <span className="text-white/90">{tServices("slogan.part2")}</span>
            </h1>

            <h2 className="text-2xl font-semibold mb-4">{tServices("advantagesTitle")}</h2>
            <ul className="space-y-4">
                {[
                    tServices("advantages.largeProduction"),
                    tServices("advantages.highQuality"),
                    tServices("advantages.uniqueTechnology"),
                    tServices("advantages.idealSPC")].map((text) => (
                    <li key={text} className="flex items-center space-x-3">
                        <Check className="w-6 h-6 text-yellow-400 flex-shrink-0"/>
                        <span>{text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ServicesTitle;