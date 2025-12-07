import { Clock, Sparkles, Target } from 'lucide-react';

const valueProps = [
    {
        icon: <Clock className="h-8 w-8 text-blue-600" />,
        title: 'Save Hours of Manual Review',
        description: 'HR teams can analyze 300 resumes in minutes with AI scoring and ranking.',
    },
    {
        icon: <Sparkles className="h-8 w-8 text-blue-600" />,
        title: 'Instant Resume Improvements',
        description: 'Candidates get detailed improvements, formatting fixes, and keyword suggestions.',
    },
    {
        icon: <Target className="h-8 w-8 text-blue-600" />,
        title: 'Better Hiring Decisions',
        description: 'Data-driven analysis improves decision accuracy and reduces guesswork.',
    },
];

export default function WhyUs() {
    return (
        <section id="value-prop" className="py-20 md:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
                        Why ResumeEZ?
                    </h2>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-3">
                    {valueProps.map((prop) => (
                        <div key={prop.title} className="flex flex-col items-center text-center shadow-lg hover:shadow-blue-600/20 transition-shadow duration-300 
                        border border-slate-200 py-8 px-4 rounded-lg">
                            <div className='flex text-center justify-center flex-col items-center'>
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                    {prop.icon}
                                </div>
                                <div className="font-bold text-xl pb-4">{prop.title}</div>
                            </div>
                            <div>
                                <p className="text-muted-foreground">{prop.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
