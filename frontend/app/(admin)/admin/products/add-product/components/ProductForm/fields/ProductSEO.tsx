import React from 'react';
import {UseFormReturn} from "react-hook-form";
import {CreateProductFormData} from "@/lib/zodSchemas/admin/productSchema";
import {FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import FormErrorMessage from "@/components/ui/FormErrorMessage";
import {Textarea} from "@/components/ui/textarea";
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
                    name="seoTitle"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>SEO Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="SEO title"
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
                    name="seoDescription"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>SEO Description</FormLabel>
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