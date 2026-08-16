"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [fileName, setFileName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert("Please upload your resume first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("resume", selectedFile);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Analysis failed");
        setLoading(false);
        return;
      }

      // Save analysis results
      localStorage.setItem(
        "atsResults",
        JSON.stringify(data)
      );

      // Go to results page
      router.push("/results");

    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-3xl bg-white/5 border border-white/10 rounded-3xl p-8">

        {/* Heading */}

        <h1 className="text-4xl font-bold text-center mb-8">
          Upload Your Resume
        </h1>

        {/* Resume Upload */}

        <div className="mb-6">

          <label className="block mb-3 text-lg">
            Resume (PDF)
          </label>

          <label className="flex flex-col items-center justify-center w-full min-h-52 border-2 border-dashed border-violet-500 rounded-3xl cursor-pointer hover:bg-white/5 transition px-6">

            <div className="text-center">

              <div className="text-5xl mb-4">
                📄
              </div>

              {!fileName ? (
                <>
                  <p className="text-xl font-semibold">
                    Upload Resume
                  </p>

                  <p className="text-gray-400 mt-2">
                    Choose your PDF resume
                  </p>

                  <p className="text-violet-400 mt-3">
                    Browse Files
                  </p>
                </>
              ) : (
                <>
                  <p className="text-green-400 text-xl font-semibold break-all">
                    ✓ {fileName}
                  </p>

                  <p className="text-gray-400 mt-2">
                    Resume selected successfully
                  </p>

                  <p className="text-violet-400 mt-3">
                    Click to change file
                  </p>
                </>
              )}

            </div>

            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />

          </label>

        </div>

        {/* Job Description */}

        <div className="mb-6">

          <label className="block mb-3 text-lg">
            Job Description
          </label>

          <textarea
            rows={8}
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
            placeholder="Paste job description here... (Optional)"
            className="w-full bg-black border border-white/20 rounded-xl p-4 outline-none focus:border-violet-500 transition"
          />

          <p className="text-gray-500 text-sm mt-2">
            You can leave this empty for a general resume analysis.
          </p>

        </div>

        {/* Analyze Button */}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-violet-600 py-4 rounded-xl font-semibold hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >

          {loading
            ? "🔄 Analyzing Resume..."
            : "🚀 Analyze Resume"}

        </button>

      </div>

    </main>
  );
}