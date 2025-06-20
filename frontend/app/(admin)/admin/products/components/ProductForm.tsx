import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Category, Product } from "@/lib/types";
import { API_BASE_URL } from "@/lib/globalConstants";
import {
    CreateProductFormData,
    createProductSchema,
    UpdateProductFormData,
    updateProductSchema
} from "@/lib/zodSchemas/productSchema";

interface ProductFormProps {
    isEditing: boolean;
    editingProduct: Product | null;
    categories: Category[];
    loading: boolean;
    onSubmit: (formData: CreateProductFormData | UpdateProductFormData, isEditingMode: boolean) => void;
    onCancel?: () => void;
    createError?: string | null;
    updateError?: string | null;
}

const ProductForm: React.FC<ProductFormProps> = ({isEditing, editingProduct, categories, loading, onSubmit, onCancel, createError, updateError}) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<CreateProductFormData | UpdateProductFormData>({
        resolver: zodResolver(isEditing ? updateProductSchema : createProductSchema),
        defaultValues: {
            category: isEditing
                ? typeof editingProduct?.category === "object"
                    ? editingProduct.category._id
                    : editingProduct?.category
                : "",
            title: editingProduct?.title || "",
            description: editingProduct?.description || "",
            image: undefined,
        } as CreateProductFormData | UpdateProductFormData,
    });

    useEffect(() => {
        if (editingProduct) {
            form.reset({
                category:
                    typeof editingProduct.category === "object"
                        ? editingProduct.category._id
                        : editingProduct.category,
                title: editingProduct.title,
                description: editingProduct.description || "",
                image: undefined,
            } as UpdateProductFormData);

            if (editingProduct.image) {
                setImagePreview(`${API_BASE_URL}/${editingProduct.image}`);
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
            form.setValue("image", file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            form.setValue("image", undefined);
            setImagePreview(null);
        }
        form.trigger("image");
    };

    const clearImage = () => {
        form.setValue("image", null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        form.trigger("image");
    };

    const handleSubmit = (data: CreateProductFormData | UpdateProductFormData) => {
        onSubmit(data, isEditing);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Название *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Название продукта"
                                        disabled={loading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Категория *</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={loading}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Выберите категорию" />
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="image"
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
                                                    <X size={12} />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
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
                            ? "Сохранение..."
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