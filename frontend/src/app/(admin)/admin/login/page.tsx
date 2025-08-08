import React from "react";
import LoginForm from "@/src/app/(admin)/admin/login/components/loginForm";
import { Container } from '@/src/components/shared/Container';
import Link from "next/link";

const AdminLoginPage = () => {
    return (
        <Container>
            <div className="max-w-lg mx-auto mb-5 border border-gray px-9 py-5 rounded-xl mt-30">
                <h1 className="text-2xl text-center font-bold mb-4">Войти</h1>
                <LoginForm/>
            </div>
            <div>
                <Link className="block text-center text-blue-500 hover:underline" href="/ru">Вернуться на главную страницу?</Link>
            </div>
        </Container>
    );
};

export default AdminLoginPage;