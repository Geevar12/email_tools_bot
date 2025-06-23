import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

// Chatbot component, receives mode as prop
function Chatbot({ mode }) {
  const navigate = useNavigate();
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState([
    { sender: 'bot', text: mode === 'spam'
      ? 'You are now in Spam Detection mode. Enter an email subject to check if it is spam.'
      : 'You are now in Summarization mode. Paste your email content to get a summary.'
    }
  ]);
  const [loading, setLoading] = React.useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);

    try {
      let response, data, botMsg;
      if (mode === 'spam') {
        response = await fetch('http://localhost:5000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: input })
        });
        data = await response.json();
        botMsg = data.prediction
          ? { sender: 'bot', text: `Result: ${data.prediction}` }
          : { sender: 'bot', text: 'Sorry, there was an error.' };
      } else {
        response = await fetch('http://localhost:5000/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: input })
        });
        data = await response.json();
        botMsg = data.summary
          ? { sender: 'bot', text: `Summary: ${data.summary}` }
          : { sender: 'bot', text: 'Sorry, there was an error.' };
      }
      setMessages((msgs) => [...msgs, botMsg]);
    } catch (e) {
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Sorry, there was an error connecting to the server.' }]);
    }
    setInput('');
    setLoading(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>Email Tools Chatbot</h2>
        <button className="return-btn" onClick={() => navigate('/')}>Return</button>
      </div>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="chat-message bot">Thinking...</div>}
      </div>
      <div className="chat-input-row">
        <textarea
          className="chat-input"
          placeholder={mode === 'spam'
            ? 'Type an email subject...'
            : 'Paste your email content...'}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          rows={mode === 'spam' ? 1 : 3}
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}

// Home page with two options
function Home() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <h2>Email Tools Suite</h2>
      <div className="landing-description">
        Welcome to the Email Tools Suite – your one-stop solution for smarter email management.<br />
        Instantly detect spam or summarize lengthy emails with AI-powered precision.<br />
        Choose a service below to get started.
      </div>
      <div className="landing-options">
        <div className="landing-option-card" onClick={() => navigate('/chatbot/spam')}>
          <div className="landing-option-title">Spam Detector</div>
          <div className="landing-option-desc">
            Check if an email subject is spam or safe in seconds.<br />
            Fast, accurate, and privacy-friendly.
          </div>
          <button>Try Spam Detector</button>
        </div>
        <div className="landing-option-card" onClick={() => navigate('/chatbot/summarize')}>
          <div className="landing-option-title">Summarizer</div>
          <div className="landing-option-desc">
            Paste your email content and get a concise summary.<br />
            Save time and focus on what matters.
          </div>
          <button>Try Summarizer</button>
        </div>
      </div>
    </div>
  );
}

// Wrapper to extract mode from URL and pass as prop
function ChatbotRouteWrapper() {
  const { pathname } = useLocation();
  const mode = pathname.endsWith('/summarize') ? 'summarize' : 'spam';
  return <Chatbot mode={mode} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatbot/:mode" element={<ChatbotRouteWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;
