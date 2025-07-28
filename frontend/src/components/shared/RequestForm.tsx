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

import requestSchema from "@/src/lib/zodSchemas/requestSchema";

interface Props {
    closeModal: () => void;
}

const RequestForm: React.FC<Props> = ({closeModal}) => {
    const {createLoading, createError, errorMessage, setLoading, setError} = useRequestStore();

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<IRequestMutation>({
        resolver: zodResolver(requestSchema),
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
            toast.success('Заявка отправлена! Менеджер свяжется с вами.');
            reset();
            closeModal();
        }
    };

    return (
        <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <DialogHeader>
                    <DialogTitle>Оставить заявку</DialogTitle>
                    <DialogDescription>
                        Заполните форму, и мы свяжемся с вами в ближайшее время.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {createError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid gap-1">
                        <Label htmlFor="name">Имя</Label>
                        <Input
                            id="name"
                            {...register("name")}
                            placeholder="Введите ваше имя"
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
                        <Label htmlFor="phone">Номер телефона</Label>
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
                            Отмена
                        </Button>
                    </DialogClose>
                    <Button type="submit" disabled={createLoading} className="cursor-pointer">
                        {createLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Отправить
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
};

export default RequestForm;
