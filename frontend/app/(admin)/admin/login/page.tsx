import React from "react";
import LoginForm from "@/app/(admin)/admin/login/components/loginForm";

const AdminLoginPage = () => {
    return (
        <main className="max-w-md mx-auto p-4 mt-10">
            <div>
                <h1 className="text-2xl text-center font-bold mb-4">Войти</h1>
                <LoginForm/>
            </div>
        </main>
    );
};

export default AdminLoginPage;