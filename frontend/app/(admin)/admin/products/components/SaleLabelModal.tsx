import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import React from "react";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";

interface Props {
    saleLabel: string | null;
    onClose: () => void;
}

const ImagePreviewModal: React.FC<Props> = ({saleLabel, onClose}) => {
    if (!saleLabel) return null;

    return (
        <Dialog open={!!saleLabel} onOpenChange={onClose}>
            <DialogContent className="w-auto max-w-[90vw] p-4">
                <VisuallyHidden>
                    <DialogTitle>Подробный просмотр акции</DialogTitle>
                </VisuallyHidden>
                <div className='p-5'>
                    {saleLabel}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ImagePreviewModal;