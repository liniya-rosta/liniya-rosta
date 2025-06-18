import React from 'react';
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import RequestForm from "@/components/shared/RequestForm";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWhatsapp} from "@fortawesome/free-brands-svg-icons";
import {useContactStore} from "@/store/contactsStore";

const HeroSection = () => {
    const {contact} = useContactStore();
    const [isModalTopOpen, setIsModalTopOpen] = React.useState(false);

    return (
        <section aria-labelledby="hero-heading" className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 id="hero-heading"
                className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                Линия роста
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Натяжные потолки, SPC ламинат и монтажные услуги. Сделаем ваш дом стильным и функциональным.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">

                <Dialog open={isModalTopOpen} onOpenChange={setIsModalTopOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="min-w-[180px] cursor-pointer duration-500 hover:scale-105">
                            Оставить заявку
                        </Button>
                    </DialogTrigger>
                    <RequestForm closeModal={() => setIsModalTopOpen(false)}/>
                </Dialog>

                <Button
                    variant="outline"
                    size="lg"
                    className="min-w-[180px] border-primary text-primary hover:bg-primary/10 duration-500 hover:scale-105"
                    asChild
                >
                    <a href={`https://wa.me/${contact?.whatsapp}`} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faWhatsapp}/>
                        Написать в WhatsApp
                    </a>
                </Button>
            </div>
        </section>
    );
};

export default HeroSection;