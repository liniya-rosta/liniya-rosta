import { useTranslations } from 'next-intl';
import React from 'react';
import SectionAnimation from "@/src/components/shared/SectionAnimation";
import Script from "next/script";

const InstagramSection = () => {
    const tHome = useTranslations("HomePage");
    return (
        <SectionAnimation className="space-y-6 mx-auto mb-15 md:mb-25">
            <h3 className="main-section-title text-center text-23-30-1_5">
                {tHome("instagramTitle")}
            </h3>

            <Script
                src="https://cdn.lightwidget.com/widgets/lightwidget.js"
                strategy="afterInteractive"
            />

            <div className="rounded-xl overflow-hidden">
                <iframe
                    src="https://cdn.lightwidget.com/widgets/70e87ca9d4cd522d9a285042ea153982.html"
                    className="lightwidget-widget w-full h-[380px]"
                    scrolling="no"
                    allowTransparency
                />
            </div>

        </SectionAnimation>
    );
};

export default InstagramSection;