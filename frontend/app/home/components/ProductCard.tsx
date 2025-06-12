import React from 'react';
import Image from 'next/image';
import {AspectRatio} from '@/components/ui/aspect-ratio';
import {Card, CardContent, CardFooter} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {API_BASE_URL} from '@/lib/globalConstants';
import {Product} from "@/lib/types";

interface Props {
    product: Product;
}

const ProductCard: React.FC<Props> = ({product}) => (
    <Card className="group overflow-hidden hover:shadow-md transition-all">
        <AspectRatio ratio={4 / 3}>
            <Image
                src={`${API_BASE_URL}/${product.image}`}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </AspectRatio>
        <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold line-clamp-1">{product.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
            <Badge variant="secondary" className="mt-2">
                {product.category?.title}
            </Badge>
        </CardContent>
        <CardFooter className="p-4 pt-0">
            <Button className="w-full">Подробнее</Button>
        </CardFooter>
    </Card>
);

export default ProductCard;