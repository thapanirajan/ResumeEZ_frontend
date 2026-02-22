/* ================= EXPERIENCE ================= */

export type Experience = {
    company: string;
    role: string;
    startDate: string;   // format: YYYY-MM or "Present"
    endDate: string;     // format: YYYY-MM or "Present"
    description: string; // bullet-style text
};

/* ================= EDUCATION ================= */

export type Education = {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;   // format: YYYY-MM or "Present"
    endDate: string;     // format: YYYY-MM or "Present"
    gpa?: string;
    honors?: string;
};

/* ================= SKILLS ================= */

export type SkillCategory = {
    category: string;
    items: string; // comma-separated
};

/* ================= RESUME ================= */

export type ResumeData = {
    /* PERSONAL */
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;

    /* LINKS */
    linkedin: string;
    github: string;

    /* SUMMARY */
    summary: string;

    /* SECTIONS */
    experience: Experience[];
    education: Education[];
    projects: Project[];
    skills: SkillCategory[];
};


export type Project = {
    name: string;
    role?: string;
    techStack: string;
    description: string;
    liveUrl?: string;
    githubUrl?: string;
};
