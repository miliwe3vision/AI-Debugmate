import React, { useRef, useEffect, useState, useContext } from 'react';
import { Card } from 'react-bootstrap';
import { FaComments, FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import './DualChatbot.css';
import { MyContext } from '../../App';

const DualChatbot = () => {
  const [generalMessages, setGeneralMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your Dual Chat Assistant. I can help you with both general development questions and project-specific guidance. How can I assist you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const chatEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const context = useContext(MyContext);
  const userEmail = context.userEmail;
  const userName = context.userName || "User";
// Responsive design: detect mobile screen
useEffect(() => {
  const checkScreenSize = () => {
    const mobile = window.innerWidth <= 768;
    setIsMobile(mobile);
    if (mobile) {
      setHistoryOpen(false); // 👈 start closed on mobile
    } else {
      setHistoryOpen(true); // 👈 keep open on desktop
    }
  };
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  return () => window.removeEventListener('resize', checkScreenSize);
}, []);

  // Responsive design: detect mobile screen
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Use unified localStorage key for chat history shared with WorkChat
  const storageKey = userEmail ? `unified_chatHistory_${userEmail}` : 'unified_chatHistory_guest';

  // Load unified chat history from storageKey
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setChatHistory(parsed);
          console.log('🔄 Unified chat history loaded:', parsed.length, 'items');
        }
      } catch (e) {
        console.error('Failed to parse unified chat history:', e);
      }
    }
  }, [storageKey]);

  // Save chat history to localStorage on changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(chatHistory));
      console.log('💾 Unified chat history saved:', storageKey, chatHistory.length, 'items');
    }
  }, [chatHistory, storageKey]);

  // Listen for unified history updates from other components/tabs and refresh
  useEffect(() => {
    const refreshUnifiedHistory = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setChatHistory(parsed);
            console.log('🔄 Unified chat history refreshed via event:', parsed.length, 'items');
          }
        }
      } catch (e) {
        console.error('Failed to refresh unified chat history:', e);
      }
    };

    window.addEventListener('unifiedChatHistoryUpdated', refreshUnifiedHistory);
    window.addEventListener('storage', (e) => {
      if (e && e.key === storageKey) refreshUnifiedHistory();
    });

    return () => {
      window.removeEventListener('unifiedChatHistoryUpdated', refreshUnifiedHistory);
    };
  }, [storageKey]);

  // Set session on mount
  useEffect(() => {
    const setSession = async () => {
      if (!userEmail) return;
      try {
        await fetch('http://localhost:8000/set_session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email: userEmail, name: userName }),
        });
        console.log('✅ Session set for Dual Chatbot');
      } catch (error) {
        console.error('❌ Failed to set session:', error);
      }
    };
    setSession();
  }, [userEmail, userName]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    const chatBox = document.getElementById("chatBox");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [generalMessages]);

  // Send message logic
  const sendMessage = async () => {
    if (inputText.trim() === '') return;
    const newMessage = { role: 'user', content: inputText };
    const newMessages = [...generalMessages, newMessage];
    setGeneralMessages(newMessages);
    setInputText('');
    setSessionActive(true);

    if (!currentSessionId) {
      const sessionId = Date.now();
      setCurrentSessionId(sessionId);
    }

    try {
      setIsTyping(true);
      const response = await fetch('http://localhost:8000/chat/dual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: inputText, chat_type: 'general', project_id: 'general' }),
      });
      const data = await response.json();
      const botReply = { role: 'assistant', content: data.reply || '⚠️ No reply from server' };
      setIsTyping(false);
      setGeneralMessages(prev => [...prev, botReply]);

      const sessionName = `Session ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

      if (!sessionActive) {
        setChatHistory(prev => [
          ...prev,
          {
            id: currentSessionId || Date.now(),
            sessionId: currentSessionId || Date.now(),
            chatType: 'dual',
            summary: inputText,
            fullChat: [...generalMessages, newMessage, botReply],
            timestamp: new Date().toISOString(),
            sessionName: sessionName,
            messageCount: (generalMessages.length || 0) + 2,
          },
        ]);
      } else {
        setChatHistory(prev =>
          prev.map(chat =>
            chat.sessionId === currentSessionId
              ? {
                  ...chat,
                  fullChat: [...generalMessages, newMessage, botReply],
                  timestamp: new Date().toISOString(),
                  messageCount: (chat.fullChat?.length || 0) + 2,
                }
              : chat
          )
        );
      }
    } catch (error) {
      console.error('❌ Chat request failed:', error);
      setIsTyping(false);
      const errorMessage = { role: 'assistant', content: 'Error connecting to chatbot.' };
      setGeneralMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const clearChat = () => {
    setGeneralMessages([
      { role: 'assistant', content: "Hello! I'm your Dual Chat Assistant. I can help you with both general development questions and project-specific guidance. How can I assist you today?" },
    ]);
    setSessionActive(false);
    setCurrentSessionId(null);
  };

  const handleNewChat = () => {
    clearChat();
  };

  const handleHistoryClick = (chat) => {
    setGeneralMessages(chat.fullChat);
    setCurrentSessionId(chat.sessionId);
    setSessionActive(true);
  };

  const handleHistoryDelete = (id) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== id));
  };

  return (
    <div className={`dual-layout${!context.istheme ? ' dark-mode' : ''}`}>
      {/* Main Chat Area */}
      <div className={`dual-container${historyOpen ? ' with-history' : ' full-width'}`}>
        <Card className="dual-card">
          <Card.Header className="d-flex align-items-center">
            <FaComments className="me-2" />
            <span>Dual Chat Assistant</span>
          </Card.Header>

          <div className="dual-banner" style={{
            background: 'linear-gradient(135deg, #A80C4C, #090939, #421256, #531C9B)',
            color: 'white',
            padding: '12px 20px',
            fontSize: '14px',
          }}>
            <strong>Dual Chat Assistant</strong>
            <span style={{ marginLeft: '10px', opacity: 0.8 }}>
              General development questions and project-specific guidance
            </span>
          </div>

          <Card.Body className="dual-history" id="chatBox">
            {generalMessages.map((msg, idx) => (
              <div key={idx} className={`dual-bubble ${msg.role}`}>
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
            <div className="dual-input-area">
              <div className="input-wrapper">
                <button className="attach-btn"><FaPaperclip /></button>
                <input
                  type="text"
                  placeholder="Ask development questions..."
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
      <div className={`dual-history-panel${historyOpen ? '' : ' closed'}`}>
        <div className="dual-panel-header">
          <h3>Dual Chat History</h3>
        </div>
        <div className="dual-history-list">
          {chatHistory.length === 0 ? (
            <p style={{ color: '#888', fontStyle: 'italic' }}>No previous sessions</p>
          ) : (
            chatHistory.map(chat => (
              <div
                key={chat.id}
                className={`dual-history-item${generalMessages === chat.fullChat ? ' selected' : ''}`}
                onClick={() => handleHistoryClick(chat)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div className="dual-history-type-badge">{chat.projectName || 'Session'}</div>
                    <button
                      className="dual-history-delete-btn"
                      onClick={e => { e.stopPropagation(); handleHistoryDelete(chat.id); }}
                      style={{ marginLeft: '8px', marginTop: '-6px' }}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="dual-history-session-name">{chat.sessionName || `Session ${new Date(chat.timestamp).toLocaleDateString()}`}</div>
                  <span className="dual-history-summary">{chat.summary}</span>
                  <div className="dual-history-meta">
                    {chat.messageCount && (
                      <small style={{ display: 'inline-block', color: '#666', fontSize: '10px', marginRight: '10px' }}>
                        {chat.messageCount} messages
                      </small>
                    )}
                    <small style={{ color: '#666', fontSize: '10px' }}>
                      {new Date(chat.timestamp).toLocaleString()}
                    </small>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* History Toggle Button */}
      <button
        className="dual-history-toggle-btn"
        onClick={() => setHistoryOpen(prev => !prev)}
        style={{
          position: 'fixed',
          right: '3px',
          top: '12%',
          transform: 'translateY(-50%)',
          width: '44px',
          height: '44px',
          background: 'linear-gradient(135deg, #A80C4C, #090939, #421256, #531C9B)',
          color: 'white',
          border: '1px solid rgba(83, 28, 155, 0.3)',
          borderRadius: '50%',
          boxShadow: '0 4px 12px rgba(83, 28, 155, 0.3)',
          cursor: 'pointer',
          zIndex: '1000',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontSize: '16px',
          fontWeight: '600',
        }}
      >
        {historyOpen ? '→' : '←'}
      </button>
    </div>
  );
};

export default DualChatbot;
