import ServiceContentCard from "@/src/app/(public)/[locale]/services/components/ServiceContentCard";
import React from "react";
import {useServiceStore} from "@/store/serviceStore";
import {useLocale, useTranslations} from "next-intl";

const ServiceSection = () => {
    const {allServices} = useServiceStore();
    const locale = useLocale() as "ru" | "ky";
    const tHome = useTranslations("HomePage");
    const tError = useTranslations("Errors")

    return (
        <section className="bg-gray-100 py-16 px-6">
            <div className="max-w-4xl mx-auto ">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">{tHome("servicesTitle")}</h2>
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
    )
}

export default ServiceSection;