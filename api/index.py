from flask import Flask, request, jsonify
from flask_cors import CORS
from ddgs import DDGS
from google import genai
import os
import wikipedia
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

client = genai.Client(api_key=os.getenv("API_KEY"))
model_id = "gemini-2.5-flash"

def get_combined_intel(query):
    print(f"-> Searching: {query}")

    context_text = ""
    sources_list = []

    try:
        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=2):
                context_text += f"SOURCE (WEB): {r['title']} - {r['body']}\n"
                sources_list.append({"title": r['title'], "url": r['href'], "type": "web"})
    except Exception as e:
        print(f"DDG Error: {e}")

    try:
        search_res = wikipedia.search(query)
        if search_res:
            page = wikipedia.page(search_res[0], auto_suggest=False)
            context_text += f"SOURCE (WIKI): {page.title} - {page.summary[:300]}\n"
            sources_list.append({"title": page.title, "url": page.url, "type": "wiki"})
    except Exception as e:
        print(f"Wiki Error: {e}")

    if not context_text:
        context_text = "No live external data found."

    return context_text, sources_list


@app.route('/api/agent_search', methods=['POST'])
def agent_search():
    data = request.json
    user_query = data.get("query")

    if not user_query:
        return jsonify({"error": "No query provided."})

    print(f"--- Processing Query: {user_query} ---")

    context, sources = get_combined_intel(user_query)

    prompt = f"""
    User Question: {user_query}

    Context:
    {context}

    You are a micro-scale scientific assistant.
    Convert all knowledge to apply to a 1.5cm human.
    Answer in a practical, medical way. 10 sentences max.
    """

    try:
        result = client.models.generate_content(
            model=model_id,
            contents=[{"role": "user", "parts": [{"text": prompt}]}]
        )

        print("AI Response:", result.text)

        return jsonify({
            "response": result.text,
            "sources": sources
        })

    except Exception as e:
        print("🔥 AI ERROR:", str(e))
        return jsonify({"error": "Analysis Failed."})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
