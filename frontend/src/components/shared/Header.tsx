import React from 'react';
import NavBar from "@/src/components/shared/NavBar";
import {Container} from "@/src/components/shared/Container";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
    return (
        <header className="py-4 shadow mb-15 md:mb-8">
            <Container>
                <div className="flex items-center justify-between">
                    <Link href="/frontend/public">
                        <Image
                            src="/logo.png"
                            alt="Линия роста"
                            width={300}
                            height={40}
                            className="h-20 w-20"
                            priority/>
                    </Link>
                    <NavBar/>
                </div>
            </Container>
        </header>
    );
};

export default Header;