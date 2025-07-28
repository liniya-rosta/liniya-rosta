import React from 'react';
import SectionAnimation from "@/src/app/(public)/(home)/components/SectionAnimation";

const InstagramSection = () => {
    return (
        <SectionAnimation className="space-y-6 mx-auto">
            <h3 className="main-section-title text-center text-23-30-1_5">
                Наша лента в Instagram
            </h3>
            <iframe
                src="//lightwidget.com/widgets/a5595befc0b75c39ae732dfc56693cbd.html"
                className="lightwidget-widget w-full h-[350px] rounded-xl"
            ></iframe>
        </SectionAnimation>
    );
};

export default InstagramSection;