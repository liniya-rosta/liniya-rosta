import React from 'react';
import ServiceContentCard from "@/src/app/(public)/[locale]/services/components/ServiceContentCard";
import {useServiceStore} from "@/store/serviceStore";
import {useLocale, useTranslations} from "next-intl";

interface Props {
    text: string;
}

const ServicesContent: React.FC<Props> = ({text}) => {
    const { allServices } = useServiceStore();
    const locale = useLocale() as "ru" | "ky";
    const tError = useTranslations("Errors");
    const tServices = useTranslations("ServicesPage");

    return (
        <section className="bg-gray-100 py-16 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">{tServices("advantagesTitle")}</h2>
                    <p className="text-gray-600">
                        {text}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8 mt-8">
                    {allServices?.length ? (
                        allServices.map((service) => (
                            <div
                                key={service._id}
                                className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1.333rem)]"
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
            </div>
        </section>
    );
};

export default ServicesContent;