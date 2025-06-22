'use client';

import {Contact, GlobalMessage} from '@/lib/types';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useSuperadminContactsStore} from '@/store/superadmin/superadminContactsStore';
import {updateContact} from '@/actions/superadmin/contacts';
import {AxiosError} from 'axios';
import {adminContactSchema} from "@/lib/zodSchemas/adminContactSchema";
import {toast} from "react-toastify";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Loader2} from "lucide-react";
import React from "react";


interface Props {
    contact: Contact;
}

export interface ContactFormData {
    location: string;
    phone1: string;
    phone2?: string | undefined;
    email: string;
    instagram: string;
    whatsapp: string;
    linkLocation: string;
    mapLocation: string;
    workingHours: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };
}


const AdminContactForm: React.FC<Props> = ({contact}) => {
    const {setContact, setFetchError, setUpdateLoading, fetchLoading, updateLoading} = useSuperadminContactsStore();

    const defaultValues: ContactFormData = {
        location: contact.location,
        phone1: contact.phone1,
        phone2: contact.phone2,
        email: contact.email,
        instagram: contact.instagram,
        whatsapp: contact.whatsapp,
        linkLocation: contact.linkLocation,
        mapLocation: contact.mapLocation,
        workingHours: contact.workingHours,
    };

    const isLoading = fetchLoading || updateLoading;

    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
    } = useForm<ContactFormData>({
        resolver: zodResolver(adminContactSchema),
        defaultValues,
    });


    const onSubmit = async (data: ContactFormData) => {
        try {
            setUpdateLoading(true);
            const {contact: updatedContact} = await updateContact(contact._id, data);
            setContact(updatedContact);
            toast.success('Вы успешно обновили контактные данные');
        } catch (e) {
            const err = e as AxiosError<GlobalMessage>;
            toast.error(err.response?.data?.error || 'Ошибка при обновлении контакта')
            setFetchError(err.response?.data?.error || 'Ошибка при обновлении контакта');
        } finally {
            setUpdateLoading(false);
        }
    };

    const fieldLabels: Record<string, string> = {
        location: 'Локация',
        phone1: 'Телефон 1',
        phone2: 'Телефон 2',
        email: 'Email',
        instagram: 'Instagram',
        whatsapp: 'Whatsapp',
        linkLocation: 'Ссылка на локацию',
        mapLocation: 'Карта локации',
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card className="mt-3">
                <CardContent className="p-6 space-y-6">
                    {Object.entries(fieldLabels).map(([field, label]) => (
                        <div key={field} className="space-y-1">
                            <Label htmlFor={field}>{label}</Label>
                            {field === "linkLocation" ? (
                                <Textarea
                                    id={field}
                                    {...register(field as keyof ContactFormData)}
                                    placeholder={`Введите ${label.toLowerCase()}`}
                                    disabled={isLoading}
                                    className={errors[field as keyof ContactFormData] ? "border-red-500" : ""}
                                />
                            ) : (
                                <Input
                                    id={field}
                                    {...register(field as keyof ContactFormData)}
                                    placeholder={`Введите ${label.toLowerCase()}`}
                                    disabled={isLoading}
                                    className={errors[field as keyof ContactFormData] ? "border-red-500" : ""}
                                />
                            )}
                            {errors[field as keyof ContactFormData] && (
                                <p className="text-sm text-red-600">
                                    {String(errors[field as keyof ContactFormData]?.message)}
                                </p>
                            )}
                        </div>
                    ))}

                    <fieldset className="space-y-4 border rounded-md p-4">
                        <legend className="text-lg font-semibold text-gray-700">Рабочие часы</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(Object.keys(defaultValues.workingHours) as (keyof ContactFormData['workingHours'])[]).map((day) => (
                                <div key={day} className="space-y-1">
                                    <Label htmlFor={`workingHours.${day}`} className="capitalize">{day}</Label>
                                    <Controller
                                        name={`workingHours.${day}`}
                                        control={control}
                                        render={({field}) => (
                                            <Input
                                                {...field}
                                                id={`workingHours.${day}`}
                                                placeholder="например, 9:00 - 18:00"
                                                disabled={isLoading}
                                                className={errors.workingHours?.[day] ? "border-red-500" : ""}
                                            />
                                        )}
                                    />
                                    {errors.workingHours?.[day] && (
                                        <p className="text-sm text-red-600">
                                            {String(errors.workingHours[day]?.message)}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </fieldset>

                    <Button type="submit" disabled={isLoading} className="w-full cursor-pointer">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        {isLoading ? 'Сохраняем...' : 'Сохранить'}
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
};

export default AdminContactForm;
