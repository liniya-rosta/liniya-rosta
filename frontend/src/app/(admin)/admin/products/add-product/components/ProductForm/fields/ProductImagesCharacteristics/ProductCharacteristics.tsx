import React from 'react';
import {Button} from "@/src/components/ui/button";
import {FormControl, FormField, FormItem} from "@/src/components/ui/form";
import {Input} from "@/src/components/ui/input";
import FormErrorMessage from "@/src/components/ui/FormErrorMessage";
import {Trash2} from "lucide-react";
import {useFieldArray, UseFormReturn} from "react-hook-form";
import {CreateProductFormData} from "@/src/lib/zodSchemas/admin/productSchema";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";

interface Props {
    form: UseFormReturn<CreateProductFormData>;
}

const ProductCharacteristics: React.FC<Props> = ({form}) => {
    const {createLoading} = useAdminProductStore();
    const {
        fields: characteristicFields,
        append: appendCharacteristic,
        remove: removeCharacteristic
    } = useFieldArray({control: form.control, name: "characteristics"});

    return (
        <div className="flex flex-col">
            <Button
                type="button"
                onClick={() => appendCharacteristic({key: "", value: ""})}
                disabled={createLoading}
            >
                Добавить характеристику
            </Button>

            <div className="mt-4 max-h-[300px] md:max-h-[500px] overflow-y-auto p-2 space-y-4">
                {characteristicFields.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-9 gap-4 w-full">
                        <FormField
                            control={form.control}
                            name={`characteristics.${index}.key`}
                            render={({field}) => (
                                <FormItem className="flex flex-col col-span-4">
                                    <FormControl>
                                        <Input placeholder="Ключ" disabled={createLoading} {...field} />
                                    </FormControl>
                                    {form.formState.errors.characteristics?.[index]?.key?.message && (
                                        <FormErrorMessage>
                                            {form.formState.errors.characteristics[index].key.message}
                                        </FormErrorMessage>
                                    )}
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`characteristics.${index}.value`}
                            render={({field}) => (
                                <FormItem className="flex flex-col col-span-4">
                                    <FormControl>
                                        <Input placeholder="Значение" disabled={createLoading} {...field} />
                                    </FormControl>
                                    {form.formState.errors.characteristics?.[index]?.value?.message && (
                                        <FormErrorMessage>
                                            {form.formState.errors.characteristics[index].value.message}
                                        </FormErrorMessage>
                                    )}
                                </FormItem>
                            )}
                        />

                        <div className="flex items-start col-span-1">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeCharacteristic(index)}
                                disabled={createLoading}
                            >
                                <Trash2 className="w-5 h-5"/>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductCharacteristics;