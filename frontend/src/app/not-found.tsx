'use client';

import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { ArrowLeft } from 'lucide-react';

 const NotFound = () => (
     <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
         <h1 className="text-4xl font-bold mb-4">404 — Страница не найдена</h1>
         <p className="text-muted-foreground text-lg mb-6">
             Такой страницы не существует или она была удалена.
         </p>
         <Link href="/frontend/public">
             <Button className="flex items-center gap-2">
                 <ArrowLeft size={16}/>
                 На главную
             </Button>
         </Link>
     </div>
 );
export default NotFound;
