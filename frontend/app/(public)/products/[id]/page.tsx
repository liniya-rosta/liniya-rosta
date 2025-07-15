import ProductDetailView from "@/app/(public)/products/[id]/ProductDetailView";
import {Product} from "@/lib/types";
import {fetchProductById} from "@/actions/products";
import {isAxiosError} from "axios";

export default async function ProductDetailPage({params}: {
    params: Promise<{ id: string }>;
}) {
    const {id} = await params;
    let product: Product | null = null;
    let fetchProductError: string | null = null;

    try {
        product = await fetchProductById(id);
    } catch (e) {
        fetchProductError = isAxiosError(e) && e.response?.data?.error
            ? e.response.data.error
            : "Ошибка при загрузке продукта";
    }

    return (
        <ProductDetailView
            productData={product}
            fetchProductError={fetchProductError}
        />
    );
}