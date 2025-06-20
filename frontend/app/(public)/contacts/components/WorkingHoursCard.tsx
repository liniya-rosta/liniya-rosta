'use client';

import {Card, CardHeader, CardContent} from "@/components/ui/card";
import {Clock} from "lucide-react";

interface Props {
    workingHours: Record<string, string>;
}

const dayLabels: Record<string, string> = {
    monday: 'Понедельник',
    tuesday: 'Вторник',
    wednesday: 'Среда',
    thursday: 'Четверг',
    friday: 'Пятница',
    saturday: 'Суббота',
    sunday: 'Воскресенье',
};

const WorkingHoursCard: React.FC<Props> = ({workingHours}) => {
    return (
        <Card className="w-full h-full">
            <CardHeader className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-700" aria-hidden="true"/>
                </div>
                <h2 className="text-xl font-semibold">Режим работы</h2>
            </CardHeader>

            <CardContent className="py-0 text-sm text-muted-foreground mb-0">
                <ul className="space-y-3.5">
                    {Object.entries(dayLabels).map(([key, label]) => {
                        const time = workingHours[key];
                        const isDayOff = time === 'Выходной';

                        return (
                            <li key={key} className="flex justify-between items-center">
                                <span>{label}:</span>
                                <span
                                    className={`font-medium ${isDayOff ? 'text-red-600 uppercase' : 'text-foreground'}`}
                                >
                                    {time}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </CardContent>
        </Card>
    );
};

export default WorkingHoursCard;
