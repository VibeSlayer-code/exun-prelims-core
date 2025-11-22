from flask import Flask, request, jsonify
from flask_cors import CORS
from ddgs import DDGS
from google import genai
import os
import wikipedia
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

client = genai.Client(api_key="AIzaSyCQ25UsuYUAyyKcUAaMwKmutUVewTA54QQ")
model_id = "gemini-2.5-flash-preview-09-2025" 

def get_combined_intel(query):
    print(f"-> Searching: {query}")
    
    context_text = ""
    sources_list = []

    try:
        with DDGS() as ddgs:
            ddg_results = list(ddgs.text(query, max_results=2))
            for r in ddg_results:
                context_text += f"SOURCE (WEB): {r['title']} - {r['body']}\n"
                sources_list.append({"title": r['title'], "url": r['href'], "type": "web"})
    except Exception as e:
        print(f"DDG Error: {e}")

    try:
        search_res = wikipedia.search(query)
        if search_res:
            wiki_page = wikipedia.page(search_res[0], auto_suggest=False)
            context_text += f"SOURCE (WIKI): {wiki_page.title} - {wiki_page.summary[:500]}\n"
            sources_list.append({"title": "Wiki: " + wiki_page.title, "url": wiki_page.url, "type": "wiki"})
    except Exception as e:
        print(f"Wiki Error: {e}")

    if not context_text:
        context_text = "No live data found. Rely on internal general knowledge."

    return {"context": context_text, "sources": sources_list}

@app.route('/api/agent_search', methods=['POST'])
def agent_search():
    data = request.json
    user_query = data.get('query')
    
    if not user_query:
        return jsonify({"error": "Empty query"})

    print(f"--- Processing: {user_query} ---")

    intel = get_combined_intel(f"{user_query} physical properties mechanism size")
    
    full_prompt = f"""
    SYSTEM INSTRUCTION:
    You are an analytical survival assistant for humans scaled down to 1.5cm height.
    
    CONTEXT FROM REAL WORLD:
    {intel['context']}
    
    INSTRUCTIONS:
    1. Answer the user's question using the Context provided.
    2. Adapt the data to the micro-scale context (e.g., Square-Cube Law implications, fluid dynamics at small scale).
    3. Tone: Direct, practical, and informative. Do not use a "persona" or roleplay. Just provide the data.
    4. Format: Plain text, paragraphs. Max 15 sentences.

    USER QUERY:
    {user_query}
    """

    try:
        response = client.models.generate_content(
            model=model_id,
            contents=[{"role": "user", "parts": [{"text": full_prompt}]}]
        )
        
        return jsonify({
            "response": response.text,
            "sources": intel['sources']
        })

    except Exception as e:
        print(f"AI Error: {e}")
        return jsonify({"error": "Analysis Failed."})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
