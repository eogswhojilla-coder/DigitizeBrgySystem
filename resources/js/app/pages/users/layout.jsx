import SidebarSection from "@/app/_sections/sidebar-section";
import TopbarSection from "@/app/_sections/topbar-section";

import "react-toastify/dist/ReactToastify.css"; // <- global CSS for react-toastify
import { MdOutlineFamilyRestroom } from "react-icons/md";
import {
    FcAssistant,
    FcBusinessman,
    FcConferenceCall,
    FcCustomerSupport,
    FcDataConfiguration,
    FcDataRecovery,
    FcDepartment,
    FcFilingCabinet,
    FcHome,
    FcLibrary,
    FcList,
    FcNews,
    FcNook,
    FcOpenedFolder,
    FcOrganization,
    FcPortraitMode,
    FcPrint,
    FcPrivacy,
    FcRatings,
    FcReadingEbook,
    FcTemplate,
    FcTimeline,
    FcViewDetails,
} from "react-icons/fc";
import FloatingButtonSection from "./_sections/floating-button-section";
import { LiaLandmarkSolid } from "react-icons/lia";
import {
    Boxes,
    BoxIcon,
    CheckCircle,
    FileText,
    HomeIcon,
    List,
    Package,
    UserPlus2Icon,
    UserPlusIcon,
    UsersIcon,
    Warehouse,
} from "lucide-react";
import { GiFamilyHouse, GiFamilyTree } from "react-icons/gi";
import { PiCertificateDuotone } from "react-icons/pi";
import { FaHouseUser } from "react-icons/fa";
import ToastProvider from "@/app/_components/toast";

export default function Layout({ children }) {
    const isCurrentMain = window.location.pathname.split("/")[2];
    const isCurrentSub = window.location.pathname.split("/")[3];
    const navigation = [
        {
            name: "Dashboard",
            href: "/administrator/dashboard",
            icon: <FcTemplate className="h-6 w-6" />,
            current: isCurrentMain == "dashboard",
        },

        

        {
            name: "Certificate",
            href: "#",
            icon: <FcRatings className="h-6 w-6" />,
            current: isCurrentMain == "certificate",
            children: [
                {
                    name: "Certificate layout",
                    href: "/administrator/certificate/certificate_layout",
                    icon: <PiCertificateDuotone className="h-6 w-6" />,
                    current: isCurrentSub == "certificate_layout",
                },
                {
                    name: "Certificate Request",
                    href: "/administrator/certificate/certificate_pending",
                    icon: <FcPrint className="h-6 w-6" />,
                    current: isCurrentSub == "certificate_pending",
                },
            ],
        },

        {
            name: "User",
            href: "#",
            icon: <FcPortraitMode className="h-6 w-6 " />,
            current: isCurrentMain == "user",
            children: [
                {
                    name: "Resident",
                    href: "/administrator/user/resident_user",
                    icon: <FcReadingEbook className="h-6 w-6" />,
                    current: isCurrentSub == "resident_user",
                },
                {
                    name: "Administrator",
                    href: "/administrator/user/administrator_user",
                    icon: <FcCustomerSupport className="h-6 w-6" />,
                    current: isCurrentSub == "administrator_user",
                },
            ],
        },
        


        // {
        //     name: "Ticketing",
        //     href: "#",
        //     icon: <FcOrganization className="h-6 w-6" />,
        //     current: isCurrentMain == "ticketing",
        //     children: [
        //          {
        //             name: "Categories",
        //             href: "/administrator/ticketing/categories?department=IT Department",
        //             icon: <FcTimeline className="h-6 w-6" />,
        //             current: isCurrentSub == "categories",
        //         },
        //         {
        //             name: "Carcar",

        //             href: "/administrator/ticketing/carcar/tickets",
        //             icon: <FcHome className="h-6 w-6" />,
        //             current: isCurrentSub == "carcar",
        //         },
        //         {
        //             name: "San Carlos",
        //             href: "/administrator/ticketing/san_carlos/tickets",
        //             icon: <FcHome className="h-6 w-6" />,
        //             current: isCurrentSub == "san_carlos",
        //         },
        //     ],
        // },
        //  {
        //     name: "Inventory",
        //     href: "#",
        //     icon: <FcOrganization className="h-6 w-6" />,
        //     current: isCurrentMain == "ticketing",
        //     children: [
        //         {
        //             name: "Carcar",

        //             href: "/administrator/ticketing/carcar/tickets",
        //             icon: <FcHome className="h-6 w-6" />,
        //             current: isCurrentSub == "carcar",
        //         },
        //         {
        //             name: "San Carlos",
        //             href: "/administrator/ticketing/san_carlos/tickets",
        //             icon: <FcHome className="h-6 w-6" />,
        //             current: isCurrentSub == "san_carlos",
        //         },
        //     ],
        // },
    ];

    const userNavigation = [
        { name: "Your profile", href: "#" },
        { name: "Sign out", href: "#" },
    ];
    return (
        <>
            <SidebarSection navigation={navigation} />
            <div className="lg:pl-72">
                <TopbarSection userNavigation={userNavigation} />

                <main className="p-3">
                    <div>{children}</div>
                    {/* <FloatingButtonSection /> */}
                </main>
            </div>
            {/* mount the Toast provider once, globally */}
            <ToastProvider />
        </>
    );
}
