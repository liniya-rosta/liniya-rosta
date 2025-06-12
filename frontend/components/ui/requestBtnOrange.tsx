import React from 'react';

interface Props {
    onClick: () => void;
}

const RequestBtn: React.FC<Props> = ({onClick}) => {
    return (
        <>
            <button
                onClick={onClick}
                className="mt-4 px-5 py-3 font-bold text-orange-500 rounded-full bg-transparent border border-orange-500 hover:bg-orange-100">
                Оставить заявку
            </button>
        </>
    );
};

export default RequestBtn;