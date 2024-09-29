"use client";
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense';
import React, { useEffect, useRef, useState } from 'react';
import { Editor } from './editor/Editor';
import Header from './Header';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Loader from './Loader';
import ActiveCollaborators from './ActiveCollaborators';
import { Input } from './ui/input';
import Image from 'next/image';
import { updateDocument } from '@/lib/actions/room.actions';
import ShareModal from './ShareModal';

const CollaborativeRoom = ({ roomId, roomMetadata, users, currentUserType }: CollaborativeRoomProps) => {
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState(roomMetadata?.title);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = setTimeout(async () => {
                console.log("clicked outside", editing);
            if (editing && title !== roomMetadata?.title) {
                console.log("Fucking called");
                setLoading(true);
                try {
                const res = await updateDocument({roomId, title});
                if(res) setEditing(false);
                }
                catch (error) {
                    console.error("Error occured while updating document title" + error);
                };
                setLoading(false);
            }
        }, 2500);
        // document.addEventListener('mousedown', handleClickOutside);
            return () => clearTimeout(handleClickOutside);
           
        // return () => {
        //     document.removeEventListener('mousedown', handleClickOutside);
        // };
    }, [title,roomId]);

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current?.focus();
        }
    }, [editing]);

    const updateDocumentTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setLoading(true);
            try {
                if (title !== roomMetadata?.title) {
                    const updatedTitle = await updateDocument({ roomId, title });

                    if (updatedTitle) {
                        console.log("updatedTIlte", updatedTitle);
                        setEditing(false);
                    }
                }
            }
            catch (error) {
                console.error("Error occured while updating document title" + error);
            };
            setLoading(false);
        }
    }
    // console.log("setEditing", editing);
    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<Loader />}>
                <div>
                    <div className='collaborative-room'>
                        <Header>
                            <div className='flex w-fit items-center justify-center gap-2' ref={containerRef}>
                                {editing && !loading ? (
                                    <Input
                                        type='text'
                                        ref={inputRef}
                                        placeholder='Enter Title'
                                        onChange={(e) => setTitle(e.target.value)}
                                        onKeyDown={(e) => updateDocumentTitleHandler(e)}
                                        disabled={!editing}
                                        value={title}
                                        className='document-title-input'
                                    />
                                )
                                    :
                                    (
                                        <>
                                            <p className='document-title'>{title}</p>
                                        </>
                                    )}
                                {currentUserType === 'editor' && !editing ? (
                                    <Image
                                        src={"/assets/icons/edit.svg"}
                                        alt="Edit Icon"
                                        width={24}
                                        height={24}
                                        onClick={() => {
                                            console.log("true hora hao");
                                            setEditing(true)}
                                        }
                                        className='cursor-pointer'
                                    />
                                )
                                    :
                                    !editing && (
                                        <p className='view-only-tag'>View only</p>
                                    )
                                }
                                {
                                    loading && <p className='text-sm text-gray-400'>saving...</p>
                                }
                            </div>
                            <div className='flex w-full flex-1 justify-end gap-2 sm:gap-3'>
                                <ActiveCollaborators />
                                <ShareModal 
                                 roomId={roomId} 
                                 collaborators={users} 
                                 creatorId={roomMetadata.creatorId} 
                                 currentUserType={currentUserType}
                                 />
                                <SignedOut>
                                    <SignInButton />
                                </SignedOut>
                                <SignedIn>
                                    <UserButton />
                                </SignedIn>
                            </div>
                        </Header>
                    </div>
                    <Editor roomId={roomId} currentUserType={currentUserType} />
                </div>
            </ClientSideSuspense>
        </RoomProvider>
    );
};

export default CollaborativeRoom;