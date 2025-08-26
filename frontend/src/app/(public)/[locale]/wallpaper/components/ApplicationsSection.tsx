import React from "react";

import {CustomContainer} from "@/src/components/shared/CustomContainer";
import {getTranslations} from "next-intl/server";
import SectionAnimation from "@/src/components/shared/SectionAnimation";

const ApplicationsSection = async () => {
    const t = await getTranslations("WallpaperPage");

    const applications = [
        {
            title: t("ApplicationsCard1Title"),
            items: [t("ApplicationsCard1Item1"), t("ApplicationsCard1Item2"), t("ApplicationsCard1Item3")],
        },
        {
            title: t("ApplicationsCard2Title"),
            items: [t("ApplicationsCard2Item1"), t("ApplicationsCard2Item2"), t("ApplicationsCard2Item3"), t("ApplicationsCard2Item4")],
        },
        {
            title: t("ApplicationsCard3Title"),
            items: [t("ApplicationsCard3Item1")],
        },
    ];

    return (
        <SectionAnimation className="py-20 px-6 bg-gray-50">
            <h2 className="text-18-28-1_2 font-bold text-center mb-12">{t("ApplicationsTitle")}</h2>

            <CustomContainer>
                <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    {applications.map((app, idx) => (
                        <div key={idx} className="p-8 flex flex-col items-center text-center">
                            <h3 className="text-lg font-semibold mb-4">{app.title}</h3>
                            <ul className="space-y-2 text-gray-600">
                                {app.items.map((el, i) => (
                                    <li key={i}>{el}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </CustomContainer>
        </SectionAnimation>
    );
};

export default ApplicationsSection;