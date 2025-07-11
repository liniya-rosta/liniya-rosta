import React from 'react';

interface Props {
    onClick: () => void;
}

const RequestBtn: React.FC<Props> = ({onClick}) => {
    return (
        <>
            <button
                onClick={onClick}
                className="mt-4 px-5 py-3 text-white rounded-full bg-transparent border border-white hover:animate-pulse cursor-pointer">
                Оставить заявку
            </button>
        </>
    );
};

export default RequestBtn;