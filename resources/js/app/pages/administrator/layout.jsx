import SidebarSection from "@/app/_sections/sidebar-section";
import TopbarSection from "@/app/_sections/topbar-section";

import "react-toastify/dist/ReactToastify.css"; // <- global CSS for react-toastify
import { MdOutlineFamilyRestroom } from "react-icons/md";
import {
    FcAdvertising,
    FcCalendar,
    FcConferenceCall,
    FcCustomerSupport,
    FcDataRecovery,
    FcDepartment,
    FcList,
    FcNook,
    FcOpenedFolder,
    FcPortraitMode,
    FcPrint,
    FcRatings,
    FcReadingEbook,
    FcTemplate,
} from "react-icons/fc";

import {
    CheckCircle,
    FileText,
    HomeIcon,
    List,
    Package,
    Trophy,
    UserPlus2Icon,
    UsersIcon,
} from "lucide-react";
import { GiBulb, GiFamilyTree, GiLightBulb } from "react-icons/gi";
import { PiCertificateDuotone } from "react-icons/pi";
import { FaUserPlus, FaUsers, FaUsersCog } from "react-icons/fa";
import ToastProvider from "@/app/_components/toast";
import { DocumentCheckIcon } from "@heroicons/react/24/outline";
import { usePage } from '@inertiajs/react';

