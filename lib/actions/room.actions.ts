'use server';
import { randomUUID } from "crypto"
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { getAccessType, parseStringify } from "../utils";
import { redirect } from "next/navigation";

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
            defaultAccesses: [],
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

        const hasAccess = Object.keys(room.usersAccesses).includes(userId);

        if(!hasAccess) {
            throw new Error("You do not have access to this document");
        }
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
export const updateDocumentAccess = async ({ roomId, email, userType, updatedBy }: ShareDocumentParams) => {
    try {
      const usersAccesses: RoomAccesses = {
        [email]: getAccessType(userType) as AccessType,
      }
  
      const room = await liveblocks.updateRoom(roomId, { 
        usersAccesses
      })
  
      if(room) {
        const notificationId = randomUUID();
  
        await liveblocks.triggerInboxNotification({
          userId: email,
          kind: '$documentAccess',
          subjectId: notificationId,
          activityData: {
            userType,
            title: `You have been granted ${userType} access to the document by ${updatedBy.name}`,
            updatedBy: updatedBy.name,
            avatar: updatedBy.avatar,
            email: updatedBy.email
          },
          roomId
        })
      }
  
      revalidatePath(`/documents/${roomId}`);
      return parseStringify(room);
    } catch (error) {
      console.log(`Error happened while updating a room access: ${error}`);
    }
  }
  
  export const removeCollaborator = async ({ roomId, email }: {roomId: string, email: string}) => {
    try {
      const room = await liveblocks.getRoom(roomId)
  
      if(room.metadata.email === email) {
        throw new Error('You cannot remove yourself from the document');
      }
  
      const updatedRoom = await liveblocks.updateRoom(roomId, {
        usersAccesses: {
          [email]: null
        }
      })
  
      revalidatePath(`/documents/${roomId}`);
      return parseStringify(updatedRoom);
    } catch (error) {
      console.log(`Error happened while removing a collaborator: ${error}`);
    }
  }
  
  export const deleteDocument = async (roomId: string) => {
    try {
      await liveblocks.deleteRoom(roomId);
      revalidatePath('/');
      redirect('/');
    } catch (error) {
      console.log(`Error happened while deleting a room: ${error}`);
    }
  }