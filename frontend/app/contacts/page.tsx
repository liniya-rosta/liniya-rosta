import ContactsClient from "@/app/contacts/ContactsClient";
import {fetchContactsData} from "@/actions/contacts";

const ContactsPage = async () => {

    const contactData = await fetchContactsData();

    return (
        <ContactsClient data={contactData}/>
    )
};

export default ContactsPage;