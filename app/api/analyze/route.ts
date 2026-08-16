import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const resume = formData.get("resume");
    const jobDescription =
      formData.get("jobDescription")?.toString() || "";

    if (!(resume instanceof File)) {
      return NextResponse.json(
        { error: "No resume uploaded" },
        { status: 400 }
      );
    }

    if (resume.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Please upload a PDF file." },
        { status: 400 }
      );
    }

    // Convert uploaded PDF to Buffer
    const buffer = Buffer.from(await resume.arrayBuffer());

    // Create PDF parser
    const parser = new PDFParse({
      data: buffer,
    });

    // Extract text
    const result = await parser.getText();

    // Free parser resources
    await parser.destroy();

    const resumeText = result.text || "";

    console.log("Resume text length:", resumeText.length);

    if (!resumeText.trim()) {
      return NextResponse.json(
        {
          error:
            "No readable text was found in this PDF. Please upload a text-based PDF.",
        },
        { status: 400 }
      );
    }

    const skills = [
      "Python",
      "Java",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "SQL",
      "MongoDB",
      "AWS",
      "Docker",
      "Git",
      "GitHub",
      "Machine Learning",
      "Data Science",
      "Data Analysis",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Power BI",
      "Excel",
      "Deep Learning",
      "TensorFlow",
      "PyTorch",
      "C++",
      "C",
      "Figma",
      "REST API",
      "PostgreSQL",
      "MySQL",
    ];

    const resumeLower = resumeText.toLowerCase();
    const jobLower = jobDescription.toLowerCase();

    // Skills found in resume
    const foundSkills = skills.filter((skill) =>
      resumeLower.includes(skill.toLowerCase())
    );

    // Skills present in both resume and job description
    const matchedSkills = skills.filter(
      (skill) =>
        resumeLower.includes(skill.toLowerCase()) &&
        jobLower.includes(skill.toLowerCase())
    );

    // Skills in job description but missing from resume
    const missingSkills = skills.filter(
      (skill) =>
        jobLower.includes(skill.toLowerCase()) &&
        !resumeLower.includes(skill.toLowerCase())
    );

    let atsScore = 0;
    let skillMatch = 0;

    /*
      --------------------------------
      NO JOB DESCRIPTION
      --------------------------------
    */

    if (!jobDescription.trim()) {
      const skillScore = Math.min(foundSkills.length * 5, 50);

      const resumeLengthScore =
        resumeText.length > 1500
          ? 25
          : resumeText.length > 800
          ? 20
          : resumeText.length > 400
          ? 15
          : 10;

      const contactScore = resumeLower.includes("@")
        ? 10
        : 0;

      const sections = [
        "education",
        "experience",
        "project",
        "skills",
      ];

      const sectionScore =
        sections.filter((section) =>
          resumeLower.includes(section)
        ).length * 4;

      atsScore = Math.min(
        95,
        skillScore +
          resumeLengthScore +
          contactScore +
          sectionScore
      );

      skillMatch = atsScore;
    }

    /*
      --------------------------------
      JOB DESCRIPTION EXISTS
      --------------------------------
    */

    else {
      const requiredSkills = skills.filter((skill) =>
        jobLower.includes(skill.toLowerCase())
      );

      if (requiredSkills.length > 0) {
        skillMatch = Math.round(
          (matchedSkills.length /
            requiredSkills.length) *
            100
        );
      } else {
        skillMatch = 50;
      }

      const keywordCount = jobLower
        .split(/\s+/)
        .filter((word) => {
          const cleanWord = word.replace(
            /[^a-zA-Z0-9+#.-]/g,
            ""
          );

          return (
            cleanWord.length > 4 &&
            resumeLower.includes(cleanWord)
          );
        }).length;

      const jobWords = jobLower
        .split(/\s+/)
        .filter((word) => word.length > 4).length;

      const keywordScore =
        jobWords > 0
          ? Math.min(
              100,
              Math.round(
                (keywordCount / jobWords) * 100
              )
            )
          : 50;

      const sections = [
        "education",
        "experience",
        "project",
        "skills",
      ];

      const structureScore =
        sections.filter((section) =>
          resumeLower.includes(section)
        ).length * 25;

      atsScore = Math.round(
        skillMatch * 0.6 +
          keywordScore * 0.25 +
          Math.min(structureScore, 100) * 0.15
      );

      atsScore = Math.min(
        100,
        Math.max(0, atsScore)
      );
    }

    /*
      --------------------------------
      DYNAMIC SUGGESTIONS
      --------------------------------
    */

    const suggestions: string[] = [];

    if (missingSkills.length > 0) {
      suggestions.push(
        `Add these missing skills if you genuinely have them: ${missingSkills
          .slice(0, 5)
          .join(", ")}.`
      );
    }

    if (!resumeLower.includes("experience")) {
      suggestions.push(
        "Add an Experience section with your internship, work, or practical experience."
      );
    }

    if (!resumeLower.includes("project")) {
      suggestions.push(
        "Add a Projects section with your strongest technical projects."
      );
    }

    if (!resumeLower.includes("education")) {
      suggestions.push(
        "Add an Education section with your degree and relevant academic details."
      );
    }

    if (!resumeLower.includes("@")) {
      suggestions.push(
        "Add a professional email address to your contact information."
      );
    }

    if (resumeText.length < 500) {
      suggestions.push(
        "Your resume contains very little text. Add relevant projects, skills, education, and experience."
      );
    }

    if (atsScore < 60) {
      suggestions.push(
        "Improve keyword matching and tailor your resume more closely to the target job."
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        "Your resume has a strong structure. Continue tailoring keywords and achievements to each job."
      );
    }

    return NextResponse.json({
      atsScore,
      skillMatch,
      foundSkills,
      matchedSkills,
      missingSkills,
      suggestions,
      resumeTextLength: resumeText.length,
    });
  } catch (error) {
    console.error("ATS ANALYSIS ERROR:", error);

    return NextResponse.json(
      {
        error:
          "PDF reading failed. Please try another PDF resume.",
      },
      { status: 500 }
    );
  }
}