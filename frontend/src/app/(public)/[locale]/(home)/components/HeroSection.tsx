import React from 'react';
import {Dialog, DialogTrigger} from "@/src/components/ui/dialog";
import {Button} from "@/src/components/ui/button";
import RequestForm from "@/src/components/shared/RequestForm";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWhatsapp} from "@fortawesome/free-brands-svg-icons";
import {useContactStore} from "@/store/contactsStore";
import {useTranslations} from "next-intl";
import { CustomContainer } from '@/src/components/shared/CustomContainer';
import { motion } from 'motion/react';

interface Props {
    title: string;
}

const HeroSection: React.FC<Props> = ({title}) => {
    const {contact} = useContactStore();
    const [isModalTopOpen, setIsModalTopOpen] = React.useState(false);

    const tBtn = useTranslations("Buttons");

    return (
        <section aria-labelledby="hero-heading" className="text-center space-y-6 mb-15 md:mb-20">
            <div className="relative w-full h-[500px] mb-8 -mt-[35px]">
                <video
                    className="block absolute top-0 left-0 w-full h-full object-cover"
                    src="/video/background-home.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                />
                <div className="block absolute inset-0 bg-black/150"/>

                <CustomContainer>
                    <div className="absolute inset-0 flex items-center justify-center text-white px-4">
                        <motion.div
                            className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg max-w-3xl mx-auto space-y-6"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}>
                            <h1 className="main-heading text-30-48-1_2">Линия роста</h1>
                            <p className="text-lg md:text-xl">
                                {title}
                            </p>

                            <div className="flex gap-4 justify-center flex-wrap">
                                <Dialog open={isModalTopOpen} onOpenChange={setIsModalTopOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            size="lg"
                                            className="min-w-[180px] font-semibold shadow-md btn-highlight btn-hover-scale">
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
                        </motion.div>
                    </div>
                </CustomContainer>
            </div>
        </section>
    );
};

export default HeroSection;