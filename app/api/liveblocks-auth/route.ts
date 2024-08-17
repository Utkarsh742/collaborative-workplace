import { liveblocks } from "@/lib/liveblocks";
import { getRandomColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { colors } from "@clerk/themes/dist/clerk-js/src/ui/foundations/colors";
import { info } from "console";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
    // Get the current user from your database
    const clerkUser = await currentUser();
    if (!clerkUser) redirect('/sign-in');

    const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;
    const user = {
        id,
        info: {
        id,
        name: `${firstName} ${lastName}`,
        email: emailAddresses[0].emailAddress,
        avatar: imageUrl,
        colors: getRandomColor(),
    }};

    // Identify the user and return the result
    const { status, body } = await liveblocks.identifyUser(
        {
            userId: user.info.email,
            groupIds: [], // Optional
        },
        { userInfo: user.info },
    );

    return new Response(body, { status });
}