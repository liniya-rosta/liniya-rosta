import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import React from "react";

interface Props {
    open: boolean;
    openChange: () => void,
    isGallery?: boolean;
}

const ModalEdit: React.FC<React.PropsWithChildren<Props>> = (
    {open, openChange, isGallery=false, children}
) => {
    return (
        <Dialog open={open} onOpenChange={openChange}>
            <DialogContent aria-describedby={undefined} className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Редактировать {isGallery ? "галерею" : "Портфолио"}
                    </DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}

export default ModalEdit;