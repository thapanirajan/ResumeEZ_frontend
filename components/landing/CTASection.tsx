"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function CTASection() {
    const { href } = useAuthRedirect();
    return (
        <section className="py-16 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="relative rounded-2xl overflow-hidden">
                    {/* Background image */}
                    <div
                        className="absolute inset-0 scale-105"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1400&q=80')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "blur(2px)",
                            opacity: 0.9,
                        }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-br from-primary/90 via-primary/80 to-blue-900/90" />

                    {/* Decorative dots */}
                    <div className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />

                    <div className="relative z-10 px-8 py-20 sm:px-16 sm:py-24 text-center">
                        {/* Eyebrow */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6">
                            <Sparkles size={12} />
                            Start for Free Today
                        </div>

                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-5 tracking-tight leading-tight">
                            Ready to Land Your <br className="hidden sm:block" />
                            <span className="text-blue-200">Dream Role?</span>
                        </h2>

                        <p className="text-blue-100 text-base sm:text-lg mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                            Join thousands of successful professionals and top-tier recruiters
                            using ResumeEZ to build their future — no credit card required.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button variant="white" size="lg" asChild>
                                <Link href={href("/candidate", "/recruiter")}>
                                    Get Started for Free
                                    <ArrowRight size={18} />
                                </Link>
                            </Button>
                            <Button variant="outline-white" size="lg" asChild>
                                <Link href={href("/candidate/resume", "/recruiter")}>View All Templates</Link>
                            </Button>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-10 flex items-center justify-center gap-6 flex-wrap">
                            {["No credit card", "Free forever plan", "Cancel anytime"].map((item) => (
                                <div key={item} className="flex items-center gap-1.5 text-blue-200 text-xs font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
