import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/src/components/ui/select";
import {Category} from "@/src/lib/types";

interface CategoryFilterProps {
    selectedCategoryId: string | null;
    onCategoryChange: (id: string) => void;
    categories: Category[];
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
                                                           selectedCategoryId,
                                                           onCategoryChange,
                                                           categories
                                                       }) => {
    return (
        <Select
            value={selectedCategoryId ?? "all"}
            onValueChange={onCategoryChange}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Все категории"/>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                        {category.title.ru}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default CategoryFilter;