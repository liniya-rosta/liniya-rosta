import React from 'react';
import {Card, CardFooter, CardHeader} from "@/src/components/ui/card";
import {Skeleton} from "@/src/components/ui/skeleton";

const ProductsSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({length: 6}).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full"/>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4"/>
                        <Skeleton className="h-4 w-full"/>
                        <Skeleton className="h-4 w-1/2"/>
                    </CardHeader>
                    <CardFooter>
                        <Skeleton className="h-10 w-full"/>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};

export default ProductsSkeleton;