'use client';

import {Contact, GlobalMessage} from '@/src/lib/types';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useSuperadminContactsStore} from '@/store/superadmin/superadminContactsStore';
import {updateContact} from '@/actions/superadmin/contacts';
import {AxiosError} from 'axios';
import {adminContactSchema} from "@/src/lib/zodSchemas/admin/adminContactSchema";
import {toast} from "react-toastify";
import {Input} from "@/src/components/ui/input";
import {Textarea} from "@/src/components/ui/textarea";
import {Label} from "@/src/components/ui/label";
import {Button} from "@/src/components/ui/button";
import {Card, CardContent} from "@/src/components/ui/card";
import {Loader2} from "lucide-react";
import React from "react";
import {z} from "zod";

interface Props {
    contact: Contact;
}

const AdminContactForm: React.FC<Props> = ({contact}) => {
    const {setContact, setFetchError, setUpdateLoading, fetchLoading, updateLoading} = useSuperadminContactsStore();

    const defaultValues: z.infer<typeof adminContactSchema> = {
        location: { ru: contact.location?.ru },
        phone1: contact.phone1,
        phone2: contact.phone2,
        email: contact.email,
        instagram: contact.instagram,
        whatsapp: contact.whatsapp,
        linkLocation: contact.linkLocation,
        mapLocation: contact.mapLocation,
        workingHours: {
            monday: { ru: contact.workingHours?.monday?.ru },
            tuesday: { ru: contact.workingHours?.tuesday?.ru },
            wednesday: { ru: contact.workingHours?.wednesday?.ru },
            thursday: { ru: contact.workingHours?.thursday?.ru },
            friday: { ru: contact.workingHours?.friday?.ru },
            saturday: { ru: contact.workingHours?.saturday?.ru },
            sunday: { ru: contact.workingHours?.sunday?.ru },
        },
    };

    const isLoading = fetchLoading || updateLoading;

    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
    } = useForm<z.infer<typeof adminContactSchema>>({
        resolver: zodResolver(adminContactSchema),
        defaultValues,
    });

    const onSubmit = async (data: z.infer<typeof adminContactSchema>) => {
        try {
            setUpdateLoading(true);
            const {contact: updatedContact} = await updateContact(contact._id, data);
            setContact(updatedContact);
            toast.success('Контактные данные успешно обновлены');
        } catch (e) {
            const err = e as AxiosError<GlobalMessage>;
            toast.error(err.response?.data?.error || 'Ошибка при обновлении');
            setFetchError(err.response?.data?.error || 'Ошибка при обновлении');
        } finally {
            setUpdateLoading(false);
        }
    };

    const fieldLabels: Record<string, string> = {
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
                    <Label htmlFor="location.ru" className="capitalize">Локация</Label>
                    <Controller
                        name="location.ru"
                        control={control}
                        render={({field}) => (
                            <Input
                                {...field}
                                id="location.ru"
                                placeholder="г. Бишкек, ул., д."
                                disabled={isLoading}
                                className={errors.location?.ru ? "border-red-500" : ""}
                            />
                        )}
                    />
                    {errors.location?.ru && (
                        <p className="text-sm text-red-600">{errors.location.ru.message}</p>
                    )}

                    {Object.entries(fieldLabels).map(([field, label]) => (
                        <div key={field} className="space-y-1">
                            <Label htmlFor={field}>{label}</Label>
                            {field === "linkLocation" ? (
                                <Textarea
                                    id={field}
                                    {...register(field as keyof typeof defaultValues)}
                                    placeholder={`Введите ${label.toLowerCase()}`}
                                    disabled={isLoading}
                                    className={errors[field as keyof typeof defaultValues] ? "border-red-500" : ""}
                                />
                            ) : (
                                <Input
                                    id={field}
                                    {...register(field as keyof typeof defaultValues)}
                                    placeholder={`Введите ${label.toLowerCase()}`}
                                    disabled={isLoading}
                                    className={errors[field as keyof typeof defaultValues] ? "border-red-500" : ""}
                                />
                            )}
                            {errors[field as keyof typeof defaultValues] && (
                                <p className="text-sm text-red-600">
                                    {String(errors[field as keyof typeof defaultValues]?.message)}
                                </p>
                            )}
                        </div>
                    ))}

                    <fieldset className="space-y-4 border rounded-md p-4">
                        <legend className="text-lg font-semibold text-gray-700">Рабочие часы</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(Object.keys(defaultValues.workingHours) as (keyof typeof defaultValues['workingHours'])[]).map((day) => (
                                <div key={day} className="space-y-1">
                                    <Label htmlFor={`workingHours.${day}.ru`} className="capitalize">{day}</Label>
                                    <Controller
                                        name={`workingHours.${day}.ru`}
                                        control={control}
                                        render={({field}) => (
                                            <Input
                                                {...field}
                                                id={`workingHours.${day}.ru`}
                                                placeholder="например, 9:00 - 18:00"
                                                disabled={isLoading}
                                                className={errors.workingHours?.[day]?.ru ? "border-red-500" : ""}
                                            />
                                        )}
                                    />
                                    {errors.workingHours?.[day]?.ru && (
                                        <p className="text-sm text-red-600">
                                            {String(errors.workingHours[day]?.ru?.message)}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </fieldset>

                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        {isLoading ? 'Сохраняем...' : 'Сохранить'}
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
};

export default AdminContactForm;
