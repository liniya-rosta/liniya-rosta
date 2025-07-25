import ProductDetailView from "@/app/(public)/ceilings/[id]/ProductDetailView";
import {Product} from "@/lib/types";
import {fetchProductById} from "@/actions/products";
import {isAxiosError} from "axios";
import {Metadata} from "next";

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    try {
        const {id} = await params;
        const product = await fetchProductById(id);

        return {
            title: product.seoTitle || product.title,
            description: product.seoDescription || `Подробнее о продукте "${product.title}"`,
            openGraph: {
                title: product.seoTitle || product.title,
                description: product.seoDescription || `Описание продукта ${product.title}`,
                images: [
                    {
                        url: product.cover?.url,
                        alt: product.cover?.alt || product.title,
                    },
                ],
                type: "website",
            },
        };
    } catch {
        return {
            title: "Продукт не найден",
            description: "Информация о продукте недоступна",
        };
    }
}

export default async function ProductDetailPage({params}: Props) {
    const {id} = await params;
    let product: Product | null = null;
    let fetchProductError: string | null = null;

    try {
        product = await fetchProductById(id);
    } catch (e) {
        fetchProductError =
            isAxiosError(e) && e.response?.data?.error
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