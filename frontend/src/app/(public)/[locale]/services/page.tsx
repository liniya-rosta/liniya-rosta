import React from 'react';
import ServicesForm from "@/src/app/(public)/[locale]/services/components/ServicesForm";
import ServicesTitle from "@/src/app/(public)/[locale]/services/components/ServicesTitle";
import ServiceClient from "@/src/app/(public)/[locale]/services/ServiceClient";
import {fetchAllServices} from "@/actions/services";
import {ServiceResponse} from '@/src/lib/types';
import {getTranslations} from "next-intl/server";
import {Metadata} from "next";
import {Container} from '@/src/components/shared/Container';
import {handleKyError} from "@/src/lib/handleKyError";

export const revalidate = 1800;

export const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations('ServicesPage');
    const tHeader = await getTranslations('Header');

    return {
        title: tHeader('headerLinks.services'),
        description: t('descriptionSeo'),
        openGraph: {
            title: t('ogTitle'),
            description: t('ogDescription'),
            url: '/services',
            siteName: 'Линия Роста',
            images: [
                {
                    url: '/images/services/main-service.JPG',
                    width: 1200,
                    height: 630,
                    alt: t('ogImageAlt'),
                },
            ],
            type: 'website',
        },
    };
};

const ServicePage = async () => {
    let serviceData: ServiceResponse | null = null;
    let errorMessage: string | null = null;
    const tError = await getTranslations("Errors");

    try {
        serviceData = await fetchAllServices();
    } catch (error) {
        errorMessage = await handleKyError(error, tError("servicesError"));

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