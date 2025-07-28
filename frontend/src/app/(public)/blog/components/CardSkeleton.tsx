import {Card, CardFooter, CardHeader} from "@/src/components/ui/card";
import {Skeleton} from "@/src/components/ui/skeleton";
import React from "react";

const CardSkeleton = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-foreground">Блог</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <Skeleton className="h-48 w-full" />
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </CardHeader>
                        <CardFooter>
                            <Skeleton className="h-10 w-32 ml-auto" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
};

export default CardSkeleton;