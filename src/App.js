// App.js
import React, { useState, useEffect, createContext } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './component/header';
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from './component/Sidebar';
import Communication from './pages/chatbot/Communication';
import Dashboard from './pages/Dashboard';
import Feedback from './pages/chatbot/feedback';
import ChooseRole from './pages/Role-management/chooserole';
import CreateMail from './pages/Role-management/createmail.js';
import Announcements from './pages/Announcements/index.js';
import ChatbotIcon from './component/ChatbotIcon';
import SignIn from './pages/Signin';
import EmployeeProjectForm from './pages/project/project_info.js';
import ApiManagement from './pages/Api_managment/Api_managment.js';
import Overview from './pages/Overview/Overview.js';
import Setting from './pages/Setting/setting.js';
import ProjectDetailsTable from './pages/project/ProjectDetailsTable';
import ProjectDetails from './pages/project/ProjectDetails';
import WorkChat from './pages/chatbot/WorkChat.js';
import DeveloperChat from './pages/chatbot/DeveloperChat';
import DualChatbot from './pages/chatbot/DualChatbot';
import ProtectedRoute from './component/ProtectedRoute';
import ChatPage from './pages/project/chatpage.js';
import { MessagesProvider } from './contexts/messagecontext.js';

const MyContext = createContext();

function App() {
  const [istoggleSidebar, setIstoggleSidebar] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const [ishideSidebar, setIshideSidebar] = useState(false);
  const [istheme, setIstheme] = useState(true);
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const [userRole, setUserRole] = useState('Guest'); // 'Admin'/'Manager'/'Employee'
  const [userPermissions, setUserPermissions] = useState({});

  useEffect(() => {
    if (istheme) {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, [istheme]);

  const values = {
    istoggleSidebar,
    setIstoggleSidebar,
    isSignIn,
    setIsSignIn,
    ishideSidebar,
    setIshideSidebar,
    istheme,
    setIstheme,
    username,
    setUsername,
    userEmail,
    setUserEmail,
    userRole,
    setUserRole,
    userPermissions,
    setUserPermissions,
  };

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        {!ishideSidebar && <Header />}
        <div className="main d-flex">
          {!ishideSidebar && (
            <div className={`sidebarwrapper ${istoggleSidebar ? 'open' : ''}`}>
              <Sidebar />
            </div>
          )}

          <div className={`content ${ishideSidebar ? 'full' : ''} ${istoggleSidebar ? 'open' : ''}`}>
            {/* Wrap all routes with MessagesProvider */}
            <MessagesProvider>
              <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/home" element={<SignIn />} />
                <Route path="/EmployeeProjectForm" element={<EmployeeProjectForm />} />
                <Route path="/project" element={<EmployeeProjectForm />} />
                <Route path="/chatbot/communication" element={<Communication />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/chat/:email" element={<ChatPage />} />
                <Route path="/announcements" element={<Announcements />} />

                {/* Protected routes */}
                <Route
                  path="/role-management/chooserole"
                  element={
                    <ProtectedRoute requiredPage="Choose Roles">
                      <ChooseRole />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/role-management/createmail"
                  element={
                    <ProtectedRoute requiredPage="Create Mails">
                      <CreateMail />
                    </ProtectedRoute>
                  }
                />

                <Route path="/Announcements" element={<Announcements />} />
                <Route path="/communication" element={<Communication />} />
                <Route path="/chatbot/feedback" element={<Feedback />} />
                <Route path="/api-management" element={<ApiManagement />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/project/DetailsTable" element={<ProjectDetailsTable />} />
                <Route path="/project/:id" element={<ProjectDetails />} />
                <Route path="/chatbot" element={<WorkChat />} />
                <Route path="/chatbot/WorkChat" element={<WorkChat />} />
                <Route path="/chatbot/web" element={<DeveloperChat />} />
                <Route path="/chatbot/dual" element={<DualChatbot />} />
              </Routes>
            </MessagesProvider>
          </div>
        </div>
        <ChatbotIcon />
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { MyContext };
