import React from 'react';
import ServiceForm from "@/app/(public)/services/components/ServiceForm";
import ServiceContent from "@/app/(public)/services/components/ServiceContent";

export default function ServicePage() {
    return (
        <section className="min-h-screen bg-white">
            <div
                className="w-full h-[560px] bg-black/50 bg-[url('/images/services/main-service.jpg')] bg-cover bg-center bg-blend-overlay">
                <div
                    className="max-w-7xl mx-auto h-full px-6 py-10 md:py-0 flex flex-col md:flex-row items-center justify-between gap-10">
                    <ServiceContent/>

                    <ServiceForm/>
                </div>
            </div>
        </section>
    );
};
