import {Button} from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";
import React from "react";

interface FormActionButtonsProps {
    onCancel: () => void;
    isLoading: boolean;
    isDirty?: boolean;
    submitText: string;
    cancelText?: string;
}

const FormActionButtons: React.FC<FormActionButtonsProps> = ({
                                                                 onCancel,
                                                                 isLoading,
                                                                 isDirty = true,
                                                                 submitText = "Сохранить",
                                                                 cancelText = "Отмена"
                                                             }) => {
    return (
        <div className="space-y-2">
            <Button
                type="submit"
                className="mt-6 px-6"
                disabled={isLoading || !isDirty}
            >
                {isLoading && <LoaderIcon />}
                {submitText}
            </Button>
            <Button
                type="button"
                className="mt-6 px-6"
                disabled={isLoading}
                variant="outline"
                onClick={onCancel}
            >
                {cancelText}
            </Button>
        </div>
    );
};

export default FormActionButtons;
