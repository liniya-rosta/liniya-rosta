import axiosAPI from "@/src/lib/axiosAPI";
import {FetchRequestsResponse, IRequest, RequestMutation} from "@/src/lib/types";

export const fetchAllRequests = async (
    params?: {
        page?: number;
        status?: string,
        search?: string,
        dateFrom?: string;
        dateTo?: string;
        archived: boolean;
    }
): Promise<FetchRequestsResponse> => {
    const response = await axiosAPI.get<FetchRequestsResponse>("/superadmin/requests",
        {params});

    return response.data;
};

export const fetchOneRequest = async (id: string) => {
    const response = await axiosAPI.get<IRequest>(`/superadmin/requests/${id}`)
    return response.data;
}

export const editRequest = async (request_id: string, state: Partial<RequestMutation>) => {
    await axiosAPI.patch(`/superadmin/requests/${request_id}`, state);
}

export const deleteRequest = async (request_id: string) => {
    await axiosAPI.delete(`/superadmin/requests/${request_id}`);
}