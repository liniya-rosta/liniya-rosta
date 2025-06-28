import React from 'react';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {IRequest} from "@/lib/types";
import EditRequestForm from "@/app/(admin)/admin/requests/components/EditRequestForm";

interface Props {
    request: IRequest | null;
    onClose: () => void;
}

const RequestsModal: React.FC<Props> = ({request, onClose}) => {
    return (
        <Dialog open={!!request} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Информация о заявке</DialogTitle>
                    <DialogDescription>
                        Здесь отображается подробная информация и форма для редактирования заявки.
                    </DialogDescription>
                </DialogHeader>

                <EditRequestForm request={request} onClose={onClose}/>
            </DialogContent>
        </Dialog>
    );
};

export default RequestsModal;