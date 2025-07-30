import React from 'react';
import ServicesForm from "@/src/app/(public)/[locale]/services/components/ServicesForm";
import ServicesTitle from "@/src/app/(public)/[locale]/services/components/ServicesTitle";
import ServiceClient from "@/src/app/(public)/[locale]/services/ServiceClient";
import {isAxiosError} from "axios";
import {fetchAllServices} from "@/actions/services";
import { ServiceResponse } from '@/src/lib/types';
import {getTranslations} from "next-intl/server";
import {Metadata} from "next";
import { Container } from '@/src/components/shared/Container';

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
    const tError = await getTranslations("Errors");

    try {
        serviceData = await fetchAllServices();
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            errorMessage = error.response.data.error;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = tError("PortfolioError");
        }
    }

    const tServices = await getTranslations("ServicesPage");

    return (
        <section className="min-h-screen -mt-8">
            <div
                className="w-full min-h-[560px] lg:h-[560px] bg-black/50 bg-[url('/images/services/main-service.JPG')] py-14 bg-cover bg-center bg-blend-overlay mb-20">
                <Container>
                    <div
                        className="min-h-full px-6 md:py-15 lg:py-0 grid grid-cols-1 lg:grid-cols-2 items-stretch justify-between gap-10">
                        <ServicesTitle/>
                        <ServicesForm/>
                    </div>
                </Container>
            </div>

            <ServiceClient data={serviceData} error={errorMessage} servicesText={tServices("servicesSubtitle")}/>
        </section>
    );
};

export default ServicePage;