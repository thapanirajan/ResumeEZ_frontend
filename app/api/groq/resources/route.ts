import { NextRequest, NextResponse } from "next/server";

type GroqResource = {
    title: string;
    type: string;
    duration: string;
    platform: string;
    url: string;
};

type GroqPayload = {
    objective?: string;
    resources?: GroqResource[];
};

export async function POST(req: NextRequest) {
    try {
        const { skills } = (await req.json()) as { skills: string[] };

        if (!skills?.length) {
            return NextResponse.json({ resources: [], objective: "" });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ resources: [], objective: "" });
        }

        const skillList = skills.slice(0, 10).join(", ");

        const prompt = `You are a learning advisor. Given these tech skills to learn: ${skillList}

Return ONLY a raw JSON object with no markdown, no explanation, no code fences.

{
  "objective": "One sentence: what mastering these skills enables the learner to do professionally.",
  "resources": [
    {
      "title": "exact course/book/doc name",
      "type": "Video Course",
      "duration": "e.g. 20 hours",
      "platform": "Udemy",
      "url": "https://www.udemy.com/course/exact-course-slug/"
    },
    {
      "title": "exact name",
      "type": "Documentation",
      "duration": "self-paced",
      "platform": "Official Docs",
      "url": "https://docs.example.com/getting-started"
    },
    {
      "title": "exact name",
      "type": "Video Course",
      "duration": "e.g. 8 hours",
      "platform": "YouTube",
      "url": "https://www.youtube.com/results?search_query=exact+course+name"
    },
    {
      "title": "exact name",
      "type": "Book",
      "duration": "e.g. 400 pages",
      "platform": "O'Reilly",
      "url": "https://www.oreilly.com/library/view/exact-book-title/isbn/"
    }
  ]
}

STRICT RULES:
1. Every "url" must start with https://
2. Use real platform URLs: udemy.com, coursera.org, youtube.com, docs.aws.amazon.com, kubernetes.io/docs, react.dev, developer.mozilla.org, oreilly.com, etc.
3. If unsure of exact slug, use the platform's search: https://www.udemy.com/courses/search/?q=topic
4. Valid "type" values: Video Course, Book, Documentation, Hands-on Lab, Tutorial`;

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.3,
                max_tokens: 1200,
            }),
        });

        if (!groqRes.ok) {
            return NextResponse.json({ resources: [], objective: "" });
        }

        const groqData = await groqRes.json() as {
            choices: { message: { content: string } }[];
        };

        const content = groqData.choices?.[0]?.message?.content ?? "";

        // Extract first JSON object found in the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return NextResponse.json({ resources: [], objective: "" });
        }

        const parsed = JSON.parse(jsonMatch[0]) as GroqPayload;

        return NextResponse.json({
            resources: parsed.resources ?? [],
            objective: parsed.objective ?? "",
        });
    } catch {
        return NextResponse.json({ resources: [], objective: "" });
    }
}
