import AdminServiceClient from "@/src/app/(admin)/admin/services/AdminServiceClient";
import {ServiceResponse} from "@/lib/types";
import {fetchAllServices} from "@/actions/services";
import {isAxiosError} from "axios";

const AdminServicePage = async () => {
    let services: ServiceResponse | null = null;
    let errorMessage: string | null = null;

    try {
        services = await fetchAllServices();
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            errorMessage = error.response.data.error;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = "Неизвестная ошибка при загрузке услуг";
        }
    }
    return(
        <>
            <AdminServiceClient data={services} error={errorMessage}/>
        </>

    )
}

export default AdminServicePage;