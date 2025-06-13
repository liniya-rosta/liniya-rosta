'use client';

import React, {useEffect, useState} from 'react';
import Image from "next/image";
import {Waves, Brush, ShieldCheck, Volume2} from 'lucide-react';
import AdvantageLaminateCard from "@/app/spc/components/AdvantageLaminateCard";
import {Navigation, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import {useLaminateStore} from "@/store/laminateItems";
import LaminateCard from "@/app/spc/components/LaminateCard";
import RequestForm from "@/components/shared/RequestForm";
import {ModalWindow} from "@/components/ui/modal-window";
import RequestBtnOrange from "@/components/ui/requestBtnOrange";
import Loading from "@/components/shared/Loading";
import {fetchLaminateItems} from "@/actions/laminateItems";

const advantages = [
    {
        title: "Высокая влагостойкость",
        text: "SPC-ядро состоит из смеси известняка (каменный наполнитель) и ПВХ (полимер). Ламинат не боится воды, можно укладывать даже в ванных и кухнях",
        icon: <Waves size={52} strokeWidth={1} color='darkOrange'/>
    }, {
        title: "Эстетика",
        text: "Реалистичное изображение древесины, камня и других текстур.",
        icon: <Brush size={52} strokeWidth={1} color='darkOrange'/>
    }, {
        title: "Износостойкость и долговечность",
        text: "Защитный слой предохраняет от царапин, истирания, пятен.Защищает от УФ-излучения — не выцветает от солнца.",
        icon: <ShieldCheck size={52} strokeWidth={1} color='darkOrange'/>
    }, {
        title: "Шумоизоляция и комфорт",
        text: "Подложка IXPE уменьшает ударные и шаговые звуки. Обеспечивает мягкость и комфорт при ходьбе.",
        icon: <Volume2 size={52} strokeWidth={1} color='darkOrange'/>
    },
];

const SpcLaminatePage = () => {
    const {
        laminateItems,
        setLaminateItems,
        setLaminateLoading,
        fetchLaminateLoading,
        fetchLaminateError,
        setFetchLaminateError,
    } = useLaminateStore()
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
        const loadLaminate = async () => {
            setLaminateLoading(true);
            try {
                const data = await fetchLaminateItems();
                setLaminateItems(data);
                setFetchLaminateError(null);
            } catch (e) {
                const message = e instanceof Error ? e.message : 'Ошибка при загрузке';
                setFetchLaminateError(message);
            } finally {
                setLaminateLoading(false);
            }
        };

        void loadLaminate();
    }, [setLaminateItems, setLaminateLoading, setFetchLaminateError]);

        return (
            <div className="container">
                <div className="flex items-center -mt-8 mb-18">
                    <div className="w-[40%]">
                        <h2 className="text-2xl pb-3">Что такое SPC Ламинат?</h2>
                        <p>
                            SPC-ламинат — это влагостойкое, прочное, долговечное покрытие нового поколения, подходящее
                            практически для любых условий, включая ванные комнаты. Он выглядит как обычный ламинат, но
                            по
                            характеристикам ближе к виниловой плитке или плитке ПВХ.
                        </p>
                        <RequestBtnOrange onClick={openModal}/>
                    </div>
                    <div className="w-[60%] h-[400] shrink-0 ml-20 -mr-20">
                        <Image
                            src="/images/spc-laminate.png"
                            alt="SPC ламинат"
                            width={600}
                            height={400}
                            className="w-full h-full cover"
                        />
                    </div>
                </div>

                <div className="mb-18">
                    <h3 className="text-[28px] mb-10 text-center">Преимущества SPC ламината</h3>
                    <div className="flex flex-wrap justify-center gap-7">
                        {
                            advantages.map((advantage, i) => (
                                <AdvantageLaminateCard key={i} text={advantage.text} title={advantage.title}
                                                       icon={advantage.icon}/>
                            ))
                        }
                    </div>
                </div>

                {fetchLaminateLoading ? <Loading/> :
                    fetchLaminateError ? (<h4>{fetchLaminateError}</h4>) :
                        (<div className="mb-[55px]">
                                <h3 className="text-[28px] mb-10 text-center">Каталог</h3>
                                <Swiper
                                    slidesPerView={1}
                                    navigation
                                    pagination={{clickable: true}}
                                    modules={[Navigation, Pagination]}
                                    className="mySwiper py-4"
                                >
                                    {laminateItems.map(item => (
                                        <SwiperSlide key={item._id}>
                                            <LaminateCard title={item.title} image={item.image}
                                                          description={item.description}/>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        )}

                <ModalWindow isOpen={isOpen} onClose={closeModal}>
                    <RequestForm closeModal={closeModal}/>
                </ModalWindow>
            </div>
        );
    };

    export default SpcLaminatePage;