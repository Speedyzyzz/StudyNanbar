import { useState, useEffect } from "react";

function App() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [mood, setMood] = useState("Curious");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [error, setError] = useState("");

  const handleExplain = async (
    simplify = false,
    example = false,
    mode = null,
  ) => {
    if (!topic) return;

    if (mode === "eli5") {
      simplify = false;
      example = false;
    }

    setIsLoading(true);
    setOutput("");
    setDisplayedText("");
    setError("");

    try {
      const res = await fetch("http://localhost:5000/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, level, mood, simplify, example, mode }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch");

      setOutput(data.output);
    } catch (err) {
      setError(
        "Oops! Our highly trained AI hamsters tripped. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!output) return;

    let index = 0;
    setDisplayedText(output.charAt(0));

    const timer = setInterval(() => {
      index++;
      if (index < output.length) {
        setDisplayedText((prev) => prev + output.charAt(index));
      } else {
        clearInterval(timer);
      }
    }, 15);

    return () => clearInterval(timer);
  }, [output]);

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-dim/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary-dim/20 rounded-full blur-[120px]"></div>
      </div>

      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-slate-950/40 backdrop-blur-xl">
        <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 font-headline">
          StudyNanbar
        </span>
      </nav>

      <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-screen">
        <div className="animate-float w-full max-w-6xl glass-panel rounded-xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          <section className="flex-1 p-8 lg:p-12 border-r border-outline-variant/10">
            <h1 className="text-4xl lg:text-5xl font-headline font-extrabold mb-4">
              Unlock Knowledge <span className="text-primary">Instantly</span>
            </h1>

            <div className="space-y-6 mt-8">
              <div className="space-y-3">
                <label className="block font-label text-sm font-semibold uppercase text-on-surface-variant">
                  What's on your mind?
                </label>
                <input
                  className="w-full bg-surface-container-low rounded-lg py-4 px-4 text-on-surface border border-outline-variant/5 glow-pulse"
                  placeholder="e.g. Quantum Physics"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="block font-label text-sm font-semibold uppercase text-on-surface-variant">
                    Complexity
                  </label>
                  <select
                    className="w-full bg-surface-container-low rounded-lg py-3 px-4 text-on-surface border border-outline-variant/5"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="block font-label text-sm font-semibold uppercase text-on-surface-variant">
                    Vibe
                  </label>
                  <select
                    className="w-full bg-surface-container-low rounded-lg py-3 px-4 text-on-surface border border-outline-variant/5"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                  >
                    <option>Curious</option>
                    <option>Confused</option>
                    <option>Tired</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => handleExplain(false, false)}
                  disabled={isLoading}
                  className="disabled:opacity-50 disabled:cursor-not-allowed flex-1 py-4 rounded-lg bg-gradient-to-r from-primary-dim to-secondary-dim text-white font-headline font-extrabold shadow-lg hover:scale-[1.02] transition-all"
                >
                  {isLoading ? "Thinking..." : "Explain Now"}
                </button>
              </div>
            </div>
          </section>

          <section className="flex-1 bg-surface-container-high/30 p-8 lg:p-12 border-l border-outline-variant/10 flex flex-col">
            <h2 className="text-2xl font-headline font-bold text-on-surface mb-8">
              Instant Explanation
            </h2>
            <div className="bg-surface-container-lowest/40 rounded-lg p-6 font-body text-on-surface-variant leading-relaxed h-[300px] overflow-y-auto border border-outline-variant/5 relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                    <div
                      className="w-3 h-3 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-3 h-3 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              )}
              {!isLoading && error && (
                <div className="text-red-400">{error}</div>
              )}
              {!isLoading && !error && displayedText}
              {!isLoading &&
                !error &&
                !displayedText &&
                "Waiting for your curiosity..."}
            </div>

            {output && !isLoading && !error && (
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => handleExplain(true, false)}
                  className="flex-1 py-3 rounded-lg bg-surface-container-high text-on-surface font-headline font-semibold border border-outline-variant/10 hover:border-primary/40 transition-all text-sm"
                >
                  Simplify More
                </button>
                <button
                  onClick={() => handleExplain(false, true)}
                  className="flex-1 py-3 rounded-lg bg-surface-container-high text-on-surface font-headline font-semibold border border-outline-variant/10 hover:border-secondary/40 transition-all text-sm"
                >
                  Real-life Example
                </button>
                <button
                  onClick={() => handleExplain(false, false, "eli5")}
                  className="flex-1 py-3 rounded-lg bg-surface-container-high text-on-surface font-headline font-semibold border border-outline-variant/10 hover:border-purple-400/40 transition-all text-sm"
                >
                  Explain Like I'm 5
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
