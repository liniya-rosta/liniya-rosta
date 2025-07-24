'use client'

import React from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from "react-toastify";
import {IRequestMutation} from "@/src/lib/types";
import {useRequestStore} from "@/store/requestStore";
import {createRequest} from "@/actions/requestActions";
import {Button} from "@/src/components/ui/button";
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import {Input} from "@/src/components/ui/input";
import {Label} from "@/src/components/ui/label";
import {Alert, AlertDescription} from "@/src/components/ui/alert";
import {Loader2, AlertCircle} from "lucide-react";

import {getRequestSchema} from "@/src/lib/zodSchemas/requestSchema";
import {useTranslations} from "next-intl";

interface Props {
    closeModal: () => void;
}

const RequestForm: React.FC<Props> = ({closeModal}) => {
    const {createLoading, createError, errorMessage, setLoading, setError} = useRequestStore();

    const tForm = useTranslations("FormModal");
    const tToasts = useTranslations("Toasts");
    const tBtn = useTranslations("Buttons");
    const tFormErrors = useTranslations("FormErrors");
    const schema = getRequestSchema(tFormErrors);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<IRequestMutation>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: IRequestMutation) => {
        if (createLoading) return;

        setLoading(true);
        setError(null);

        const response = await createRequest(data);
        setLoading(false);

        if (response !== null) {
            setError(response);
        } else {
            toast.success(tToasts("success.submitRequest"));
            reset();
            closeModal();
        }
    };

    return (
        <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <DialogHeader>
                    <DialogTitle>{tForm("formTitle")}</DialogTitle>
                    <DialogDescription>
                        {tForm("formSubtitle")}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {createError && (
                        <Alert variant="destructive">
                            <div>
                                <AlertCircle className="h-4 w-4"/>
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </div>
                        </Alert>
                    )}

                    <div className="grid gap-1">
                        <Label htmlFor="name">{tForm("form.name")}</Label>
                        <Input
                            id="name"
                            {...register("name")}
                            placeholder="Иван Иванов"
                            disabled={createLoading}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="email">Почта</Label>
                        <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="example@email.com"
                            disabled={createLoading}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="phone">Телефон</Label>
                        <Input
                            id="phone"
                            type="tel"
                            {...register("phone")}
                            placeholder="+996999999999"
                            disabled={createLoading}
                        />
                        {errors.phone && (
                            <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={createLoading} className="cursor-pointer">
                            {tBtn("canselBtn")}
                        </Button>
                    </DialogClose>
                    <Button type="submit" disabled={createLoading} className="cursor-pointer">
                        {createLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        {tBtn("submitBtn")}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
};

export default RequestForm;
