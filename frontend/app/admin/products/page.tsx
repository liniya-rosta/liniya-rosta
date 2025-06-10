'use client'

import {Category, Product, ProductWithoutId } from "@/lib/types";
import {useEffect, useState} from "react";
import {Pencil, Plus, Save, Trash2, X} from "lucide-react";

const AdminProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<ProductWithoutId>({
        category: "",
        title: "",
        description: "",
        image: ""
    });

    // Загрузка данных при монтировании компонента
    useEffect(() => {
        void fetchProducts();
        void fetchCategories();
    }, []);

    // Закомментированные запросы для будущей реализации
    const fetchProducts = async () => {
        try {
            setLoading(true);
            // const response = await fetch('/api/products');
            // const data = await response.json();
            // setProducts(data);

            // Временно устанавливаем пустой массив
            setProducts([]);
        } catch (error) {
            console.error('Ошибка при загрузке продуктов:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            // const response = await fetch('/api/categories');
            // const data = await response.json();
            // setCategories(data);

            // Временно устанавливаем пустой массив
            setCategories([]);
        } catch (error) {
            console.error('Ошибка при загрузке категорий:', error);
        }
    };

    const createProduct = async (productData: ProductWithoutId) => {
        try {
            // const response = await fetch('/api/products', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(productData),
            // });
            // const newProduct = await response.json();
            // return newProduct;

            // Временная реализация для демонстрации
            const newProduct: Product = {
                _id: Date.now().toString(),
                ...productData
            };
            return newProduct;
        } catch (error) {
            console.error('Ошибка при создании продукта:', error);
            throw error;
        }
    };

    const updateProduct = async (id: string, productData: ProductWithoutId) => {
        try {
            // const response = await fetch(`/api/products/${id}`, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(productData),
            // });
            // const updatedProduct = await response.json();
            // return updatedProduct;

            // Временная реализация для демонстрации
            const updatedProduct: Product = {
                _id: id,
                ...productData
            };
            return updatedProduct;
        } catch (error) {
            console.error('Ошибка при обновлении продукта:', error);
            throw error;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            // await fetch(`/api/products/${id}`, {
            //     method: 'DELETE',
            // });

            // Временная реализация для демонстрации
            console.log('Удаление продукта с ID:', id);
        } catch (error) {
            console.error('Ошибка при удалении продукта:', error);
            throw error;
        }
    };


    // Handles
    const handleEdit = (product: Product) => {
        setEditingId(product._id);
        setFormData({
            category: product.category,
            title: product.title,
            description: product.description,
            image: product.image
        });
        setIsAdding(false);
    };

    const handleAdd = () => {
        setIsAdding(true);
        setEditingId(null);
        setFormData({
            category: "",
            title: "",
            description: "",
            image: ""
        });
    };

    const handleSave = async () => {
        try {
            if (isAdding) {
                const newProduct = await createProduct(formData);
                setProducts([...products, newProduct]);
                setIsAdding(false);
            } else if (editingId) {
                const updatedProduct = await updateProduct(editingId, formData);
                setProducts(products.map(product =>
                    product._id === editingId ? updatedProduct : product
                ));
                setEditingId(null);
            }

            setFormData({
                category: "",
                title: "",
                description: "",
                image: ""
            });
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setIsAdding(false);
        setFormData({
            category: "",
            title: "",
            description: "",
            image: ""
        });
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Вы уверены, что хотите удалить этот товар?")) {
            try {
                await deleteProduct(id);
                setProducts(products.filter(product => product._id !== id));
            } catch (error) {
                console.error('Ошибка при удалении:', error);
            }
        }
    };

    const handleInputChange = (field: keyof ProductWithoutId, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="p-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center">Загрузка...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6">
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Товары - Натяжные потолки
                            </h1>
                            <button
                                onClick={handleAdd}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Добавить товар
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {isAdding && (
                            <div className="bg-blue-50 p-4 rounded-lg mb-6 border-2 border-blue-200">
                                <h3 className="text-lg font-semibold mb-4 text-blue-800">
                                    Добавить новый товар
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Название товара"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <select
                                        value={formData.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Выберите категорию</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat.title}>{cat.title}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="URL изображения"
                                        value={formData.image || ""}
                                        onChange={(e) => handleInputChange('image', e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <textarea
                                        placeholder="Описание товара"
                                        value={formData.description || ""}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                                    />
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={handleSave}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                                    >
                                        <Save size={16} />
                                        Сохранить
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
                                    >
                                        <X size={16} />
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="text-left p-3 border-b font-semibold">ID</th>
                                    <th className="text-left p-3 border-b font-semibold">Название</th>
                                    <th className="text-left p-3 border-b font-semibold">Категория</th>
                                    <th className="text-left p-3 border-b font-semibold">Описание</th>
                                    <th className="text-left p-3 border-b font-semibold">Изображение</th>
                                    <th className="text-left p-3 border-b font-semibold">Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        {editingId === product._id ? (
                                            <>
                                                <td className="p-3 border-b">{product._id}</td>
                                                <td className="p-3 border-b">
                                                    <input
                                                        type="text"
                                                        value={formData.title}
                                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="p-3 border-b">
                                                    <select
                                                        value={formData.category}
                                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        {categories.map(cat => (
                                                            <option key={cat._id} value={cat.title}>{cat.title}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="p-3 border-b">
                                                    <textarea
                                                        value={formData.description || ""}
                                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-16"
                                                    />
                                                </td>
                                                <td className="p-3 border-b">
                                                    <input
                                                        type="text"
                                                        value={formData.image || ""}
                                                        onChange={(e) => handleInputChange('image', e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="URL изображения"
                                                    />
                                                </td>
                                                <td className="p-3 border-b">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleSave}
                                                            className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                                                            title="Сохранить"
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                        <button
                                                            onClick={handleCancel}
                                                            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
                                                            title="Отмена"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="p-3 border-b text-gray-600">{product._id}</td>
                                                <td className="p-3 border-b font-medium">{product.title}</td>
                                                <td className="p-3 border-b">
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="p-3 border-b text-gray-600 max-w-xs truncate">
                                                    {product.description || "Нет описания"}
                                                </td>
                                                <td className="p-3 border-b">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.title}
                                                            className="w-12 h-12 object-cover rounded"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">Нет изображения</span>
                                                    )}
                                                </td>
                                                <td className="p-3 border-b">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(product)}
                                                            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                                                            title="Редактировать"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product._id)}
                                                            className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                                                            title="Удалить"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {products.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-lg">Товары не найдены</p>
                                <p className="text-sm mt-2">Добавьте первый товар, нажав кнопку Добавить товар</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductsPage;