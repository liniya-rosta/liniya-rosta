import {useFieldArray, UseFormReturn} from "react-hook-form";
import {CreateProductFormData} from "@/src/lib/zodSchemas/admin/productSchema";
import {Button} from "@/src/components/ui/button";
import FormErrorMessage from "@/src/components/ui/FormErrorMessage";
import {FormControl, FormField, FormItem, FormLabel} from "@/src/components/ui/form";
import {Input} from "@/src/components/ui/input";
import Image from "next/image";
import React from "react";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";

interface Props {
    form: UseFormReturn<CreateProductFormData>;
}

const ProductImages: React.FC<Props> = ({form}) => {
    const {createLoading} = useAdminProductStore();
    const {fields, append, remove} = useFieldArray({control: form.control, name: "images",});

    const onImagesChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        form.setValue(`images.${index}.image`, file, {shouldValidate: true});
    };

    return (
        <div className="flex flex-col">
            <Button
                type="button"
                onClick={() => {
                    const lastImage = form.getValues("images")?.at(-1);
                    if (lastImage && !(lastImage.image instanceof File)) return;
                    append({alt: {ru: ""}, image: null});
                }}
                className='cursor-pointer'
                disabled={createLoading}
            >
                Добавить изображение
            </Button>

            {form.formState.errors.images?.message && (
                <div className='mt-2'>
                    <FormErrorMessage>{form.formState.errors.images.message}</FormErrorMessage>
                </div>
            )}

            <div className="mt-4 max-h-[300px] md:max-h-[500px] overflow-y-auto p-2 space-y-4">
                {fields.map((item, index) => (
                    <div key={item.id} className="border rounded-lg p-4 bg-white shadow-sm space-y-4">
                        <FormField
                            control={form.control}
                            name={`images.${index}.alt`}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Альтернативный текст одного изображения</FormLabel>
                                    <FormControl>
                                        <Input
                                            value={field.value?.ru || ""}
                                            onChange={(e) => field.onChange({ ru: e.target.value })}
                                            name={field.name}
                                            ref={field.ref}
                                            onBlur={field.onBlur}
                                            disabled={createLoading}
                                            placeholder="Например: Изображение SPC ламината Дуб Сканди"
                                        />
                                    </FormControl>
                                    {form.formState.errors.images?.[index]?.alt?.message && (
                                        <FormErrorMessage>
                                            {form.formState.errors.images?.[index]?.alt?.message}
                                        </FormErrorMessage>
                                    )}
                                </FormItem>
                            )}
                        />

                        <Input
                            type="file"
                            accept="image/*"
                            className='cursor-pointer transition-opacity duration-200 hover:opacity-75'
                            disabled={createLoading}
                            onChange={(e) => onImagesChange(index, e)}
                        />
                        {form.formState.errors.images?.[index]?.image?.message && (
                            <FormErrorMessage>
                                {form.formState.errors.images?.[index]?.image?.message}
                            </FormErrorMessage>
                        )}
                        <div className="flex items-center justify-between pt-2">
                            {(() => {
                                const file = form.watch(`images.${index}.image`);
                                if (!(file instanceof File)) return null;

                                const objectUrl = URL.createObjectURL(file);
                                return (
                                    <Image
                                        src={objectUrl}
                                        alt={form.watch(`images.${index}.alt.ru`) || "предпросмотр"}
                                        width={96}
                                        height={96}
                                        className="rounded border object-cover w-24 h-24"
                                    />
                                );
                            })()}

                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => remove(index)}
                                disabled={createLoading}
                            >
                                Удалить
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductImages;