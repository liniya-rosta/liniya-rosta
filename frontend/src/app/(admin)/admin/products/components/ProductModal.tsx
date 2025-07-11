import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Category, Product } from "@/lib/types";
import { CreateProductFormData, UpdateProductFormData } from "@/lib/zodSchemas/productSchema";
import ProductForm from "./ProductForm";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    isEditing: boolean;
    editingProduct: Product | null;
    categories: Category[];
    loading: boolean;
    onSubmit: (formData: CreateProductFormData | UpdateProductFormData, isEditingMode: boolean) => void;
    createError: string | null;
    updateError: string | null;
}

const ProductModal: React.FC<ProductModalProps> = ({isOpen, onClose, isEditing, editingProduct, categories, loading, onSubmit, createError, updateError}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Редактировать продукт" : "Добавить новый продукт"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Измените данные продукта и нажмите сохранить."
                            : "Заполните форму для создания нового товара."}
                    </DialogDescription>
                </DialogHeader>

                <ProductForm
                    isEditing={isEditing}
                    editingProduct={editingProduct}
                    categories={categories}
                    loading={loading}
                    onSubmit={onSubmit}
                    onCancel={onClose}
                    createError={createError}
                    updateError={updateError}
                />
            </DialogContent>
        </Dialog>
    );
};

export default ProductModal;