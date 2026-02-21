
import Navbar from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/Hero";
import SolutionsSection from "@/components/landing/SolutionSection";
import JobBoardSection from "@/components/landing/JobBoardSection";
import SkillGapSection from "@/components/landing/Skillgapsection";
import HiringSection from "@/components/landing/HiringSection";
import CTASection from "@/components/landing/CTASection";


export default function Home() {
    return (
        <main className="bg-white text-slate-900 font-display">
            <Navbar />
            <HeroSection />
            <SolutionsSection />
            <JobBoardSection />
            <SkillGapSection />
            <HiringSection />
            <CTASection />
            <Footer />
        </main>
    );
}