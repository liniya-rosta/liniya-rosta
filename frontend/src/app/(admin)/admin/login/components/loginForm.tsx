'use client'

import {Input} from "@/src/components/ui/input";
import {Button} from "@/src/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {UserForm} from "@/src/lib/types";
import {login} from "@/actions/users";
import useUserStore from "@/store/usersStore";

import {userLoginSchema} from "@/src/lib/zodSchemas/userSchema";
import {useRouter} from "next/navigation";
import FormErrorMessage from "@/src/components/ui/FormErrorMessage";
import {isAxiosError} from "axios";
import {toast} from "react-toastify";
import LoaderIcon from "@/src/components/ui/Loading/LoaderIcon";
import React from "react";

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
    const router = useRouter();

    const {
        setUser,
        setAccessToken,
        loading,
        setLoading
    } = useUserStore();

    const onSubmit = async (data: UserForm) => {
        try {
            const user = await login(data);
            setUser(user.user);
            setAccessToken(user.accessToken);
            setLoading(true);
            router.push("/admin");
        } catch (error) {
            let errorMessage = "Неизвестная ошибка при входе в систему";
            if (isAxiosError(error) && error.response) {
                errorMessage = error.response.data.error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }

    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Input
                    className="mb-1"
                    type="text"
                    placeholder="Email"
                    {...register("email")}
                />
                {errors.email && (
                    <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                )}
            </div>

            <div>
                <Input
                    className="mb-1"
                    type="password"
                    placeholder="Пароль"
                    {...register("password")}
                />
                {errors.password && (
                    <FormErrorMessage>{errors.password.message}</FormErrorMessage>
                )}
            </div>

            <div>
                <Input
                    className="mb-1"
                    type="password"
                    placeholder="Подтверждение пароля"
                    {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                    <FormErrorMessage>{errors.confirmPassword.message}</FormErrorMessage>
                )}
            </div>

            <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                {loading && <LoaderIcon/>} Войти
            </Button>
        </form>

    )
}

export default LoginForm;