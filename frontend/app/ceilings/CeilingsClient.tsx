"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Phone, MessageCircle, Filter, X } from 'lucide-react';
import { fetchProducts } from "@/actions/products";
import { fetchCategories } from "@/actions/categories";

type Category = {
    _id: string;
    title: string;
};

type Product = {
    _id: string;
    title: string;
    description?: string;
    image?: string;
    category?: Category;
};

type Props = {
    initialProducts: Product[];
    initialCategories: Category[];
}

const CeilingsClient: React.FC<Props> = ({ initialProducts, initialCategories }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showConsultationModal, setShowConsultationModal] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [consultationForm, setConsultationForm] = useState({
        name: '',
        phone: '',
        productName: ''
    });

    useEffect(() => {
        const fetchFilteredProducts = async () => {
            if (selectedCategory === 'all') {
                setProducts(initialProducts);
                return;
            }

            try {
                setError(null);
                setLoading(true);
                // Фильтруем продукты по категории
                const filteredProducts = initialProducts.filter(product =>
                    product.category?._id === selectedCategory
                );
                setProducts(filteredProducts);
            } catch {
                setError('Ошибка загрузки товаров');
            } finally {
                setLoading(false);
            }
        };

        void fetchFilteredProducts();
    }, [selectedCategory, initialProducts]);

    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, products]);

    const categoryCounts = useMemo<Record<string, number>>(() => {
        const counts: Record<string, number> = {};
        initialProducts.forEach(p => {
            const id = p.category?._id;
            if (id) counts[id] = (counts[id] || 0) + 1;
        });
        return counts;
    }, [initialProducts]);

    const handleConsultationSubmit = async () => {
        const isValidPhone = /^\+996\d{9}$/.test(consultationForm.phone.trim());
        if (!consultationForm.name.trim() || !isValidPhone) {
            alert('Пожалуйста, введите корректные имя и номер телефона (+996...)');
            return;
        }

        try {
            console.log('Заявка:', consultationForm);
            alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
            setShowConsultationModal(false);
            setConsultationForm({ name: '', phone: '', productName: '' });
        } catch (error) {
            console.error(error);
            alert('Произошла ошибка при отправке заявки.');
        }
    };

    const openConsultationModal = (product: Product | null = null) => {
        setSelectedProduct(product);
        setConsultationForm(prev => ({
            ...prev,
            productName: product?.title || ''
        }));
        setShowConsultationModal(true);
    };

    const getImageUrl = (imagePath?: string) => {
        if (!imagePath) return null;

        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Натяжные потолки</h1>
                        <p className="text-gray-600 mt-1">Все необходимое для создания идеального потолка</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => openConsultationModal()} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            <Phone size={18} />
                            Консультация
                        </button>
                        <a href="https://wa.me/996552088988" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                            <MessageCircle size={18} />
                            WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                <div className="lg:w-80 sticky top-4 h-fit">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                            <Filter size={20} />
                            Категории
                        </h2>
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input type="text" placeholder="Поиск товаров..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="space-y-2">
                            <div onClick={() => setSelectedCategory('all')} className={`cursor-pointer p-3 rounded-lg transition ${selectedCategory === 'all' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50'}`}>
                                <div className="flex justify-between items-center">
                                    <span>Все товары</span>
                                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{initialProducts.length}</span>
                                </div>
                            </div>
                            {categories.map(cat => (
                                <div key={cat._id} onClick={() => setSelectedCategory(cat._id)} className={`cursor-pointer p-3 rounded-lg transition ${selectedCategory === cat._id ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50'}`}>
                                    <div className="flex justify-between items-center">
                                        <span>{cat.title}</span>
                                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{categoryCounts[cat._id] || 0}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-600">Найдено товаров: <strong>{filteredProducts.length}</strong></p>
                        {selectedCategory !== 'all' && (
                            <button onClick={() => setSelectedCategory('all')} className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                                <X size={16} />
                                Сбросить фильтр
                            </button>
                        )}
                    </div>
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full"></div>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProducts.map(product => {
                                const imageUrl = getImageUrl(product.image);
                                return (
                                    <div key={product._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition">
                                        {imageUrl && (
                                            <img
                                                src={imageUrl}
                                                onError={e => {
                                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop';
                                                }}
                                                alt={product.title}
                                                className="w-full h-48 object-cover rounded-t-lg"
                                            />
                                        )}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.title}</h3>
                                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>
                                            <div className="mb-3">
                                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{product.category?.title || 'Без категории'}</span>
                                            </div>
                                            <button onClick={() => openConsultationModal(product)} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                                                Консультация по товару
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Search size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Товары не найдены</h3>
                            <p className="text-gray-600">Попробуйте изменить критерии поиска или фильтры</p>
                        </div>
                    )}
                </div>
            </div>

            {showConsultationModal && (
                <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Заявка на консультацию</h3>
                            <button onClick={() => setShowConsultationModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        {selectedProduct && (
                            <div className="mb-4 p-3 bg-blue-50 rounded">
                                <p className="text-sm text-blue-800">
                                    Консультация по товару: <strong>{selectedProduct.title}</strong>
                                </p>
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ваше имя *</label>
                                <input
                                    type="text"
                                    value={consultationForm.name}
                                    onChange={e => setConsultationForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Введите ваше имя"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Номер телефона *</label>
                                <input
                                    type="tel"
                                    value={consultationForm.phone}
                                    onChange={e => setConsultationForm(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="+996 XXX XXX XXX"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowConsultationModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                                    Отмена
                                </button>
                                <button type="button" onClick={handleConsultationSubmit} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Отправить заявку
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CeilingsClient;