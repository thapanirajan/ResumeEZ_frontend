import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import WhyUs from "@/components/landing/WhyUs";

export default function Home() {
    return (
        <div>
            <Header />
            <Hero />
            <WhyUs />
            <Features />
            <HowItWorks />
            <Pricing />
            <Testimonials />
            <Footer />
        </div>
    );
}
