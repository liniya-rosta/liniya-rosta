import React from 'react';
import ServicesForm from "@/app/(public)/services/components/ServicesForm";
import ServicesTitle from "@/app/(public)/services/components/ServicesTitle";
import ServiceClient from "@/app/(public)/services/ServiceClient";
import {isAxiosError} from "axios";
import {fetchAllServices} from "@/actions/services";
import { ServiceResponse } from '@/lib/types';

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