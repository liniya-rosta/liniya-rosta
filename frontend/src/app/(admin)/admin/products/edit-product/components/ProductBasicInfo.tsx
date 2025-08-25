import React, {useState} from 'react';
import {Label} from "@/src/components/ui/label";
import {Input} from "@/src/components/ui/input";
import FormErrorMessage from "@/src/components/ui/FormErrorMessage";
import {Button} from "@/src/components/ui/button";
import Image from "next/image";
import {Trash2} from "lucide-react";
import {
    Control,
    Controller,
    FieldArrayWithId,
    FieldErrors,
    UseFieldArrayAppend,
    UseFieldArrayRemove,
    UseFormRegister, UseFormSetValue
} from "react-hook-form";
import {UpdateProductFormData} from "@/src/lib/zodSchemas/admin/productSchema";
import {Category} from "@/src/lib/types";
import ConfirmDialog from '@/src/components/ui/ConfirmDialog';

interface ProductBasicInfoProps {
    updateLoading: boolean;
    errors: FieldErrors<UpdateProductFormData>;
    register: UseFormRegister<UpdateProductFormData>;
    categories: Category[];
    fileInputCoverRef: React.RefObject<HTMLInputElement | null>;
    coverPreview: string | null;
    onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileInputIconRef: React.RefObject<HTMLInputElement | null>
    iconPreview: string | null;
    setIconPreview: React.Dispatch<React.SetStateAction<string | null>>;
    appendCharacteristic: UseFieldArrayAppend<UpdateProductFormData, "characteristics">;
    onIconChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    characteristicFields: FieldArrayWithId<UpdateProductFormData, "characteristics">[];
    removeCharacteristic: UseFieldArrayRemove;
    setValue: UseFormSetValue<UpdateProductFormData>;
    control: Control<UpdateProductFormData>;
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
                                                               updateLoading,
                                                               errors,
                                                               register,
                                                               categories,
                                                               fileInputCoverRef,
                                                               coverPreview,
                                                               onCoverChange,
                                                               fileInputIconRef,
                                                               iconPreview,
                                                               setIconPreview,
                                                               appendCharacteristic,
                                                               onIconChange,
                                                               characteristicFields,
                                                               removeCharacteristic,
                                                               setValue,
                                                               control
                                                           }) => {

    const [showIconConfirm, setShowIconConfirm] = useState<boolean>(false);

    const handleDeleteIcon = () => setShowIconConfirm(true);

    const confirmDeleteIcon = () => {
        setValue("icon", null, { shouldDirty: true, shouldValidate: true });
        setValue("iconAlt.ru", "", { shouldDirty: true, shouldValidate: true });
        setIconPreview(null);

        if (fileInputIconRef.current) {
            fileInputIconRef.current.value = "";
        }

        setShowIconConfirm(false);
    };

    return (
        <>
            <div>
                <Label className="mb-2 block">Название товара</Label>
                <Input className="mb-2" type="text" placeholder="Введите цепляющий заголовок" {...register("title.ru")}
                       disabled={updateLoading}/>
                {errors.title?.ru && <FormErrorMessage>{errors.title.ru.message}</FormErrorMessage>}
            </div>

            <div>
                <Label className="mb-2 block">Категория</Label>
                <select {...register("category")} disabled={updateLoading}
                        className="mb-2 w-full rounded-md text-sm border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900">
                    <option value="">Выберите категорию</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={String(cat._id)}>
                            {cat.title.ru}
                        </option>
                    ))}
                </select>
                {errors.category && <FormErrorMessage>{errors.category.message}</FormErrorMessage>}
            </div>

            <div>
                <Label className="mb-2 block">Описание</Label>
                <Input className="mb-2" placeholder="Описание" {...register("description.ru")} disabled={updateLoading}/>
                {errors.description?.ru && <FormErrorMessage>{errors.description.ru.message}</FormErrorMessage>}
            </div>

            <div>
                <Label className="mb-2 block">SEO заголовок</Label>
                <Input className="mb-2" placeholder="SEO заголовок" {...register("seoTitle.ru")} disabled={updateLoading}/>
                {errors.seoTitle?.ru && <FormErrorMessage>{errors.seoTitle.ru.message}</FormErrorMessage>}
            </div>

            <div>
                <Label className="mb-2 block">SEO описание</Label>
                <Input className="mb-2" placeholder="SEO описание" {...register("seoDescription.ru")} disabled={updateLoading}/>
                {errors.seoDescription?.ru && <FormErrorMessage>{errors.seoDescription.ru.message}</FormErrorMessage>}
            </div>

            <div className="flex items-center gap-4">
                <div>
                    <Label className="mb-2 block">Обложка</Label>
                    <Button type="button" onClick={() => fileInputCoverRef.current?.click()} variant="outline">
                        {coverPreview ? "Изменить обложку" : "Загрузить обложку"}
                    </Button>
                    <input type="file" accept="image/*" {...register("cover")} ref={fileInputCoverRef}
                           onChange={onCoverChange} className="hidden"/>
                </div>
                {coverPreview && <Image src={coverPreview} alt="предпросмотр" width={128} height={128}
                                        className="rounded border object-cover"/>}
            </div>
            <div>
                <Label className="mb-2 block">Alt текст обложки</Label>
                <Input placeholder="Описание" {...register("coverAlt.ru")} disabled={updateLoading}/>
            </div>

            <div className="flex items-center gap-4">
                <div>
                    <Label className="mb-2 block">Иконка</Label>
                    <Button type="button" onClick={() => fileInputIconRef.current?.click()} variant="outline">
                        {iconPreview ? "Изменить иконку" : "Загрузить иконку"}
                    </Button>
                    {iconPreview && (
                        <Button
                            type="button"
                            variant="destructive"
                            className="ml-3"
                            onClick={handleDeleteIcon}
                            disabled={updateLoading}
                        >
                            Удалить инконку
                        </Button>
                    )}
                    <input type="file" accept="image/*" {...register("icon")} ref={fileInputIconRef}
                           onChange={onIconChange} className="hidden"/>
                </div>
                {iconPreview && <Image src={iconPreview} alt="предпросмотр" width={64} height={64}
                                       className="rounded border object-cover"/>}
            </div>
            <div>
                <Label className="mb-2 block">Alt текст иконки</Label>
                <Input placeholder="Описание иконки" {...register("iconAlt.ru")} disabled={updateLoading}/>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="mb-2 block">Товар по акции?</Label>
                    <Controller
                        name="sale.isOnSale"
                        control={control}
                        render={({field}) => (
                            <select
                                {...field}
                                value={field.value ? "true" : "false"}
                                onChange={(e) => field.onChange(e.target.value === "true")}
                                disabled={updateLoading}
                                className="w-full rounded-md text-sm border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900"
                            >
                                <option value="false">Нет</option>
                                <option value="true">Да</option>
                            </select>
                        )}
                    />
                    {errors.sale?.isOnSale && <FormErrorMessage>{errors.sale.isOnSale.message}</FormErrorMessage>}
                </div>
                <div>
                    <Label className="mb-2 block">Текст акции</Label>
                    <Input className="mb-2" placeholder="Например: -20%" {...register("sale.label")} disabled={updateLoading}/>
                    {errors.sale?.label && <FormErrorMessage>{errors.sale?.label.message}</FormErrorMessage>}
                </div>
                <div>
                    <Label className="mb-2 block">Дедлайн скидки</Label>
                    <Input className="mb-2" type="date" placeholder="Скидка продлится до" {...register("sale.saleDate")}
                           disabled={updateLoading}/>
                    {errors.sale?.saleDate && <FormErrorMessage>{errors.sale?.saleDate.message}</FormErrorMessage>}
                </div>
            </div>

            <div className="space-y-4">
                <Button type="button" onClick={() => appendCharacteristic({key: {ru: ""}, value: {ru: ""}})}
                        disabled={updateLoading}>
                    Добавить характеристику
                </Button>

                {characteristicFields.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-9 gap-4 items-end">
                        <Input placeholder="Ключ" {...register(`characteristics.${index}.key.ru`)}
                               className="col-span-4" disabled={updateLoading}/>
                        <Input placeholder="Значение" {...register(`characteristics.${index}.value.ru`)}
                               className="col-span-4" disabled={updateLoading}/>
                        <Button type="button" variant="destructive" size="icon" className="col-span-1"
                                onClick={() => removeCharacteristic(index)} disabled={updateLoading}>
                            <Trash2 className="w-4 h-4"/>
                        </Button>
                    </div>
                ))}
            </div>

            <ConfirmDialog
                open={showIconConfirm}
                onOpenChange={setShowIconConfirm}
                title="Удалить иконку?"
                text="Вы уверены, что хотите удалить иконку?"
                onConfirm={confirmDeleteIcon}
                loading={updateLoading}
                confirmText="Удалить"
                cancelText="Отмена"
            />
        </>
    );
};

export default ProductBasicInfo;