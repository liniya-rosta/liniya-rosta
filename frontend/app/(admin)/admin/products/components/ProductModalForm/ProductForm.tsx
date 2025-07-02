import React, {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Image from "next/image";
import {Loader2, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Product} from "@/lib/types";
import {API_BASE_URL} from "@/lib/globalConstants";
import {
    CreateProductFormData,
    createProductSchema,
    UpdateProductFormData,
    updateProductSchema
} from "@/lib/zodSchemas/productSchema";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
import {createProduct, updateProduct} from "@/actions/superadmin/products";
import {toast} from "react-toastify";
import {AxiosError} from "axios";
import {useCategoryStore} from "@/store/categoriesStore";
import {cn} from "@/lib/utils";

interface ProductFormProps {
    isEditing: boolean;
    editingProduct: Product | null;
    onCancel?: () => void;
}

type FormData = CreateProductFormData | UpdateProductFormData;

const ProductForm: React.FC<ProductFormProps> = ({isEditing, editingProduct, onCancel}) => {
    const {
        products,
        setProducts,
        createLoading,
        updateLoading,
        createError,
        updateError,
        setCreateLoading,
        setUpdateLoading,
        setCreateError,
        setUpdateError,
    } = useAdminProductStore();
    const {categories} = useCategoryStore();

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loading = createLoading || updateLoading;

    const form = useForm<FormData>({
        resolver: zodResolver(isEditing ? updateProductSchema : createProductSchema),
        defaultValues: {
            category: isEditing ? editingProduct?.category._id : "",
            title: editingProduct?.title || "",
            description: editingProduct?.description || "",
            cover: undefined,
        } as CreateProductFormData | UpdateProductFormData,
    });

    useEffect(() => {
        if (editingProduct) {
            form.reset({
                category: editingProduct.category._id,
                title: editingProduct.title,
                description: editingProduct.description || "",
                cover: undefined,
            } as UpdateProductFormData);

            if (editingProduct.cover) {
                setImagePreview(`${API_BASE_URL}/${editingProduct.cover.url}`);
            } else {
                setImagePreview(null);
            }
        } else {
            form.reset({
                category: "",
                title: "",
                description: "",
            } as CreateProductFormData);
            setImagePreview(null);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        form.clearErrors();
    }, [editingProduct, form]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("cover", file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            form.setValue("cover", undefined);
            setImagePreview(null);
        }
        form.trigger("cover");
    };

    const clearImage = () => {
        form.setValue("cover", null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        form.trigger("cover");
    };

    const handleSubmitForm = async (data: CreateProductFormData | UpdateProductFormData) => {
        try {
            if (isEditing && editingProduct) {
                setUpdateLoading(true);
                setUpdateError(null);

                const updatedProduct = await updateProduct(
                    editingProduct._id,
                    data as UpdateProductFormData,
                    data.cover ?? undefined
                );

                const updatedCategory = categories.find(cat => cat._id === updatedProduct.category._id);
                if (updatedCategory) updatedProduct.category = updatedCategory;

                setProducts(products.map(p =>
                    p._id === updatedProduct._id ? updatedProduct : p
                ));

                toast.success("Продукт успешно обновлен");

                form.reset({
                    category: updatedCategory?._id || "",
                    title: updatedProduct.title,
                    description: updatedProduct.description || "",
                    cover: undefined,
                });

                if (updatedProduct.cover) {
                    setImagePreview(`${API_BASE_URL}/${updatedProduct.cover.url}`);
                } else {
                    setImagePreview(null);
                }
                onCancel?.()
            } else {
                setCreateLoading(true);
                setCreateError(null);

                const newProduct = await createProduct(
                    data as CreateProductFormData,
                    data.cover ?? undefined
                );

                setProducts([...products, newProduct]);
                toast.success("Продукт успешно создан");

                form.reset();
                setImagePreview(null);
                onCancel?.();
            }
        } catch (e) {
            if (e instanceof AxiosError) {
                if (isEditing) {
                    setUpdateError(e.response?.data.error);
                } else {
                    setCreateError(e.response?.data.error);
                }
                toast.error(e.response?.data.error);
            } else {
                toast.error('Неизвестная ошибка');
            }
            console.error(e);
        } finally {
            setCreateLoading(false);
            setUpdateLoading(false);
        }
    };

    return (
        <Form {...form} key={editingProduct?._id || "new"}>
            <form
                onSubmit={form.handleSubmit(handleSubmitForm)}
                className={cn("space-y-6", loading && "opacity-50 pointer-events-none")}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Название *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Название продукта"
                                        disabled={loading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

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
                                        <SelectTrigger>
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
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

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
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="cover"
                        render={() => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Изображение {isEditing ? "" : "*"}</FormLabel>
                                <FormControl>
                                    <div className="space-y-4">
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
                                            onChange={handleImageChange}
                                            disabled={loading}
                                            className="hidden"
                                        />

                                        {imagePreview && (
                                            <div className="relative inline-block mt-2">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Предварительный просмотр"
                                                    className="w-32 h-32 object-cover rounded-lg border"
                                                    width={128}
                                                    height={128}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={clearImage}
                                                    disabled={loading}
                                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                                                >
                                                    <X size={12}/>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                {(createError || updateError) && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            {createError || updateError}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex justify-end space-x-2">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Отмена
                        </Button>
                    )}
                    <Button type="submit" disabled={loading}>
                        {loading
                            ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            : isEditing
                                ? "Сохранить изменения"
                                : "Создать продукт"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ProductForm;