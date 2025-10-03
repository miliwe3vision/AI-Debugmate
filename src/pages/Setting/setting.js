import React from "react";
import { useLocation, Link } from "react-router-dom";
import ProfileSetting from "./ProfileSetting";
import ApiManagement from "./ApiManagement";
import "./setting.css";

const TabLink = ({ to, label, active }) => (
  <Link to={to} className={`tab-link ${active ? "active" : ""}`}>
    {label}
  </Link>
);

const Setting = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get("tab") || "profile";

  return (
    <div className="settings-page">
      {/*<aside className="settings-sidebar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">⚙️</div>
          <div>
            <h1 className="brand-title">Settings</h1>
            <p className="brand-sub">Manage profile & API</p>
          </div>
        </div>

        <nav className="settings-nav" aria-label="Settings Navigation">
          <TabLink to="?tab=profile" label="Profile" active={activeTab === "profile"} />
          <TabLink to="?tab=api-management" label="API Management" active={activeTab === "api-management"} />
        </nav>

        <div className="sidebar-footer">
          <small>Version 1.0 • Secure</small>
        </div>
      </aside>*/}

      <main className="settings-main" role="main">
        {activeTab === "profile" && <ProfileSetting />}
        {activeTab === "api-management" && <ApiManagement />}
      </main>
    </div>
  );
};

export default Setting;
