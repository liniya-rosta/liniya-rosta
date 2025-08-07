import {FetchRequestsResponse, IRequest, RequestMutation} from "@/src/lib/types";
import kyAPI from "@/src/lib/kyAPI";

type ReqParams = {
    page?: number;
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    archived: boolean;
};

export const fetchAllRequests = async (params: ReqParams): Promise<FetchRequestsResponse> => {
    const sp = new URLSearchParams();

    if (params.page != null) sp.set("page", String(params.page));
    if (params.status)      sp.set("status", params.status);
    if (params.search)      sp.set("search", params.search);
    if (params.dateFrom)    sp.set("dateFrom", params.dateFrom);
    if (params.dateTo)      sp.set("dateTo", params.dateTo);

    // важное отличие от axios: не отправляем "false" строкой, шлём "0/1"
    sp.set("archived", params.archived ? "1" : "0");

    console.log("GET /superadmin/requests?", sp.toString());

    return await kyAPI
        .get("superadmin/requests", { searchParams: sp })
        .json<FetchRequestsResponse>();
};

export const fetchOneRequest = async (id: string) => {
    return await kyAPI.get(`superadmin/requests/${id}`).json<IRequest>();
};

export const editRequest = async (request_id: string, state: Partial<RequestMutation>) => {
    await kyAPI.patch(`superadmin/requests/${request_id}`, { json: state });
};

export const deleteRequest = async (request_id: string) => {
    await kyAPI.delete(`superadmin/requests/${request_id}`).json<{ message: string }>();
};