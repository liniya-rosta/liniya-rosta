import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/src/components/ui/dialog";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {serviceEditSchema, serviceSchema} from "@/lib/zodSchemas/serviceSchema";
import {useSuperAdminServicesStore} from "@/store/superadmin/superAdminServices";
import {ServiceForm} from "@/lib/types";
import {isAxiosError} from "axios";
import {toast} from "react-toastify";
import {createService, fetchServiceById, updateService} from "@/actions/superadmin/services";
import {Input} from "@/src/components/ui/input";
import FormErrorMessage from "@/src/components/ui/FormErrorMessage";
import React, {useEffect} from "react";
import {Button} from "@/src/components/ui/button";
import LoaderIcon from "@/src/components/ui/LoaderIcon";
import {Textarea} from "@/src/components/ui/textarea";
import {fetchAllServices} from "@/actions/services";
import {z} from "zod"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/src/components/ui/tooltip";

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
                title: "",
                description: "",
            });
        }

        const fetchData = async () => {
            if (isEditMode && id) {
                try {
                    const data = await fetchServiceById(id);
                    reset(data);
                } catch (error) {
                    let errorMessage = "Неизвестная ошибка при выводе услуг";
                    if (isAxiosError(error) && error.response) {
                        errorMessage = error.response.data.error;
                    } else if (error instanceof Error) {
                        errorMessage = error.message;
                    }
                    toast.error(errorMessage);
                }
            }
        };

        void fetchData();
    }, [isEditMode, id, reset, open]);

    const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
            if (isEditMode && id) {
                setUpdateServiceLoading(true);
                await updateService(id, data);
                toast.success("Услуга успешно обновлена");
            } else if( data.title ){
                const safeData: ServiceForm = {
                    title: data.title,
                    description: data.description,
                };
                await createService(safeData);
                setCreateServiceLoading(true);
                toast.success("Услуга успешно создана");
            }

            const updated = await fetchAllServices();
            setServices(updated);

            openChange(false);
            reset();
        } catch (error) {
            let errorMessage = "Неизвестная ошибка при создании услуг";
            if (isAxiosError(error) && error.response) {
                errorMessage = error.response.data.error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
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
                            {...register("title")}
                        />
                        {errors.title && (
                            <FormErrorMessage>{errors.title.message}</FormErrorMessage>
                        )}
                    </div>
                    <div className="mb-3">
                        <Textarea
                            className="mb-2"
                            placeholder="Описание"
                            disabled={createServiceLoading}
                            {...register("description")}
                        />
                        {errors.description && (
                            <FormErrorMessage>{errors.description.message}</FormErrorMessage>
                        )}
                    </div>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="submit"
                                className="ml-auto px-8"
                                disabled={!isDirty || createServiceLoading || updateServiceLoading}
                            >
                                {createServiceLoading || updateServiceLoading ? <LoaderIcon /> : null}
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