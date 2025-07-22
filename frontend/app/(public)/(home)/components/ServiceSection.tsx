import ServiceContentCard from "@/app/(public)/services/components/ServiceContentCard";
import React from "react";
import {useServiceStore} from "@/store/serviceStore";
import {Container} from "@/components/shared/Container";

const ServiceSection = () => {
    const {allServices} = useServiceStore();

    return (
        <section className="bg-gray-100 py-8 md:py-16 mb-15">
            <Container>
                <div className="max-w-4xl mx-auto ">
                    <h2 className="main-section-title text-20-30-1_2 text-center">Наши услуги</h2>

                    <div className="flex flex-wrap justify-center gap-8 mt-8">
                        {allServices?.length ? (
                            allServices.map((service) => (
                                <div
                                    key={service._id}
                                    className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1.333rem)]"
                                >
                                    <ServiceContentCard
                                        title={service.title}
                                        description={service.description}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="flex justify-center items-center min-h-[200px] w-full">
                                <p className="text-muted-foreground text-lg">
                                    Что-то пошло не так. Услуги не загрузились
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default ServiceSection;