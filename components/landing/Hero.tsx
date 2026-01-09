import Image from "next/image";
import { PlaceHolderImages } from "../lib/placeholder-images"
import { CheckCircle2, PlayCircle } from 'lucide-react';
import PrimaryButton from '../ui/PrimaryButton';

export default function Hero() {
    const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');

    return (
        <>
            <section
                id="hero"
                className="relative overflow-hidden bg-[#f2f7fc] pt-32 pb-20 md:pt-40 md:pb-28"
            >
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="grid items-center gap-12 md:grid-cols-2">
                        <div className="flex flex-col items-start text-left">
                            <h1 className="font-headline text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl">
                                AI-Powered Resume Improvement and Smart Candidate Screening
                            </h1>
                            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                                Build a stronger resume instantly and help HR teams shortlist the right candidates faster.
                            </p>
                            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
                                <PrimaryButton href="/">Try free</PrimaryButton>
                                <button className="border border-[#172E6B] rounded flex px-8 py-2 items-center  
                                hover:bg-[#172E6B] hover:text-white cursor-pointer transition-colors duration-300 ease-in-out">
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
                        <div className="relative">
                            {heroImage && (
                                <Image
                                    src={heroImage.imageUrl}
                                    alt={heroImage.description}
                                    width={1200}
                                    height={900}
                                    className="rounded-xl border border-slate-500 shadow-2xl shadow-blue-200"
                                />
                            )}
                        </div>
                    </div>
                </div>

            </section>
        </>
    )
}