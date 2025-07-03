import React from 'react';
import {FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import FormErrorMessage from "@/components/ui/FormErrorMessage";
import {UseFormReturn} from "react-hook-form";
import {CreateProductFormData} from "@/lib/zodSchemas/admin/productSchema";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";

interface Props {
    form: UseFormReturn<CreateProductFormData>;
}

const ProductDescription: React.FC<Props> = ({form}) => {
    const {createLoading} = useAdminProductStore();

    return (
        <FormField
            control={form.control}
            name="description"
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