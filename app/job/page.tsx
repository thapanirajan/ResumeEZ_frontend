
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import JobFeed from "@/components/landing/JobFeed";
import RightSidebar from "@/components/landing/RightSidebar";
import SidebarFilters from "@/components/landing/SidebarFilters";

export default function Home() {
    return (
        <div className="bg-background-light text-slate-900 font-display min-h-screen">
            <Header />
            <main className="max-w-[1440px] mx-auto px-6 py-8 flex gap-8">
                <SidebarFilters />
                <JobFeed />
                <RightSidebar />
            </main>
            <Footer />
        </div>
    );
}