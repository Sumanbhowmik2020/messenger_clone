"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";
import { useState } from "react";
import { User } from "@prisma/client";
import Avatar from "../Avatar";
import SettingsModal from "./SettingsModal";

interface MobileFooterProps {
    currentUser: User;
}

const MobileFooter: React.FC<MobileFooterProps> = ({
    currentUser
}) => {
    const routes = useRoutes();
    const { isOpen } = useConversation();
    const [Open, setOpen] = useState(false);

    if (isOpen) {
        return null;
    }
    return (
        <>
            <SettingsModal
                currentUser={currentUser}
                isOpen={Open}
                onClose={()=>setOpen(false)}
            />
            <div
                className="
                fixed
                justify-between
                w-full
                bottom-0
                z-40
                flex
                items-center
                bg-white
                broder-t-[1px]
                lg:hidden

            "
            >
                <div
                    onClick={() => setOpen(true)}
                    className="
                        ml-6
                        cursor-pointer
                        hover:opacity-75
                        transition
                    "
                >
                    <Avatar user={currentUser} />
                </div>
                {routes.map((route) => (
                    <MobileItem
                        key={route.herf}
                        herf={route.herf}
                        active={route.active}
                        icon={route.icon}
                        onClick={route.onclick}
                    />
                ))}



            </div>
        </>
    )
}

export default MobileFooter;