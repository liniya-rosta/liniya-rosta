import React from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {Product} from "@/lib/types";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    isEditing: boolean;
    editingProduct: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({isOpen, onClose, isEditing, editingProduct}) => {
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

            </DialogContent>
        </Dialog>
    );
};

export default ProductModal;