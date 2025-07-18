import React from 'react';
import ServicesForm from "@/app/(public)/services/components/ServicesForm";
import ServicesTitle from "@/app/(public)/services/components/ServicesTitle";
import ServiceClient from "@/app/(public)/services/ServiceClient";
import {isAxiosError} from "axios";
import {fetchAllServices} from "@/actions/services";
import { ServiceResponse } from '@/lib/types';
import {Metadata} from "next";

export const revalidate = 1800;

export const generateMetadata = async (): Promise<Metadata> => ({
    title: "Услуги",
    description: "Выезд на замер, расчет освещенности и профессиональный монтаж потолков и ламината от компании Линия Роста. Работаем по Бишкеку и области.",
    openGraph: {
        title: "Услуги | Линия Роста",
        description: "Выезд в удобное время, точные замеры, подбор освещения и качественный монтаж. Услуги под ключ от профессионалов.",
        url: "/services",
        siteName: "Линия Роста",
        images: [
            {
                url: "/images/services/main-service.JPG",
                width: 1200,
                height: 630,
                alt: "Услуги Линия Роста — замер, расчет освещенности, монтаж",
            },
        ],
        type: "website",
    },
});

const ServicePage = async () => {
    let serviceData:  ServiceResponse | null = null;
    let errorMessage: string | null = null;

    try {
        serviceData = await fetchAllServices();
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            errorMessage = error.response.data.error;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = "Неизвестная ошибка при загрузке портфолио";
        }
    }

    return (
        <section className="min-h-screen bg-white -mt-8">
            <div
                className="w-full min-h-[560px] md:h-[560px] bg-black/50 bg-[url('/images/services/main-service.JPG')] bg-cover bg-center bg-blend-overlay mb-10">
                <div
                    className="max-w-7xl mx-auto min-h-full px-6 py-15 md:py-0 flex flex-col md:flex-row items-center justify-between gap-10">
                    <ServicesTitle/>
                    <ServicesForm/>
                </div>
            </div>

            <ServiceClient data={serviceData} error={errorMessage}/>
        </section>
    );
};

export default ServicePage;