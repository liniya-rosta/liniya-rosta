'use client';

import { Category, Product } from "@/lib/types";
import { useEffect, useState, useRef } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useProductStore } from "@/store/productsStore";
import { useCategoryStore } from "@/store/categoriesStore";
import { createProduct, updateProduct, deleteProduct } from "@/actions/products";
import { AxiosError } from 'axios';
import Loading from "@/components/shared/Loading";
import { useForm } from 'react-hook-form';
import { CreateProductFormData, UpdateProductFormData, createProductSchema, updateProductSchema } from '@/lib/zodSchemas/productSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from "next/image";
import { API_BASE_URL } from "@/lib/globalConstants";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';


interface ProductsClientProps {
    initialProducts: Product[];
    initialCategories: Category[];
    initialError: string | null;
}

const ProductsClient: React.FC<ProductsClientProps> = ({initialProducts, initialCategories, initialError}) => {
    const {
        products,
        setProducts,
        fetchProductsLoading,
        fetchProductsError,
        setFetchProductsLoading,
        setFetchProductsError,
    } = useProductStore();

    const {
        categories,
        setCategories,
    } = useCategoryStore();

    const [isHydrating, setIsHydrating] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isEditing = !!editingProduct;

    type ProductFormUnionData = CreateProductFormData | UpdateProductFormData;

    const formKey = isEditing ? `update-form-${editingProduct?._id || 'new'}` : 'create-form';


    const form = useForm<ProductFormUnionData>({
        resolver: zodResolver(isEditing ? updateProductSchema : createProductSchema),
        defaultValues: {
            category: editingProduct ? (typeof editingProduct.category === 'object' ? editingProduct.category._id : editingProduct.category) : "",
            title: editingProduct?.title || "",
            description: editingProduct?.description || "",
            image: undefined,
        } as ProductFormUnionData
    });

    useEffect(() => {
        if (editingProduct) {
            form.reset({
                category: typeof editingProduct.category === 'object' ? editingProduct.category._id : editingProduct.category,
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
            fileInputRef.current.value = '';
        }
        form.clearErrors();
    }, [editingProduct, form]);


    useEffect(() => {
        if (initialProducts) setProducts(initialProducts);
        if (initialCategories) setCategories(initialCategories);
        setFetchProductsError(initialError);
        setFetchProductsLoading(false);
        setIsHydrating(false);
    }, [initialProducts, initialCategories, initialError, setProducts, setCategories, setFetchProductsError, setFetchProductsLoading]);

    const resetAndCloseModal = () => {
        setEditingProduct(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setIsModalOpen(false);
        setFetchProductsError(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('image', file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            form.setValue('image', undefined);
            setImagePreview(null);
        }
        form.trigger('image');
    };

    const clearImage = () => {
        form.setValue('image', null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        form.trigger('image');
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
        setFetchProductsError(null);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
        setFetchProductsError(null);
    };

    const onSubmit = async (formData: ProductFormUnionData) => {
        setActionLoading(true);
        try {
            let resultProduct: Product;
            if (isEditing) {

                const updateFormData = formData as UpdateProductFormData;
                if (!editingProduct) throw new Error('Editing product is null');

                const productDataForUpdate: { category: string; title: string; description?: string } = {
                    category: updateFormData.category,
                    title: updateFormData.title,
                    description: updateFormData.description || "",
                };

                const imageFileOrNull = updateFormData.image === null ? undefined : (updateFormData.image instanceof File ? updateFormData.image : undefined);

                resultProduct = await updateProduct(editingProduct._id, productDataForUpdate, imageFileOrNull);
                setProducts(products.map(product =>
                    product._id === editingProduct._id ? resultProduct : product
                ));
                alert('Товар успешно обновлен!');
            } else {
                const createFormData = formData as CreateProductFormData;

                const productDataForCreate: { category: string; title: string; description?: string; image: File } = {
                    category: createFormData.category,
                    title: createFormData.title,
                    description: createFormData.description || "",
                    image: createFormData.image!,
                };

                resultProduct = await createProduct(productDataForCreate, productDataForCreate.image);
                setProducts([...products, resultProduct]);
                alert('Товар успешно создан!');
            }
            resetAndCloseModal();
        } catch (err) {
            const errorMessage = err instanceof AxiosError
                ? err.response?.data?.error
                : err instanceof Error
                    ? err.message
                    : 'Ошибка при сохранении товара';
            setFetchProductsError(errorMessage);
            alert(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!window.confirm("Вы уверены, что хотите удалить этот товар?")) return;

        try {
            setActionLoading(true);
            await deleteProduct(id);
            setProducts(products.filter(product => product._id !== id));
            alert('Товар успешно удален!');
        } catch (err) {
            const errorMessage = err instanceof AxiosError
                ? err.response?.data?.error
                : 'Ошибка при удалении товара';
            setFetchProductsError(errorMessage);
            alert(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const getCategoryTitle = (category: string | Category) => {
        if (typeof category === 'object' && category !== null) {
            return category.title;
        }
        const found = categories.find(cat => cat._id === category);
        return found ? found.title : String(category);
    };

    if (isHydrating || fetchProductsLoading) return <Loading />;

    if (fetchProductsError) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <Alert variant="destructive" className="max-w-md">
                    <AlertDescription>
                        Ошибка при загрузке продуктов: {fetchProductsError}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground text-center sm:text-left">Управление
                        продуктами</h1>
                    <p className="text-muted-foreground mt-1 text-center sm:text-left">Создавайте и редактируйте
                        товары</p>
                </div>
                <Button onClick={openCreateModal} disabled={actionLoading} className="flex items-center gap-2 w-full sm:w-auto">
                    <Plus size="{16}"/>
                    Добавить продукт
                </Button>
            </div>


            <CardContent className='px-0'>
                {products.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Продукты не найдены</p>
                        <p className="text-sm mt-2">Нажмите "Добавить продукт" для создания первого товара</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                                <div key={product._id}>
                                    <Card className="min-w-[300px]">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="outline">
                                                            {getCategoryTitle(product.category)}
                                                        </Badge>
                                                    </div>
                                                    {product.description && (
                                                        <p className="text-muted-foreground line-clamp-3">
                                                            {product.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openEditModal(product)}
                                                        disabled={actionLoading}
                                                    >
                                                        <Pencil size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteProduct(product._id)}
                                                        disabled={actionLoading}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                            {product.image && (
                                                <div className="relative w-full h-48 mt-4">
                                                    <Image
                                                        src={`${API_BASE_URL}/${product.image}`}
                                                        fill
                                                        sizes="100vw"
                                                        alt={product.title}
                                                        className="object-cover rounded-lg"
                                                        onError={(e) => {
                                                            console.error('Image failed to load:', product.image);
                                                            console.error('Attempted URL:', `${API_BASE_URL}/${product.image}`);
                                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                    {index < products.length - 1 && <Separator />}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>


            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? 'Редактировать продукт' : 'Добавить новый продукт'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? 'Измените данные продукта и нажмите сохранить.'
                                : 'Заполните форму для создания нового товара.'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" key={formKey}>
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
                                                    disabled={actionLoading}
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
                                                disabled={actionLoading}
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
                                                    disabled={actionLoading}
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
                                            <FormLabel>
                                                Изображение {isEditing ? '' : '*'}
                                            </FormLabel>
                                            <FormControl>
                                                <div className="space-y-4">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        disabled={actionLoading}
                                                        className="w-full"
                                                    >
                                                        {imagePreview ? 'Изменить изображение' : 'Выбрать изображение'}
                                                    </Button>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        ref={fileInputRef}
                                                        onChange={handleImageChange}
                                                        disabled={actionLoading}
                                                        className="hidden"
                                                    />

                                                    {imagePreview && (
                                                        <div className="relative inline-block mt-2">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Предварительный просмотр"
                                                                className="w-32 h-32 object-cover rounded-lg border"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={clearImage}
                                                                disabled={actionLoading}
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

                            <DialogFooter className="mt-6 flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={resetAndCloseModal}
                                    disabled={actionLoading}
                                >
                                    Отмена
                                </Button>
                                <Button type="submit" disabled={actionLoading}>
                                    {actionLoading
                                        ? 'Сохранение...'
                                        : isEditing
                                            ? 'Сохранить изменения'
                                            : 'Создать продукт'
                                    }
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductsClient;