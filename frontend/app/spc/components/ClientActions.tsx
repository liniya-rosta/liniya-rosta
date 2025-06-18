'use client';

import React, { useState } from 'react';
import { ModalWindow } from '@/components/ui/modal-window';
import RequestBtnOrange from '@/components/ui/requestBtnOrange';
import RequestForm from '@/components/shared/RequestForm';

export default function ClientActions() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <RequestBtnOrange onClick={() => setIsOpen(true)} />
            <ModalWindow isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <RequestForm closeModal={() => setIsOpen(false)} />
            </ModalWindow>
        </>
    )
}