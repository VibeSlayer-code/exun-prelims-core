import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Search.css";

function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConvId, setCurrentConvId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [copiedMessages, setCopiedMessages] = useState(new Set());
  const [placeholder, setPlaceholder] = useState("");
  const [isChangingPlaceholder, setIsChangingPlaceholder] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const API_KEY = "AIzaSyD8AEu0nUoyAlrBnqXoniZFcRlk9XOl_3o";
  const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

  const randomQueries = [
    "What's the lethal dose of caffeine for a 1cm human?",
    "How to perform CPR on someone 0.4 inches tall?",
    "Emergency tracheotomy procedure at micro scale",
    "Blood transfusion volume for 0.1g body mass",
    "Treating hypothermia in miniaturized humans",
    "Antibiotic dosage calculation for tiny beings",
    "Fracture treatment when bones are hair-thin",
    "Defibrillation voltage for 1cm cardiac arrest",
    "Anesthesia protocols for micro-surgery",
    "Fluid replacement therapy at nano-volumes",
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("login") === "true";
    setIsLoggedIn(loggedInStatus);
    if (loggedInStatus) {
      setUserImage(localStorage.getItem("userImage"));
      setUserName(localStorage.getItem("userName") || "Agent");
    }

    const savedConversations = localStorage.getItem("conversations");
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      const fullText = `${getGreeting()}, ${userName || "etinuxE"}.`;
      let index = 0;
      setDisplayedText("");
      setShowCursor(true);

      const typingInterval = setInterval(() => {
        if (index < fullText.length) {
          setDisplayedText(fullText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => setShowCursor(false), 500);
        }
      }, 50);

      return () => clearInterval(typingInterval);
    }
  }, [messages.length, userName]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsChangingPlaceholder(true);
      const randomIndex = Math.floor(Math.random() * randomQueries.length);
      setPlaceholder(randomQueries[randomIndex]);
      setTimeout(() => {
        setIsChangingPlaceholder(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSignOut = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.reload();
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const saveConversation = (convId, newMessages) => {
    const updatedConversations = [...conversations];
    const existingIndex = updatedConversations.findIndex(
      (c) => c.id === convId
    );

    const conversationData = {
      id: convId,
      title: newMessages[0]?.content.substring(0, 50) || "New Conversation",
      messages: newMessages,
      timestamp: Date.now(),
    };

    if (existingIndex >= 0) {
      updatedConversations[existingIndex] = conversationData;
    } else {
      updatedConversations.unshift(conversationData);
    }

    const limitedConversations = updatedConversations.slice(0, 20);
    setConversations(limitedConversations);
    localStorage.setItem("conversations", JSON.stringify(limitedConversations));
  };

  const copyToClipboard = async (text, messageTimestamp) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessages((prev) => new Set([...prev, messageTimestamp]));
      setTimeout(() => {
        setCopiedMessages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(messageTimestamp);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    const convId = currentConvId || Date.now().toString();
    if (!currentConvId) setCurrentConvId(convId);

    const userMessage = {
      role: "user",
      content: searchQuery,
      timestamp: Date.now(),
      image: imagePreview,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setQuery("");
    setLoading(true);

    //this is the image sending logic
    let imagePart = null;
    if (imagePreview) {
      const base64Data = imagePreview.split(",")[1];
      const mimeType = selectedImage?.type || "image/jpeg";
      imagePart = {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      };
    }

    clearImage();

    const systemPrompt = `Dr. Tai Ni, a world-class researcher and acclaimed innovator from Nuxeland, stood at the forefront of miniature sciences. With his latest ventures and discoveries in shrinking the human body, his work was sensational — yet not a sensation to which the public paid much heed. All his lab rats were successfully shrunk, almost invisibly small. His brother, Fhu, called his discovery a failure; Dr. Ni called it proof — proof that required closer inspection, something that most were not willing to offer. The public outrage forced Ni to go underground; his notes remain the only remnants of his findings.

In the catacombs beneath Nuxeland, Ni's former test subjects formed a network of reformists called etinuxE. Their greatest achievement? The ability to shrink people.

You are helping the etinuXe community - humans shrunk to 1cm tall.

IMPORTANT: Provide long, detailed answers which are clear not just general guidelines but really specific based on research studies(USE online and research studies in your database) (13-15 sentences max). Use plain text only - NO markdown formatting like ** for bold or ## for headers.

Convert this query from human to tiny human scale (1cm, ~0.1g body mass):`;

    const considerText = `

Consider:
- Dosage calculations (scale by body mass)
- Equipment adaptations
- Safety considerations
- Metabolic changes
- it should be medically accurate and impressive

Keep your response brief and practical.`;

    let parts = [
      { text: systemPrompt },
      { text: searchQuery },
      { text: considerText },
    ];
    if (imagePart) {
      parts.splice(2, 0, imagePart);
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: parts,
            },
          ],
        }),
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0].content) {
        const answer = data.candidates[0].content.parts[0].text;
        const aiMessage = {
          role: "ai",
          content: answer,
          timestamp: Date.now(),
        };
        const finalMessages = [...newMessages, aiMessage];
        setMessages(finalMessages);
        saveConversation(convId, finalMessages);
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      const errorMessage = {
        role: "ai",
        content: `Error: ${error.message}`,
        timestamp: Date.now(),
      };
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      saveConversation(convId, finalMessages);
    } finally {
      setLoading(false);
    }
  };

  const handleNewQuery = () => {
    setMessages([]);
    setQuery("");
    setCurrentConvId(null);
    clearImage();
    setCopiedMessages(new Set());
  };

  const handleRandomQuery = () => {
    const randomQuery =
      randomQueries[Math.floor(Math.random() * randomQueries.length)];
    setQuery(randomQuery);
  };

  const loadConversation = (conv) => {
    setMessages(conv.messages);
    setCurrentConvId(conv.id);
    setCopiedMessages(new Set());
  };

  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderGreeting = () => {
    const greeting = getGreeting();
    const name = userName || "etinuxE";
    const comma = ", ";
    const period = ".";
    
    if (displayedText.length === 0) return null;
    
    const greetingEnd = greeting.length;
    const commaEnd = greetingEnd + comma.length;
    const nameEnd = commaEnd + name.length;
    const periodEnd = nameEnd + period.length;
    
    const greetingPart = displayedText.substring(0, Math.min(displayedText.length, greetingEnd));
    const commaPart = displayedText.length > greetingEnd ? displayedText.substring(greetingEnd, Math.min(displayedText.length, commaEnd)) : "";
    const namePart = displayedText.length > commaEnd ? displayedText.substring(commaEnd, Math.min(displayedText.length, nameEnd)) : "";
    const periodPart = displayedText.length > nameEnd ? displayedText.substring(nameEnd, Math.min(displayedText.length, periodEnd)) : "";
    
    return (
      <>
        {greetingPart}
        {commaPart}
        {namePart && <span className="highlight">{namePart}</span>}
        {periodPart}
        {showCursor && <span className="typing-cursor"></span>}
      </>
    );
  };

  const suggestionCards = [
    "How do I perform heart surgery on a tiny human?",
    "Calculate ibuprofen dosage for a 0.03 feet tall man.",
    "What are the effects caused by long-term miniaturization?",
  ];

  const CopyIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );

  const CheckIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );

  return (
    <div className="search-page">
      <nav className="navigation-bar">
        <div className="nixun-section">
          <div className="nixun-icon">
            <img src="/assets/Global/logo.png" alt="Nixun Logo" />
          </div>
          <div className="nixun-name">Nixun</div>
        </div>

        <div className="navigation-menu-container">
          <ul className="navigation-menu">
            <li>
              <Link to="/" className="navigation-link">
                Home
              </Link>
            </li>
            <li>
              <span className="navigation-separator">/</span>
            </li>
            <li>
              <Link to="/services" className="navigation-link">
                Jobs
              </Link>
            </li>
            <li>
              <span className="navigation-separator">/</span>
            </li>
            <li>
              <Link to="/search" className="navigation-link active">
                Search
              </Link>
            </li>
            <li>
              <span className="navigation-separator">/</span>
            </li>
            <li>
              <Link to="/map" className="navigation-link">
                3d Map
              </Link>
            </li>
            <li>
              <span className="navigation-separator">/</span>
            </li>
            <li>
              <Link to="/library" className="navigation-link">
                Library
              </Link>
            </li>
          </ul>
        </div>

        {!isLoggedIn ? (
          <button className="login-button" onClick={() => navigate("/login")}>
            LOG IN
          </button>
        ) : (
          <div className="profile-pill">
            <div className="profile-data">
              <img
                src={
                  userImage ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                }
                alt="User"
                className="nav-profile-img"
              />
              <span className="nav-username">Hi, {userName}</span>
            </div>
            <button
              className="mini-signout-btn"
              onClick={handleSignOut}
              title="Sign Out"
            >
              ✕
            </button>
          </div>
        )}
      </nav>

      <div className="content-card">
        <div className="sidebar">
          <div className="sidebar-card">
            <button className="new-query-btn" onClick={handleNewQuery}>
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8.5" cy="8.5" r="8.5" fill="#8654D8" />
                <path
                  d="M3.83872 9.0408V7.88167H13.3097V9.0408H3.83872ZM7.99462 13.0742V3.83885H9.14433V13.0742H7.99462Z"
                  fill="white"
                  fillOpacity="0.58"
                />
              </svg>
              New Query
            </button>

            <button className="query-option">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              </svg>
              Dr. Tai Ni's Digitized Notes
            </button>

            <button className="query-option" onClick={handleRandomQuery}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="12" x2="2" y2="12"></line>
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
              </svg>
              Create Random Query
            </button>
          </div>

          <div className="sidebar-card">
            <div className="recents-title">Recents</div>
            {conversations.length === 0 ? (
              <div className="recent-item empty">No conversations yet</div>
            ) : (
              conversations.map((conv, index) => (
                <div
                  key={index}
                  className={`recent-item ${
                    currentConvId === conv.id ? "active" : ""
                  }`}
                  onClick={() => loadConversation(conv)}
                >
                  {conv.title}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="main-content">
          <div className="chat-area">
            {messages.length === 0 ? (
              <>
                <div className="greeting">
                  <h1>{renderGreeting()}</h1>
                  <p>converting medical research to the scale of 1cm beings</p>
                </div>

                <div className="suggestion-cards">
                  {suggestionCards.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-card"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <p>{suggestion}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="messages-container">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message-wrapper ${message.role}`}
                  >
                    <div className="message-time">
                      {formatTimestamp(message.timestamp)}
                    </div>
                    <div className="message-bubble">
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Uploaded"
                          className="message-image"
                        />
                      )}
                      <div className="message-text">
                        {message.content}
                        {message.role === "ai" && (
                          <button
                            className="copy-btn"
                            onClick={() =>
                              copyToClipboard(
                                message.content,
                                message.timestamp
                              )
                            }
                          >
                            {copiedMessages.has(message.timestamp) ? (
                              <CheckIcon />
                            ) : (
                              <CopyIcon />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="message-wrapper ai">
                    <div className="message-time">now</div>
                    <div className="message-bubble loading">
                      <div className="loading-animation">
                        <img
                          src="/assets/Global/logo.png"
                          alt="Nixun Logo"
                          className="spinning-logo"
                          style={{ width: "20px", height: "20px" }}
                        />
                        <span
                          className="loading-text"
                          style={{ fontSize: "14px" }}
                        >
                          Creating Your Response
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="input-section">
            {imagePreview && (
              <div className="image-preview-container">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                />
                <button className="remove-image" onClick={clearImage}>
                  ✕
                </button>
              </div>
            )}
            <div className="input-container">
              <div
                className={`input-box ${
                  isChangingPlaceholder ? "changing-placeholder" : ""
                }`}
              >
                <div className="input-icons">
                  <button
                    className="icon-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                    </svg>
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <circle cx="9" cy="9" r="2"></circle>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                    </svg>
                  </button>
                  <button className="icon-btn">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"></path>
                    </svg>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder={
                    placeholder || "Ask any medical or survival questions..."
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <button
                  className="send-btn"
                  onClick={() => handleSearch()}
                  disabled={loading || !query.trim()}
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
