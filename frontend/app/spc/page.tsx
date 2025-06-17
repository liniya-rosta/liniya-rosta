import React from 'react';
import SpcLaminatePage from "@/app/spc/SpcLaminatePage";
import {fetchLaminateItems} from "@/actions/laminateItems";
import { Laminate } from "@/lib/types";
import AdvantagesLaminate from "@/app/spc/components/AdvantagesLaminate";
import InfoAboutSpcLaminate from "@/app/spc/components/InfoAboutSpcLaminate";

const SpcPage = async () => {
    let laminateData: Laminate[] | null = null;
    let error: string | null = null;

    try {
        laminateData = await fetchLaminateItems();
    } catch (e) {
        if (e instanceof Error) {
            error = e.message;
        } else {
            error = 'Ошибка при получении данных';
        }
    }

    return (
        <div className="container">
            <InfoAboutSpcLaminate />

            <AdvantagesLaminate/>

            <SpcLaminatePage initialData={laminateData} error={error}/>
        </div>
    );
};

export default SpcPage;