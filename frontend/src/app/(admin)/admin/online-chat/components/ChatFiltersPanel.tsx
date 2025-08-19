import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import {ChatFilters, User} from "@/src/lib/types";
import {chat_statuses} from "@/src/app/(admin)/admin/online-chat/constants";
import {useAdminChatStore} from "@/store/superadmin/adminChatStore";

const filterSchema = z.object({
    status: z.string().optional(),
    clientName: z.string().optional(),
    createdFrom: z.string().optional(),
    createdTo: z.string().optional(),
    updatedFrom: z.string().optional(),
    updatedTo: z.string().optional(),
    adminId: z.string().optional(),
});

interface ChatFiltersPanelProps {
    onChange: (filters: ChatFilters) => void;
    adminList: User[];
}

const ChatFiltersPanel: React.FC<ChatFiltersPanelProps> = ({ onChange, adminList }) => {
    const { register, handleSubmit, setValue, watch, reset } = useForm<ChatFilters>({
        resolver: zodResolver(filterSchema),
        defaultValues: {},
    });

    const {fetchChatLoading, setFetchChatLoading} =useAdminChatStore();

    const onSubmit = (data: ChatFilters) => {
        const formatted = {
            ...data,
            createdFrom: data.createdFrom || undefined,
            createdTo: data.createdTo || undefined,
            updatedFrom: data.updatedFrom || undefined,
            updatedTo: data.updatedTo || undefined,
        };
        setFetchChatLoading(true);
        onChange(formatted);
    };

    const filterCleaning = () => {
        reset();
        onChange({});
        setFetchChatLoading(true);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 rounded-xl shadow mb-6">
            <div className="flex gap-4 mb-8 flex-wrap justify-between items-center">

                <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
                    <label className="flex flex-col w-full max-w-xs text-sm">
                        <span className="mb-1">Имя клиента</span>
                        <Input placeholder="Введите имя" {...register("clientName")} />
                    </label>

                    <label className="flex flex-col w-40 text-sm">
                        <span className="mb-1">Статус</span>
                        <Select
                            onValueChange={(val) => setValue("status", val)}
                            value={watch("status") || ""}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Нет статуса" />
                            </SelectTrigger>
                            <SelectContent>
                                {chat_statuses.map((status, index) => (
                                    <SelectItem key={index} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </label>

                    <label className="flex flex-col w-40 text-sm">
                        <span className="mb-1">Админ</span>
                        <Select
                            onValueChange={(val) => setValue("adminId", val)}
                            value={watch("adminId") || ""}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Выбрать" />
                            </SelectTrigger>
                            <SelectContent>
                                {adminList.map((admin) => (
                                    <SelectItem key={admin._id} value={admin._id}>
                                        {admin.displayName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </label>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <label>
                        <span className="text-sm">Создан от</span>
                        <Input type="date" {...register("createdFrom")} />
                    </label>
                    <label>
                        <span className="text-sm">Создан до</span>
                        <Input type="date" {...register("createdTo")} />
                    </label>
                    <label>
                        <span className="text-sm">Обновлён от</span>
                        <Input type="date" {...register("updatedFrom")} />
                    </label>
                    <label>
                        <span className="text-sm">Обновлён до</span>
                        <Input type="date" {...register("updatedTo")} />
                    </label>
                </div>
            </div>

            <div className="flex gap-3 mt-2">
                <Button type="submit" disabled={fetchChatLoading}>
                     Применить
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={filterCleaning}
                    disabled={fetchChatLoading}
                >
                    Сбросить
                </Button>
            </div>
        </form>
    );
};

export default ChatFiltersPanel;
