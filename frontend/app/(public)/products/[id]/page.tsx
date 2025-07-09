import { notFound } from "next/navigation";
import { fetchProductById } from "@/actions/products";
import ProductDetailView from "./ProductDetailView";

interface Props {
    params: { id: string };
}

export default async function ProductDetailPage({ params }: Props) {
    const product = await fetchProductById(params.id);

    if (!product) return notFound();

    return <ProductDetailView product={product} />;
}