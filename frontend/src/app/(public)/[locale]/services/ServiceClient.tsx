'use client'

import ServicesContent from "@/src/app/(public)/[locale]/services/components/ServicesContent";
import React, {useEffect} from "react";
import { ServiceResponse } from "@/lib/types";
import {useServiceStore} from "@/store/serviceStore";
import LoadingFullScreen from "@/src/components/ui/Loading/LoadingFullScreen";
import ErrorMsg from "@/src/components/ui/ErrorMsg";

interface Props {
    data: ServiceResponse | null;
    error: string | null;
}

const ServiceClient: React.FC<Props> = ({data, error}) => {
    const {setAllServices, fetchLoadingService, setFetchServiceLoading} = useServiceStore();

    useEffect(() => {
        if(data) setAllServices(data.items);
        setFetchServiceLoading(false);
    }, [data, setAllServices, setFetchServiceLoading]);

    if (fetchLoadingService) return <LoadingFullScreen/>;
    if (error) return <ErrorMsg error={error}/>

    return (
        <ServicesContent/>
    )
};

export default ServiceClient;