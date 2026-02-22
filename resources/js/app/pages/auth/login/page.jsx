import HeaderSection from "./sections/header-section";
import HomeSection from "./sections/home-section";

export default function Page({ announcements, highlights }) {
    return (
        <>
            <HeaderSection />
            <HomeSection announcements={announcements} highlights={highlights} />
        </>
    );
}
