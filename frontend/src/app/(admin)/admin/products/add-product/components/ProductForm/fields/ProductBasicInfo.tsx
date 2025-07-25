import React from 'react';
import {FormControl, FormField, FormItem, FormLabel} from "@/src/components/ui/form";
import {Input} from "@/src/components/ui/input";
import FormErrorMessage from "@/src/components/ui/FormErrorMessage";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/src/components/ui/select";
import {useCategoryStore} from "@/store/categoriesStore";
import {UseFormReturn} from "react-hook-form";
import {CreateProductFormData} from "@/src/lib/zodSchemas/admin/productSchema";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";

interface Props {
    form: UseFormReturn<CreateProductFormData>;
}

const ProductBasicInfo: React.FC<Props> = ({form}) => {
    const {createLoading} = useAdminProductStore();
    const {categories} = useCategoryStore();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Название *</FormLabel>
                            <FormControl>
                                <Input placeholder="Название продукта" disabled={createLoading} {...field} />
                            </FormControl>
                            {form.formState.errors.title?.message && (
                                <FormErrorMessage>{form.formState.errors.title.message}</FormErrorMessage>
                            )}
                        </FormItem>
                    )}
                />
            </div>

            <div className="flex flex-col">
                <FormField
                    control={form.control}
                    name="category"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Категория *</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={createLoading}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full cursor-pointer">
                                        <SelectValue placeholder="Выберите категорию"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category._id} value={category._id}>
                                            {category.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.category?.message && (
                                <FormErrorMessage>{form.formState.errors.category.message}</FormErrorMessage>
                            )}
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
};

export default ProductBasicInfo;