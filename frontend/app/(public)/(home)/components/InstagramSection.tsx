import React from 'react';

const InstagramSection = () => {
    return (
        <section className="space-y-6 mx-auto">
            <h3 className="main-section-title text-20-30-1_2 from-primary">
                Наша лента в Instagram
            </h3>
            <iframe
                src="//lightwidget.com/widgets/a5595befc0b75c39ae732dfc56693cbd.html"
                className="lightwidget-widget w-full h-[350px] rounded-xl"
            ></iframe>
        </section>
    );
};

export default InstagramSection;