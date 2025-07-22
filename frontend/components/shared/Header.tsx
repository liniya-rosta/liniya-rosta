import React from 'react';
import NavBar from "@/components/shared/NavBar";
import {Container} from "@/components/shared/Container";

const Header = () => {
    return (
        <header className="py-4 shadow mb-15 md:mb-8">
            <Container>
                <NavBar/>
            </Container>
        </header>
    );
};

export default Header;