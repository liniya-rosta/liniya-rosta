import React from 'react';
import {FormControl, FormField, FormItem, FormLabel} from "@/src/components/ui/form";
import {Textarea} from "@/src/components/ui/textarea";
import FormErrorMessage from "@/src/components/ui/FormErrorMessage";
import {UseFormReturn} from "react-hook-form";
import {CreateProductFormData} from "@/src/lib/zodSchemas/admin/productSchema";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";

interface Props {
    form: UseFormReturn<CreateProductFormData>;
}

const ProductDescription: React.FC<Props> = ({form}) => {
    const {createLoading} = useAdminProductStore();

    return (
        <FormField
            control={form.control}
            name="description.ru"
            render={({field}) => (
                <FormItem className="md:col-span-2">
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder="Описание продукта"
                            rows={3}
                            disabled={createLoading}
                            {...field}
                        />
                    </FormControl>
                    {form.formState.errors.description?.message && (
                        <FormErrorMessage>{form.formState.errors.description.message}</FormErrorMessage>
                    )}
                </FormItem>
            )}
        />
    );
};

export default ProductDescription;