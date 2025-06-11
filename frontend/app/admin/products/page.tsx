'use client';

import { Category, Product, ProductWithoutId } from "@/lib/types";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/actions/products";
import { fetchCategories } from "@/actions/categories";
import { Pencil, Plus, Save, Trash2, X, Eye, EyeOff } from "lucide-react";

const AdminProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [isMobile, setIsMobile] = useState(false);
    const [formData, setFormData] = useState<ProductWithoutId>({
        category: "",
        title: "",
        description: "",
        image: ""
    });

    useEffect(() => {
        void loadProducts();
        void loadCategories();

        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1200);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchProducts();
            setProducts(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Неизвестная ошибка при загрузке продуктов');
            console.error('Ошибка при загрузке продуктов:', e);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (e) {
            console.error('Ошибка при загрузке категорий:', e);
        }
    };

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
        if (!formData.title.trim() || !formData.category.trim()) {
            alert('Пожалуйста, заполните обязательные поля: название и категория');
            return;
        }

        try {
            if (isAdding) {
                // const newProduct = await createProduct(formData);
                // setProducts([...products, newProduct]);
                setIsAdding(false);
            } else if (editingId) {
                // const updatedProduct = await updateProduct(editingId, formData);
                // setProducts(products.map(product =>
                //   product._id === editingId ? updatedProduct : product
                // ));
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
            alert(error instanceof Error ? error.message : 'Ошибка при сохранении');
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
                // await deleteProduct(id);
                setProducts(products.filter(product => product._id !== id));
            } catch (error) {
                console.error('Ошибка при удалении:', error);
                alert(error instanceof Error ? error.message : 'Ошибка при удалении');
            }
        }
    };

    const handleInputChange = (field: keyof ProductWithoutId, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getCategoryTitle = (category: string | Category) => {
        if (typeof category === 'object' && category !== null) {
            return category.title;
        }
        const found = categories.find(cat => cat._id === category);
        return found ? found.title : String(category);
    };

    const toggleRowExpanded = (productId: string) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(productId)) {
            newExpandedRows.delete(productId);
        } else {
            newExpandedRows.add(productId);
        }
        setExpandedRows(newExpandedRows);
    };

    const ProductCard = ({ product }: { product: Product }) => {
        const isExpanded = expandedRows.has(product._id);
        const isEditing = editingId === product._id;

        if (isEditing) {
            return (
                <div className="bg-white border border-blue-200 rounded-lg p-4 mb-4 shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Категория *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Изображение</label>
                            <input
                                type="text"
                                value={formData.image || ""}
                                onChange={(e) => handleInputChange('image', e.target.value)}
                                placeholder="URL изображения"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                            <textarea
                                value={formData.description || ""}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                            >
                                <Save size={16} />
                                Сохранить
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2"
                            >
                                <X size={16} />
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-gray-900 flex-1 pr-2">{product.title}</h3>
                    <div className="flex gap-1 flex-shrink-0">
                        <button
                            onClick={() => toggleRowExpanded(product._id)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                            title={isExpanded ? "Скрыть детали" : "Показать детали"}
                        >
                            {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                            title="Редактировать"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                            title="Удалить"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                            {getCategoryTitle(product.category)}
                        </span>
                    </div>

                    {product.image && (
                        <div className="flex justify-center">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-20 h-20 object-cover rounded-lg"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    )}

                    {isExpanded && (
                        <div className="pt-3 border-t border-gray-100 space-y-2">
                            <div>
                                <span className="text-sm font-medium text-gray-600">ID:</span>
                                <span className="text-sm text-gray-800 ml-2 font-mono">{product._id}</span>
                            </div>
                            {product.description && (
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Описание:</span>
                                    <p className="text-sm text-gray-800 mt-1">{product.description}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
                <div className="bg-white rounded-lg shadow p-6 text-center">Загрузка...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="bg-white rounded-lg shadow">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                            Товары - Натяжные потолки
                        </h1>
                        <button
                            onClick={handleAdd}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            <Plus size={16} />
                            Добавить товар
                        </button>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {isAdding && (
                        <div className="bg-blue-50 p-4 rounded-lg mb-6 border-2 border-blue-200">
                            <h3 className="text-lg font-semibold mb-4 text-blue-800">Добавить новый товар</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Название товара *"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <select
                                        value={formData.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Выберите категорию *</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <input
                                    type="text"
                                    placeholder="URL изображения"
                                    value={formData.image || ""}
                                    onChange={(e) => handleInputChange('image', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <textarea
                                    placeholder="Описание товара"
                                    value={formData.description || ""}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                                />
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                        onClick={handleSave}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} />
                                        Сохранить
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2"
                                    >
                                        <X size={16} />
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isMobile ? (
                        <div>
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
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
                                                        className="w-full px-2 py-1 border border-gray-300 rounded"
                                                    />
                                                </td>
                                                <td className="p-3 border-b">
                                                    <select
                                                        value={formData.category}
                                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded"
                                                    >
                                                        {categories.map(cat => (
                                                            <option key={cat._id} value={cat._id}>{cat.title}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="p-3 border-b">
                                                  <textarea
                                                      value={formData.description || ""}
                                                      onChange={(e) => handleInputChange('description', e.target.value)}
                                                      className="w-full px-2 py-1 border border-gray-300 rounded h-16"
                                                  />
                                                </td>
                                                <td className="p-3 border-b">
                                                    <input
                                                        type="text"
                                                        value={formData.image || ""}
                                                        onChange={(e) => handleInputChange('image', e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded"
                                                        placeholder="URL изображения"
                                                    />
                                                </td>
                                                <td className="p-3 border-b">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleSave}
                                                            className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                                                            title="Сохранить"
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                        <button
                                                            onClick={handleCancel}
                                                            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                                                            title="Отмена"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="p-3 border-b text-gray-600 font-mono text-xs">{product._id}</td>
                                                <td className="p-3 border-b font-medium">{product.title}</td>
                                                <td className="p-3 border-b">
                                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                                    {getCategoryTitle(product.category)}
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
                                                            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                                                            title="Редактировать"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product._id)}
                                                            className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
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
                    )}

                    {products.length === 0 && !error && (
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-lg">Товары не найдены</p>
                            <p className="text-sm mt-2">Добавьте первый товар, нажав кнопку "Добавить товар"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProductsPage;