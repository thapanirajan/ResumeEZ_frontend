import JobCard from "./JobCard";

const jobs = [
    {
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4PIGpM3NT_v7L3F8DXhJyhxUt4hU_B7xNX50FuIXvzrhXzzw1nQHLQKnERY5iFIjDSUrn42tebz2tvzA-RdkDOOhQQDZyuNwQXvWfN8_rpGVu3xtSZGTCMFMqPvC08BeSMeHX3d7MDVDPzIiLvDCik5hc6JI-AJ_5xtoG7qOAAPwEkAshPRjM-1Js0NXAbsmYItPhqpxBHddTwSaIg8y0l0MA-vDKUJ8VTPAzLUfOiUCzcA_lewI_EIvc0RmNt8kIv44l6bsZDEc",
        title: "Senior Generative AI Researcher",
        company: "Anthropic AI",
        location: "San Francisco, CA (Hybrid)",
        salary: "$180k – $260k",
        type: "Full-time",
        typeIcon: "work_outline",
        posted: "2 days ago",
        matchLabel: "98% AI Match",
        matchColor: "bg-green-100 text-green-700",
        highlightContent: (
            <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                <li>Lead the development of next-gen Large Language Models.</li>
                <li>Work alongside world-class researchers in safe AI development.</li>
                <li>Competitive equity package and premium health benefits.</li>
            </ul>
        ),
    },
    {
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7mQwOlp4wifGVKS1qYmeBCRMRIpDSUf58zFwjnJRp7MlGlrbrNZih9LTi4KAgPo_iBx0E2ksx_dYb-wxeu8Uwe7Qwt6WZPk0UMcmYKrAzCv7dl0Ckiw0WkDnHZEo7W2Kr8s0aDhH_cNd8GiUz2OE4NZ_3Fa7qBOKqiiWAtwJ5k4-TV0RJavZSsuyMOrzhyC22iUt9gjEmrmxFaVcO4eiX5RfpnHcrX6Ku69UrlL0Xm2sGaBbgizudu2BSB3MvBL8t9QYg8C361WE",
        title: "Machine Learning Operations (MLOps) Lead",
        company: "Lumina Data",
        location: "Remote (Global)",
        salary: "$140k – $195k",
        type: "Remote",
        typeIcon: "public",
        posted: "5 hours ago",
        matchLabel: "Top Rated",
        matchColor: "bg-primary/10 text-primary",
        highlightContent: (
            <p className="text-sm text-slate-600">
                Scale our ML infrastructure to support millions of daily predictions.
                Architect high-availability pipelines using Kubernetes and GCP.
            </p>
        ),
    },
    {
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXaQV0O9zxpaMekQAa93ebIVVHhGB1aCixyz5VcbegkOiXpNAOoB_d7xqPQzbuWPdA4oRMu8IWSVq4gXCSn4vkjeMR1GQQwwb0Ar3flY1gi_A4spvEfmb5BGoAuK2mLck8WqRkckgjlE9DtVmWNF72k8tf1EW3qYW-L6iHzgWlTm4pHa4Cu3SHqetb1XvSqyOWMeFK-X1g6LiELuZamTM4x9jURoLdiIasRTNpoi2rnBSBaMonjMCjtCewD5PeEy20M6zK6L9M5TE",
        title: "Principal AI Solutions Architect",
        company: "NeuralFlow Systems",
        location: "New York, NY",
        salary: "$220k – $310k",
        type: "On-site",
        typeIcon: "apartment",
        posted: "Just now",
        matchLabel: "85% Match",
        matchColor: "bg-blue-100 text-blue-700",
        featured: true,
        borderStyle: "border-2 border-primary/20 hover:border-primary",
        highlightContent: (
            <p className="text-sm text-slate-600">
                Join the founding team to bridge enterprise needs with state-of-the-art
                AI capabilities. Significant leadership role with direct CEO reporting.
            </p>
        ),
    },
];

const pages = [1, 2, 3, 12];

export default function JobFeed() {
    return (
        <section className="flex-1 space-y-6">
            {/* Feed Controls */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight">
                        AI Engineering Roles
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">
                        Showing 1,240 relevant opportunities in San Francisco
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white rounded-lg p-1 border border-slate-200">
                        <button className="p-1.5 bg-primary/10 text-primary rounded-md">
                            <span className="material-icons-round text-sm">view_list</span>
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md">
                            <span className="material-icons-round text-sm">grid_view</span>
                        </button>
                    </div>
                    <select className="bg-white border-slate-200 rounded-lg text-sm font-bold py-2 px-4 focus:ring-primary border">
                        <option>Most Relevant</option>
                        <option>Newest First</option>
                        <option>Highest Salary</option>
                    </select>
                </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
                {jobs.map((job) => (
                    <JobCard key={job.title} {...job} />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center pt-8 gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                    <span className="material-icons-round text-sm">chevron_left</span>
                </button>

                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
                    1
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors font-bold text-sm">
                    2
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors font-bold text-sm">
                    3
                </button>
                <span className="px-2 text-slate-400">...</span>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors font-bold text-sm">
                    12
                </button>

                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                    <span className="material-icons-round text-sm">chevron_right</span>
                </button>
            </div>
        </section>
    );
}