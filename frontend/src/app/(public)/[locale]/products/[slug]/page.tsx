import {Product} from "@/src/lib/types";
import {fetchProductBySlug} from "@/actions/products";
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import ProductDetailView from "@/src/app/(public)/[locale]/products/[slug]/ProductDetailView";
import {handleKyError} from "@/src/lib/handleKyError";

type Props = {
    params: Promise<{ slug: string; locale: 'ru' | 'ky' }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    try {
        const {slug, locale} = await params;
        const product = await fetchProductBySlug(slug);

        const title = product.seoTitle?.[locale] || product.title?.[locale];
        const description = product.seoDescription?.[locale] || `Подробнее о продукте "${product.title?.[locale]}"`;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: [
                    {
                        url: product.cover?.url,
                        alt: product.cover?.alt?.[locale] || product.title?.[locale],
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
    let product: Product | null = null;
    let fetchProductError: string | null = null;
    const tError = await getTranslations("Errors");

    const {slug} = await params;

    try {
        product = await fetchProductBySlug(slug);
    } catch (e) {
        fetchProductError = await handleKyError(e, tError("ceilingDetailError"));
    }

    return (
        <ProductDetailView
            productData={product}
            fetchProductError={fetchProductError}
        />
    );
}