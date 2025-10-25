import SidebarSection from "@/app/_sections/sidebar-section";
import TopbarSection from "@/app/_sections/topbar-section";

import "react-toastify/dist/ReactToastify.css"; // <- global CSS for react-toastify
import { MdOutlineFamilyRestroom } from "react-icons/md";
import {
    FcAdvertising,
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
            name: "Barangay Residents",
            href: "#",
            icon: <FcConferenceCall className="h-6 w-6" />,
            current: isCurrentMain == "barangay_residents",
            children: [
                {
                    name: "New Resident",

                    href: "/administrator/barangay_residents/new_official",
                    icon: <FcBusinessman className="h-6 w-6" />,
                    current: isCurrentSub == "new_official",
                },

                {
                    name: "List of Officials",
                    href: "/administrator/barangay_residents/list_of_official",
                    icon: <FcViewDetails className="h-6 w-6" />,
                    current: isCurrentSub == "list_of_official",
                },
                {
                    name: "Officials End Term",
                    href: "/administrator/barangay_residents/official_end_term",
                    icon: <FcDataRecovery className="h-6 w-6" />,
                    current: isCurrentSub == "official_end_term",
                },
            ],
        },
        {
            name: "Resident",
            href: "#",
            icon: <FaHouseUser className="h-6 w-6  text-blue-300" />,

            current: isCurrentMain == "resident",
            children: [
                {
                    name: "List of Residents",
                    href: "/administrator/resident/list_of_resident",
                    icon: <FcList className="h-6 w-6 " />,

                    current: isCurrentSub == "list_of_resident",
                },
                {
                    name: "Archive of Residents",
                    href: "/administrator/resident/archive_resident",
                    icon: <FcDataConfiguration className="h-6 w-6" />,
                    current: isCurrentSub == "archive_resident",
                },
            ],
        },

        {
            name: "Certificate",
            href: "#",
            icon: <FcRatings className="h-6 w-6" />,
            current: isCurrentMain == "certificate",
            children: [
                {
                    name: "Certificate Type",
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
                  {
                    name: "Certificate ",
                    href: "/administrator/certificate/certificate",
                    icon: <FcPrint className="h-6 w-6" />,
                    current: isCurrentSub == "certificate",
                },
            ],
        },
        {
            name: "Announcement",
            href: "#",
            icon: <FcAdvertising className="h-6 w-6  text-yellow-600" />,
            current: isCurrentMain == "announcement",
            children: [
                {
                    name: "Add Announcement",
                    href: "/administrator/announcement/add_announcement",
                    icon: <FcAdvertising className="h-6 w-6  text-blue-600" />,
                    current: isCurrentSub == "add_announcement",
                },
                {
                    name: "Announcement List",
                    href: "/administrator/announcement/announcement_list",
                    icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
                    current: isCurrentSub == "announcement_list",
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
        {
            name: "Family Profile",
            href: "#",
            icon: <GiFamilyTree className="h-6 w-6  text-yellow-600" />,
            current: isCurrentMain == "family_profile",
            children: [
                {
                    name: "Create New Family",
                    href: "/administrator/family_profile/create_new_family",
                    icon: <UserPlus2Icon className="h-6 w-6  text-blue-600" />,
                    current: isCurrentSub == "create_new_family",
                },
                {
                    name: "Add Family Members",
                    href: "/administrator/family_profile/add_family_members",
                    icon: <UsersIcon className="h-6 w-6 text-blue-600" />,
                    current: isCurrentSub == "add_family_members",
                },
                {
                    name: "Household Details",
                    href: "/administrator/family_profile/household_details",
                    icon: <HomeIcon className="h-6 w-6  text-blue-600" />,
                    current: isCurrentSub == "household_details",
                },
                {
                    name: "List of Family",
                    href: "/administrator/family_profile/list_of_family",
                    icon: (
                        <MdOutlineFamilyRestroom className="h-6 w-6  text-blue-600" />
                    ),
                    current: isCurrentSub == "list_of_family",
                },
            ],
        },
        {
            name: "Inventory",
            href: "#",
            icon: <Package className="h-6 w-6  text-yellow-600" />,
            current: isCurrentMain == "inventory",
            children: [
                {
                    name: "List of Inventory",
                    href: "/administrator/inventory/list_of_inventory",
                    icon: <List className="h-6 w-6  text-blue-600" />,
                    current: isCurrentSub == "list_of_inventory",
                },
                {
                    name: "Approved Inventory Request",
                    href: "/administrator/inventory/approved_inventory_request",
                    icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
                    current: isCurrentSub == "approved_inventory_request",
                },
                {
                    name: "View Inventory Report",
                    href: "/administrator/inventory/view_inventory_report",
                    icon: <FileText className="h-6 w-6 text-blue-600" />,
                    current: isCurrentSub == "view_inventory_report",
                },
            ],
        },

        {
            name: "Position",
            href: "/administrator/position",
            icon: <FcDepartment className="h-6 w-6" />,
            current: isCurrentMain == "position",
        },
        {
            name: "Blotter Record",
            href: "/administrator/blotter_record",
            icon: <FcDataRecovery className="h-6 w-6" />,
            current: isCurrentMain == "blotter_record",
        },

        {
            name: "Reports",
            href: "/administrator/reports",
            icon: <FcOpenedFolder className="h-6 w-6" />,
            current: isCurrentMain == "reports",
        },

        {
            name: "System Logs",
            href: "/administrator/system_logs",
            icon: <FcRatings className="h-6 w-6" />,
            current: isCurrentMain == "system_logs",
        },
        {
            name: "Backup/Reports",
            href: "/administrator/backup_reports",
            icon: <FcNook className="h-6 w-6" />,
            current: isCurrentMain == "backup_reports",
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
