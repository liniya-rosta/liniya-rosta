'use client'

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {UserForm} from "@/lib/types";
import {login} from "@/actions/users";
import useUserStore from "@/store/usersStore";
import useAuthStore from "@/store/authStore";
import {userLoginSchema} from "@/lib/zodSchemas/userSchema";
import {useRouter} from "next/navigation";

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

    const {setUser} = useUserStore();
    const { setAccessToken} = useAuthStore();

    const onSubmit = async (data: UserForm) => {
        try {
            const user = await login(data);
            setUser(user.user);
            setAccessToken(user.accessToken);
            router.push("/admin");
        } catch (e) {
            console.log(e)
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
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
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
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
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
                    <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full">
                Войти
            </Button>
        </form>

    )
}

export default LoginForm;