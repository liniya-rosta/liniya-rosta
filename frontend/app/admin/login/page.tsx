import React from "react";
import LoginForm from "@/app/admin/login/components/loginForm";

const AdminLoginPage = () => {


    return (
        <main className="max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Вход в админку</h1>
            <LoginForm/>
        </main>
    );
};

export default AdminLoginPage;