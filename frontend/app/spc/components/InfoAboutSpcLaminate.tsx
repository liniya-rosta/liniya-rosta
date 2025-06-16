import React from 'react';
import ClientActions from "@/app/spc/components/ClientActions";
import Image from "next/image";

const InfoAboutSpcLaminate = () => {
    return (
        <div className="flex items-center -mt-8 mb-18">
            <div className="w-[40%]">
                <h2 className="text-2xl pb-3">Что такое SPC Ламинат?</h2>
                <p>
                    SPC-ламинат — это влагостойкое, прочное, долговечное покрытие нового поколения, подходящее
                    практически для любых условий, включая ванные комнаты. Он выглядит как обычный ламинат, но
                    по
                    характеристикам ближе к виниловой плитке или плитке ПВХ.
                </p>
                <ClientActions/>
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
    );
};

export default InfoAboutSpcLaminate;