'use client';

import {Contact, GlobalMessage} from '@/lib/types';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useSuperadminContactsStore} from '@/store/superadmin/superadminContactsStore';
import {updateContact} from '@/actions/superadmin/contacts';
import {AxiosError} from 'axios';
import {adminContactSchema} from "@/lib/zodSchemas/adminContactSchema";
import {toast} from "react-toastify";

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
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg"
            noValidate
        >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Редактирование контакта</h2>

            {Object.entries(fieldLabels).map(([field, label]) => (
                <div key={field} className="flex flex-col">
                    <label htmlFor={field} className="mb-1 text-gray-700 font-medium">
                        {label}
                    </label>
                    <input
                        id={field}
                        {...register(field as keyof ContactFormData)}
                        placeholder={`Введите ${label.toLowerCase()}`}
                        className={`border rounded-md p-3 transition 
          focus:outline-none focus:ring-2 focus:ring-blue-500 
          ${errors[field as keyof ContactFormData] ? 'border-red-500' : 'border-gray-300'}`}
                        autoComplete="off"
                        disabled={isLoading}
                    />
                    {errors[field as keyof ContactFormData] && (
                        <p className="text-red-600 text-sm mt-1">
                            {String(errors[field as keyof ContactFormData]?.message)}
                        </p>
                    )}
                </div>
            ))}

            <fieldset className="border border-gray-300 rounded-md p-4">
                <legend className="text-lg font-semibold mb-4 text-gray-700">Рабочие часы</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {(Object.keys(defaultValues.workingHours) as (keyof ContactFormData['workingHours'])[]).map((day) => (
                        <div key={day} className="flex flex-col">
                            <label
                                htmlFor={`workingHours.${day}`}
                                className="capitalize mb-1 text-gray-700 font-medium"
                            >
                                {day}
                            </label>
                            <Controller
                                name={`workingHours.${day}`}
                                control={control}
                                render={({field}) => (
                                    <input
                                        {...field}
                                        id={`workingHours.${day}`}
                                        className={`border rounded-md p-3 transition 
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 
                                            ${errors.workingHours?.[day] ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="например, 9:00 - 18:00"
                                        autoComplete="off"
                                        disabled={isLoading}
                                    />
                                )}
                            />
                            {errors.workingHours?.[day] && (
                                <p className="text-red-600 text-sm mt-1">
                                    {String(errors.workingHours[day]?.message)}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </fieldset>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md
                    hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Сохраняем...' : 'Сохранить'}
            </button>
        </form>
    );
};

export default AdminContactForm;
