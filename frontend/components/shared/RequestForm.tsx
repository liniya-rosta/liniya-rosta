import React, {useState} from 'react';
import { toast } from "react-toastify";
import {IRequestMutation} from "@/lib/types";
import {useRequestStore} from "@/store/request";

interface Props {
    closeModal: () => void;
}

const initialState: IRequestMutation = {
    name: '',
    email: '',
    phone: '',
}

const RequestForm: React.FC<Props> = ({closeModal}) => {
    const [state, setState] = useState<IRequestMutation>(initialState);
    const {createItem} = useRequestStore();
    const [localError, setLocalError] = useState<string | null>(null);

    const submitFormHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        const error = await createItem(state);

        if (error) {
            setLocalError(error);
            return;
        } else {
            setLocalError(null);
        }
        toast.success('Заявка отправлена! Менеджер свяжется с вами.');
        closeModal();
        setState(initialState);
    };

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState(prevState => {
            return {...prevState, [name]: value};
        });
    };

    return (
        <form
            onSubmit={submitFormHandler}
            className="max-w-md mx-auto p-4 bg-white rounded-2xl shadow-md space-y-4"
        >
            <h2 className="text-xl font-semibold text-center">Оставить заявку</h2>
            {localError && (
                <div className="flex items-center mt-2 text-red-700 bg-red-100 border border-red-400 rounded-md px-3 py-2">
                    <p className="text-sm font-medium">{localError}</p>
                </div>
            )}
            <input
                type="text"
                name="name"
                placeholder="Имя"
                value={state.name}
                onChange={inputChangeHandler}
                required
                className="w-full p-2 border rounded-xl focus:outline-none focus:ring"
            />

            <input
                type="email"
                name="email"
                placeholder="Почта"
                value={state.email}
                onChange={inputChangeHandler}
                required
                className="w-full p-2 border rounded-xl focus:outline-none focus:ring"
            />

            <input
                type="tel"
                name="phone"
                placeholder="Номер телефона"
                value={state.phone}
                onChange={inputChangeHandler}
                required
                className="w-full p-2 border rounded-xl focus:outline-none focus:ring"
            />

            <button
                type="submit"
                className="w-full bg-gray-600 text-white py-2 rounded-xl hover:bg-gray-700 transition"
            >
                Отправить
            </button>
        </form>
    );
};

export default RequestForm;