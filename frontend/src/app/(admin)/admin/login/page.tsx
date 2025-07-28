import React from "react";
import LoginForm from "@/src/app/(admin)/admin/login/components/loginForm";
import { Container } from "@/src/components/shared/Container";

const AdminLoginPage = () => {
    return (
        <Container>
            <div className="max-w-lg mx-auto border border-gray px-9 py-5 rounded mt-30">
                <h1 className="text-2xl text-center font-bold mb-4">Войти</h1>
                <LoginForm/>
            </div>
        </Container>
    );
};

export default AdminLoginPage;