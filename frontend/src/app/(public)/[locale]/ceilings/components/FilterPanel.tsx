import React from 'react';
import AnimatedEntrance from "@/src/components/shared/AnimatedEntrance";
import {Card, CardContent, CardHeader, CardTitle} from "@/src/components/ui/card";
import {Filter, Search, X} from "lucide-react";
import {Input} from "@/src/components/ui/input";
import {Button} from "@/src/components/ui/button";
import { Category } from '@/src/lib/types';
import {useLocale, useTranslations} from "next-intl";

interface FilterPanelProps {
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchTitle: string;
    clearSearch: () => void;
    handleCategoryChange: (category: string) => void;
    categoryId: string;
    categories: Category[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
                                                     handleSearchChange,
                                                     searchTitle,
                                                     clearSearch,
                                                     handleCategoryChange,
                                                     categoryId,
                                                     categories
                                                 }) => {

    const tCeilings = useTranslations("CeilingsPage");
    const locale = useLocale() as "ky" | "ru";

    return (
        <AnimatedEntrance
            direction="bottom"
            duration={0.8}
            className="lg:max-w-[300px]"
        >
            <Card className="sticky top-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5"/>
                        {tCeilings("filter.categoriesTitle")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                        <Input
                            type="text"
                            placeholder={tCeilings("filter.filterSearch")}
                            value={searchTitle}
                            onChange={handleSearchChange}
                            className="pl-10"
                        />
                        {searchTitle && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearSearch}
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                            >
                                <X className="h-3 w-3"/>
                            </Button>
                        )}
                    </div>

                    <AnimatedEntrance direction="bottom" className="space-y-2">
                        <div
                            onClick={() => handleCategoryChange('all')}
                            className={`cursor-pointer p-3 rounded-lg transition-colors ${
                                categoryId === 'all'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <span>{tCeilings("filter.allProducts")}</span>
                            </div>
                        </div>
                        {categories
                            .filter(category => category.title[locale].toLowerCase() !== "spc")
                            .map(category => (
                                <div
                                    key={category._id}
                                    onClick={() => handleCategoryChange(category._id)}
                                    className={`cursor-pointer p-3 rounded-lg transition-colors ${
                                        categoryId === category._id
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                    }`}
                                >
                                    <div className="flex justify-between items-center gap-3">
                                        <span>{category.title[locale]}</span>
                                    </div>
                                </div>
                            ))}
                    </AnimatedEntrance>
                </CardContent>
            </Card>
        </AnimatedEntrance>
    );
};

export default FilterPanel;