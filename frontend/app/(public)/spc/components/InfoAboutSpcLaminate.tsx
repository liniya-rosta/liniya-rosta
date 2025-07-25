import React from 'react';
import ClientActions from "@/app/(public)/spc/components/ClientActions";

const InfoAboutSpcLaminate = () => {
    return (
            <div className="relative w-full h-[450px] flex items-center justify-center text-white mt-[-32] mb-[70px] sm:mb-[48px]">
                <div className="absolute inset-0 bg-[url('/images/spc-laminate.png')] bg-cover bg-center
                before:absolute before:inset-0 before:bg-black/65 before:content-[''] z-0" />
                <div className="relative z-10 px-4 text-center max-w-[90%]">
                    <h2 className="text-23-30-1_5 font-semibold mb-4">Что такое SPC ламинат?</h2>
                    <p className="sm:text-base max-w-[600px] mb-5 text-sm">
                        SPC-ламинат — это влагостойкое, прочное, долговечное покрытие нового поколения, подходящее
                        практически для любых условий, включая ванные комнаты. Он выглядит как обычный ламинат, но
                        по характеристикам ближе к виниловой плитке или плитке ПВХ.
                    </p>
                    <ClientActions />
                </div>
            </div>
    );
};

export default InfoAboutSpcLaminate;
