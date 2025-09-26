import React, { useRef, useEffect, useState, useContext } from 'react';
import { Card } from 'react-bootstrap';
import { FaComments, FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import './WorkChat.css';
import { MyContext } from '../../App';

const WorkChat = () => {
  const [workMessages, setWorkMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your Project Chat Assistant. I can help you with project-related questions, development guidance, team collaboration, and project management. How can I assist you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [sessionActive, setSessionActive] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [projectId, setProjectId] = useState('Default');
  const [projectName, setProjectName] = useState('Default Project');
  const [projectInfo, setProjectInfo] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const context = useContext(MyContext);
  const userEmail = context.userEmail;
  const userName = context.userName || "User";

  const location = useLocation();

  // ✅ Pick project info from router state (Dashboard -> WorkChat)
  useEffect(() => {
    if (location.state?.projectId) {
      setProjectId(location.state.projectId);
      setProjectName(location.state.projectName || 'Unnamed Project');
      setWorkMessages([
        { role: 'assistant', content: `Hello! I'm your Project Chat Assistant for "${location.state.projectName}".` }
      ]);
    }
  }, [location.state]);

  // ✅ Check screen size
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 768);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // ✅ Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // ✅ Auto-scroll to bottom on message update
  useEffect(() => {
    if (chatContainerRef.current) {
      const chatContainer = chatContainerRef.current;
      const scrollHeight = chatContainer.scrollHeight;
      const clientHeight = chatContainer.clientHeight;
      if (scrollHeight > clientHeight) {
        setTimeout(() => {
          chatContainer.scrollTo({ top: scrollHeight, behavior: 'smooth' });
        }, 100);
      }
    }
  }, [workMessages]);

  // ✅ Storage keys
  const storageKey = projectId !== 'Default' ? `chatHistory_project_${projectId}` : 'chatHistory_work_chat';
  const unifiedStorageKey = userEmail ? `unified_chatHistory_${userEmail}` : 'unified_chatHistory_guest';

  // ✅ Save chat history
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(chatHistory));
    }
  }, [chatHistory, storageKey]);

  // ✅ Sync unified history to localStorage
  useEffect(() => {
    try {
      const existingUnifiedRaw = localStorage.getItem(unifiedStorageKey);
      const existingUnified = existingUnifiedRaw ? JSON.parse(existingUnifiedRaw) : [];
      const mapById = new Map();
      if (Array.isArray(existingUnified)) {
        for (const item of existingUnified) if (item?.id != null) mapById.set(item.id, item);
      }
      if (Array.isArray(chatHistory)) {
        for (const item of chatHistory) if (item?.id != null) mapById.set(item.id, item);
      }
      const merged = Array.from(mapById.values());
      localStorage.setItem(unifiedStorageKey, JSON.stringify(merged));
      if (chatHistory.length > 0) window.dispatchEvent(new Event('unifiedChatHistoryUpdated'));
    } catch (e) {
      console.error('Failed to sync unified chat history:', e);
    }
  }, [chatHistory, unifiedStorageKey]);

  // ✅ Restore history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setChatHistory(parsed);
      } catch (e) {
        console.error("Failed to parse project chat history", e);
      }
    }
  }, [storageKey, projectId]);

  // ✅ Restore unified history after login
  useEffect(() => {
    if (userEmail) {
      const unifiedRaw = localStorage.getItem(unifiedStorageKey);
      if (unifiedRaw) {
        try {
          const unifiedParsed = JSON.parse(unifiedRaw);
          if (Array.isArray(unifiedParsed)) setChatHistory(unifiedParsed);
        } catch (e) {
          console.error("Failed to restore unified chat history", e);
        }
      }
    }
  }, [userEmail, unifiedStorageKey]);

  // ✅ Backend session setup (only if no project is passed from dashboard)
  useEffect(() => {
    if (location.state?.projectId) return; // ✅ skip if project came from Dashboard
    const setSession = async () => {
      if (!userEmail) return;
      try {
        await fetch("http://localhost:8000/set_session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: userEmail, name: userName })
        });
        const projectResponse = await fetch("http://localhost:8000/get_user_project", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: userEmail })
        });
        if (projectResponse.ok) {
          const projectData = await projectResponse.json();
          if (projectData.project_id) {
            const newProjectId = projectData.project_id;
            const newProjectName = projectData.project_name || 'Unknown Project';
            setProjectId(newProjectId);
            setProjectName(newProjectName);
            setProjectInfo(projectData.full_project_info || null);
            setWorkMessages([{ role: 'assistant', content: `Hello! I'm your Project Chat Assistant for "${newProjectName}".` }]);
            setSessionActive(false);
            setCurrentSessionId(null);
          }
        }
      } catch (error) {
        console.error("❌ Failed to set session:", error);
      }
    };
    setSession();
  }, [userEmail, userName, location.state]);

  // ✅ Send message & save session with project info
  const sendMessage = async () => {
    if (inputText.trim() === '') return;
    const newMessage = { role: 'user', content: inputText };
    const newMessages = [...workMessages, newMessage];
    setWorkMessages(newMessages);
    setInputText('');
    setSessionActive(true);
    if (!currentSessionId) {
      const sessionId = Date.now();
      setCurrentSessionId(sessionId);
    }
    setIsTyping(true);
    try {
      const response = await fetch("http://localhost:8000/chat/work", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message: inputText,
          chat_type: 'project',
          project_id: projectId
        }),
      });
      const data = await response.json();
      const botReply = { role: 'assistant', content: data.reply || "⚠️ No reply from server" };
      setIsTyping(false);
      setWorkMessages(prev => [...prev, botReply]);
      if (!sessionActive) {
        setChatHistory(prev => [
          ...prev,
          { 
            id: currentSessionId || Date.now(), 
            sessionId: currentSessionId || Date.now(),
            chatType: 'project',
            projectId: projectId,
            projectName: projectName,
            summary: inputText, 
            fullChat: [...workMessages, newMessage, botReply],
            timestamp: new Date().toISOString(),
            sessionName: `${projectName} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
          },
        ]);
      } else {
        setChatHistory(prev =>
          prev.map(chat =>
            chat.sessionId === currentSessionId
              ? { 
                  ...chat, 
                  fullChat: [...workMessages, newMessage, botReply],
                  timestamp: new Date().toISOString(),
                  messageCount: (chat.fullChat?.length || 0) + 2
                } 
              : chat
          )
        );
      }
    } catch (error) {
      console.error("❌ Chat request failed:", error);
      setIsTyping(false);
      setWorkMessages(prev => [...prev, { role: 'assistant', content: 'Error connecting to chatbot.' }]);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') sendMessage(); };

  const handleHistoryClick = (chat) => { 
    setWorkMessages(chat.fullChat); 
    setCurrentSessionId(chat.sessionId); 
    setSessionActive(true);
    setProjectId(chat.projectId || 'Default');
    setProjectName(chat.projectName || 'Default Project');
  };

  const handleHistoryDelete = (id) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== id));
    try {
      const existingUnifiedRaw = localStorage.getItem(unifiedStorageKey);
      const existingUnified = existingUnifiedRaw ? JSON.parse(existingUnifiedRaw) : [];
      if (Array.isArray(existingUnified)) {
        const updatedUnified = existingUnified.filter(chat => chat && chat.id !== id);
        localStorage.setItem(unifiedStorageKey, JSON.stringify(updatedUnified));
      }
      const existingProjectRaw = localStorage.getItem(storageKey);
      const existingProject = existingProjectRaw ? JSON.parse(existingProjectRaw) : [];
      if (Array.isArray(existingProject)) {
        const updatedProject = existingProject.filter(chat => chat && chat.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(updatedProject));
      }
    } catch (e) {
      console.error('Failed to remove from unified chat history:', e);
    }
  };

  return (
    <div className="work-layout">
      {/* Main Chat Area */}
      <div className={`work-container${historyOpen ? ' with-history' : ' full-width'}`}>
        <Card className="work-card">
          <Card.Header className="d-flex align-items-center">
            <FaComments className="me-2" /> 
            <span>Project Chat</span>
          </Card.Header>

          <div className="work-banner">
            <strong>{projectName}</strong>
            <span style={{ marginLeft: '10px', opacity: 0.8 }}>
              Project ID: {projectId}
            </span>
          </div>

          <Card.Body className="work-history" ref={chatContainerRef}>
            {workMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`work-bubble ${msg.role}`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {msg.content}
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </Card.Body>

          <Card.Footer>
            <div className="work-input-area">
              <div className="input-wrapper">
                <button className="attach-btn"><FaPaperclip /></button>
                <input
                  type="text"
                  placeholder="Ask project-related questions..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className="send-btn" onClick={sendMessage} aria-label="Send message" title="Send">
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </Card.Footer>
        </Card>
      </div>

      {/* History Panel */}
      <div className={`work-history-panel${historyOpen ? '' : ' closed'}`}>
        <div className="work-panel-header">
          <h3>Project Chat History</h3>
        </div>
        <div className="work-history-list">
          {chatHistory.length === 0 ? (
            <p className="empty-history">No previous sessions</p>
          ) : (
            chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`work-history-item${workMessages === chat.fullChat ? ' selected' : ''}`}
                onClick={() => handleHistoryClick(chat)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div className="work-history-type-badge">{chat.projectName || 'Project'}</div>
                    <button
                      className="work-history-delete-btn"
                      onClick={e => { e.stopPropagation(); handleHistoryDelete(chat.id); }}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="work-history-session-name">
                    {chat.sessionName || `Session ${new Date(chat.timestamp).toLocaleDateString()}`}
                  </div>
                  {chat.projectId && chat.projectId !== 'Default' && (
                    <div className="work-history-id">ID: {chat.projectId}</div>
                  )}
                  <span className="work-history-summary">{chat.summary}</span>
                  <div className="work-history-meta">
                    {chat.messageCount && (
                      <small className="work-history-count">{chat.messageCount} messages</small>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* History Toggle Button */}
      <button className="work-history-toggle-btn" onClick={() => setHistoryOpen(prev => !prev)}>
        {historyOpen ? '→' : '←'}
      </button>
    </div>
  );
};

export default WorkChat;
