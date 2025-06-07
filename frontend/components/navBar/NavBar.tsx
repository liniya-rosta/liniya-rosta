import Link from "next/link";

export default function NavBar() {
    return (
        <nav className="text-white flex flex-wrap gap-12 items-center justify-center w-full p-8">

            <Link className="py-1.5 border-b-1 border-y-transparent hover:border-b-1 hover:border-b-white" href="/">Главная</Link>
            <Link className="py-1.5 border-b-1 border-b-transparent hover:border-b-1 hover:border-b-white" href="/ceilings">Натяжные потолки</Link>
            <Link className="py-1.5 border-b-1 border-b-transparent hover:border-b-1 hover:border-b-white" href="/spc">SPC ламинат</Link>
            <Link className="py-1.5 border-b-1 border-b-transparent hover:border-b-1 hover:border-b-white" href="/services">Услуги</Link>
            <Link className="py-1.5 border-b-1 border-b-transparent hover:border-b-1 hover:border-b-white" href="/portfolio">Портфолио</Link>
            <Link className="py-1.5 border-b-1 border-b-transparent hover:border-b-1 hover:border-b-white" href="/blog">Блог</Link>
            <Link className="py-1.5 border-b-1 border-b-transparent hover:border-b-1 hover:border-b-white" href="/contacts">Контакты</Link>
        </nav>
    );
}