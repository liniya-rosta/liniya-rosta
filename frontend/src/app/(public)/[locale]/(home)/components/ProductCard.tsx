import React from 'react';
import Image from 'next/image';
import {AspectRatio} from '@/src/components/ui/aspect-ratio';
import {Card, CardContent, CardFooter} from '@/src/components/ui/card';
import {Button} from '@/src/components/ui/button';
import {Badge} from '@/src/components/ui/badge';
import {IMG_BASE} from '@/src/lib/globalConstants';
import {Product} from "@/src/lib/types";
import Link from "next/link";
import {useLocale, useTranslations} from "next-intl";

interface Props {
    product: Product;
}

const ProductCard: React.FC<Props> = ({product}) => {
    const locale = useLocale() as "ru" | "ky";
    const tBtn = useTranslations("Buttons")

    return (
        <Card className="flex flex-col h-full">
            <div className="flex-shrink-0">
                <AspectRatio ratio={4 / 3}>
                    <Image
                        src={`${IMG_BASE}/${product.cover.url}`}
                        alt={product.title[locale] ?? "Изображение продукта"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </AspectRatio>
            </div>

            <CardContent className="p-4 flex flex-col flex-grow">
                <div className="space-y-2 flex-grow">
                    <h3 className="font-semibold line-clamp-1">{product.title[locale]}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                        {product.description?.[locale]}
                    </p>
                </div>
                <div className="mt-2">
                    <Badge variant="secondary">
                        {product.category?.title[locale]}
                    </Badge>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Link href={`/products/${product.slug}`} className="w-full">
                    <Button className="w-full btn-hover-scale">{tBtn("detailBtn")}</Button>
                </Link>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;
