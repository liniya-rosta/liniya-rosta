"use client";

import React, {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/src/components/ui/dialog";
import {Button} from "@/src/components/ui/button";
import {Input} from "@/src/components/ui/input";
import {toast} from "react-toastify";
import {useAdminCategoryStore} from "@/store/superadmin/superadminCategoriesStore";
import LoaderIcon from "@/src/components/ui/Loading/LoaderIcon";
import {createCategory, updateCategory} from "@/actions/superadmin/categories";
import {handleKyError} from "@/src/lib/handleKyError";

interface CategoryFormProps {
    open: boolean;
    onClose: () => void;
    initialData?: { _id?: string; title: { ru: string } } | null;
    onSuccess?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({open, onClose, initialData, onSuccess}) => {
    const [title, setTitle] = useState<{ ru: string }>({ru: ""});
    const [loading, setLoading] = useState(false);
    const {setCategories, categories, setCreateCategoryError} = useAdminCategoryStore();

    const isEdit = Boolean(initialData?._id);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
        } else {
            setTitle({ru: ""});
        }
    }, [initialData, open]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (isEdit && initialData?._id) {
                const res = await updateCategory(initialData._id, {title});
                toast.success("Категория обновлена");
                setCategories(categories.map(c => c._id === res.category._id ? res.category : c));
            } else {
                const res = await createCategory({title});
                toast.success("Категория успешно создана");
                setCategories([...categories, res.category]);
            }
            setTitle({ru: ""});
            onClose();
            if (onSuccess) {
                onSuccess();
            }
        } catch (e) {
            const message = await handleKyError(e, isEdit ? "Ошибка при обновлении категории" : "Ошибка при создании категории");
            setCreateCategoryError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Редактирование категории" : "Создание категории"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        placeholder="Название категории"
                        value={title.ru}
                        onChange={(e) => setTitle({ru: e.target.value})}
                        disabled={loading}
                    />
                    <Button onClick={handleSubmit} disabled={loading || !title.ru.trim()} className="w-full">
                        {loading ? <LoaderIcon/> : isEdit ? "Сохранить" : "Создать"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CategoryForm;
