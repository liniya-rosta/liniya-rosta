import React from 'react';
import ClientActions from "@/app/(public)/spc/components/ClientActions";

const InfoAboutSpcLaminate = () => {
    return (
        <div className="relative w-full min-h-[480px] flex items-center mb-20 -mt-17 shadow-md">
            <div
                className="w-full h-[300px] md:h-[400px] bg-no-repeat bg-contain bg-left bg-center"
                style={{
                    backgroundImage: "url('/images/spc/main-bg-spc.png')",
                }}
            >
            </div>

            <div className="mx-auto w-full py-10">
                <h2 className="text-4xl font-bold leading-snug mb-4">
                    Что такое <span className="text-highlight">SPC</span> ламинат?
                </h2>
                <p className="text-base text-muted-foreground max-w-prose">
                    <strong>SPC-ламинат</strong> — это влагостойкое, прочное, долговечное покрытие нового
                    поколения,
                    подходящее практически для любых условий, включая ванные комнаты. Он выглядит как обычный
                    ламинат,
                    но по характеристикам ближе к виниловой плитке или плитке ПВХ.
                </p>

                <ClientActions/>
            </div>
        </div>
    );
};

export default InfoAboutSpcLaminate;
