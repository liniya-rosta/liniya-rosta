import AdvantageLaminateCard from "@/src/app/(public)/[locale]/spc/components/AdvantageLaminateCard";
import {Brush, ShieldCheck, Volume2, Waves} from "lucide-react";
import React from "react";

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

const AdvantagesLaminate = () => {
    return (
        <div className="mb-[70px] sm:mb-[55px]">
            <h3 className="sm:text-2xl text-xl  mb-10 text-center">Преимущества SPC ламината</h3>
            <div className="flex flex-wrap justify-center gap-7">
                {
                    advantages.map((advantage, i) => (
                        <AdvantageLaminateCard key={i} text={advantage.text} title={advantage.title}
                                               icon={advantage.icon}/>
                    ))
                }
            </div>
        </div>
    );
};

export default AdvantagesLaminate;