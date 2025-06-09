import {Clock} from 'lucide-react';

const WorkingHoursCard = () => (
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
                <li className="flex justify-between items-center">
                    <span>Понедельник - Воскресенье:</span>
                    <span className="font-medium text-gray-900">
    <time dateTime="09:00">9:00</time> – <time dateTime="19:00">19:00</time>
  </span>
                </li>
            </ul>
        </div>
    </section>
);

export default WorkingHoursCard;