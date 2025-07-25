'use client';

import React from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'react-toastify';
import {Loader2, AlertCircle} from 'lucide-react';

import {Button} from '@/src/components/ui/button';
import {Input} from '@/src/components/ui/input';
import {Label} from '@/src/components/ui/label';
import {Alert, AlertDescription} from '@/src/components/ui/alert';

import {IRequestMutation} from '@/src/lib/types';
import {useRequestStore} from '@/store/requestStore';
import {createRequest} from '@/actions/requestActions';
import {getRequestSchema} from '@/src/lib/zodSchemas/requestSchema';
import {useTranslations} from "next-intl";

const ServicesForm = () => {
    const {createLoading, createError, errorMessage, setLoading, setError} = useRequestStore();
    const tForm = useTranslations("FormModal");
    const tToast = useTranslations("Toasts");
    const tBtn = useTranslations("Buttons")
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
            toast.error(errorMessage);
        } else {
            toast.success(tToast("success.submitRequest"));
            reset();
        }
    };

    return (
        <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full my-6">

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold">{tForm("formTitle")}</h2>
                <p className="text-gray-600 mt-2">
                    {tForm("formSubtitle")}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                {createError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-1">
                    <Label htmlFor="name">{tForm("form.name")}</Label>
                    <Input
                        id="name"
                        placeholder="Иван Иванов"
                        disabled={createLoading}
                        {...register('name')}
                        aria-invalid={errors.name ? 'true' : 'false'}
                    />
                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
                </div>

                <div className="grid gap-1">
                    <Label htmlFor="email">Почта</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        disabled={createLoading}
                        {...register('email')}
                        aria-invalid={errors.email ? 'true' : 'false'}
                    />
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                </div>

                <div className="grid gap-1">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="+996999999999"
                        disabled={createLoading}
                        {...register('phone')}
                        aria-invalid={errors.phone ? 'true' : 'false'}
                    />
                    {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
                </div>

                <Button
                    type="submit"
                    className="w-full bg-yellow-400 hover:bg-yellow-600 cursor-pointer duration-500"
                    disabled={createLoading}
                >
                    {createLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    {tBtn("submitBtn")}
                </Button>
            </form>
        </div>
    );
};

export default ServicesForm;
