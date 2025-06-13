'use client';

import ContactInfoCard from "@/app/contacts/components/ContactInfoCard";
import WorkingHoursCard from "@/app/contacts/components/WorkingHoursCard";
import MapSection from "@/app/contacts/components/MapSection";
import {Contact} from "@/lib/types";
import {useEffect, useState} from "react";
import {useContactStore} from "@/store/contactsStore";
import Loading from "@/components/shared/Loading";
import ErrorMsg from "@/components/shared/ErrorMsg";

interface Props {
    data: Contact | null;
    error: string | null;
}

const ContactsClient: React.FC<Props> = ({data, error}) => {
    const {contact, setContact, setFetchError, fetchLoading, setFetchLoading, fetchError} = useContactStore();

    const [isHydrating, setIsHydrating] = useState(true);

    useEffect(() => {
        if (data) setContact(data);
        setFetchError(error);
        setFetchLoading(false);
        setIsHydrating(false);
    }, [data, error, setContact, setFetchError, setFetchLoading, setIsHydrating]);

    const overallLoading = isHydrating || fetchLoading;

    if (overallLoading) return <Loading/>;

    if (fetchError) return <ErrorMsg error={fetchError} label='контактов'/>

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Контакты</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <ContactInfoCard/>
                <WorkingHoursCard workingHours={contact?.workingHours ?? {}}/>
            </div>
            <MapSection/>
        </div>
    );
};


export default ContactsClient;