export default function Layout({ children }) {
    const isCurrentMain = window.location.pathname.split("/")[2];
    const isCurrentSub = window.location.pathname.split("/")[3];
    
    // 🔐 Get user permissions from Inertia props
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];
    
    // Helper function to check permissions
    const hasPermission = (permission) => permissions.includes(permission);
    const hasAnyPermission = (perms) => perms.some(p => permissions.includes(p));
    
    const navigation = [
        {
            name: "Dashboard",
            href: "/administrator/dashboard",
            icon: <FcTemplate className="h-6 w-6" />,
            current: isCurrentMain == "dashboard",
            // Dashboard is always visible
        },

        {
            name: "Barangay Residents",
            href: "#",
            icon: <FcConferenceCall className="h-6 w-6" />,
            current: isCurrentMain == "barangay_residents",
            show: hasPermission("residents.view"), // 🔐 Permission check
            children: [
                {
                    name: "Add New Resident",
                    href: "/administrator/barangay_residents/new_official",
                    icon: <FaUserPlus className="h-6 w-6 text-blue-500" />,
                    current: isCurrentSub == "new_official",
                    show: hasPermission("residents.create"),
                },
                {
                    name: "List of Officials",
                    href: "/administrator/barangay_residents/list_of_official",
                    icon: <FaUsersCog className="h-6 w-6 text-blue-500" />,
                    current: isCurrentSub == "list_of_official",
                    show: hasPermission("residents.view"),
                },
                {
                    name: "List of Residents",
                    href: "/administrator/barangay_residents/list_of_resident",
                    icon: <FaUsers className="h-6 w-6 text-blue-500" />,
                    current: isCurrentSub == "list_of_resident",
                    show: hasPermission("residents.view"),
                },
                {
                    name: "Officials End Term",
                    href: "/administrator/barangay_residents/official_end_term",
                    icon: <FcDataRecovery className="h-6 w-6" />,
                    current: isCurrentSub == "official_end_term",
                    show: hasPermission("residents.update"),
                },
                {
                    name: "Archive of Residents",
                    href: "/administrator/barangay_residents/archive_resident",
                    icon: <FcList className="h-6 w-6" />,
                    current: isCurrentSub == "archive_resident",
                    show: hasPermission("residents.delete"),
                },
                {
                    name: "Account Approval",
                    href: "/administrator/barangay_residents/account_approval",
                    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
                    current: isCurrentSub == "account_approval",
                    show: hasPermission("residents.approve"),
                },
            ].filter(item => item.show !== false), // Filter out items without permission
        },
        // {
        //     name: "User Approval",
        //     href: "/administrator/account_approval",
        //     icon: <CheckCircle className="h-6 w-6" />,
        //     current: isCurrentMain == "account_approval",
        // },

        // {
        //     name: "Resident",
        //     href: "#",
        //     icon: <FaHouseUser className="h-6 w-6  text-blue-300" />,

        //     current: isCurrentMain == "resident",
        //     children: [
        //         {
        //             name: "List of Residents",
        //             href: "/administrator/resident/list_of_resident",
        //             icon: <FcList className="h-6 w-6 " />,

        //             current: isCurrentSub == "list_of_resident",
        //         },
        //         {
        //             name: "Archive of Residents",
        //             href: "/administrator/resident/archive_resident",
        //             icon: <FcDataConfiguration className="h-6 w-6" />,
        //             current: isCurrentSub == "archive_resident",
        //         },
        //     ],
        // },

        {
            name: "Certificate",
            href: "#",
            icon: <FcRatings className="h-6 w-6" />,
            current: isCurrentMain == "certificate",
            show: hasPermission("certificates.view"), // 🔐 Permission check
            children: [
                {
                    name: "Certificate Type",
                    href: "/administrator/certificate/certificate_layout",
                    icon: <PiCertificateDuotone className="h-6 w-6" />,
                    current: isCurrentSub == "certificate_layout",
                    show: hasPermission("certificates.configure_fees"),
                },
                {
                    name: "Certificate Request",
                    href: "/administrator/certificate/certificate_pending",
                    icon: <FcPrint className="h-6 w-6" />,
                    current: isCurrentSub == "certificate_pending",
                    show: hasPermission("certificates.view"),
                },
                {
                    name: "Certificate ",
                    href: "/administrator/certificate/certificate",
                    icon: <DocumentCheckIcon className="h-6 w-6" />,
                    current: isCurrentSub == "certificate",
                    show: hasPermission("certificates.view"),
                },
            ].filter(item => item.show !== false),
        },
        {
            name: "Announcement",
            href: "#",
            icon: <FcAdvertising className="h-6 w-6  text-yellow-600" />,
            current: isCurrentMain == "announcement",
            show: hasPermission("announcements.create"), // 🔐 Permission check
            children: [
                {
                    name: "Add Announcement",
                    href: "/administrator/announcement/add_announcement",
                    icon: <FcAdvertising className="h-6 w-6  text-blue-600" />,
                    current: isCurrentSub == "add_announcement",
                    show: hasPermission("announcements.create"),
                },
                {
                    name: "Announcement List",
                    href: "/administrator/announcement/announcement_list",
                    icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
                    current: isCurrentSub == "announcement_list",
                    show: hasPermission("announcements.create"),
                },
                {
                    name: "Calendar",
                    href: "/administrator/announcement/calendar",
                    icon: <FcCalendar className="h-6 w-6 text-blue-600" />,
                    current: isCurrentSub == "calendar",
                    show: hasPermission("announcements.create"),
                },
            ].filter(item => item.show !== false),
        },

        {
            name: "User",
            href: "#",
            icon: <FcPortraitMode className="h-6 w-6 " />,
            current: isCurrentMain == "user",
            show: hasPermission("users.manage"), // 🔐 Permission check
            children: [
                {
                    name: "Resident",
                    href: "/administrator/user/resident_user",
                    icon: <FcReadingEbook className="h-6 w-6" />,
                    current: isCurrentSub == "resident_user",
                    show: hasPermission("users.manage"),
                },
                {
                    name: "Administrator",
                    href: "/administrator/user/administrator_user",
                    icon: <FcCustomerSupport className="h-6 w-6" />,
                    current: isCurrentSub == "administrator_user",
                    show: hasPermission("users.manage"),
                },
            ].filter(item => item.show !== false),
        },
        {
            name: "Family Profile",
            href: "#",
            icon: <GiFamilyTree className="h-6 w-6  text-yellow-600" />,
            current: isCurrentMain == "family_profile",
            show: hasPermission("residents.view"), // 🔐 Permission check
            children: [
                {
                    name: "Create New Family",
                    href: "/administrator/family_profile/create_new_family",
                    icon: <UserPlus2Icon className="h-6 w-6  text-blue-600" />,
                    current: isCurrentSub == "create_new_family",
                    show: hasPermission("residents.create"),
                },
                {
                    name: "Add Family Members",
                    href: "/administrator/family_profile/add_family_members",
                    icon: <UsersIcon className="h-6 w-6 text-blue-600" />,
                    current: isCurrentSub == "add_family_members",
                    show: hasPermission("residents.create"),
                },
                {
                    name: "Household Details",
                    href: "/administrator/family_profile/household_details",
                    icon: <HomeIcon className="h-6 w-6  text-blue-600" />,
                    current: isCurrentSub == "household_details",
                    show: hasPermission("residents.view"),
                },
                {
                    name: "List of Family",
                    href: "/administrator/family_profile/list_of_family",
                    icon: (
                        <MdOutlineFamilyRestroom className="h-6 w-6  text-blue-600" />
                    ),
                    current: isCurrentSub == "list_of_family",
                    show: hasPermission("residents.view"),
                },
            ].filter(item => item.show !== false),
        },
        {
            name: "Inventory",
            href: "#",
            icon: <Package className="h-6 w-6  text-yellow-600" />,
            current: isCurrentMain == "inventory",
            show: hasPermission("inventory.view"), // 🔐 Permission check
            children: [
                {
                    name: "List of Inventory",
                    href: "/administrator/inventory/list_of_inventory",
                    icon: <List className="h-6 w-6  text-blue-600" />,
                    current: isCurrentSub == "list_of_inventory",
                    show: hasPermission("inventory.view"),
                },
                {
                    name: "Approved Inventory Request",
                    href: "/administrator/inventory/approved_inventory_request",
                    icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
                    current: isCurrentSub == "approved_inventory_request",
                    show: hasPermission("borrow.approve"),
                },
                {
                    name: "View Inventory Report",
                    href: "/administrator/inventory/view_inventory_report",
                    icon: <FileText className="h-6 w-6 text-blue-600" />,
                    current: isCurrentSub == "view_inventory_report",
                    show: hasAnyPermission(["reports.view", "inventory.view"]),
                },
            ].filter(item => item.show !== false),
        },

        {
            name: "Position",
            href: "/administrator/position",
            icon: <FcDepartment className="h-6 w-6" />,
            current: isCurrentMain == "position",
            show: hasPermission("residents.view"), // 🔐 Permission check
        },
        {
            name: "Barangay Highlights",
            href: "/administrator/highlights",
            icon: <Trophy className="h-6 w-6 text-yellow-300" />,
            current: isCurrentMain == "highlights",
            show: hasPermission("highlights.manage"), // 🔐 Permission check
        },
        {
            name: "Blotter Record",
            href: "/administrator/blotter_record",
            icon: <FcDataRecovery className="h-6 w-6" />,
            current: isCurrentMain == "blotter_record",
            show: hasPermission("blotter.view"), // 🔐 Permission check
        },

        {
            name: "Reports",
            href: "/administrator/reports",
            icon: <FcOpenedFolder className="h-6 w-6" />,
            current: isCurrentMain == "reports",
            show: hasPermission("reports.view"), // 🔐 Permission check
        },

        {
            name: "System Logs",
            href: "/administrator/system_logs",
            icon: <FcRatings className="h-6 w-6" />,
            current: isCurrentMain == "system_logs",
            show: hasPermission("logs.view"), // 🔐 Permission check
        },
        {
            name: "Backup/Reports",
            href: "/administrator/backup",
            icon: <FcNook className="h-6 w-6" />,
            current: isCurrentMain == "backup" || isCurrentMain == "backup_reports",
            show: hasPermission("backups.manage"), // 🔐 Permission check
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
    ].filter(item => item.show !== false); // 🔐 Filter out items without permission

    const userNavigation = [
        { name: "Your profile", href: "#" },
        { name: "Sign out", href: "#" },
    ];
    
    return (
        <>
            <SidebarSection navigation={navigation} permissions={permissions} roles={auth?.roles || []} />
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
