import React, {useState} from 'react';
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {useRouter} from "next/navigation";
import ProductConfirm
    from "@/app/(admin)/admin/products/add-product/components/ProductForm/fields/ProductActions/ProductConfirm";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";

interface Props {
    onConfirm: () => void;
}

const ProductBtns: React.FC<Props> = ({onConfirm}) => {
    const {createLoading} = useAdminProductStore();
    const router = useRouter();
    const [dialogType, setDialogType] = useState<"submit" | "cancel" | null>(null);

    const handleConfirm = () => {
        if (dialogType === "submit") {
            onConfirm();
        } else {
            router.push("/admin/products");
        }
        setDialogType(null);
    };

    return (
        <>
            <div className="flex flex-col-reverse md:flex-row justify-end gap-4 my-10">
                <Button
                    type="button"
                    onClick={() => setDialogType("submit")}
                    disabled={createLoading}
                    className="w-full md:w-auto"
                >
                    {createLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Создать продукт"}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogType("cancel")}
                    disabled={createLoading}
                    className="w-full md:w-auto"
                >
                    Отмена
                </Button>
            </div>

            <ProductConfirm
                open={dialogType !== null}
                onOpenChange={(open) => !open && setDialogType(null)}
                title={dialogType === "submit" ? "Подтвердите действие" : "Подтвердите выход"}
                description={
                    dialogType === "submit"
                        ? "Вы уверены, что хотите создать продукт? Перепроверьте данные."
                        : "Вы уверены, что хотите покинуть страницу? Введённые данные будут потеряны."
                }
                onConfirm={handleConfirm}
            />
        </>
    );
};

export default ProductBtns;