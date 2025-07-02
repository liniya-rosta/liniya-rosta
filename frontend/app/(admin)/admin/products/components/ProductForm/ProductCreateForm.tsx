'use client';

import React, {useRef, useState} from "react";
import {Resolver, useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Image from "next/image";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {CreateProductFormData, createProductSchema,} from "@/lib/zodSchemas/productSchema";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
import {createProduct} from "@/actions/superadmin/products";
import {toast} from "react-toastify";
import {AxiosError} from "axios";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";
import ErrorMsg from "@/components/ui/ErrorMsg";
import {Category} from "@/lib/types";
import FormErrorMessage from "@/components/ui/FormErrorMessage";

interface Props {
    categories: Category[];
    categoriesError: string | null;
}

const ProductCreateForm: React.FC<Props> = ({categories, categoriesError}) => {
    const {
        createLoading,
        createError,
        setCreateLoading,
        setCreateError,
    } = useAdminProductStore();

    const form = useForm<CreateProductFormData>({
        resolver: zodResolver(createProductSchema) as Resolver<CreateProductFormData>,
        mode: "onChange",
        defaultValues: {
            title: "",
            category: "",
            description: "",
            cover: null,
            coverAlt: "",
            images: [],
            characteristics: [],

            sale: {
                isOnSale: false,
                label: "",
            },
            icon: {
                alt: "",
                url: "",
            },
        },
    });
    const {fields, append, remove} = useFieldArray({control: form.control, name: "images",});
    const router = useRouter();

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const loading = createLoading;
    const overallError = categoriesError || createError;

    const onCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        form.setValue("cover", file);
        setImagePreview(URL.createObjectURL(file));
        await form.trigger("cover");
    };

    const onImagesChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        form.setValue(`images.${index}.url`, file, {shouldValidate: true});
    };

    const onSubmit = async (data: CreateProductFormData) => {
        try {
            setCreateLoading(true);
            setCreateError(null);
            await createProduct(data);
            toast.success("Продукт успешно создан");
            setImagePreview(null);
            router.push("/admin/products");
        } catch (e) {
            if (e instanceof AxiosError) {
                setCreateError(e.response?.data.error);
                toast.error(e.response?.data.error);
            } else {
                toast.error('Неизвестная ошибка');
            }
            console.error(e);
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("space-y-6", loading && "opacity-50 pointer-events-none")}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Название *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Название продукта" disabled={loading} {...field} />
                                    </FormControl>
                                    {form.formState.errors.title?.message && (
                                        <FormErrorMessage>{form.formState.errors.title.message}</FormErrorMessage>
                                    )}
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Категория *</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={loading}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full cursor-pointer">
                                                <SelectValue placeholder="Выберите категорию"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category._id} value={category._id}>
                                                    {category.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.category?.message && (
                                        <FormErrorMessage>{form.formState.errors.category.message}</FormErrorMessage>
                                    )}
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

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
                                    disabled={loading}
                                    {...field}
                                />
                            </FormControl>
                            {form.formState.errors.description?.message && (
                                <FormErrorMessage>{form.formState.errors.description.message}</FormErrorMessage>
                            )}
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <FormField
                            control={form.control}
                            name="cover"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Изображение</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={loading}
                                                className="w-full"
                                            >
                                                {imagePreview
                                                    ? "Изменить изображение"
                                                    : "Выбрать изображение"}
                                            </Button>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                ref={fileInputRef}
                                                onChange={onCoverChange}
                                                disabled={loading}
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
                                               disabled={loading} {...field}
                                               value={field.value ?? ""}/>
                                    </FormControl>
                                    {form.formState.errors.coverAlt?.message && (
                                        <FormErrorMessage>{form.formState.errors.coverAlt.message}</FormErrorMessage>
                                    )}
                                </FormItem>
                            )}
                        />
                    </div>

                    {imagePreview && (
                        <div className="relative inline-block mt-2">
                            <Image
                                src={imagePreview}
                                alt="Предварительный просмотр"
                                className="w-32 h-32 object-cover rounded-lg border"
                                width={128}
                                height={128}
                            />
                        </div>
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
                                    onValueChange={(value) => field.onChange(value === "true")}
                                    value={field.value ? "true" : "false"}
                                    disabled={loading}
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
                                    <Input placeholder="Например: -20%" disabled={loading} {...field}
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <Button
                            type="button"
                            onClick={() => append({alt: "", url: null})}
                            disabled={loading}
                        >
                            Добавить изображение
                        </Button>

                        <div className="mt-4 max-h-[700px] overflow-y-auto p-2 space-y-4">
                            <div className='space-y-4'>
                                {fields.map((item, index) => (
                                    <div key={item.id} className="border rounded-lg p-4 bg-white shadow-sm space-y-4">
                                        <FormField
                                            control={form.control}
                                            name={`images.${index}.alt`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Alt изображения</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={loading}/>
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
                                            disabled={loading}
                                            onChange={(e) => onImagesChange(index, e)}
                                        />
                                        {form.formState.errors.images?.[index]?.url?.message && (
                                            <FormErrorMessage>
                                                {form.formState.errors.images?.[index]?.url?.message}
                                            </FormErrorMessage>
                                        )}
                                        <div className="flex items-center justify-between pt-2">
                                            {(() => {
                                                const file = form.watch(`images.${index}.url`);
                                                if (!(file instanceof File)) return null;

                                                const objectUrl = URL.createObjectURL(file);
                                                return (
                                                    <Image
                                                        src={objectUrl}
                                                        alt={form.watch(`images.${index}.alt`) || "предпросмотр"}
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
                                                disabled={loading}
                                            >
                                                Удалить
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <Button
                            type="button"
                            onClick={() =>
                                form.setValue(
                                    "characteristics",
                                    [...(form.getValues("characteristics") || []), {key: "", value: ""}]
                                )
                            }
                            disabled={loading}
                        >
                            Добавить характеристику
                        </Button>

                        <div className="mt-4 max-h-[700px] overflow-y-auto p-2 space-y-4">
                            {form.watch("characteristics")?.map((_, index) => (
                                <div key={index} className="grid grid-cols-2 gap-4 w-full">
                                    <FormField
                                        control={form.control}
                                        name={`characteristics.${index}.key`}
                                        render={({field}) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Ключ</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ключ" disabled={loading} {...field} />
                                                </FormControl>
                                                {form.formState.errors.characteristics?.[index]?.key?.message && (
                                                    <FormErrorMessage>
                                                        {form.formState.errors.characteristics?.[index]?.key?.message}
                                                    </FormErrorMessage>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`characteristics.${index}.value`}
                                        render={({field}) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Значение</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Значение" disabled={loading} {...field} />
                                                </FormControl>
                                                {form.formState.errors.characteristics?.[index]?.value?.message && (
                                                    <FormErrorMessage>
                                                        {form.formState.errors.characteristics?.[index]?.value?.message}
                                                    </FormErrorMessage>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {(overallError) && <ErrorMsg error={overallError}/>}

                <div className="flex justify-end space-x-2 mb-10">
                    <Button type="submit" disabled={loading} className='cursor-pointer w-full'>
                        {loading
                            ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            : "Создать продукт"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ProductCreateForm;