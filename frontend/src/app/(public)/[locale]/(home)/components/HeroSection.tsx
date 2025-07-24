import React from 'react';
import {Dialog, DialogTrigger} from "@/src/components/ui/dialog";
import {Button} from "@/src/components/ui/button";
import RequestForm from "@/src/components/shared/RequestForm";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWhatsapp} from "@fortawesome/free-brands-svg-icons";
import {useContactStore} from "@/store/contactsStore";
import {useTranslations} from "next-intl";

interface Props {
    title: string;
}

const HeroSection: React.FC<Props> = ({title}) => {
    const {contact} = useContactStore();
    const [isModalTopOpen, setIsModalTopOpen] = React.useState(false);

    const tBtn = useTranslations("Buttons");

    return (
        <section aria-labelledby="hero-heading" className="text-center space-y-6 mb-20">
            <div className="relative w-full h-[600px] md:h-[500px] mb-8 -mt-[35px]">
                <video
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    src="/video/background-home.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                />
                <div className="absolute inset-0 bg-black/70" />

                <div className="absolute inset-0 flex items-center justify-center text-white px-4">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg max-w-3xl mx-auto space-y-6">
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-[#fff7ed] via-[#fdba74] to-[#fb923c] bg-clip-text text-transparent">
                            Линия роста
                        </h1>
                        <p className="text-lg md:text-xl text-white/90">
                            {title}
                        </p>

                        <div className="flex gap-4 justify-center flex-wrap">
                            <Dialog open={isModalTopOpen} onOpenChange={setIsModalTopOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        size="lg"
                                        className="min-w-[180px] bg-[#D2691E] text-white font-semibold shadow-md hover:scale-105
                                                    hover:bg-[#a35213] hover:border-[#D2691E] duration-500">
                                        {tBtn("requestBtn1")}
                                    </Button>
                                </DialogTrigger>
                                <RequestForm closeModal={() => setIsModalTopOpen(false)}/>
                            </Dialog>

                            <Button
                                variant="outline"
                                size="lg"
                                className="min-w-[180px] border-primary text-[#D2691E] duration-500 hover:scale-105"
                                asChild
                            >
                                <a href={`https://wa.me/${contact?.whatsapp}`} target="_blank" rel="noopener noreferrer">
                                    <FontAwesomeIcon icon={faWhatsapp}/>
                                    WhatsApp
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>


            {/*<div className="text-center space-y-6">*/}
            {/*    <h1 id="hero-heading"*/}
            {/*        className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">*/}
            {/*        Линия роста*/}
            {/*    </h1>*/}
            {/*    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">*/}
            {/*        Натяжные потолки, SPC ламинат и монтажные услуги. Сделаем ваш дом стильным и функциональным.*/}
            {/*    </p>*/}
            {/*    <div className="flex gap-4 justify-center flex-wrap">*/}

            {/*        <Dialog open={isModalTopOpen} onOpenChange={setIsModalTopOpen}>*/}
            {/*            <DialogTrigger asChild>*/}
            {/*                <Button size="lg" className="min-w-[180px] cursor-pointer duration-500 hover:scale-105">*/}
            {/*                    Оставить заявку*/}
            {/*                </Button>*/}
            {/*            </DialogTrigger>*/}
            {/*            <RequestForm closeModal={() => setIsModalTopOpen(false)}/>*/}
            {/*        </Dialog>*/}

            {/*        <Button*/}
            {/*            variant="outline"*/}
            {/*            size="lg"*/}
            {/*            className="min-w-[180px] border-primary text-primary hover:bg-primary/10 duration-500 hover:scale-105"*/}
            {/*            asChild*/}
            {/*        >*/}
            {/*            <a href={`https://wa.me/${contact?.whatsapp}`} target="_blank" rel="noopener noreferrer">*/}
            {/*                <FontAwesomeIcon icon={faWhatsapp}/>*/}
            {/*                Написать в WhatsApp*/}
            {/*            </a>*/}
            {/*        </Button>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </section>
    );
};

export default HeroSection;