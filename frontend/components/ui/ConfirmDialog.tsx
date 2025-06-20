'use client';

import {Button} from "@/components/ui/button";
import ButtonLoading from "@/components/ui/ButtonLoading";

import React, {PropsWithChildren} from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "./alert-dialog";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    onConfirm: () => void;
    loading?: boolean;
}

const ConfirmDialog: React.FC<PropsWithChildren<Props>> = ({
                                                         open,
                                                         onOpenChange,
                                                         title = "Вы уверены?",
                                                         onConfirm,
                                                         loading = false,
                                                         children,
                                                     }) => {
    return (
        <AlertDialog
            aria-describedby={undefined}
            open={open}
            onOpenChange={onOpenChange}
        >
            <AlertDialogContent className="!max-w-sm !w-full flex flex-col items-center justify-center text-center gap-4 max-w-lg">
                <AlertDialogHeader className="text-center">
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    Это действие невозможно отменить. Элемент будет удален навсегда.
                </AlertDialogDescription>
                {children}
                <AlertDialogFooter className="flex justify-center gap-4 mt-4">
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Отмена</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        {loading ? <ButtonLoading/>
                            : <Button onClick={onConfirm}>Подтвердить</Button>
                        }
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmDialog;
