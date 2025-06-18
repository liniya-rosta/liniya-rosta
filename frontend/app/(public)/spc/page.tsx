import React from 'react';
import SpcLaminatePage from "@/app/(public)/spc/SpcLaminatePage";
import {fetchLaminateItems} from "@/actions/laminateItems";
import { Laminate } from "@/lib/types";
import AdvantagesLaminate from "@/app/(public)/spc/components/AdvantagesLaminate";
import InfoAboutSpcLaminate from "@/app/(public)/spc/components/InfoAboutSpcLaminate";

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
        <div className="container mx-auto">
            <InfoAboutSpcLaminate />

            <AdvantagesLaminate/>

            <SpcLaminatePage initialData={laminateData} error={error}/>
        </div>
    );
};

export default SpcPage;