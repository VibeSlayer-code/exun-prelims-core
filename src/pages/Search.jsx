import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Search.css';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const API_KEY = 'AIzaSyBYzf144EVp8crCUPfLZ_q5AJqMGWocesM';
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  const setExampleQuery = (exampleQuery) => {
    setQuery(exampleQuery);
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      alert('Please enter a query');
      return;
    }

    setShowResults(true);
    setLoading(true);
    setResults('');

    const prompt = `Dr. Tai Ni, a world-class researcher and acclaimed innovator from Nuxeland, stood at the forefront of miniature sciences. With his latest ventures and discoveries in shrinking the human body, his work was sensational — yet not a sensation to which the public paid much heed. All his lab rats were successfully shrunk, almost invisibly small. His brother, Fhu, called his discovery a failure; Dr. Ni called it proof — proof that required closer inspection, something that most were not willing to offer. The public outrage forced Ni to go underground; his notes remain the only remnants of his findings.


In the catacombs beneath Nuxeland, Ni's former test subjects formed a network of reformists called etinuxE. Their greatest achievement? The ability to shrink people.


Their purpose is ambiguous — what do they aim to accomplish? Are they attempting to use shrinking technology to escape some crisis, looking to make a quick buck, or do they see this as the next step in humanity's evolution?
You are helping the etinuXe community - humans shrunk to 1cm tall.

IMPORTANT: Provide long, detailed answers which are clear not just general guidelines but really specific based on research studies(USE online and research studies in your database) (13-15 sentences max). Use plain text only - NO markdown formatting like ** for bold or ## for headers.

Convert this query from human to tiny human scale (1cm, ~0.1g body mass):

${query}

Consider:
- Dosage calculations (scale by body mass)
- Equipment adaptations
- Safety considerations
- Metabolic changes
- it should be medically accurate and impressive

Keep your response brief and practical.`;

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
        const answer = data.candidates[0].content.parts[0].text;
        setResults(answer);
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      setResults(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <div className="container">
        <div className="header">
          <h1>Tiny Human Research Search</h1>
          <p>Convert human medical research to 1cm scale</p>
        </div>

        <div className="search-section">
          <div className="examples">
            <h3>Example Queries</h3>
            <div className="example-item" onClick={() => setExampleQuery('How to perform heart surgery on a tiny human?')}>
              How to perform heart surgery on a tiny human?
            </div>
            <div className="example-item" onClick={() => setExampleQuery('Medicine dosage calculation for 1cm tall person')}>
              Medicine dosage calculation for 1cm tall person
            </div>
            <div className="example-item" onClick={() => setExampleQuery('Long-term health impacts of miniaturization')}>
              Long-term health impacts of miniaturization
            </div>
          </div>

          <textarea
            id="searchQuery"
            className="search-input"
            placeholder="Ask any medical or survival question for tiny humans..."
            rows="4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></textarea>
          <button className="search-button" id="searchBtn" onClick={handleSearch} disabled={loading}>
            Convert & Search
          </button>
        </div>

        {showResults && (
          <div id="results" className="results active">
            <h2>Results</h2>
            <div id="resultContent" className="result-content">
              {loading ? (
                <div className="loading">Converting to tiny human scale...</div>
              ) : (
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{results}</pre>
              )}
            </div>
          </div>
        )}

        <Link to="/" className="back-button">← Back to Home</Link>
      </div>
    </div>
  );
}

export default Search;
