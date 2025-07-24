import React from 'react';
import ServicesForm from "@/src/app/(public)/[locale]/services/components/ServicesForm";
import ServicesTitle from "@/src/app/(public)/[locale]/services/components/ServicesTitle";
import ServiceClient from "@/src/app/(public)/[locale]/services/ServiceClient";
import {isAxiosError} from "axios";
import {fetchAllServices} from "@/actions/services";
import { ServiceResponse } from '@/src/lib/types';
import {getTranslations} from "next-intl/server";

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
        <section className="min-h-screen bg-white -mt-8">
            <div
                className="w-full min-h-[560px] md:h-[560px] bg-black/50 bg-[url('/images/services/main-service.JPG')] bg-cover bg-center bg-blend-overlay mb-10">
                <div
                    className="max-w-7xl mx-auto min-h-full px-6 py-15 md:py-0 flex flex-col md:flex-row items-center justify-between gap-10">
                    <ServicesTitle/>
                    <ServicesForm />
                </div>
            </div>
            <ServiceClient data={serviceData} error={errorMessage} servicesText={tServices("servicesSubtitle")} />
        </section>
    );
};

export default ServicePage;