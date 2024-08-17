'use server';
import { randomUUID } from "crypto"
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";

export const createDocument = async ({ userId, email }: CreateDocumentParams) => {

    const roomId = randomUUID();

    try {
        const metadata = {
            creatorId: userId,
            email,
            title: "Untitled Document",
        };

        const usersAccesses: RoomAccesses = {
            [email]: ["room:write"],
        };

        const room = await liveblocks.createRoom(roomId, {
            metadata,
            defaultAccesses: ['room:write'],
            usersAccesses
        });

        revalidatePath('/');

        return parseStringify(room);
    }
    catch (error) {
        console.error("Error occured while creating room" + error);
    }
}
export const getDocument = async ({ roomId, userId }: { roomId: string, userId: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        // const hasAccess = Object.keys(room.usersAccesses).includes(userId);

        // if(!hasAccess) {
        //     throw new Error("You do not have access to this document");
        // }
        return parseStringify(room);
    }
    catch (error) {
        console.error("Error occured while getting room" + error);
    }
}
export const updateDocument = async ({ roomId, title }: { roomId: string, title: string }) => {
    try {
        const room = await liveblocks.updateRoom(roomId, {
            metadata: {
                title,
            }
        });

        revalidatePath('/');

        return parseStringify(room);
    }
    catch (error) {
        console.error("Error occured while updating room" + error);
    }
}
export const getAllDocuments = async ({ email }: { email: string }) => {
    try {
        const room = await liveblocks.getRooms({ userId: email });

        // const hasAccess = Object.keys(room.usersAccesses).includes(userId);

        // if(!hasAccess) {
        //     throw new Error("You do not have access to this document");
        // }
        return parseStringify(room);
    }
    catch (error) {
        console.error("Error occured while getting all rooms" + error);
    }
}