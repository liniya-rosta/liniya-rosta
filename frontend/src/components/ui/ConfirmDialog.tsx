'use client';

import {Button} from "@/src/components/ui/button";
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
import LoaderIcon from "@/src/components/ui/Loading/LoaderIcon";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    onConfirm: () => void;
    loading?: boolean;
    text?: string;
    confirmText?: string;
    cancelText?:string,
}

const ConfirmDialog: React.FC<PropsWithChildren<Props>> = ({
                                                         open,
                                                         onOpenChange,
                                                         title = "Вы уверены?",
                                                         onConfirm,
                                                         loading = false,
                                                         children,
                                                         text = "Это действие невозможно отменить",
                                                         confirmText = "Подтвердить",
                                                         cancelText = "Отмена"
                                                     }) => {

    return (
        <AlertDialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <AlertDialogContent className="!max-w-sm !w-full flex flex-col items-center justify-center text-center gap-4">
                <AlertDialogHeader className="text-center">
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    {text}
                </AlertDialogDescription>
                {children}
                <AlertDialogFooter className="flex justify-center gap-4 mt-4">
                    <AlertDialogCancel asChild>
                        <Button variant="outline">
                            {cancelText}
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button onClick={onConfirm}>
                            {loading && <LoaderIcon/>}
                            {confirmText}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmDialog;
