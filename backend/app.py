from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import re

app = Flask(__name__)
CORS(app)

# Load model and vectorizer
model = joblib.load('spam_classifier_model.pkl')
vectorizer = joblib.load('vectorizer.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    email = data.get('title', '')
    if not email:
        return jsonify({'error': 'Email subject is required'}), 400
    transformed = vectorizer.transform([email])
    prediction = model.predict(transformed)[0]
    return jsonify({'prediction': 'Spam' if prediction == 1 else 'Ham'})

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.json
    text = data.get('text', '')
    if not text:
        return jsonify({'error': 'Text is required'}), 400

    # Simple extractive summarization using TF-IDF
    # Split text into sentences
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    if len(sentences) == 1:
        summary = sentences[0]
    else:
        # Compute TF-IDF for each sentence
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(sentences)
        # Score sentences by the sum of TF-IDF weights
        scores = tfidf_matrix.sum(axis=1).A1
        # Get the top 2 sentences as summary (or 1 if only 1 sentence)
        top_n = min(2, len(sentences))
        top_indices = np.argsort(scores)[-top_n:][::-1]
        summary = ' '.join([sentences[i] for i in sorted(top_indices)])

    return jsonify({'summary': summary})

if __name__ == '__main__':
    app.run(debug=True)
