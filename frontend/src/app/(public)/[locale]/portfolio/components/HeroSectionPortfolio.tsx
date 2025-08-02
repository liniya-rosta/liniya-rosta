import { useTranslations } from 'next-intl';
import React from 'react';
import {Dialog, DialogTrigger} from "@/src/components/ui/dialog";
import {Button} from "@/src/components/ui/button";
import RequestForm from "@/src/components/shared/RequestForm";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWhatsapp} from "@fortawesome/free-brands-svg-icons";
import {useContactStore} from "@/store/contactsStore";

const HeroSectionPortfolio = () => {
    const {contact} = useContactStore();
    const [isModalTopOpen, setIsModalTopOpen] = React.useState(false);

    const tPortfolio = useTranslations("PortfolioPage");
    const tBtn = useTranslations("Buttons");

    return (
        <section className="text-center py-16 px-6 bg-secondary/20 rounded-lg shadow-lg mb-15 md:mb-24">
            <h1
                className="text-30-48-1_2 font-extrabold leading-tight text-primary"
            >
                {tPortfolio("titlePart1")} <br />
                <span className="text-black">{tPortfolio("titlePart2")}</span>
            </h1>

            <p className="mt-6 max-w-xl mx-auto text-base sm:text-lg text-muted-foreground mb-4">
                {tPortfolio("description")}
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
                <Dialog open={isModalTopOpen} onOpenChange={setIsModalTopOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="lg"
                            className="min-w-[180px] font-semibold shadow-md btn-hover-scale">
                            {tBtn("requestBtn1")}
                        </Button>
                    </DialogTrigger>
                    <RequestForm closeModal={() => setIsModalTopOpen(false)}/>
                </Dialog>

                <Button
                    variant="outline"
                    size="lg"
                    className="btn-hover-scale"
                    asChild
                >
                    <a href={`https://wa.me/${contact?.whatsapp}`} target="_blank"
                       rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faWhatsapp}/>
                        WhatsApp
                    </a>
                </Button>
            </div>
        </section>
    )
};

export default HeroSectionPortfolio;