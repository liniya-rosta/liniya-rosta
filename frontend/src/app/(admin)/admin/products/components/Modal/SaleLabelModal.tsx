import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog";
import React from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import parse from "html-react-parser";

interface Props {
    saleLabel: string | null;
    onClose: () => void;
}

const isHtml = (s: string) => /<\/?[a-z][\s\S]*>/i.test(s);

const SaleLabelModal: React.FC<Props> = ({ saleLabel, onClose }) => {
    if (!saleLabel) return null;

    return (
        <Dialog
            open={!!saleLabel}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="w-full max-w-[90vw] max-h-[80vh] overflow-y-auto">
                <VisuallyHidden>
                    <DialogTitle>Подробный просмотр</DialogTitle>
                </VisuallyHidden>

                <div className="p-4 break-words">
                    {isHtml(saleLabel) ? parse(saleLabel) : saleLabel}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SaleLabelModal;