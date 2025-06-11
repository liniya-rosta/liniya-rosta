'use client'

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {GlobalMessage, UserForm} from "@/lib/types";
import {login} from "@/actions/users";
import {isAxiosError} from "axios";
import {useState} from "react";
import useUserStore from "@/store/usersStore";
import useAuthStore from "@/store/authStore";
import {userLoginSchema} from "@/lib/zodSchemas/userSchema";


const LoginForm = () => {
    const {register, handleSubmit, formState: {errors}} = useForm(
        {
            resolver: zodResolver(userLoginSchema),
            defaultValues: {
                email: "",
                password: "",
                confirmPassword: "",
            }
        });

    const {setUser} = useUserStore();
    const { setAccessToken} = useAuthStore();

    const [error, setError] = useState<GlobalMessage | null>(null);

    const onSubmit = async (data: UserForm) => {
        try {
            const user = await login(data);
            setUser(user.user);
            setAccessToken(user.accessToken);

        } catch (e) {
            console.log(e)
            if (isAxiosError(e)) {
                console.log(e)
            }
        }

    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            <Input
                className="mb-3"
                type="text"
                placeholder="Email"
                {...register("email")}
            />

            {errors.password && <p className="text-red-500 text-sm"
            >{errors.password.message}</p>}
            <Input
                className="mb-3"
                type="password"
                placeholder="Пароль"
                {...register("password")}
            />

            {errors.confirmPassword && <p className="text-red-500 text-sm"
            >{errors.confirmPassword.message}</p>}
            <Input
                className="mb-4"
                type="password"
                placeholder="Подтверждение пароля"
                {...register("confirmPassword")}
            />

            <Button type="submit">Войти</Button>
        </form>
    )
}

export default LoginForm;