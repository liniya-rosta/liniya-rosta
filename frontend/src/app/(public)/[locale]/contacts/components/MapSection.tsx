import {useContactStore} from "@/store/contactsStore";
import {useTranslations} from "next-intl";
import SectionAnimation from "@/src/components/shared/SectionAnimation";

const MapSection= () => {
    const contact = useContactStore(state => state.contact);
    const tContacts = useTranslations("ContactsPage");

    if (!contact || !contact.linkLocation) return null;

    return (
        <SectionAnimation aria-labelledby="map-heading" lang="ru">
            <h2 id="map-heading" className="text-xl font-semibold mb-4 text-gray-900">
                {tContacts("locationTitle")}
            </h2>
            <div className="w-full h-[300px] rounded-xl overflow-hidden mb-[40px]">
                <iframe
                    src={contact.linkLocation}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Карта"
                />
            </div>
        </SectionAnimation>
    );
};

export default MapSection;
