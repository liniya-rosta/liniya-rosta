import React from 'react';

interface Props {
    error: string | null;
    label?: string;
}

const ErrorMsg: React.FC<Props> = ({error, label}) => {
    if (!error) return <div className="text-center text-red-500">Неизвестная ошибка</div>

    return (
        <div className="text-center text-red-500">
            {label ? `Ошибка загрузки ${label}:` : 'Ошибка'} {error}
        </div>
    );
};

export default ErrorMsg;