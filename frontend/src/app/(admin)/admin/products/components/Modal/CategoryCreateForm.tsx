"use client";

import React, {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/src/components/ui/dialog";
import {Button} from "@/src/components/ui/button";
import {Input} from "@/src/components/ui/input";
import {toast} from "react-toastify";
import {useAdminCategoryStore} from "@/store/superadmin/superadminCategoriesStore";
import LoaderIcon from "@/src/components/ui/Loading/LoaderIcon";
import {createCategory} from "@/actions/superadmin/categories";
import {handleKyError} from "@/src/lib/handleKyError";

const CreateCategoryForm: React.FC<{ open: boolean; onClose: () => void }> = ({open, onClose}) => {
    const [title, setTitle] = useState<{ ru: string }>({ru: ""});
    const [loading, setLoading] = useState(false);
    const {setCategories, categories, setCreateCategoryError} = useAdminCategoryStore();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await createCategory({title});
            toast.success("Категория успешно создана");
            setCategories([...categories, res.category]);
            setTitle({ru: ""});
            onClose();
        } catch (e) {
            const message = await handleKyError(e, "Ошибка при создании категории");
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
                    <DialogTitle>Создание категории</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        placeholder="Название категории"
                        value={title.ru}
                        onChange={(e) => setTitle({ru: e.target.value})}
                        disabled={loading}
                    />
                    <Button onClick={handleSubmit} disabled={loading || !title.ru.trim()} className="w-full">
                        {loading ? <LoaderIcon/> : "Создать"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateCategoryForm;