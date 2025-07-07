"use client";

import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Product} from "@/lib/types";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
import {useCategoryStore} from "@/store/categoriesStore";
import {useRef, useState} from "react";
import {updateProduct} from "@/actions/superadmin/products";
import {toast} from "react-toastify";
import {Trash2} from "lucide-react";
import Image from "next/image";
import {UpdateProductFormData, updateProductSchema} from "@/lib/zodSchemas/admin/productSchema";
import {API_BASE_URL} from "@/lib/globalConstants";
import {isAxiosError} from "axios";

interface Props {
    open: boolean;
    onClose: () => void;
    product: Product;
}

const ProductEditModal: React.FC<Props> = ({open, onClose, product}) => {
    const {categories} = useCategoryStore();
    const {
        updateLoading,
        setUpdateError,
        products,
        setProducts
    } = useAdminProductStore();

    const [coverPreview, setCoverPreview] = useState<string | null>(product.cover?.url ? `${API_BASE_URL}/${product.cover.url}` : null);
    const [iconPreview, setIconPreview] = useState<string | null>(product.icon?.url ? `${API_BASE_URL}/${product.icon.url}` : null);

    const form = useForm<UpdateProductFormData>({
        resolver: zodResolver(updateProductSchema),
        defaultValues: {
            title: product.title,
            category: product.category._id,
            description: product.description || "",
            coverAlt: product.cover?.alt || "",
            iconAlt: product.icon?.alt || "",
            sale: product.sale || {isOnSale: false, label: ""},
            characteristics: product.characteristics || [],
        },
    });

    const {
        fields: characteristicFields,
        append: appendCharacteristic,
        remove: removeCharacteristic
    } = useFieldArray({control: form.control, name: "characteristics"});

    const fileInputCoverRef = useRef<HTMLInputElement>(null);
    const fileInputIconRef = useRef<HTMLInputElement>(null);

    const onCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        form.setValue("cover", file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const onIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        form.setValue("icon", file);
        setIconPreview(URL.createObjectURL(file));
    };

    const onSubmit = async (data: UpdateProductFormData) => {
        try {
            setUpdateError(null);
            const updated = await updateProduct(product._id, data);
            setProducts(products.map((p) => (p._id === updated._id ? updated : p)));
            toast.success("Продукт успешно обновлён");
            onClose();
        } catch (e) {
            if (isAxiosError(e)){
                setUpdateError(e.response?.data.error);
                toast.error(e.response?.data.error);
            } else {
                toast.error("Ошибка при обновлении продукта");
            }
            console.error(e);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Редактировать продукт</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Название</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Название продукта" disabled={updateLoading} {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="category"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Категория</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={updateLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full cursor-pointer">
                                                    <SelectValue placeholder="Выберите категорию"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat._id} value={cat._id}>
                                                        {cat.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Описание</FormLabel>
                                    <FormControl>
                                        <Textarea rows={3} placeholder="Описание продукта" disabled={updateLoading} {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                            <FormField
                                control={form.control}
                                name="cover"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Обложка</FormLabel>
                                        <FormControl>
                                            <div>
                                                <Button type="button" variant="outline" onClick={() => fileInputCoverRef.current?.click()}>
                                                    {coverPreview ? "Изменить обложку" : "Загрузить обложку"}
                                                </Button>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    ref={fileInputCoverRef}
                                                    onChange={onCoverChange}
                                                    className="hidden"
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="coverAlt"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Alt текст обложки</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Описание" {...field} value={field.value ?? ""} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {coverPreview && (
                                <Image
                                    src={coverPreview}
                                    alt="предпросмотр"
                                    width={128}
                                    height={128}
                                    className="rounded border object-cover mt-2"
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                            <FormField
                                control={form.control}
                                name="icon"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Иконка</FormLabel>
                                        <FormControl>
                                            <div>
                                                <Button type="button" variant="outline" onClick={() => fileInputIconRef.current?.click()}>
                                                    {iconPreview ? "Изменить иконку" : "Загрузить иконку"}
                                                </Button>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    ref={fileInputIconRef}
                                                    onChange={onIconChange}
                                                    className="hidden"
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="iconAlt"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Alt текст иконки</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Описание иконки" disabled={updateLoading} {...field} value={field.value ?? ""} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {iconPreview && (
                                <Image
                                    src={iconPreview}
                                    alt="предпросмотр"
                                    width={64}
                                    height={64}
                                    className="rounded border object-cover mt-2"
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="sale.isOnSale"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Товар по акции?</FormLabel>
                                        <Select
                                            onValueChange={(val) => field.onChange(val === "true")}
                                            value={field.value ? "true" : "false"}
                                            disabled={updateLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full cursor-pointer">
                                                    <SelectValue placeholder="Акционный товар?"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="true">Да</SelectItem>
                                                <SelectItem value="false">Нет</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                            <Input placeholder="Например: -20%" disabled={updateLoading} {...field} value={field.value ?? ""}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <Button
                                type="button"
                                onClick={() => appendCharacteristic({key: "", value: ""})}
                                disabled={updateLoading}
                            >
                                Добавить характеристику
                            </Button>

                            {characteristicFields.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-9 gap-4 items-end">
                                    <FormField
                                        control={form.control}
                                        name={`characteristics.${index}.key`}
                                        render={({field}) => (
                                            <FormItem className="col-span-4">
                                                <FormControl>
                                                    <Input placeholder="Ключ" disabled={updateLoading} {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`characteristics.${index}.value`}
                                        render={({field}) => (
                                            <FormItem className="col-span-4">
                                                <FormControl>
                                                    <Input placeholder="Значение" disabled={updateLoading} {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <div className="col-span-1">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeCharacteristic(index)}
                                            disabled={updateLoading}
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-2 pt-6">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Отмена
                            </Button>
                            <Button type="submit" disabled={updateLoading}>
                                Сохранить
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ProductEditModal;