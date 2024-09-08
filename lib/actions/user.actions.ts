'use server'

import { clerkClient } from "@clerk/nextjs/server"
import { parseStringify } from "../utils"
import { liveblocks } from "../liveblocks"

export const getClerkUser = async ({userIds} : {userIds : string[]}) => {
try {
    const {data} = await clerkClient.users.getUserList({
        emailAddress: userIds
    })

    const users = data.map((user) => ({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.emailAddresses[0].emailAddress,
    avatar: user.imageUrl
    })) 

    const sortedUsers = userIds.map((userId) => users.find((user) => user.email === userId));

    return parseStringify(sortedUsers);
}
catch (error) {
    console.error(error)
}
}

export const getDocumentUsers = async ({roomId, currentUser, text} : {roomId : string, currentUser : string, text: string}) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser);

        if(text.length > 0 ) {
            text = text.toLowerCase();
            const filteredUsers = users.filter((email) => email.toLowerCase().includes(text));
            
            return parseStringify(filteredUsers);
        }
        else {
            return parseStringify(users);
        }
    }
    catch (error) {
        console.error(error)
    }
    
}