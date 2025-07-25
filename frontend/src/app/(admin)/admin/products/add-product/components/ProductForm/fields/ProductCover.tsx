import React, {useRef, useState} from 'react';
import {FormControl, FormField, FormItem, FormLabel} from "@/src/components/ui/form";
import {Button} from "@/src/components/ui/button";
import {Input} from "@/src/components/ui/input";
import FormErrorMessage from "@/src/components/ui/FormErrorMessage";
import Image from "next/image";
import {UseFormReturn} from "react-hook-form";
import {CreateProductFormData} from "@/src/lib/zodSchemas/admin/productSchema";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";

interface Props {
    form: UseFormReturn<CreateProductFormData>;
}

const ProductCover: React.FC<Props> = ({form}) => {
    const {createLoading} = useAdminProductStore();

    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        form.setValue("cover", file);
        setCoverPreview(URL.createObjectURL(file));
        await form.trigger("cover");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
                <FormField
                    control={form.control}
                    name="cover"
                    render={() => (
                        <FormItem>
                            <FormLabel>Обложка</FormLabel>
                            <FormControl>
                                <div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={createLoading}
                                        className="w-full"
                                    >
                                        {coverPreview
                                            ? "Изменить обложку"
                                            : "Выбрать обложку"}
                                    </Button>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={onCoverChange}
                                        disabled={createLoading}
                                        className="hidden"
                                    />
                                </div>
                            </FormControl>
                            {form.formState.errors.cover?.message && (
                                <FormErrorMessage>{form.formState.errors.cover.message}</FormErrorMessage>
                            )}
                        </FormItem>
                    )}
                />
            </div>
            <div className="flex flex-col">
                <FormField
                    control={form.control}
                    name="coverAlt"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Альтернативный текст для обложки</FormLabel>
                            <FormControl>
                                <Input placeholder="Например: Изображение Тис Латте"
                                       disabled={createLoading} {...field}
                                       value={field.value ?? ""}/>
                            </FormControl>
                            {form.formState.errors.coverAlt?.message && (
                                <FormErrorMessage>{form.formState.errors.coverAlt.message}</FormErrorMessage>
                            )}
                        </FormItem>
                    )}
                />
            </div>

            {coverPreview && (
                <div className="relative inline-block mt-2">
                    <Image
                        src={coverPreview}
                        alt="Предварительный просмотр"
                        className="w-32 h-32 object-cover rounded-lg border"
                        width={128}
                        height={128}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductCover;