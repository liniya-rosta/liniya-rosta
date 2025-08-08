import AdminServiceClient from "@/src/app/(admin)/admin/services/AdminServiceClient";
import {ServiceResponse} from "@/src/lib/types";
import {fetchAllServices} from "@/actions/services";
import {handleKyError} from "@/src/lib/handleKyError";

const AdminServicePage = async () => {
    let services: ServiceResponse | null = null;
    let errorMessage: string | null = null;

    try {
        services = await fetchAllServices();
    } catch (error) {
        errorMessage = await handleKyError(error, "Неизвестная ошибка при загрузке услуг");
    }
    return (
        <>
            <AdminServiceClient data={services} error={errorMessage}/>
        </>

    )
}

export default AdminServicePage;