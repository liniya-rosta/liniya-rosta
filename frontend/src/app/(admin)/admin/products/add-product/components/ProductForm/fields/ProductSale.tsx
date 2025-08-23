import React from 'react';
import {FormControl, FormField, FormItem, FormLabel} from "@/src/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/src/components/ui/select";
import FormErrorMessage from "@/src/components/ui/FormErrorMessage";
import {Input} from "@/src/components/ui/input";
import {UseFormReturn} from "react-hook-form";
import {CreateProductFormData} from "@/src/lib/zodSchemas/admin/productSchema";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
import dayjs from "dayjs";

interface Props {
    form: UseFormReturn<CreateProductFormData>;
}

const ProductSale: React.FC<Props> = ({form}) => {
    const {createLoading} = useAdminProductStore();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="sale.isOnSale"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Товар по акции?</FormLabel>
                        <Select
                            onValueChange={(value) => field.onChange(value === "true")}
                            value={field.value ? "true" : "false"}
                            disabled={createLoading}
                        >
                            <FormControl>
                                <SelectTrigger className='w-full cursor-pointer'>
                                    <SelectValue placeholder="Акционный товар?"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="true">Да</SelectItem>
                                <SelectItem value="false">Нет</SelectItem>
                            </SelectContent>
                        </Select>
                        {form.formState.errors.sale?.isOnSale?.message && (
                            <FormErrorMessage>
                                {form.formState.errors.sale?.isOnSale?.message}
                            </FormErrorMessage>
                        )}
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="sale.label"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Текст акции</FormLabel>
                        <FormControl>
                            <Input placeholder="Например: -20%" disabled={createLoading} {...field}
                                   value={field.value ?? ""}/>
                        </FormControl>
                        {form.formState.errors.sale?.label?.message && (
                            <FormErrorMessage>
                                {form.formState.errors.sale?.label?.message}
                            </FormErrorMessage>
                        )}
                    </FormItem>

                )}
            />

            <FormField
                control={form.control}
                name="sale.saleDate"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Делайн акции</FormLabel>
                        <FormControl>
                            <Input
                                type="date"
                                value={field.value ? dayjs(field.value).format("YYYY-MM-DD") : ""}
                                onChange={(e) =>
                                    field.onChange(
                                        e.target.value ? e.target.value : null
                                    )
                                }
                                placeholder="Скидка действует до"
                                disabled={createLoading}
                            />
                        </FormControl>
                        {form.formState.errors.sale?.saleDate?.message && (
                            <FormErrorMessage>
                                {form.formState.errors.sale?.saleDate?.message}
                            </FormErrorMessage>
                        )}
                    </FormItem>

                )}
            />
        </div>
    );
};

export default ProductSale;