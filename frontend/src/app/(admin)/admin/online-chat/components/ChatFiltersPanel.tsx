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
import LoaderIcon from "@/src/components/ui/Loading/LoaderIcon";

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

    const {fetchChatLoading} =useAdminChatStore();

    const onSubmit = (data: ChatFilters) => {
        const formatted = {
            ...data,
            createdFrom: data.createdFrom || undefined,
            createdTo: data.createdTo || undefined,
            updatedFrom: data.updatedFrom || undefined,
            updatedTo: data.updatedTo || undefined,
        };
        onChange(formatted);
    };

    const filterCleaning = () => {
        reset();
        onChange({});
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 rounded-xl shadow mb-6">
            <div className="flex flex-wrap gap-4">
                <Input
                    className="max-w-2/6"
                    placeholder="Имя клиента" {...register("clientName")}
                />

                <Select onValueChange={(val) => setValue("status", val)} value={watch("status") || ""}>
                    <SelectTrigger>
                        <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                        {chat_statuses.map((status, index) => (
                            <SelectItem key={index} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select onValueChange={(val) => setValue("adminId", val)} value={watch("adminId") || ""}>
                    <SelectTrigger>
                        <SelectValue placeholder="Админ" />
                    </SelectTrigger>
                    <SelectContent>
                        {adminList.map((admin) => (
                            <SelectItem key={admin._id} value={admin._id}>
                                {admin.displayName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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

            <div className="flex gap-3 mt-2">
                <Button type="submit" disabled={fetchChatLoading}>
                    {fetchChatLoading && <LoaderIcon/>} Применить
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={filterCleaning}
                    disabled={fetchChatLoading}
                >
                    {fetchChatLoading && <LoaderIcon/>}
                    Сбросить
                </Button>
            </div>
        </form>
    );
};

export default ChatFiltersPanel;
