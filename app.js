import React, { useState, useEffect } from "react";
import "./style.css";

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("xscan-theme") || "dark");
  const [username, setUsername] = useState(localStorage.getItem("xscan-username") || "");
  const [page, setPage] = useState("welcome");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [probability, setProbability] = useState(0);

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "light-theme";
    localStorage.setItem("xscan-theme", theme);
    localStorage.setItem("xscan-username", username);
  }, [theme, username]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setResult("");
      setProbability(0);
    }
  };

  const handleDetection = () => {
    setResult("Analyzing X-ray...");
    setProbability(0);
    setTimeout(() => {
      const prob = Math.random() * 0.5 + 0.5;
      setProbability(prob);
      if (prob > 0.7)
        setResult("Fracture detected!");
      else setResult("No fracture detected. Bone appears normal.");
    }, 2000);
  };

  // Settings modal JSX
  const SettingsModal = () => (
    <div className="modal-overlay" onClick={() => setSettingsOpen(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Settings</h2>
        <div className="modal-row">
          <label>Username:</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="modal-row">
          <label>Theme:</label>
          <button className="toggle-btn" onClick={toggleTheme}>
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
        <div className="modal-row">
          <label>Show History:</label>
          <input
            type="checkbox"
            checked={showHistory}
            onChange={() => setShowHistory(!showHistory)}
          />
        </div>
        <button className="close-btn" onClick={() => setSettingsOpen(false)}>
          Close
        </button>
      </div>
    </div>
  );

  // Welcome Page
  if (page === "welcome") {
    return (
      <div className="welcome-page">
        <div className="top-right">
          <button className="settings-btn" onClick={() => setSettingsOpen(true)}>⚙️</button>
        </div>
        <div className="welcome-content">
          <h1>🩻 X-Scan</h1>
          <p className="tagline">Bone Fracture Detection from X-ray Images</p>
          <button className="start-btn" onClick={() => setPage("scan")}>Start Scan</button>
          <p className="optional-login"></p>
        </div>
        {settingsOpen && <SettingsModal />}
      </div>
    );
  }

  // Scan Page
  return (
    <div className="app">
      <div className="header">
        <h1>🩻 X-Scan</h1>
        <button className="settings-btn" onClick={() => setSettingsOpen(true)}>⚙️</button>
      </div>
      {username && <p className="welcome-msg">Welcome, {username}!</p>}
      {settingsOpen && <SettingsModal />}

      {/* Upload */}
      <div className="upload-card">
        <input type="file" accept="image/*" onChange={handleImageUpload} id="fileInput" />
        <label htmlFor="fileInput" className="upload-btn">
          {image ? "Change X-ray Image" : "Upload X-ray Image"}
        </label>
      </div>

      {image && (
        <div className="preview-card">
          <img src={image} alt="X-ray Preview" />
        </div>
      )}

      {image && <button className="analyze-btn" onClick={handleDetection}>Analyze X-ray</button>}

      {result && (
        <div className="result-card">
          <p className="result-text">{result}</p>
          {probability > 0 && (
            <div className="prob-bar">
              <div className="prob-fill" style={{ width: `${(probability * 100).toFixed(0)}%` }}></div>
            </div>
          )}
        </div>
      )}

      {showHistory && (
        <div className="history-card">
          <h3>Scan History</h3>
          <ul>
            <li>Scan 1 – 90% fracture probability</li>
            <li>Scan 2 – 65% fracture probability</li>
            <li>Scan 3 – 78% fracture probability</li>
          </ul>
        </div>
      )}
    </div>
  );
}
