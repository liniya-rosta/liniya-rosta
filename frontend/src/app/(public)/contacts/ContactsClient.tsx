'use client';

import ContactInfoCard from "@/src/app/(public)/contacts/components/ContactInfoCard";
import WorkingHoursCard from "@/src/app/(public)/contacts/components/WorkingHoursCard";
import MapSection from "@/src/app/(public)/contacts/components/MapSection";
import {Contact} from "@/src/lib/types";
import {useEffect} from "react";
import {useContactStore} from "@/store/contactsStore";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import LoadingFullScreen from "@/src/components/ui/Loading/LoadingFullScreen";
import {Container} from "@/src/components/shared/Container";

interface Props {
    data: Contact | null;
    error: string | null;
}

const ContactsClient: React.FC<Props> = ({data, error}) => {
    const {
        contact,
        setContact,
        setFetchContactError,
        fetchContactLoading,
        setFetchContactLoading,
        fetchContactError
    } = useContactStore();

    useEffect(() => {
        if (data) setContact(data);
        setFetchContactError(error);
        setFetchContactLoading(false);
    }, [data, error, setContact, setFetchContactError, setFetchContactLoading]);

    if (fetchContactLoading) return <LoadingFullScreen/>;
    if (fetchContactError) return <ErrorMsg error={fetchContactError} label='контактов'/>

    return (
        <Container>
            <h1 className="text-3xl font-bold mb-6">Контакты</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <ContactInfoCard/>
                <WorkingHoursCard workingHours={contact?.workingHours ?? {}}/>
            </div>
            <MapSection/>
        </Container>
    );
};


export default ContactsClient;