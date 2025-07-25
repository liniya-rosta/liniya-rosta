import React from 'react';
import ServiceContentCard from "@/app/(public)/services/components/ServiceContentCard";
import {useServiceStore} from "@/store/serviceStore";
import { Container } from '@/components/shared/Container';

const ServicesContent = () => {
    const { allServices } =useServiceStore();

    return (
        <section className="bg-gray-100 py-16 mb-20">
            <Container>
                <h2 className="main-section-title text-center text-23-30-1_5">Наши услуги</h2>

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
            </Container>
        </section>
    );
};

export default ServicesContent;