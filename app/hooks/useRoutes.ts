import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from "react-icons/hi";
import { 
    HiArrowLeftOnRectangle ,
    HiUsers
} from "react-icons/hi2";
import { signOut } from "next-auth/react";
import useConversation from "./useConversation";


const useRoutes = () => {
    const pathname = usePathname();
    const {conversationId} = useConversation(); 

    const routes = useMemo(()=>[
        {
            label:'chat',
            herf:'/conversations',
            icon:HiChat,
            active: pathname==='/conversations' || !!conversationId
        },
        {
            label:'users',
            herf:'/users',
            icon:HiUsers,
            active: pathname==='/users'
        },
        {
            label:'Logout',
            herf:'#',
            onclick: ()=> signOut(),
            icon:HiArrowLeftOnRectangle
        }
    ],[pathname,conversationId]);

    return routes;
};

export default useRoutes;


