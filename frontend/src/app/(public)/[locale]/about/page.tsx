import React from 'react';
import {CustomContainer} from "@/src/components/shared/CustomContainer";
import OffersSection from "@/src/app/(public)/[locale]/about/copmponents/OffersSection";
import HeroAboutSection from "@/src/app/(public)/[locale]/about/copmponents/HeroAboutSection";
import WhyUsSection from "@/src/app/(public)/[locale]/about/copmponents/WhyUsSection";
import CertificatesSection from "@/src/app/(public)/[locale]/about/copmponents/CertificatesSection";
import MissionStatement from "@/src/app/(public)/[locale]/about/copmponents/MissionStatement";
import {getTranslations} from "next-intl/server";
import type {Metadata} from "next";

export const revalidate = 3600;

export const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations("AboutPage");
    const tHeader = await getTranslations("Header");

    return {
        title: tHeader("headerLinks.aboutCompany"),
        description: t("descriptionSeo"),
        openGraph: {
            title: t("ogTitle"),
            description: t("ogDescription"),
            url: "/about",
            siteName: "Линия Роста",
            images: [
                {
                    url: "/images/logo.png",
                    width: 30,
                    height: 30,
                    alt: t("ogTitle"),
                },
            ],
            type: "website",
        },
    };
};

const Page = () => {
    return (
        <div className="space-y-20">
            <HeroAboutSection/>

            <CustomContainer className="space-y-20">
                <OffersSection/>
                <WhyUsSection/>
            </CustomContainer>

            <MissionStatement/>

            <CustomContainer>
                <CertificatesSection/>
            </CustomContainer>
        </div>
    );
};

export default Page;