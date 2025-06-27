import React from 'react';
import {Home, Layers, Sun} from 'lucide-react';
import ServiceContentCard from "@/app/(public)/services/components/ServiceContentCard";

const services = [
    {
        title: 'Выезд на замер',
        description: 'Наш специалист приедет к вам в удобное время, сделает точные замеры и даст рекомендации.',
        icon: <Home className="w-10 h-10 text-yellow-400"/>,
    },
    {
        title: 'Монтаж потолков и ламината',
        description: 'Профессиональный монтаж натяжных потолков и укладка ламината любой сложности.',
        icon: <Layers className="w-10 h-10 text-yellow-400"/>,
    },
    {
        title: 'Расчет освещенности',
        description: 'Точный расчет освещения вашего помещения с учетом всех особенностей и пожеланий.',
        icon: <Sun className="w-10 h-10 text-yellow-400"/>,
    },
];

const ServicesContent = () => {
    return (
        <section className="bg-gray-100 py-16">
            <div className="container mx-auto p-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Наши услуги</h2>
                    <p className="text-gray-600">
                        Предлагаем большой спектр работ для вашего комфорта — от замеров до профессионального монтажа и
                        расчётов.
                    </p>
                </div>

                <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
                    {services.map(({title, description, icon}) => (
                        <ServiceContentCard key={title} title={title} description={description} icon={icon}/>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesContent;