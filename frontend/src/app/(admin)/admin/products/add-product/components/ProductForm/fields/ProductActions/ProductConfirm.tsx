import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import {Button} from "@/src/components/ui/button";
import {Loader2} from "lucide-react";
import React from "react";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
}

const ProductConfirm: React.FC<Props> = ({
                                             open,
                                             onOpenChange,
                                             title,
                                             description,
                                             onConfirm,
                                         }) => {
    const {createLoading} = useAdminProductStore();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Отмена
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            onOpenChange(false);
                        }}
                        disabled={createLoading}
                    >
                        {createLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Подтвердить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ProductConfirm;