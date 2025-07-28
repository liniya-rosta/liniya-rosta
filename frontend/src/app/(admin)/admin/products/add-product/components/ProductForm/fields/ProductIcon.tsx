import {UseFormReturn} from "react-hook-form";
import {CreateProductFormData} from "@/src/lib/zodSchemas/admin/productSchema";
import React, {useRef, useState} from "react";
import {FormControl, FormField, FormItem, FormLabel} from "@/src/components/ui/form";
import {Button} from "@/src/components/ui/button";
import {Input} from "@/src/components/ui/input";
import FormErrorMessage from "@/src/components/ui/FormErrorMessage";
import Image from "next/image";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";

interface Props {
    form: UseFormReturn<CreateProductFormData>;
}

const ProductIcon: React.FC<Props> = ({form}) => {
    const {createLoading} = useAdminProductStore();

    const iconInputRef = useRef<HTMLInputElement>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);

    const onIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        form.setValue("icon", file);
        setIconPreview(URL.createObjectURL(file));
        await form.trigger("icon");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
                <FormField
                    control={form.control}
                    name="icon"
                    render={() => (
                        <FormItem>
                            <FormLabel>Иконка</FormLabel>
                            <FormControl>
                                <div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => iconInputRef.current?.click()}
                                        disabled={createLoading}
                                        className="w-full"
                                    >
                                        {iconPreview
                                            ? "Изменить иконку"
                                            : "Выбрать иконку"}
                                    </Button>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        ref={iconInputRef}
                                        onChange={onIconChange}
                                        disabled={createLoading}
                                        className="hidden"
                                    />
                                </div>
                            </FormControl>
                            {form.formState.errors.icon?.message && (
                                <FormErrorMessage>
                                    {form.formState.errors.icon?.message}
                                </FormErrorMessage>
                            )}
                        </FormItem>
                    )}
                />
            </div>

            <div className="flex flex-col">
                <FormField
                    control={form.control}
                    name="iconAlt"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Альтернативный текст для иконки</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Например: Логотип Евробагета"
                                    disabled={createLoading}
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                            {form.formState.errors.iconAlt?.message && (
                                <FormErrorMessage>
                                    {form.formState.errors.iconAlt.message}
                                </FormErrorMessage>
                            )}
                        </FormItem>
                    )}
                />
            </div>

            {iconPreview && (
                <div className="relative inline-block mt-2">
                    <Image
                        src={iconPreview}
                        alt="Предпросмотр иконки"
                        className="w-16 h-16 object-cover rounded border"
                        width={64}
                        height={64}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductIcon;