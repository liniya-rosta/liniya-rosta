import React from 'react';
import {Card, CardContent} from '@/src/components/ui/card';
import {Category} from "@/lib/types";

interface Props {
    category: Category;
}

const CategoryCard: React.FC<Props> = ({category}) => (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col justify-between">
        <CardContent className="p-6 flex flex-col items-center gap-2 flex-grow justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏗️</span>
            </div>
            <h3 className="font-medium text-center line-clamp-2 min-h-[48px] flex items-center justify-center">
                {category.title}
            </h3>
        </CardContent>
    </Card>
);

export default CategoryCard;