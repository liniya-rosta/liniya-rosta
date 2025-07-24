'use client';

import {Card, CardHeader, CardContent} from "@/src/components/ui/card";
import {Clock} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";

interface Props {
    workingHours: Record<string, { ru: string; ky?: string }>;
}

const WorkingHoursCard: React.FC<Props> = ({workingHours}) => {
    const tContacts = useTranslations("ContactsPage");
    const dayLabels = {
        monday: tContacts("workDays.monday"),
        tuesday: tContacts("workDays.tuesday"),
        wednesday: tContacts("workDays.wednesday"),
        thursday: tContacts("workDays.thursday"),
        friday: tContacts("workDays.friday"),
        saturday: tContacts("workDays.saturday"),
        sunday: tContacts("workDays.sunday"),
    }
    const locale = useLocale() as "ru" | "ky";

    return (
        <Card className="w-full h-full">
            <CardHeader className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-700" aria-hidden="true"/>
                </div>
                <h2 className="text-xl font-semibold">{tContacts("workSchedule")}</h2>
            </CardHeader>

            <CardContent className="py-0 text-sm text-muted-foreground mb-0">
                <ul className="space-y-3.5">
                    {Object.entries(dayLabels).map(([key, label]) => {
                        const time = workingHours[key][locale];
                        const isDayOff = time === 'Выходной' || time === 'Эс алуу';

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
