import ServiceContentCard from "@/app/(public)/services/components/ServiceContentCard";
import React from "react";
import {useServiceStore} from "@/store/serviceStore";
import {Container} from "@/components/shared/Container";
import { motion } from "motion/react";

const ServiceSection = () => {
    const {allServices} = useServiceStore();

    return (
        <section className="bg-gray-100 py-8 md:py-16 mb-15">
            <Container>
                <h2 className="main-section-title text-center text-23-30-1_5">Наши услуги</h2>

                <div className="flex flex-wrap justify-center gap-8 mt-8">
                    {allServices?.length ? (
                        allServices.map((service, index) => (
                            <motion.div
                                key={service._id}
                                className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1.333rem)]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.1 }}
                            >
                                <ServiceContentCard
                                    title={service.title}
                                    description={service.description}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex justify-center items-center min-h-[200px] w-full">
                            <p className="text-muted-foreground text-lg">
                                Что-то пошло не так. Услуги не загрузились
                            </p>
                        </div>
                    )}
                </div>
            </Container>
        </section>
    )
}

export default ServiceSection;