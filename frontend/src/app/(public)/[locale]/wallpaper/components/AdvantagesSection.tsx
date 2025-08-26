import React from 'react';
import {Card, CardContent} from "@/src/components/ui/card";
import {CheckCircle2} from "lucide-react";
import {CustomContainer} from "@/src/components/shared/CustomContainer";
import {getTranslations} from "next-intl/server";

const AdvantagesSection = async () => {
    const t = await getTranslations("WallpaperPage");

    const advantages = [
        {
            title: t("AdvantagesCardTitle1"),
            description: t("AdvantagesCardDescription1"),
        },
        {
            title: t("AdvantagesCardTitle2"),
            description: t("AdvantagesCardDescription2"),
        },
        {
            title: t("AdvantagesCardTitle3"),
            description: t("AdvantagesCardDescription3"),
        },
        {
            title: t("AdvantagesCardTitle4"),
            description: t("AdvantagesCardDescription4"),
        },
        {
            title: t("AdvantagesCardTitle5"),
            description: t("AdvantagesCardDescription5"),
        },
        {
            title: t("AdvantagesCardTitle6"),
            description: t("AdvantagesCardDescription6"),
        },
    ];

    return (
        <CustomContainer className="py-20">
            <h2 className="text-18-28-1_2 font-bold text-center mb-12">{t("AdvantagesTitle")}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advantages.map((item, idx) => (
                    <Card key={idx} className="rounded-2xl shadow-sm border border-gray-200">
                        <CardContent className="flex flex-col gap-2 p-6">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-6 h-6 text-highlight shrink-0"/>
                                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                            </div>
                            <p className="text-gray-700 text-sm">{item.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </CustomContainer>
    );
};

export default AdvantagesSection;