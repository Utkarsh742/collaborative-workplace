"use client";
import Loader from "@/components/Loader";
import { getClerkUser } from "@/lib/actions/user.actions";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
  } from "@liveblocks/react/suspense";
import { ReactNode, use } from "react";

interface ProviderProps {
    // Add your props here
}

const Provider = ({children} : {children: ReactNode}) => {
    return (
        <LiveblocksProvider
         authEndpoint={"/api/liveblocks-auth"}
         resolveUsers={async (userIds) => {
            const users = await getClerkUser(userIds);
            return users;
         }}
         >
          <ClientSideSuspense fallback={<Loader />}>
            {children}
          </ClientSideSuspense>
      </LiveblocksProvider>
    );
};

export default Provider;