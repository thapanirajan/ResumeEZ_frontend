"use client";

import { useEffect, useState } from "react";

import Stepper from "./Stepper";
import PersonalForm from "./forms/PersonalForm";
import LinksForm from "./forms/LinksForm";
import SummaryForm from "./forms/SummaryForm";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";

import { exportToPdf } from "./pdf/exportToPdf";
import { ResumeData } from "@/app/(candidate)/candidate/resume/type";

import AtsClassic from "./templates/AtsClassic";
import AtsCompact from "./templates/AtsCompact";
import AtsModern from "./templates/AtsModern";

export type ResumeTemplate = "classic" | "compact" | "modern";

const TEMPLATE_LABELS: Record<ResumeTemplate, string> = {
    classic: "Classic",
    compact: "Compact",
    modern: "Modern",
};


const STORAGE_KEY = "resume-builder-data";

const steps = [
    "Personal",
    "Links",
    "Summary",
    "Experience",
    "Education",
];


export default function ResumeBuilder() {
    const [step, setStep] = useState(0);
    const [isHydrated, setIsHydrated] = useState(false);

    const [template, setTemplate] =
        useState<ResumeTemplate>("classic");

    const [resume, setResume] = useState<ResumeData>({
        name: "",
        title: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        summary: "",
        experience: [],
        education: [],
    });

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.resume) setResume(parsed.resume);
                if (parsed.template) setTemplate(parsed.template);
            } catch (err) {
                console.error("Failed to restore resume", err);
            }
        }
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!isHydrated) return;
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ resume, template })
        );
    }, [resume, template, isHydrated]);

    if (!isHydrated) {
        return (
            <div className="flex h-screen items-center justify-center text-sm text-slate-500">
                Restoring your resume…
            </div>
        );
    }

    const isFirstStep = step === 0;
    const isLastStep = step === steps.length - 1;

    return (
        <div className="grid h-screen grid-cols-12 bg-slate-100">
            <aside className="col-span-5 flex flex-col border-r bg-white">
                {/* Stepper */}
                <div className="border-b px-6 py-4">
                    <Stepper steps={steps} active={step} setStep={setStep} />
                    <p className="mt-2 text-xs text-slate-500">
                        Step {step + 1} of {steps.length}
                    </p>
                </div>

                {/* Form Area */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {step === 0 && (
                        <PersonalForm resume={resume} setResume={setResume} />
                    )}
                    {step === 1 && (
                        <LinksForm resume={resume} setResume={setResume} />
                    )}
                    {step === 2 && (
                        <SummaryForm resume={resume} setResume={setResume} />
                    )}
                    {step === 3 && (
                        <ExperienceForm resume={resume} setResume={setResume} />
                    )}
                    {step === 4 && (
                        <EducationForm resume={resume} setResume={setResume} />
                    )}
                </div>

                {/* Navigation */}
                <div className="border-t px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            disabled={isFirstStep}
                            onClick={() => setStep((s) => s - 1)}
                            className="rounded-lg px-4 py-2 text-sm text-slate-700 disabled:opacity-40 hover:bg-slate-100"
                        >
                            Back
                        </button>

                        <button
                            onClick={() =>
                                isLastStep ? exportToPdf() : setStep((s) => s + 1)
                            }
                            className="rounded-lg bg-[#1e3a8a] px-6 py-2 text-sm font-medium text-white"
                        >
                            {isLastStep ? "Export PDF" : "Next"}
                        </button>
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                        Changes are saved automatically
                    </p>
                </div>
            </aside>

            <section className="col-span-7 flex flex-col bg-slate-200">
                {/* Preview Header */}
                <div className="flex items-center justify-between border-b bg-white px-6 py-3">
                    <h3 className="text-sm font-medium text-slate-700">
                        Resume Preview (ATS-Safe)
                    </h3>

                    {/* Template Selector */}
                    <div className="flex gap-2">
                        {(Object.keys(TEMPLATE_LABELS) as ResumeTemplate[]).map(
                            (t) => (
                                <button
                                    key={t}
                                    onClick={() => setTemplate(t)}
                                    className={`rounded-md px-3 py-1.5 text-sm ${template === t
                                            ? "bg-[#1e3a8a] text-white"
                                            : "border bg-white text-slate-700"
                                        }`}
                                >
                                    {TEMPLATE_LABELS[t]}
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-auto p-8">
                    <div
                        id="resume-preview"
                        className="mx-auto max-w-[800px] bg-white p-10 shadow"
                    >
                        <ResumePreview
                            resume={resume}
                            template={template}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}


function ResumePreview({
    resume,
    template,
}: {
    resume: ResumeData;
    template: ResumeTemplate;
}) {
    if (template === "compact") return <AtsCompact resume={resume} />;
    if (template === "modern") return <AtsModern resume={resume} />;
    return <AtsClassic resume={resume} />;
}
