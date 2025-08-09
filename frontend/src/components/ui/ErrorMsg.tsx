import React from 'react';

interface Props {
    error: string | null;
}

const ErrorMsg: React.FC<Props> = ({error}) => {
    if (!error) return <div className="text-center text-red-500">Неизвестная ошибка</div>

    return (
        <div className="text-center text-red-500">
            {"\"Ошибка загрузки\""} {error}
        </div>
    );
};

export default ErrorMsg;