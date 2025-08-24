import React, {useCallback} from 'react';
import Image from "next/image";
import {IMG_BASE} from "@/src/lib/globalConstants";
import {Card, CardDescription, CardHeader, CardTitle} from "@/src/components/ui/card";
import {Badge} from "@/src/components/ui/badge";
import {useLocale, useTranslations} from "next-intl";
import {Product} from "@/src/lib/types";
import Link from "next/link";
import {BtnArrow} from "@/src/components/ui/btn-arrow";

interface Props {
    product: Product;
}

const CeilingsCard: React.FC<Props> = ({product}) => {
    const locale = useLocale() as "ky" | "ru";
    const tBtn = useTranslations("Buttons")

    const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop';
    }, []);

    return (
        <Card key={product._id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow pt-0">
            <div className="relative w-full h-65">
                <Image
                    src={`${IMG_BASE}/${product.cover.url}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={handleImageError}
                    alt={product.title[locale] || 'Product image'}
                    className="object-cover"
                    priority={false}
                />
            </div>
            <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{product.title[locale]}</CardTitle>
                <CardDescription className="line-clamp-2">
                    {product.description?.[locale]}
                </CardDescription>
                <div className="flex flex-col gap-2 mt-auto">
                    <Badge variant="secondary" className="text-sm px-3 py-1 my-1">
                        Категория: {product.category.title[locale]}
                    </Badge>
                    {product.sale && product.sale.isOnSale ?
                        <Badge variant="destructive" className="text-sm px-3 py-1">
                            Скидка: {product.sale?.label}
                        </Badge>
                        : null
                    }
                </div>
            </CardHeader>
            <BtnArrow className="btn-hover-scale mt-auto mx-6">
                <Link href={`/products/${product.slug}`} className="text-sm font-medium">
                    {tBtn("detailBtn")}
                </Link>
            </BtnArrow>
        </Card>
    );
};

export default CeilingsCard;