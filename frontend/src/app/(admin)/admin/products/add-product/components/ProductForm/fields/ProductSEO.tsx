import React from 'react';
import {UseFormReturn} from "react-hook-form";
import {CreateProductFormData} from "@/src/lib/zodSchemas/admin/productSchema";
import {FormControl, FormField, FormItem, FormLabel} from "@/src/components/ui/form";
import {Input} from "@/src/components/ui/input";
import FormErrorMessage from "@/src/components/ui/FormErrorMessage";
import {Textarea} from "@/src/components/ui/textarea";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";

interface Props {
    form: UseFormReturn<CreateProductFormData>;
}

const ProductSeo: React.FC<Props> = ({form}) => {
    const {createLoading} = useAdminProductStore();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
                <FormField
                    control={form.control}
                    name="seoTitle.ru"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>SEO Заголовок</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="SEO заголовок"
                                    disabled={createLoading}
                                    {...field}
                                    value={field.value ?? ""}
                                />
                            </FormControl>
                            {form.formState.errors.seoTitle?.message && (
                                <FormErrorMessage>{form.formState.errors.seoTitle.message}</FormErrorMessage>
                            )}
                        </FormItem>
                    )}
                />
            </div>

            <div className="flex flex-col">
                <FormField
                    control={form.control}
                    name="seoDescription.ru"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>SEO Описание</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="SEO description"
                                    rows={3}
                                    disabled={createLoading}
                                    {...field}
                                    value={field.value ?? ""}
                                />
                            </FormControl>
                            {form.formState.errors.seoDescription?.message && (
                                <FormErrorMessage>{form.formState.errors.seoDescription.message}</FormErrorMessage>
                            )}
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
};

export default ProductSeo;