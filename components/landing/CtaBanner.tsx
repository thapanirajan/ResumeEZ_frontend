export default function CtaBanner() {
    return (
        <section
            id="cta"
            className="py-24 md:py-32 bg-[#F8FAFC]"
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center space-y-6">
                    <h2 className="font-headline text-4xl font-bold tracking-tight text-[#1E3A8A]">
                        Improve resumes and hiring decisions today
                    </h2>

                    <p className="text-[#475569] text-lg max-w-xl mx-auto">
                        Use AI-powered insights to enhance resumes and make smarter hiring choices in minutes.
                    </p>

                    <button
                        className="mt-6 cursor-pointer rounded-xl bg-[#1E3A8A] px-8 py-3 text-white font-semibold shadow-lg hover:bg-[#172E6B] transition-all duration-200"
                    >
                        Get Started for Free
                    </button>
                </div>
            </div>
        </section>
    );
}
