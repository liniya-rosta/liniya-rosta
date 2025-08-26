import React from 'react';
import {CustomContainer} from "@/src/components/shared/CustomContainer";
import {getTranslations} from "next-intl/server";
import SectionAnimation from '@/src/components/shared/SectionAnimation';

const MissionStatement = async () => {
    const tAboutPage = await getTranslations("AboutPage");

    return (
        <SectionAnimation className="py-16 bg-secondary/20">
            <CustomContainer>
                <h2 className="text-23-30-1_5 font-semibold text-center text-foreground/80 mb-12">
                    {tAboutPage("MissionTitle")}
                </h2>

                <div className="grid md:grid-cols-2 gap-12">
                    <div className="flex items-start space-x-6">
                        <span className="hidden sm:inline text-7xl font-bold text-highlight-light">1</span>
                        <p className="text-center sm:text-left text-foreground/60 text-lg leading-relaxed">
                            {tAboutPage("MissionBlock1")}
                        </p>
                    </div>

                    <div className="flex items-start space-x-6">
                        <span className="hidden sm:inline text-7xl font-bold text-highlight-light">2</span>
                        <p className="text-center sm:text-left text-foreground/60 text-lg leading-relaxed">
                            {tAboutPage("MissionBlock2")}
                        </p>
                    </div>
                </div>
            </CustomContainer>
        </SectionAnimation>
    );
};

export default MissionStatement;