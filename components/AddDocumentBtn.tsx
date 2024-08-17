'use client';
import React from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import { createDocument } from '@/lib/actions/room.actions';
import { useRouter } from 'next/navigation';

const AddDocumentBtn = ({userId,email} : AddDocumentBtnProps) => {
    const router = useRouter();

    const AddDocumentHandler = async () => {
    try {
        const room = await createDocument({userId,email});
        if(room) {
            router.push(`/documents/${room.id}`);
        }
    }
    catch (error) {
        console.error("Error occured while creating room"+ error);
    }
    }
    return (
        <Button onClick={AddDocumentHandler} className='gradient-blue flex gap-1 shadow-md'>
            <Image src={'/assets/icons/add.svg'} alt='Add document' width={24} height={24} />
            <p className='hidden sm:block'>
                Create a new document
            </p>
        </Button>
    );
};

export default AddDocumentBtn;