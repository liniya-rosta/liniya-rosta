import axiosAPI from "@/lib/axiosAPI";


export const fetchLaminateItems = async () => {
        const response = await axiosAPI('/laminate-items');
        return response.data;
};