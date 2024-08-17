import { useOthers } from "@liveblocks/react/suspense";
import Image from "next/image";


const ActiveCollaborators = () => {
    const others = useOthers();

    const activeCollaborators = others.map((other) => other.info) as { id: string; avatar: string; name: string; color: string; }[];
    return (
        <ul className="collaborators-list">
            {
                activeCollaborators.map(({ id, avatar, name, color }) => (
                    <li key={id} className="collaborator">
                        <Image src={avatar} alt={name} width={100} height={100} className=" inline-block size-8 rounded-full ring-2 ring-dark-100" style={{ border: `3px solid ${color}` }} />
                        {/* <p className="name">{name}</p> */}
                    </li>
                ))
            }
        </ul>
    );
};

export default ActiveCollaborators;