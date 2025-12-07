export default function CtaBanner() {
    return (
        <section
            id="cta"
            className="py-24 md:py-32 bg-[#f2f7fc]"
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center space-y-6">
                    <h2 className="font-headline text-4xl font-bold tracking-tight text-blue-900">
                        Improve resumes and hiring decisions today
                    </h2>

                    <p className="text-blue-800/80 text-lg max-w-xl mx-auto">
                        Use AI-powered insights to enhance resumes and make smarter hiring choices in minutes.
                    </p>

                    <button
                        className="mt-6 inline-flex items-center cursor-pointer rounded-xl bg-white px-8 py-3 text-blue-700 font-semibold shadow-md hover:bg-gray-100 transition-all duration-200"
                    >
                        Get Started for Free
                    </button>
                </div>
            </div>
        </section>
    );
}