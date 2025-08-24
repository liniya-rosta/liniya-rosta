import React from 'react';
import {CustomContainer} from "@/src/components/shared/CustomContainer";
import OffersSection from "@/src/app/(public)/[locale]/about/copmponents/OffersSection";
import HeroAboutSection from "@/src/app/(public)/[locale]/about/copmponents/HeroAboutSection";
import WhyUsSection from "@/src/app/(public)/[locale]/about/copmponents/WhyUsSection";

const Page = () => {
    return (
        <div>
            <HeroAboutSection/>

            <CustomContainer className="space-y-6">
                <OffersSection/>
                <WhyUsSection/>
            </CustomContainer>
        </div>
    );
};

export default Page;