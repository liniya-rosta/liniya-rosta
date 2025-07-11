import React from 'react';

const InstagramSection = () => {
    return (
        <section className="space-y-6 mx-auto">
            <h3 className="text-3xl font-bold text-center from-primary">
                Наша лента в Instagram
            </h3>
            <iframe
                src="//lightwidget.com/widgets/a5595befc0b75c39ae732dfc56693cbd.html"
                className="lightwidget-widget w-full h-[400px]"
            ></iframe>
        </section>
    );
};

export default InstagramSection;