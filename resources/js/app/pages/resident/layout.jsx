import SidebarSection from "@/app/_sections/sidebar-section";
import ResidentTopbarSection from "./_sections/resident-topbar-section";
import { 
    Home, 
    FileText, 
    Package, 
    Bell, 
    User,
    Shield,
    Calendar
} from "lucide-react";
import { FcAdvertising, FcDataRecovery, FcRatings, FcTemplate } from "react-icons/fc";


export default function Layout({ children }) {
    const isCurrentMain = window.location.pathname.split("/")[2];
    const isCurrentSub = window.location.pathname.split("/")[3];
    
    const navigation = [
        {
            name: "Dashboard",
            href: "/resident/dashboard",
            icon: <FcTemplate className="h-6 w-6" />,
            current: isCurrentMain == "dashboard",
        },
        {
            name: "Announcements",
            href: "/resident/announcements",
            icon: <FcAdvertising className="h-6 w-6" />,
            current: isCurrentMain == "announcements",
        },
        {
            name: "Certificate Request",
            href: "/resident/certificate-request",
            icon: <FcRatings className="h-6 w-6" />,
            current: isCurrentMain == "certificate-request",
        },
        {
            name: "Inventory Borrow",
            href: "/resident/inventory-borrow",
            icon: <Package className="h-6 w-6  text-yellow-600" />,
            current: isCurrentMain == "inventory-borrow",
        },
        {
            name: "Blotter Notifications",
            href: "/resident/blotter-notifications",
            icon: <FcDataRecovery className="h-6 w-6" />,
            current: isCurrentMain == "blotter-notifications",
        },
        {
            name: "My Profile",
            href: "/resident/profile",
            icon: <User className="h-6 w-6" />,
            current: isCurrentMain == "profile",
        },
    ];

    const userNavigation = [
        { name: "Your profile", href: "/resident/profile" },
        { name: "Sign out", href: "/logout" },
    ];

    return (
        <>
            <SidebarSection navigation={navigation} />
            <div className="lg:pl-72">
                <ResidentTopbarSection userNavigation={userNavigation} />

                <main className="p-3">
                    <div>{children}</div>
                </main>
            </div>
        </>
    );
}
