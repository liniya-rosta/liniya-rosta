import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import dayjs from "dayjs";
import {ChatFilters, User} from "@/src/lib/types";
import {chat_statuses} from "@/src/app/(admin)/admin/online-chat/constants";

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

    const onSubmit = (data: ChatFilters) => {
        const formatted = {
            ...data,
            createdFrom: data.createdFrom ? dayjs(data.createdFrom).toISOString() : undefined,
            createdTo: data.createdTo ? dayjs(data.createdTo).toISOString() : undefined,
            updatedFrom: data.updatedFrom ? dayjs(data.updatedFrom).toISOString() : undefined,
            updatedTo: data.updatedTo ? dayjs(data.updatedTo).toISOString() : undefined,
        };
        onChange(formatted);
    };

    const handleReset = () => {
        reset();
        onChange({});
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white rounded-xl shadow mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input placeholder="Имя клиента" {...register("clientName")} />

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
                <label className="flex items-center gap-1">
                    <span className="min-w-[80px] text-sm">Создан от</span>
                    <Input type="date" {...register("createdFrom")} />
                </label>
                <label className="flex items-center gap-1">
                    <span className="min-w-[80px] text-sm">Создан до</span>
                    <Input type="date" {...register("createdTo")} />
                </label>
                <label className="flex items-center gap-1">
                    <span className="min-w-[80px] text-sm">Обновлён от</span>
                    <Input type="date" {...register("updatedFrom")} />
                </label>
                <label className="flex items-center gap-1">
                    <span className="min-w-[80px] text-sm">Обновлён до</span>
                    <Input type="date" {...register("updatedTo")} />
                </label>
            </div>

            <div className="flex gap-3 mt-2">
                <Button type="submit">Применить</Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                    Сбросить
                </Button>
            </div>
        </form>
    );
};

export default ChatFiltersPanel;
