import axiosAPI from "@/lib/axiosAPI";
import {PortfolioItemPreview} from "@/lib/types";

export const fetchPortfolio = async () => {
    const response = await axiosAPI<PortfolioItemPreview[]>("/portfolio-items");

    return response.data;
}