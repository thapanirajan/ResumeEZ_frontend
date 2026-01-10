import Image from "next/image";
import PrimaryButton from "../ui/PrimaryButton";

export default function CtaBanner() {
    return (
        <section className="relative py-24 md:py-32 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
                    alt="Resume background"
                    fill
                    className="object-cover blur-[1.5px]"
                    priority
                />
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/50"></div>
            </div>


            {/* Content */}
            <div className="container mx-auto px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center space-y-6">
                    <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-white">
                        Improve resumes and hiring decisions today
                    </h2>

                    <p className="text-white/90 text-lg max-w-xl mx-auto">
                        Use AI-powered insights to enhance resumes and make smarter hiring choices in minutes.
                    </p>
                    <div className="flex justify-center">
                        <PrimaryButton href="/login" className="px-8 py-3 h-fit w-fit">Get Started for Free</PrimaryButton>
                    </div>
                </div>
            </div>
        </section>
    );
}
