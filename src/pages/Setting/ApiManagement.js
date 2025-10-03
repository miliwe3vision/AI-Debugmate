import React, { useState } from "react";
import "./setting.css";
import { motion } from "framer-motion";

const ApiManagement = () => {
  const [apiKey, setApiKey] = useState("************");
  const [model, setModel] = useState("gpt-4");
  const [memory, setMemory] = useState(true);
  const [responseLength, setResponseLength] = useState(200);
  const [temperature, setTemperature] = useState(0.7);
  const [darkMode, setDarkMode] = useState(false);

  const generateKey = () => {
    const newKey = Math.random().toString(36).substring(2, 18);
    setApiKey(newKey);
    // Ideally store to server — placeholder action:
    alert("New API key generated and copied to clipboard.");
    navigator.clipboard?.writeText(newKey).catch(() => {});
  };

  return (
    <motion.section
      className={`page-grid ${darkMode ? "theme-dark" : ""}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="card">
        <div className="card-header">
          <h2>API Management</h2>
          <p className="muted">Manage API keys, model selection and integrations.</p>
        </div>

        <div className="api-row">
          <div className="api-left">
            <div className="api-box">
              <label className="label-text">API Key</label>
              <div className="key-row">
                <code className="api-key" aria-live="polite">{apiKey}</code>
                <div className="key-actions">
                  <button className="btn" onClick={() => { navigator.clipboard?.writeText(apiKey); alert("Copied!"); }}>
                    Copy
                  </button>
                  <button className="btn primary" onClick={generateKey}>
                    Generate
                  </button>
                </div>
              </div>
            </div>

            <div className="api-box">
              <label className="label-text">Model</label>
              <select className="dropdown" value={model} onChange={(e) => setModel(e.target.value)}>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5">GPT-3.5</option>
                <option value="custom">Custom Model</option>
              </select>
            </div>

            <div className="api-box">
              <label className="label-text">Memory</label>
              <label className="switch">
                <input type="checkbox" checked={memory} onChange={() => setMemory(!memory)} />
                <span className="slider"></span>
              </label>
              <p className="muted small">Toggle conversation memory for the assistant.</p>
            </div>
          </div>

          <div className="api-right">
            <div className="card small">
              <h4>Response Length</h4>
              <input type="range" min="50" max="500" value={responseLength} onChange={(e) => setResponseLength(e.target.value)} />
              <div className="range-value">{responseLength} tokens</div>
            </div>

            <div className="card small">
              <h4>Temperature</h4>
              <input type="range" min="0" max="1" step="0.1" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} />
              <div className="range-value">{temperature}</div>
            </div>

            <div className="card small">
              <h4>Integrations</h4>
              <div className="integration-actions">
                <button className="btn">Connect Slack</button>
                <button className="btn">Connect Teams</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className="card analysis-card">
        <h3>Chatbot Insights</h3>
        <ul className="analysis-list">
          <li>Conversations Today: <strong>152</strong></li>
          <li>Avg Response: <strong>1.2s</strong></li>
          <li>Active Users: <strong>38</strong></li>
        </ul>

        <div className="theme-toggle-row">
          <label className="label-text">Theme</label>
          <label className="switch">
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            <span className="slider"></span>
          </label>
          <div className="muted small">{darkMode ? "Dark mode enabled" : "Light mode"}</div>
        </div>
      </aside>
    </motion.section>
  );
};

export default ApiManagement;
