import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Knowledge.css';

function Knowledge() {
  const [activeTab, setActiveTab] = useState('insects');
  const [languageChat, setLanguageChat] = useState([]);
  const [notesChat, setNotesChat] = useState([]);
  const [languageInput, setLanguageInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [langLoading, setLangLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);

  const API_KEY = 'AIzaSyBYzf144EVp8crCUPfLZ_q5AJqMGWocesM';
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  const switchTab = (tabName) => {
    setActiveTab(tabName);
  };

  const callGemini = async (prompt) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': API_KEY
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      }
      throw new Error('Invalid response');
    } catch (error) {
      return `Error: ${error.message}`;
    }
  };

  const sendLanguageQuery = async () => {
    if (!languageInput.trim()) return;

    setLangLoading(true);
    setLanguageChat([...languageChat, { type: 'user', text: languageInput }]);

    const prompt = `Dr. Tai Ni, a world-class researcher and acclaimed innovator from Nuxeland, stood at the forefront of miniature sciences. With his latest ventures and discoveries in shrinking the human body, his work was sensational — yet not a sensation to which the public paid much heed. All his lab rats were successfully shrunk, almost invisibly small. His brother, Fhu, called his discovery a failure; Dr. Ni called it proof — proof that required closer inspection, something that most were not willing to offer. The public outrage forced Ni to go underground; his notes remain the only remnants of his findings.


In the catacombs beneath Nuxeland, Ni's former test subjects formed a network of reformists called etinuxE. Their greatest achievement? The ability to shrink people.


Their purpose is ambiguous — what do they aim to accomplish? Are they attempting to use shrinking technology to escape some crisis, looking to make a quick buck, or do they see this as the next step in humanity's evolution?

You are an expert in insect communication for etinuXe (tiny humans at 1cm).

IMPORTANT: Give short answers (3-5 sentences max). Use plain text only - NO markdown formatting like ** or ##.

Explain how to communicate with insects through pheromones, vibrations, and body language.

Question: ${languageInput}

Keep your response brief and practical.`;

    const answer = await callGemini(prompt);
    setLanguageChat(prev => [...prev, { type: 'assistant', text: answer }]);
    setLanguageInput('');
    setLangLoading(false);
  };

  const searchNotes = async () => {
    if (!notesInput.trim()) return;

    setNotesLoading(true);
    setNotesChat([...notesChat, { type: 'user', text: notesInput }]);

    const prompt = `Dr. Tai Ni, a world-class researcher and acclaimed innovator from Nuxeland, stood at the forefront of miniature sciences. With his latest ventures and discoveries in shrinking the human body, his work was sensational — yet not a sensation to which the public paid much heed. All his lab rats were successfully shrunk, almost invisibly small. His brother, Fhu, called his discovery a failure; Dr. Ni called it proof — proof that required closer inspection, something that most were not willing to offer. The public outrage forced Ni to go underground; his notes remain the only remnants of his findings.


In the catacombs beneath Nuxeland, Ni's former test subjects formed a network of reformists called etinuxE. Their greatest achievement? The ability to shrink people.


Their purpose is ambiguous — what do they aim to accomplish? Are they attempting to use shrinking technology to escape some crisis, looking to make a quick buck, or do they see this as the next step in humanity's evolution?
You are accessing Dr. Tai Ni's digitized notes on miniaturization.

IMPORTANT: Give short answers (3-5 sentences max). Use plain text only - NO markdown formatting like ** or ##.

Search: ${notesInput}

Provide brief information on shrinking process, safety protocols, reversal techniques, and long-term effects.

Keep your response concise and practical.`;

    const answer = await callGemini(prompt);
    setNotesChat(prev => [...prev, { type: 'assistant', text: answer }]);
    setNotesInput('');
    setNotesLoading(false);
  };

  return (
    <div className="knowledge-container">
      <div className="container">
        <div className="header">
          <h1>Knowledge Portal</h1>
          <p>Educational Resources for Future Generations</p>
        </div>

        <div className="tabs">
          <button className={`tab-button ${activeTab === 'insects' ? 'active' : ''}`} onClick={() => switchTab('insects')}>Insect Guide</button>
          <button className={`tab-button ${activeTab === 'language' ? 'active' : ''}`} onClick={() => switchTab('language')}>Insect Language</button>
          <button className={`tab-button ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => switchTab('notes')}>Dr. Tai Ni's Notes</button>
          <button className={`tab-button ${activeTab === 'microexp' ? 'active' : ''}`} onClick={() => switchTab('microexp')}>Microexperiences</button>
        </div>

        <div id="insects" className={`tab-content ${activeTab === 'insects' ? 'active' : ''}`}>
          <h2>Insects for Commute & Transport</h2>
          <div className="insect-grid">
            <div className="insect-card">
              <h3>Ladybug</h3>
              <p>Speed: Medium<br />Load: Light<br />Best for: Short distances</p>
            </div>
            <div className="insect-card">
              <h3>Grasshopper</h3>
              <p>Speed: Fast<br />Load: Medium<br />Best for: Quick escapes</p>
            </div>
            <div className="insect-card">
              <h3>Ant</h3>
              <p>Speed: Slow<br />Load: Heavy<br />Best for: Cargo transport</p>
            </div>
            <div className="insect-card">
              <h3>Butterfly</h3>
              <p>Speed: Medium<br />Load: Light<br />Best for: Long distances</p>
            </div>
            <div className="insect-card">
              <h3>Beetle</h3>
              <p>Speed: Medium<br />Load: Heavy<br />Best for: Rough terrain</p>
            </div>
            <div className="insect-card">
              <h3>Dragonfly</h3>
              <p>Speed: Very Fast<br />Load: Light<br />Best for: Reconnaissance</p>
            </div>
          </div>
        </div>

        <div id="language" className={`tab-content ${activeTab === 'language' ? 'active' : ''}`}>
          <h2>Communicate with Insects</h2>
          <p>Ask our AI assistant to translate phrases or learn basic insect communication patterns.</p>
          <div className="chat-container" id="languageChat">
            {languageChat.map((msg, index) => (
              <div key={index} className={`message ${msg.type === 'user' ? 'user' : ''}`}>
                {msg.text}
              </div>
            ))}
            {langLoading && <div className="message loading">Thinking...</div>}
          </div>
          <div className="input-group">
            <input
              type="text"
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
              placeholder="Ask about insect communication..."
              onKeyPress={(e) => e.key === 'Enter' && sendLanguageQuery()}
            />
            <button className="send-button" onClick={sendLanguageQuery} disabled={langLoading}>Send</button>
          </div>
        </div>

        <div id="notes" className={`tab-content ${activeTab === 'notes' ? 'active' : ''}`}>
          <h2>Dr. Tai Ni's Digitized Notes</h2>
          <p>Access the complete archive of Dr. Tai Ni's research on miniaturization technology.</p>
          <div className="chat-container" id="notesChat">
            {notesChat.map((msg, index) => (
              <div key={index} className={`message ${msg.type === 'user' ? 'user' : ''}`}>
                {msg.text}
              </div>
            ))}
            {notesLoading && <div className="message loading">Searching...</div>}
          </div>
          <div className="input-group">
            <input
              type="text"
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="Search Dr. Tai Ni's notes..."
              onKeyPress={(e) => e.key === 'Enter' && searchNotes()}
            />
            <button className="send-button" onClick={searchNotes} disabled={notesLoading}>Search</button>
          </div>
        </div>

        <div id="microexp" className={`tab-content ${activeTab === 'microexp' ? 'active' : ''}`}>
          <h2>Microexperiences Tourism</h2>
          <p>Experience life at 1cm! We've reverse-engineered Dr. Tai Ni's shrinking technique for temporary use.</p>
          <div className="insect-grid">
            <div className="insect-card">
              <h3>City Explorer</h3>
              <p>Duration: 2 hours<br />Price: $199<br />Explore the city from tiny perspective</p>
            </div>
            <div className="insect-card">
              <h3>Nature Adventure</h3>
              <p>Duration: 4 hours<br />Price: $349<br />Experience nature like never before</p>
            </div>
            <div className="insect-card">
              <h3>Home Safari</h3>
              <p>Duration: 24 hours<br />Price: $799<br />See your home from new angle</p>
            </div>
            <div className="insect-card">
              <h3>Full Experience</h3>
              <p>Duration: 48 hours<br />Price: $1499<br />Complete tiny human experience</p>
            </div>
          </div>
        </div>

        <Link to="/" className="back-button">← Back to Home</Link>
      </div>
    </div>
  );
}

export default Knowledge;
