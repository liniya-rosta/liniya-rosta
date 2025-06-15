'use client';

import { Category, Product } from "@/lib/types";
import { useEffect, useState, useRef } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useProductStore } from "@/store/productsStore";
import { useCategoryStore } from "@/store/categoriesStore";
import { createProduct, updateProduct, deleteProduct } from "@/actions/products";
import { AxiosError } from 'axios';
import Loading from "@/components/shared/Loading";
import { useForm } from 'react-hook-form';
import { CreateProductFormData, UpdateProductFormData, createProductSchema, updateProductSchema } from '@/lib/zodSchemas/productSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from "next/image";
import {API_BASE_URL} from "@/lib/globalConstants";

interface ProductsClientProps {
    initialProducts: Product[];
    initialCategories: Category[];
    initialError: string | null;
}

const ProductsClient: React.FC<ProductsClientProps> = ({initialProducts, initialCategories, initialError}) => {
    const {
        products,
        setProducts,
        setLoading,
        setError,
        addProduct,
        updateProduct: updateProductInStore,
        removeProduct,
        clearError,
        loading,
        error: storeError
    } = useProductStore();

    const {
        categories,
        setCategories,
    } = useCategoryStore();

    const [isHydrating, setIsHydrating] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<CreateProductFormData | UpdateProductFormData>({
        resolver: zodResolver(isAdding ? createProductSchema : updateProductSchema),
        defaultValues: {
            category: "",
            title: "",
            description: "",
            image: null
        }
    });

    useEffect(() => {
        if (initialProducts) setProducts(initialProducts);
        if (initialCategories) setCategories(initialCategories);
        setError(initialError);
        setLoading(false);
        setIsHydrating(false);
    }, [initialProducts, initialCategories, initialError, setProducts, setCategories, setError, setLoading]);

    const resetForm = () => {
        reset({
            category: "",
            title: "",
            description: "",
            image: null
        });
        setEditingId(null);
        setIsAdding(false);
        clearImage();
    };

    const clearImage = () => {
        setValue('image', null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue('image', file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingId(product._id);
        reset({
            category: typeof product.category === 'object' ? product.category._id : product.category,
            title: product.title,
            description: product.description || "",
            image: null
        });
        setIsAdding(false);
        clearImage();
        clearError();
    };

    const handleAdd = () => {
        resetForm();
        setIsAdding(true);
        clearError();
    };

    const handleCreateProduct = async (formData: CreateProductFormData) => {
        try {
            if (!formData.image) {
                alert('Пожалуйста, выберите изображение для нового товара');
                return;
            }

            const productData = {
                category: formData.category,
                title: formData.title,
                description: formData.description || "",
                image: ""
            };

            const newProduct = await createProduct(productData, formData.image);
            addProduct(newProduct);

            resetForm();
            alert('Товар успешно создан!');
        } catch (err) {
            const errorMessage = err instanceof AxiosError
                ? err.response?.data?.error
                : 'Ошибка при создании товара';
            alert(errorMessage);
        }
    };

    const handleUpdateProduct = async (formData: UpdateProductFormData) => {
        if (!editingId) return;

        try {
            const productData = {
                category: formData.category,
                title: formData.title,
                description: formData.description || "",
                image: ""
            };

            const updatedProduct = await updateProduct(editingId, productData, formData.image || undefined);
            updateProductInStore(editingId, updatedProduct);

            resetForm();
            alert('Товар успешно обновлен!');
        } catch (err) {
            const errorMessage = err instanceof AxiosError
                ? err.response?.data?.error
                : 'Ошибка при обновлении товара';
            alert(errorMessage);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!window.confirm("Вы уверены, что хотите удалить этот товар?")) return;

        try {
            await deleteProduct(id);
            removeProduct(id);
            alert('Товар успешно удален!');
        } catch (err) {
            const errorMessage = err instanceof AxiosError
                ? err.response?.data?.error
                : 'Ошибка при удалении товара';
            alert(errorMessage);
        }
    };

    const onSubmit = (formData: CreateProductFormData | UpdateProductFormData) => {
        if (isAdding) {
            handleCreateProduct(formData as CreateProductFormData);
        } else if (editingId) {
            handleUpdateProduct(formData as UpdateProductFormData);
        }
    };

    const getCategoryTitle = (category: string | Category) => {
        if (typeof category === 'object' && category !== null) {
            return category.title;
        }
        const found = categories.find(cat => cat._id === category);
        return found ? found.title : String(category);
    };

    if (isHydrating || loading) return <Loading />;
    if (storeError) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="text-center">
                    <p className="text-red-600 mb-4">
                        Ошибка при загрузке продуктов: {storeError}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Управление продуктами</h1>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={16} />
                    Добавить продукт
                </button>
            </div>

            {(isAdding || editingId) && (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">
                            {isAdding ? 'Добавить новый продукт' : 'Редактировать продукт'}
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Название *
                                </label>
                                <input
                                    type="text"
                                    {...register('title')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Введите название продукта"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Категория *
                                </label>
                                <select
                                    {...register('category')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Выберите категорию</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.title}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Описание
                                </label>
                                <textarea
                                    {...register('description')}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Введите описание продукта"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Изображение {isAdding ? '*' : ''}
                                </label>
                                <div className="space-y-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />

                                    {imagePreview && (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Предварительный просмотр"
                                                className="w-32 h-32 object-cover rounded border"
                                            />
                                            <button
                                                type="button"
                                                onClick={clearImage}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                            >
                                <Save size={16} />
                                {isAdding ? 'Создать' : 'Обновить'}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                            >
                                <X size={16} />
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold">Продукты ({products.length})</h2>
                </div>

                {products.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        Продукты не найдены
                    </div>
                ) : (
                    <div className="grid gap-6 p-6">
                        {products.map((product) => (
                            <div key={product._id} className="border rounded-lg p-6 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                                        <p className="text-gray-600 mb-2">
                                            Категория: {getCategoryTitle(product.category)}
                                        </p>
                                        {product.description && (
                                            <p className="text-gray-600 line-clamp-3">{product.description}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product._id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                {product.image && (
                                    <div className="relative w-full h-48">
                                        <Image
                                            src={`${API_BASE_URL}/${product.image}`}
                                            fill
                                            sizes="100vw"
                                            alt={product.title}
                                            className="object-cover rounded"
                                            onError={(e) => {
                                                console.error('Image failed to load:', product.image);
                                                console.error('Attempted URL:', `${API_BASE_URL}/${product.image}`);
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsClient;