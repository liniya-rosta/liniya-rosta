import React from 'react';
import ClientActions from "@/src/app/(public)/[locale]/spc/components/ClientActions";
import {getTranslations} from "next-intl/server";
import AnimatedEntrance from "@/src/components/shared/AnimatedEntrance";
import {Container} from "@/src/components/shared/Container";

const InfoAboutSpcLaminate = async () => {
    const tSpc = await getTranslations('SpcPage');
    const rawTitle = tSpc('title');
    const [before, highlight, after] = rawTitle.split(/[[\]]{2}highlight[[\]]{2}|[[\]]{2}\/highlight[[\]]{2}/);

    return (
        <div className="shadow-md">
            <Container>
                <div className='w-full flex justify-end items-center pb-10 mb-20 -mt-8 '>
                    <div className="w-full flex justify-end my-5">
                        <AnimatedEntrance>
                            <h2 className="text-30-48-1_2 font-bold leading-snug mb-4">
                                {before}
                                <span className="text-highlight">{highlight}</span>
                                {after}
                            </h2>
                            <p className="hidden sm:block text-base text-muted-foreground max-w-prose mb-4">
                                {tSpc("fullDescription")}
                            </p>
                            <p className="sm:hidden text-base text-muted-foreground max-w-prose mb-4">
                                {tSpc("shortDescription")}
                            </p>
                            <ClientActions/>
                        </AnimatedEntrance>
                    </div>

                    <div
                        className="hidden w-full h-[410px] md:block bg-no-repeat bg-contain bg-[position:center_right]"
                        style={{
                            backgroundImage: "url('/images/spc/main-bg-spc.webp')",
                        }}
                    >
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default InfoAboutSpcLaminate;
