
"use client"

import { useEffect, useRef } from "react";
import Image from "next/image";
import { PlaceHolderImages } from "../lib/placeholder-images";
import { CheckCircle2, PlayCircle } from "lucide-react";
import PrimaryButton from "../ui/PrimaryButton";



export default function Hero() {
    const heroImage = PlaceHolderImages.find((img) => img.id === "hero-image");


    const clickSoundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        clickSoundRef.current = new Audio("/sounds/click.mp3");
        clickSoundRef.current.preload = "auto";
    }, []);



    return (
        <section
            id="hero"
            className="relative overflow-hidden bg-[#f2f7fc] pt-32 pb-20 md:pt-40 md:pb-28"
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid items-center gap-12 md:grid-cols-2">

                    {/* left side container  */}
                    <div className="flex flex-col items-start text-left">
                        <h1 className="font-headline text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl">
                            AI-Powered Resume Improvement and Smart Candidate Screening
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                            Build a stronger resume instantly and help HR teams shortlist the
                            right candidates faster.
                        </p>
                        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
                            <PrimaryButton href="/">Try free</PrimaryButton>
                            <button className="border border-[#172E6B] rounded flex px-8 py-2 items-center hover:bg-[#172E6B] hover:text-white cursor-pointer transition-colors duration-300 ease-in-out">
                                <PlayCircle className="mr-2 h-5 w-5 " />
                                <p>Watch demo</p>
                            </button>
                        </div>
                        <div className="mt-8 space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-[#172E6B]" />
                                <span>Trusted by job seekers and HR teams</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-[#172E6B]" />
                                <span>Improves hiring workflows instantly</span>
                            </div>
                        </div>
                    </div>

                    {/* Right side video demo  */}
                    <div className="relative group">
                        {heroImage && (
                            <Image
                                src={heroImage.imageUrl}
                                alt={heroImage.description}
                                width={1200}
                                height={900}
                                className="rounded-xl border border-slate-500 shadow-2xl shadow-blue-200 transition-transform duration-500 group-hover:scale-105"
                            />
                        )}

                        {/* Floater 1 */}
                        <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                            <p className="text-sm font-semibold text-[#1E3A8A]">Featured AI Tool</p>
                            <p className="text-xs text-muted-foreground">Enhance resumes in seconds</p>
                        </div>

                        {/* Floater 2 */}
                        <div className="absolute bottom-8 left-8 bg-[#1E3A8A] text-white rounded-full px-3 py-1 text-xs font-medium opacity-0 translate-y-4 transition-all duration-300 delay-100 group-hover:opacity-100 group-hover:translate-y-0">
                            Live Demo
                        </div>

                        {/* Floater 3 - icon badge */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg opacity-0 scale-90 transition-all duration-300 delay-200 group-hover:opacity-100 group-hover:scale-100 cursor-pointer"
                            onClick={() => {
                                const clickSound = new Audio("/sounds/click.wav"); 
                                clickSound.play();
                            }}>
                            <PlayCircle className="h-6 w-6 text-[#1E3A8A]" />
                        </div>

                        {/* small blur circles for depth */}
                        <div className="absolute top-10 left-20 w-12 h-12 bg-blue-200/30 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="absolute bottom-16 right-24 w-20 h-20 bg-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
