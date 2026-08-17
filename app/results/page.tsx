"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";

type ATSData = {
  atsScore: number;
  skillMatch: number;
  foundSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
};

export default function ResultsPage() {
  const [data, setData] = useState<ATSData | null>(null);

  useEffect(() => {
    const savedResults = localStorage.getItem("atsResults");

    if (savedResults) {
      try {
        setData(JSON.parse(savedResults));
      } catch (error) {
        console.error("Error reading results:", error);
      }
    }
  }, []);

  const downloadReport = () => {
    if (!data) return;

    const pdf = new jsPDF();

    let y = 20;

    pdf.setFontSize(22);
    pdf.text("ATS Resume Analysis Report", 20, y);

    y += 15;

    pdf.setFontSize(14);
    pdf.text(`ATS Score: ${data.atsScore}%`, 20, y);

    y += 10;
    pdf.text(`Skill Match: ${data.skillMatch}%`, 20, y);

    y += 10;
    pdf.text(
      `Skills Found: ${data.foundSkills.length}`,
      20,
      y
    );

    y += 18;

    pdf.setFontSize(16);
    pdf.text("Found Skills", 20, y);

    y += 10;

    pdf.setFontSize(11);

    if (data.foundSkills.length === 0) {
      pdf.text("No recognized skills found.", 20, y);
      y += 8;
    } else {
      data.foundSkills.forEach((skill) => {
        pdf.text(`• ${skill}`, 25, y);
        y += 7;

        if (y > 270) {
          pdf.addPage();
          y = 20;
        }
      });
    }

    y += 8;

    pdf.setFontSize(16);
    pdf.text("Missing Skills", 20, y);

    y += 10;

    pdf.setFontSize(11);

    if (data.missingSkills.length === 0) {
      pdf.text("No missing skills detected.", 20, y);
      y += 8;
    } else {
      data.missingSkills.forEach((skill) => {
        pdf.text(`• ${skill}`, 25, y);
        y += 7;

        if (y > 270) {
          pdf.addPage();
          y = 20;
        }
      });
    }

    y += 8;

    pdf.setFontSize(16);
    pdf.text("Resume Suggestions", 20, y);

    y += 10;

    pdf.setFontSize(11);

    data.suggestions.forEach((suggestion) => {
      const lines = pdf.splitTextToSize(
        `• ${suggestion}`,
        165
      );

      pdf.text(lines, 25, y);

      y += lines.length * 7 + 3;

      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
    });

    pdf.save("ATS-Resume-Report.pdf");
  };

  if (!data) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-5">📊</div>
          <h1 className="text-2xl font-bold">
            Loading ATS Report...
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-5 md:p-10">

      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <p className="text-violet-400 font-semibold mb-2">
            ATS CHECKER
          </p>

          <h1 className="text-4xl md:text-5xl font-bold">
            ATS Analysis Report
          </h1>

          <p className="text-gray-400 mt-3">
            Detailed analysis of your resume.
          </p>
        </div>

        {/* SCORE CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">

            <div className="relative w-40 h-40 mx-auto mb-5">

              <svg
                className="w-40 h-40 -rotate-90"
                viewBox="0 0 120 120"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="text-white/10"
                />

                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  className="text-green-400"
                  strokeDasharray="314"
                  strokeDashoffset={
                    314 - (314 * data.atsScore) / 100
                  }
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">
                  {data.atsScore}%
                </span>
              </div>

            </div>

            <h2 className="text-xl font-semibold">
              ATS Score
            </h2>

            <p className="text-gray-400 mt-2">
              Overall resume score
            </p>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center flex flex-col justify-center">

            <h2 className="text-6xl font-bold text-blue-400">
              {data.skillMatch}%
            </h2>

            <p className="mt-4 text-xl font-semibold">
              Skill Match
            </p>

            <p className="text-gray-400 mt-2">
              Job skill compatibility
            </p>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center flex flex-col justify-center">

            <h2 className="text-6xl font-bold text-violet-400">
              {data.foundSkills.length}
            </h2>

            <p className="mt-4 text-xl font-semibold">
              Skills Found
            </p>

            <p className="text-gray-400 mt-2">
              Detected in your resume
            </p>

          </div>

        </div>

        {/* FOUND + MISSING */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

            <h2 className="text-2xl font-bold mb-6">
              ✅ Found Skills
            </h2>

            {data.foundSkills.length === 0 ? (
              <p className="text-gray-400">
                No recognized skills found.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {data.foundSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            )}

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

            <h2 className="text-2xl font-bold mb-6">
              ⚠️ Missing Skills
            </h2>

            {data.missingSkills.length === 0 ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5">
                <p className="text-green-400 font-semibold">
                  🎉 No missing skills!
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {data.missingSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400"
                  >
                    ✗ {skill}
                  </span>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* ATS BREAKDOWN */}

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mt-10">

          <h2 className="text-2xl font-bold mb-8">
            📊 ATS Score Breakdown
          </h2>

          <div className="space-y-7">

            <div>
              <div className="flex justify-between mb-2">
                <span>Keywords Match</span>
                <span>{data.skillMatch}%</span>
              </div>

              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${data.skillMatch}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Skills Match</span>
                <span>{data.skillMatch}%</span>
              </div>

              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: `${data.skillMatch}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Projects</span>
                <span>80%</span>
              </div>

              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className="bg-violet-500 h-3 rounded-full"
                  style={{ width: "80%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Formatting</span>
                <span>90%</span>
              </div>

              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className="bg-yellow-500 h-3 rounded-full"
                  style={{ width: "90%" }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* SUGGESTIONS */}

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mt-10">

          <h2 className="text-2xl font-bold mb-6">
            🤖 Resume Suggestions
          </h2>

          <div className="space-y-4">

            {data.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-5 bg-white/5 border border-white/10 rounded-2xl"
              >
                <p className="text-gray-300">
                  💡 {suggestion}
                </p>
              </div>
            ))}

          </div>
        </div>

        {/* BUTTONS */}

        <div className="flex flex-col sm:flex-row gap-4 mt-10 mb-10">

          <button
            onClick={() => {
              window.location.href = "/upload";
            }}
            className="flex-1 border border-white/20 py-4 rounded-xl font-semibold hover:bg-white/5 transition"
          >
            ← Analyze Another Resume
          </button>

          <button
            onClick={downloadReport}
            className="flex-1 bg-gradient-to-r from-blue-500 to-violet-600 py-4 rounded-xl font-semibold hover:scale-[1.02] transition"
          >
            📥 Download ATS Report
          </button>

        </div>

      </div>

    </main>
  );
}