import React from 'react';
import ServicesForm from "@/app/(public)/services/components/ServicesForm";
import ServicesTitle from "@/app/(public)/services/components/ServicesTitle";
import ServicesContent from "@/app/(public)/services/components/ServicesContent";

export default function ServicePage() {
    return (
        <section className="min-h-screen bg-white">
            <div
                className="w-full min-h-[560px] md:h-[560px] bg-black/50 bg-[url('/images/services/main-service.jpg')] bg-cover bg-center bg-blend-overlay mb-10">
                <div
                    className="max-w-7xl mx-auto min-h-full px-6 py-15 md:py-0 flex flex-col md:flex-row items-center justify-between gap-10">
                    <ServicesTitle/>
                    <ServicesForm/>
                </div>
            </div>

            <ServicesContent/>
        </section>
    );
};
