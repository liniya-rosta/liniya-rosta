import ServiceContentCard from "@/src/app/(public)/[locale]/services/components/ServiceContentCard";
import React from "react";
import {useServiceStore} from "@/store/serviceStore";
import {useLocale, useTranslations} from "next-intl";
import {CustomContainer} from "@/src/components/shared/CustomContainer";
import { motion } from "motion/react";

const ServiceSection = () => {
    const {allServices} = useServiceStore();
    const locale = useLocale() as "ru" | "ky";
    const tHome = useTranslations("HomePage");
    const tError = useTranslations("Errors");

    return (
        <section className="bg-gray-100 py-8 md:py-16 mb-15">
            <CustomContainer>
                <h2 className="main-section-title text-center text-23-30-1_5">{tHome("servicesTitle")}</h2>

                <div className="flex flex-wrap justify-center gap-8 mt-8">
                    {allServices?.length ? (
                        allServices.map((service, index) => (
                            <motion.div
                                key={service._id}
                                className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1.333rem)] md:min-w-[280px]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.1 }}
                            >
                                <ServiceContentCard
                                    title={service.title[locale]!}
                                    description={service.description?.[locale] || ""}
                                />
                            </motion.div>
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
        </section>
    )
}

export default ServiceSection;