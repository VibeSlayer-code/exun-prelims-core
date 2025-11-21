import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileModal from "../components/ProfileModal";
import "./Knowledge.css";

function Knowledge() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [userName, setUserName] = useState("");

  const [placeholder, setPlaceholder] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const randomQueries = [
    "Calculate caloric needs for a 1.5cm human",
    "Is spider silk strong enough for climbing gear?",
    "How to purify a water droplet using charcoal?",
    "List of household chemicals fatal at micro-scale",
    "Structural integrity of cardboard for shelter"
  ];

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("login") === "true";
    setIsLoggedIn(loggedInStatus);
    if (loggedInStatus) {
      setUserImage(localStorage.getItem("userImage"));
      setUserName(localStorage.getItem("userName") || "Operative");
    }

    const name = localStorage.getItem("userName") || "Operative";
    const fullText = `System Online. Welcome, ${name}.`;
    let index = 0;
    setDisplayedText("");

    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(prev => fullText.slice(0, prev.length + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => setShowCursor(false), 1000);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * randomQueries.length);
      setPlaceholder(randomQueries[randomIndex]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSignOut = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.reload();
  };

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    const userMessage = {
      role: "user",
      content: searchQuery,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const response = await fetch("/api/agent_search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery })
      });

      const data = await response.json();

      if (data.response) {
        const aiMessage = {
          role: "ai",
          content: data.response,
          sources: data.sources,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      const errorMessage = {
        role: "ai",
        content: `[SYSTEM ERROR]: Connection to Intelligence Layer failed.`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = timestamp => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="knowledge-page">

      <nav className="navigation-bar">
        <div className="brand-section">
          <div className="brand-icon">
            <img src="assets/Global/logo.png" alt="Nixun Logo" />
          </div>
          <div className="brand-name">Nixun</div>
        </div>

        <div className="navigation-menu-container">
          <ul className="navigation-menu">
            <li><Link to="/" className="navigation-link">Home</Link></li>
            <li><span className="navigation-separator">/</span></li>
            <li><Link to="/services" className="navigation-link">Jobs</Link></li>
            <li><span className="navigation-separator">/</span></li>
            <li><Link to="/search" className="navigation-link">Search</Link></li>
            <li><span className="navigation-separator">/</span></li>
            <li><Link to="/map" className="navigation-link">3d Map</Link></li>
            <li><span className="navigation-separator">/</span></li>
            <li><Link to="/library" className="navigation-link active">Library</Link></li>
          </ul>
        </div>

        {!isLoggedIn ? (
          <button className="login-button" onClick={() => navigate("/login")}>
            LOG IN
          </button>
        ) : (
          <div className="profile-pill" onClick={() => setIsProfileModalOpen(true)}>
            <div className="profile-data">
              <img
                src={userImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                alt="User"
                className="nav-profile-img"
              />
              <span className="nav-username">Hi, {userName}</span>
            </div>
            <button className="mini-signout-btn" onClick={e => { e.stopPropagation(); handleSignOut(); }}>
              ✕
            </button>
          </div>
        )}
      </nav>

      <div className="k-container">
        <div className="k-main-centered">

          <div className="chat-scroll-area">
            {messages.length === 0 && (
              <div className="empty-state">
                <h1>
                  {displayedText}
                  {showCursor && <span className="typing-cursor">|</span>}
                </h1>
                <p>MICRO-SCALE ANALYSIS ENGINE.</p>

                <div className="suggestions">
                  {randomQueries.slice(0, 3).map((q, i) => (
                    <button key={i} className="suggestion-btn" onClick={() => handleSearch(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`message-row ${msg.role}`}>
                <div className="msg-timestamp">{formatTimestamp(msg.timestamp)}</div>
                <div className="msg-bubble">
                  {msg.content.split("\n").map((line, l) => (
                    <p key={l}>{line}</p>
                  ))}

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="sources-grid">
                      {msg.sources.map((src, idx) => (
                        <a key={idx} href={src.url} target="_blank" rel="noreferrer" className="source-chip">
                          <div className="src-icon-box">
                            {src.type === "wiki" ? "W" : "🌐"}
                          </div>
                          <div className="src-info">
                            <span className="src-title">{src.title}</span>
                            <span className="src-url">{new URL(src.url).hostname}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-row ai">
                <div className="msg-bubble loading-state">
                  <div className="loading-animation">
                    <img src="/assets/Global/logo.png" alt="Loading" className="spinning-logo" />
                    <span className="loading-text">Analyzing Surface Data...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="input-wrapper">
            <div className="input-box">
              <input
                type="text"
                placeholder={placeholder || "Enter Query..."}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                disabled={loading}
              />
              <button onClick={() => handleSearch()} disabled={loading}>
                ➤
              </button>
            </div>
          </div>

        </div>
      </div>

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
}

export default Knowledge;
