import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/src/components/ui/dialog";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {serviceEditSchema, serviceSchema} from "@/src/lib/zodSchemas/admin/serviceSchema";
import {useSuperAdminServicesStore} from "@/store/superadmin/superAdminServices";
import {ServiceForm} from "@/src/lib/types";
import {toast} from "react-toastify";
import {createService, fetchServiceById, updateService} from "@/actions/superadmin/services";
import {Input} from "@/src/components/ui/input";
import FormErrorMessage from "@/src/components/ui/FormErrorMessage";
import React, {useEffect} from "react";
import {Button} from "@/src/components/ui/button";
import LoaderIcon from "@/src/components/ui/Loading/LoaderIcon";
import {Textarea} from "@/src/components/ui/textarea";
import {fetchAllServices} from "@/actions/services";
import {z} from "zod"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/src/components/ui/tooltip";
import {handleKyError} from "@/src/lib/handleKyError";

interface Props {
    open: boolean;
    openChange: (isOpen: boolean) => void;
    id?: string | null;
}

const ServiceFormModal: React.FC<Props> = ({open, openChange, id}) => {
    const isEditMode = Boolean(id);
    const schema = isEditMode ? serviceEditSchema : serviceSchema;

    const {
        register, handleSubmit, reset, formState: {errors, isDirty}
    } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
    });

    const {
        createServiceLoading,
        updateServiceLoading,
        setServices,
        setCreateServiceLoading,
        setUpdateServiceLoading,
    } = useSuperAdminServicesStore();

    useEffect(() => {
        if (open && !isEditMode) {
            reset({
                title: {
                    ru: "",
                },
                description: {
                    ru: "",
                },
            });
        }

        const fetchData = async () => {
            if (isEditMode && id) {
                try {
                    const data = await fetchServiceById(id);
                    reset(data);
                } catch (error) {
                    const msg = await handleKyError(error, "Неизвестная ошибка при выводе услуг");
                    toast.error(msg);
                }
            }
        };

        void fetchData();
    }, [isEditMode, id, reset, open]);

    const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
            const safeData: ServiceForm = {
                title: {
                    ru: data.title!.ru,
                },
                description: {
                    ru: data.description?.ru ?? "",
                },
            };
            if (isEditMode && id) {
                setUpdateServiceLoading(true);
                await updateService(id, safeData);
                toast.success("Услуга успешно обновлена");
            } else if (data.title) {
                setCreateServiceLoading(true);
                await createService(safeData);
                toast.success("Услуга успешно создана");
            }

            const updated = await fetchAllServices();
            setServices(updated);

            openChange(false);
            reset();
        } catch (error) {
            const msg = await handleKyError(
                error,
                isEditMode
                    ? "Неизвестная ошибка при редактировании услуги"
                    : "Неизвестная ошибка при создании услуги"
            );            toast.error(msg);
        } finally {
            setCreateServiceLoading(false);
            setUpdateServiceLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={openChange}>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle> {isEditMode ? "Редактировать" : "Создать"} услугу</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <Input
                            className="mb-2"
                            type="text"
                            placeholder="Название услуги"
                            disabled={createServiceLoading}
                            {...register("title.ru")}
                        />
                        {errors.title && errors.title.ru && (
                            <FormErrorMessage>{errors.title.ru.message}</FormErrorMessage>
                        )}
                    </div>
                    <div className="mb-3">
                        <Textarea
                            className="mb-2"
                            placeholder="Описание"
                            disabled={createServiceLoading}
                            {...register("description.ru")}
                        />
                        {errors.description && errors.description.ru && (
                            <FormErrorMessage>{errors.description.ru.message}</FormErrorMessage>
                        )}
                    </div>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="submit"
                                className="ml-auto px-8"
                                disabled={!isDirty || createServiceLoading || updateServiceLoading}
                            >
                                {createServiceLoading || updateServiceLoading ? <LoaderIcon/> : null}
                                {isEditMode ? "Сохранить" : "Создать"}
                            </Button>
                        </TooltipTrigger>
                        {!isDirty && isEditMode && <TooltipContent>Вы ничего не изменили</TooltipContent>}
                    </Tooltip>

                </form>
            </DialogContent>
        </Dialog>
    )
};

export default ServiceFormModal;