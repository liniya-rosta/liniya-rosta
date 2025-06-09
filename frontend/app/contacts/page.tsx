'use client';

import ContactInfoCard from "@/components/shared/ContactInfoCard";
import WorkingHoursCard from "@/components/shared/WorkingHoursCard";
import MapSection from "@/components/shared/MapSection"; // Компонент с картой

const ContactsPage = () => (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Контакты</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <ContactInfoCard />
            <WorkingHoursCard />
        </div>
        <MapSection />
    </div>
);

export default ContactsPage;