'use client';

import ContactInfoCard from "@/src/app/(public)/[locale]/contacts/components/ContactInfoCard";
import WorkingHoursCard from "@/src/app/(public)/[locale]/contacts/components/WorkingHoursCard";
import MapSection from "@/src/app/(public)/[locale]/contacts/components/MapSection";
import {Contact} from "@/src/lib/types";
import {useEffect} from "react";
import {useContactStore} from "@/store/contactsStore";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import LoadingFullScreen from "@/src/components/ui/Loading/LoadingFullScreen";
import {useTranslations} from "next-intl";
import AnimatedEntrance from "@/src/components/shared/AnimatedEntrance";
import {CustomContainer} from '@/src/components/shared/CustomContainer';


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
    const tContacts = useTranslations("ContactsPage");

    useEffect(() => {
        if (data) setContact(data);
        setFetchContactError(error);
        setFetchContactLoading(false);
    }, [data, error, setContact, setFetchContactError, setFetchContactLoading]);

    if (fetchContactLoading) return <LoadingFullScreen/>;
    if (fetchContactError) return <ErrorMsg error={fetchContactError}/>

    return (
        <CustomContainer>
            <div className='md:my-7'>
                <h1 className="text-30-48-1_2 text-center md:text-left font-bold mb-6">{tContacts("contactsTitle")}</h1>
                <AnimatedEntrance direction="bottom" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <ContactInfoCard/>
                    <WorkingHoursCard workingHours={contact?.workingHours ?? {}}/>
                </AnimatedEntrance>
                <MapSection/>
            </div>
        </CustomContainer>
    );
};


export default ContactsClient;