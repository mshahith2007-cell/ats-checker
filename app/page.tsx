export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-10 py-6">
        <h1 className="text-3xl font-bold">
          ATS <span className="text-violet-500">Checker</span>
        </h1>

        <div className="hidden md:flex gap-8">
          <a href="#">About</a>
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Contact</a>
        </div>

        <button className="bg-violet-600 px-5 py-2 rounded-full">
          Sign In
        </button>
      </nav>

      <section className="max-w-7xl mx-auto px-10 pt-24 flex flex-col lg:flex-row items-center justify-between">
        <div className="max-w-xl">
          <div className="mb-6 inline-block px-4 py-2 rounded-full border border-violet-500">
            AI-Powered Resume Analysis
          </div>

          <h1 className="text-6xl font-bold leading-tight">
            Improve Your Resume.
            <br />
            Beat the{" "}
            <span className="text-violet-500">
              ATS.
            </span>
          </h1>

          <p className="text-gray-400 mt-6 text-lg">
            Upload your resume, analyze ATS compatibility,
            discover missing skills, and improve your chances
            of getting hired.
          </p>

          <div className="flex gap-4 mt-8">
            <a
  href="/upload"
  className="bg-gradient-to-r from-blue-500 to-violet-600 px-8 py-4 rounded-xl font-semibold hover:scale-105 transition inline-block"
>
  Analyze My Resume
</a>

            <button className="border border-white/20 px-8 py-4 rounded-xl">
              Watch Demo
            </button>
          </div>
        </div>

        <div className="mt-16 lg:mt-0">
          <img
            src="/hero.jpg"
            alt="ATS Dashboard"
            className="w-[650px]"
          />
        </div>
        </section>
        <section className="max-w-6xl mx-auto px-10 py-20">
  <section className="max-w-6xl mx-auto px-10 py-20">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
      <h2 className="text-5xl font-bold text-violet-400">50K+</h2>
      <p className="text-gray-400 mt-4 text-lg">
        Resumes Analyzed
      </p>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
      <h2 className="text-5xl font-bold text-blue-400">92%</h2>
      <p className="text-gray-400 mt-4 text-lg">
        ATS Accuracy
      </p>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
      <h2 className="text-5xl font-bold text-purple-400">10K+</h2>
      <p className="text-gray-400 mt-4 text-lg">
        Active Users
      </p>
    </div>

  </div>
</section>
      </section>
      {/* Features Section */}
<section className="max-w-7xl mx-auto px-6 md:px-10 py-20">

  <div className="text-center mb-16">
    <h2 className="text-4xl font-bold">
      Powerful ATS Features
    </h2>

    <p className="text-gray-400 mt-4">
      Everything you need to optimize your resume.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
      <h3 className="text-xl font-semibold text-violet-400">
        ATS Analysis
      </h3>
      <p className="text-gray-400 mt-3">
        Check ATS compatibility instantly.
      </p>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
      <h3 className="text-xl font-semibold text-blue-400">
        Skill Match
      </h3>
      <p className="text-gray-400 mt-3">
        Compare resume skills with job requirements.
      </p>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
      <h3 className="text-xl font-semibold text-purple-400">
        Missing Skills
      </h3>
      <p className="text-gray-400 mt-3">
        Discover important skills missing from your resume.
      </p>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
      <h3 className="text-xl font-semibold text-green-400">
        AI Suggestions
      </h3>
      <p className="text-gray-400 mt-3">
        Get recommendations to improve your resume.
      </p>
    </div>

  </div>

</section>
    </main>
  );
}