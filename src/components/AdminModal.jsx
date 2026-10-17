import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_PIN = "hasan2026";
const GITHUB_REPO = "hasanmujtaba2006/hasan-portfolio";
const FILE_PATH = "src/data/projects.json";

export default function AdminModal({ isOpen, onClose, projects, onSaveProjects, onResetProjects }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");

  const [activeTab, setActiveTab] = useState("add"); // "add" | "manage" | "github"
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Add form fields
  const [title, setTitle] = useState("");
  const [tech, setTech] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [typewriterText, setTypewriterText] = useState("");
  const [github, setGithub] = useState("");
  const [demo, setDemo] = useState("");

  // GitHub Sync fields
  const [githubToken, setGithubToken] = useState(() => {
    return localStorage.getItem("hasan_gh_token") || "";
  });
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const storedPin = localStorage.getItem("hasan_admin_pin") || DEFAULT_PIN;
    if (enteredPin.trim() === storedPin) {
      setIsAuthenticated(true);
      setPinError("");
      setEnteredPin("");
    } else {
      setPinError("Incorrect PIN. Please try again.");
    }
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!title.trim() || !tech.trim() || !description.trim()) {
      setStatusMessage({ type: "error", text: "Please fill in Title, Tech Stack, and Description." });
      return;
    }

    const newProject = {
      id: "project-" + Date.now(),
      title: title.trim(),
      tech: tech.trim(),
      description: description.trim(),
      video: video.trim(),
      typewriterText: typewriterText.trim(),
      github: github.trim(),
      demo: demo.trim() || "#"
    };

    const updated = [newProject, ...projects];
    onSaveProjects(updated);

    // Reset form
    setTitle("");
    setTech("");
    setDescription("");
    setVideo("");
    setTypewriterText("");
    setGithub("");
    setDemo("");

    setStatusMessage({
      type: "success",
      text: `"${newProject.title}" added to your live portfolio!`
    });
  };

  const handleDeleteProject = (id) => {
    if (window.confirm("Are you sure you want to remove this project?")) {
      const updated = projects.filter(p => p.id !== id && p.title !== id);
      onSaveProjects(updated);
      setStatusMessage({ type: "info", text: "Project removed." });
    }
  };

  const handleSaveToken = () => {
    localStorage.setItem("hasan_gh_token", githubToken.trim());
    setStatusMessage({ type: "success", text: "GitHub token saved securely in browser!" });
  };

  const handlePublishToGitHub = async () => {
    if (!githubToken.trim()) {
      setStatusMessage({ type: "error", text: "Please enter your GitHub Personal Access Token below." });
      return;
    }

    setIsPublishing(true);
    setStatusMessage({ type: "info", text: "Publishing projects to GitHub repository..." });

    try {
      // Step 1: Get current SHA of projects.json
      const getFileRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`, {
        headers: {
          Authorization: `token ${githubToken.trim()}`,
          Accept: "application/vnd.github.v3+json"
        }
      });

      if (!getFileRes.ok) {
        throw new Error(`Failed to fetch repo content: ${getFileRes.statusText}. Please verify token scopes (Contents: Read/Write).`);
      }

      const fileData = await getFileRes.json();
      const currentSha = fileData.sha;

      // Step 2: Encode updated JSON content in Base64
      const jsonString = JSON.stringify(projects, null, 2);
      const encodedContent = btoa(unescape(encodeURIComponent(jsonString)));

      // Step 3: Put/commit updated file
      const updateRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`, {
        method: "PUT",
        headers: {
          Authorization: `token ${githubToken.trim()}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github.v3+json"
        },
        body: JSON.stringify({
          message: `chore: update portfolio projects via Admin Panel (${new Date().toLocaleDateString()})`,
          content: encodedContent,
          sha: currentSha,
          branch: "main"
        })
      });

      if (!updateRes.ok) {
        const errJson = await updateRes.json().catch(() => ({}));
        throw new Error(errJson.message || `GitHub error: ${updateRes.status}`);
      }

      setStatusMessage({
        type: "success",
        text: "Pushed to GitHub main! Your live website will automatically update for all visitors."
      });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to publish to GitHub. You can still use 'Export JSON' below."
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "projects.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setStatusMessage({ type: "success", text: "projects.json downloaded!" });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                HM
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Project Manager Admin</h3>
                <p className="text-xs text-slate-500">Add, edit, or publish projects without touching code</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
              aria-label="Close Admin Modal"
            >
              ✕
            </button>
          </div>

          {/* Status Message Alert */}
          {statusMessage.text && (
            <div className={`px-6 py-3 text-sm flex items-center justify-between border-b ${
              statusMessage.type === "error"
                ? "bg-red-50 text-red-700 border-red-200"
                : statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
            }`}>
              <span>{statusMessage.text}</span>
              <button onClick={() => setStatusMessage({ type: "", text: "" })} className="ml-2 font-bold opacity-60 hover:opacity-100">✕</button>
            </div>
          )}

          {!isAuthenticated ? (
            /* PIN Gate */
            <form onSubmit={handlePinSubmit} className="p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-4 font-bold border border-emerald-200">
                🔒
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Enter Admin PIN</h4>
              <p className="text-sm text-slate-600 mb-6 max-w-sm">
                To prevent unauthorized changes, please enter your PIN to manage your portfolio projects.
              </p>
              
              <div className="w-full max-w-xs space-y-3">
                <input
                  type="password"
                  placeholder="Enter PIN (Default: hasan2026)"
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center font-mono tracking-widest text-lg"
                  autoFocus
                />
                {pinError && <p className="text-xs text-red-600 font-medium">{pinError}</p>}
                
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Unlock Admin
                </button>
              </div>
            </form>
          ) : (
            /* Authenticated Admin Dashboard */
            <div>
              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 px-6 pt-3 gap-6 text-sm font-medium text-slate-500 bg-slate-50/50">
                <button
                  onClick={() => setActiveTab("add")}
                  className={`pb-3 border-b-2 transition-colors ${
                    activeTab === "add"
                      ? "border-emerald-600 text-emerald-600 font-semibold"
                      : "border-transparent hover:text-slate-700"
                  }`}
                >
                  ➕ Add New Project
                </button>
                <button
                  onClick={() => setActiveTab("manage")}
                  className={`pb-3 border-b-2 transition-colors ${
                    activeTab === "manage"
                      ? "border-emerald-600 text-emerald-600 font-semibold"
                      : "border-transparent hover:text-slate-700"
                  }`}
                >
                  📂 Manage Current ({projects.length})
                </button>
                <button
                  onClick={() => setActiveTab("github")}
                  className={`pb-3 border-b-2 transition-colors ${
                    activeTab === "github"
                      ? "border-emerald-600 text-emerald-600 font-semibold"
                      : "border-transparent hover:text-slate-700"
                  }`}
                >
                  🚀 Publish to GitHub
                </button>
              </div>

              {/* Tab 1: Add New Project */}
              {activeTab === "add" && (
                <form onSubmit={handleAddProject} className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Smart IoT Weather Station"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Tech Stack *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Python / ESP32 / Flask / MQTT"
                        value={tech}
                        onChange={(e) => setTech(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Project Description *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Explain what the project does, key challenges solved, hardware/software integration, etc."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        GitHub Repository URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/hasanmujtaba2006/..."
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Live Demo URL (or '#' if none)
                      </label>
                      <input
                        type="text"
                        placeholder="https://yourdemo.com or #"
                        value={demo}
                        onChange={(e) => setDemo(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Video Demo File URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /parking.mp4 or video link (leave empty to show terminal typewriter effect)"
                      value={video}
                      onChange={(e) => setVideo(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Terminal Typewriter Lines (Shown when no video)
                    </label>
                    <textarea
                      rows={3}
                      placeholder={`> Booting firmware...\n> Calibrating sensors...\n> Connected to cloud server successfully.`}
                      value={typewriterText}
                      onChange={(e) => setTypewriterText(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="pt-3 flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
                    >
                      Add to Website
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-3 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium text-sm"
                    >
                      Done
                    </button>
                  </div>
                </form>
              )}

              {/* Tab 2: Manage Current Projects */}
              {activeTab === "manage" && (
                <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-slate-500">Showing {projects.length} projects currently on your site.</p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleExportJson}
                        className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition-colors"
                      >
                        Download JSON
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Reset back to default projects? Any unsynced custom projects will be cleared.")) {
                            onResetProjects();
                            setStatusMessage({ type: "info", text: "Reset to default project list." });
                          }
                        }}
                        className="text-xs px-3 py-1.5 text-red-600 hover:bg-red-50 rounded font-medium transition-colors"
                      >
                        Reset Defaults
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {projects.map((proj, idx) => (
                      <div key={proj.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <span className="text-[11px] font-mono font-semibold text-emerald-600">{proj.tech}</span>
                          <h4 className="font-bold text-slate-900 text-base">{proj.title}</h4>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{proj.description}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteProject(proj.id || proj.title)}
                          className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors text-sm"
                          title="Delete project"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Publish directly to GitHub repository */}
              {activeTab === "github" && (
                <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-slate-800 text-xs leading-relaxed space-y-1">
                    <p className="font-bold text-emerald-800 text-sm flex items-center gap-1.5">
                      <span>🚀</span> Instant Public Auto-Deploy
                    </p>
                    <p>
                      When you add projects, they are instantly live in your browser. To make them visible to <strong>everyone on the internet</strong>, you can publish directly to your GitHub repository here.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      GitHub Personal Access Token (PAT)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="github_pat_... or ghp_..."
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleSaveToken}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Save Token
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      Stored only locally in your browser. Needs <code>Contents: Read and write</code> permission for <code>hasanmujtaba2006/hasan-portfolio</code>.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isPublishing}
                      onClick={handlePublishToGitHub}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      {isPublishing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Publishing to GitHub...
                        </>
                      ) : (
                        "🚀 Commit & Publish to GitHub"
                      )}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-500 mb-2">Alternative: Download updated JSON and replace <code>src/data/projects.json</code></p>
                    <button
                      type="button"
                      onClick={handleExportJson}
                      className="text-xs px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
                    >
                      📥 Download projects.json
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
