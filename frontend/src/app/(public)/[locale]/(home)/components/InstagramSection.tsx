import { useTranslations } from 'next-intl';
import React from 'react';
import SectionAnimation from "@/src/components/shared/SectionAnimation";

const InstagramSection = () => {
    const tHome = useTranslations("HomePage");
    return (
        <SectionAnimation className="space-y-6 mx-auto">
            <h3 className="main-section-title text-center text-23-30-1_5">
                {tHome("instagramTitle")}
            </h3>
            <iframe
                src="//lightwidget.com/widgets/a5595befc0b75c39ae732dfc56693cbd.html"
                className="lightwidget-widget w-full h-[380px] rounded-xl"
            ></iframe>
        </SectionAnimation>
    );
};

export default InstagramSection;