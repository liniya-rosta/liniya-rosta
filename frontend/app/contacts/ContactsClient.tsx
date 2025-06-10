'use client';

import ContactInfoCard from "@/app/contacts/components/ContactInfoCard";
import WorkingHoursCard from "@/app/contacts/components/WorkingHoursCard";
import MapSection from "@/app/contacts/components/MapSection";
import {useEffect} from "react";
import {useContactStore} from "@/store/contacts";
import {ContactDataDTO} from "@/lib/types";

type Props = {
    data: ContactDataDTO
}

const ContactsClient: React.FC<Props> = ({ data }) => {

    const { contactData, setContactData } = useContactStore();

    useEffect(() => {
        setContactData(data);
    }, [setContactData, data])

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Контакты</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <ContactInfoCard />
                <WorkingHoursCard />
            </div>
            <MapSection />
        </div>
    )
}

export default ContactsClient;