import Link from "next/link";

export default function CTASection() {
    return (
        <section className="py-16 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-primary rounded-xl p-8 sm:p-12 lg:p-20 text-center relative overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage:
                                "url('https://www.transparenttextures.com/patterns/cubes.png')",
                        }}
                    />
                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 tracking-tight">
                            Ready to Land Your Dream Role?
                        </h2>
                        <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto font-medium">
                            Join thousands of successful professionals and top-tier recruiters
                            using ResumeEZ to build their future.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/login" className="bg-white text-primary text-sm sm:text-base font-black px-6 py-3 rounded-lg shadow-xl hover:scale-105 transition-all text-center">
                                Get Started for Free
                            </Link>
                            <Link href="/login" className="bg-transparent border-2 border-white text-white text-sm sm:text-base font-black px-6 py-3 rounded-lg hover:bg-white/10 transition-all text-center">
                                View All Templates
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
