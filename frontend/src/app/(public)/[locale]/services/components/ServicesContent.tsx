import React from 'react';
import ServiceContentCard from "@/src/app/(public)/[locale]/services/components/ServiceContentCard";
import {useServiceStore} from "@/store/serviceStore";
import {useLocale, useTranslations} from "next-intl";
import { CustomContainer } from '@/src/components/shared/CustomContainer';
import SectionAnimation from "@/src/components/shared/SectionAnimation";

interface Props {
    text: string;
}

const ServicesContent: React.FC<Props> = ({text}) => {
    const { allServices } = useServiceStore();
    const locale = useLocale() as "ru" | "ky";
    const tError = useTranslations("Errors");
    const tServices = useTranslations("ServicesPage");

    return (
        <SectionAnimation className="bg-gray-100 py-16 px-6 mb-10 md:mb-20">
            <CustomContainer>
                <div className="text-center mb-12">
                    <h2 className="text-23-30-1_5 font-bold mb-4">{tServices("advantagesTitle")}</h2>
                    <p className="text-gray-600">
                        {text}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8 mt-8">
                    {allServices?.length ? (
                        allServices.map((service) => (
                            <div
                                key={service._id}
                                className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1.333rem)] md:min-w-[280px]"
                            >
                                <ServiceContentCard
                                    title={service.title[locale]}
                                    description={service.description?.[locale]}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center items-center min-h-[200px] w-full">
                            <p className="text-muted-foreground text-lg">
                                {tError("servicesError")}
                            </p>
                        </div>
                    )}
                </div>
            </CustomContainer>
        </SectionAnimation>
    );
};

export default ServicesContent;