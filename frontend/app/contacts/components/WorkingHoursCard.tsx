import {Clock} from 'lucide-react';

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
        <section
            aria-labelledby="working-hours-heading"
            className="bg-white rounded-xl border border-gray-200 shadow-sm"
        >
            <div className="p-6 flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-700" aria-hidden="true"/>
                </div>
                <h2 id="working-hours-heading" className="text-xl font-semibold text-gray-900">
                    Режим работы
                </h2>
            </div>
            <div className="p-6 pt-0 text-gray-700">
                <ul className="space-y-3">
                    {Object.keys(dayLabels).map((key) => {
                        const time = workingHours[key];
                        const isDayOff = time === 'Выходной';

                        return (
                            <li key={key} className="flex justify-between items-center">
                                <span>{dayLabels[key]}:</span>
                                <span
                                    className={`font-medium ${isDayOff ? 'text-red-600 uppercase' : 'text-gray-900'}`}>
                  {isDayOff ? 'Выходной' : time}
                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
};

export default WorkingHoursCard;
