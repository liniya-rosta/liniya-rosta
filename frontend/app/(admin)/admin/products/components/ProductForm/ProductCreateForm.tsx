'use client';

import React, {useRef, useState} from "react";
import {Resolver, useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Image from "next/image";
import {Loader2, Trash2} from "lucide-react";
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
    const router = useRouter();

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
                url: null,
            },
        },
    });
    const {fields, append, remove} = useFieldArray({control: form.control, name: "images",});
    const {
        fields: characteristicFields,
        append: appendCharacteristic,
        remove: removeCharacteristic
    } = useFieldArray({control: form.control, name: "characteristics"});

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const iconInputRef = useRef<HTMLInputElement>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);

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

    const onIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        form.setValue("icon.url", file);
        setIconPreview(URL.createObjectURL(file));
        await form.trigger("icon.url");
    };

    const onSubmit = async (data: CreateProductFormData) => {
        data.images = data.images.filter(image => image.url instanceof File);
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
                                    <FormLabel>Обложка</FormLabel>
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
                                                    ? "Изменить обложку"
                                                    : "Выбрать обложку"}
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
                        <FormField
                            control={form.control}
                            name="icon.url"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Иконка</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => iconInputRef.current?.click()}
                                                disabled={loading}
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
                                                disabled={loading}
                                                className="hidden"
                                            />
                                        </div>
                                    </FormControl>
                                    {form.formState.errors.icon?.url?.message && (
                                        <FormErrorMessage>
                                            {form.formState.errors.icon.url.message}
                                        </FormErrorMessage>
                                    )}
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <FormField
                            control={form.control}
                            name="icon.alt"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Альтернативный текст для иконки</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Например: Логотип Евробагета"
                                               disabled={loading} {...field} />
                                    </FormControl>
                                    {form.formState.errors.icon?.alt?.message && (
                                        <FormErrorMessage>
                                            {form.formState.errors.icon.alt.message}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 border-t border-t-gray-500 pt-10">
                    <div className="flex flex-col">
                        <Button
                            type="button"
                            onClick={() => {
                                const lastImage = form.getValues("images")?.at(-1);
                                if (lastImage && !(lastImage.url instanceof File)) return;
                                append({alt: "", url: null});
                            }}
                            className='cursor-pointer mb-2'
                            disabled={loading}
                        >
                            Добавить изображение
                        </Button>

                        {form.formState.errors.images?.message && (
                            <FormErrorMessage>{form.formState.errors.images.message}</FormErrorMessage>
                        )}

                        <div className="mt-4 max-h-[300px] md:max-h-[500px]  overflow-y-auto p-2 space-y-4">
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
                            onClick={() => appendCharacteristic({key: "", value: ""})}
                            disabled={loading}
                        >
                            Добавить характеристику
                        </Button>

                        <div className="mt-4 max-h-[300px] md:max-h-[500px]  overflow-y-auto  space-y-4">
                            {characteristicFields.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-9 gap-4 w-full">
                                    <FormField
                                        control={form.control}
                                        name={`characteristics.${index}.key`}
                                        render={({field}) => (
                                            <FormItem className="flex flex-col col-span-4">
                                                <FormControl>
                                                    <Input placeholder="Ключ" disabled={loading} {...field} />
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
                                                    <Input placeholder="Значение" disabled={loading} {...field} />
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
                                            disabled={loading}
                                        >
                                            <Trash2 className="w-5 h-5"/>
                                        </Button>
                                    </div>
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