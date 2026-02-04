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
};
