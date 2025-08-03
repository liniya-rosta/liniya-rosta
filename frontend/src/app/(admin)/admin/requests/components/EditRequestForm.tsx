import React, {useEffect} from 'react';
import {Input} from "@/src/components/ui/input";
import {IRequest, RequestMutation} from "@/src/lib/types";
import {editRequest, fetchAllRequests} from "@/actions/superadmin/requests";
import {toast} from "react-toastify";
import {useAdminRequestsStore} from "@/store/superadmin/adminRequestsStore";
import {Button} from "@/src/components/ui/button";
import {requestAdminSchema} from "@/src/lib/zodSchemas/admin/requestAdminSchema";
import {useForm} from 'react-hook-form';
import {z} from "zod"
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/src/components/ui/form';
import {Textarea} from "@/src/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/src/components/ui/select';
import {DialogFooter} from "@/src/components/ui/dialog";
import LoaderIcon from "@/src/components/ui/Loading/LoaderIcon";


interface Props {
    request: IRequest | null;
    onClose: () => void;
}

const EditRequestForm: React.FC<Props> = ({request, onClose}) => {
    const {setRequests, status, updateLoading, setUpdateLoading, viewArchived} = useAdminRequestsStore();
    const form = useForm<z.infer<typeof requestAdminSchema>>({
        resolver: zodResolver(requestAdminSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            commentOfManager: "",
            status: "Новая",
        },
    })

    useEffect(() => {
        if (request) {
            form.reset({
                name: request.name,
                phone: request.phone,
                email: request.email,
                commentOfManager: request.commentOfManager ?? '',
                status: request.status,
                isArchived: request.isArchived ?? false,
            });
        }
    }, [request]);

    if (!request) return null;

    const getChangedFields = (
        original: RequestMutation,
        updated: RequestMutation
    ): Partial<RequestMutation> => Object.entries(updated).reduce((changes, [key, value]) => {
        if (value !== original[key as keyof RequestMutation]) {
            changes[key as keyof RequestMutation] = value;
        }
        return changes;
    }, {} as Partial<RequestMutation>);

    const onSubmit = async (values: z.infer<typeof requestAdminSchema>) => {
        const originalData: RequestMutation = {
            name: request.name,
            phone: request.phone,
            email: request.email,
            commentOfManager: request.commentOfManager ?? '',
            status: request.status,
        };

        const changes = getChangedFields(originalData, values);

        try {
            setUpdateLoading(true);
            await editRequest(request._id, changes);
            const requests = await fetchAllRequests({status, page: 1, archived: viewArchived});
            setRequests(requests.data);
            toast.success("Заявка успешно обновлена!");
            onClose();
        } catch {
            toast.error("Ошибка при обновлении заявки");
            setUpdateLoading(false);
        } finally {
            setUpdateLoading(false);
        }
    };


    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Имя</FormLabel>
                            <FormControl>
                                <Input placeholder="Введите имя" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Номер телефона</FormLabel>
                            <FormControl>
                                <Input placeholder="Введите номер телефона" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Почта</FormLabel>
                            <FormControl>
                                <Input placeholder="Введите почту" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Статус</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={request?.status}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите статус"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Новая">Новая</SelectItem>
                                    <SelectItem value="В работе">В работе</SelectItem>
                                    <SelectItem value="Завершена">Завершена</SelectItem>
                                    <SelectItem value="Отклонена">Отклонена</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="commentOfManager"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Комментарий</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Введите комментарий"
                                    className="resize-none"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <Button
                        onClick={onClose}
                        type="button"
                        variant="outline"
                    >
                        Отмена
                    </Button>

                    <Button
                        type="submit"
                    >
                        Сохранить {updateLoading && <LoaderIcon/>}
                    </Button>


                </DialogFooter>
            </form>
        </Form>
    );
};

export default EditRequestForm;