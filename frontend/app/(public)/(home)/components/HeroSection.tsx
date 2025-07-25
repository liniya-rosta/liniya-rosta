import React from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import RequestForm from "@/components/shared/RequestForm";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWhatsapp} from "@fortawesome/free-brands-svg-icons";
import {useContactStore} from "@/store/contactsStore";
import {Container} from '@/components/shared/Container';
import {motion} from "motion/react";

const HeroSection = () => {
    const {contact} = useContactStore();
    const [isModalTopOpen, setIsModalTopOpen] = React.useState(false);

    return (
        <section aria-labelledby="hero-heading" className="text-center space-y-6 mb-15 md:mb-20">
            <div className="md:relative w-full md:h-[500px] mb-8 -mt-[35px]">
                <video
                    className="hidden md:block absolute top-0 left-0 w-full h-full object-cover"
                    src="/video/background-home.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                />
                <div className="hidden md:block absolute inset-0 bg-black/150"/>

                <Container>
                    <div className="md:absolute md:inset-0 flex items-center justify-center md:text-white px-4">
                        <motion.div
                            className="md:bg-black/40 md:backdrop-blur-sm p-6 md:rounded-2xl md:shadow-lg max-w-3xl mx-auto space-y-6"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}>
                            <h1 className="main-heading">Линия роста</h1>
                            <p className="text-lg md:text-xl">
                                Натяжные потолки, SPC ламинат и монтажные услуги. Сделаем ваш дом стильным и
                                функциональным
                            </p>

                            <div className="flex gap-4 justify-center flex-wrap">
                                <Dialog open={isModalTopOpen} onOpenChange={setIsModalTopOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="lg"
                                                className="min-w-[180px] font-semibold shadow-md btn-hover-scale">
                                            Оставить заявку
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="text-center">Форма заявки</DialogTitle>
                                        </DialogHeader>
                                        <RequestForm closeModal={() => setIsModalTopOpen(false)}/>
                                    </DialogContent>
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
                                        Написать в WhatsApp
                                    </a>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </Container>
            </div>
        </section>
    );
};

export default HeroSection;