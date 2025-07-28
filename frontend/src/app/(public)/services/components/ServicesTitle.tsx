import React from 'react';
import {Check} from "lucide-react";

const ServicesTitle = () => {
    return (
        <div className="max-w-lg text-popover drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
            <h1 className="text-4xl font-bold mb-8">
                Линия роста —{' '}
                <span className="text-highlight-light">мы работаем</span>,{' '}
                <span className="text-popover/90">вы отдыхаете.</span>
            </h1>

            <h2 className="text-2xl font-semibold mb-4">Наши преимущества:</h2>
            <ul className="space-y-4">
                {[
                    'Самое крупное производство багета в Кыргызстане 🇰🇬',
                    'Высокое качество материалов',
                    'Уникальная технология производства натяжных потолков',
                    'Идеальный SPC ламинат'].map((text) => (
                    <li key={text} className="flex items-center space-x-3">
                        <Check className="w-6 h-6 text-highlight-light flex-shrink-0"/>
                        <span>{text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ServicesTitle;