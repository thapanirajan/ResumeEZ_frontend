export default function Stepper({
    steps,
    active,
    setStep,
}: {
    steps: string[];
    active: number;
    setStep: (n: number) => void;
}) {
    return (
        <div className="flex gap-2 border-b p-4">
            {steps.map((step, i) => (
                <button
                    key={step}
                    onClick={() => setStep(i)}
                    className={`rounded-lg  cursor-pointer px-3 py-1 text-sm font-medium ${active === i
                            ? "bg-[#1e3a8a] text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                >
                    {step}
                </button>
            ))}
        </div>
    );
}
