# 📧 Email Spam Detection & Summarizer 🔍✉️

A dual-purpose machine learning application that **detects spam emails** and **summarizes email content** to help users prioritize important information quickly and efficiently.

## 🚀 Features

- ✅ **Spam Detection**: Classifies incoming emails as `Spam` or `Ham` using NLP + ML.
- ✅ **Email Summarization**: Generates short, meaningful summaries from long email bodies.
- ⚙️ Built with scikit-learn, NLTK, and Python.
- 🌐 Web-based interface (e.g., Streamlit or HTML+Flask).
- 📈 Easily extensible to Gmail APIs, real-time alerts, or dashboards.

## 🧠 Technologies Used

- Python 🐍
- scikit-learn 🤖
- NLTK / spaCy 🗣️
- Flask or FastAPI 🌐
- Streamlit (for demo UI) ⚡
- Pandas, NumPy 📊

## 📊 Model Overview

| Task              | Technique           | Metric      |
|-------------------|---------------------|-------------|
| Spam Detection    | Logistic Regression | 95%+ accuracy |
| Summarization     | Extractive (TextRank / custom) | Human-readable output |

## Downloading the model

Download from [here](https://drive.google.com/file/d/1xqLivhVDr3llLW3o2jXxcdtw16U16sE1/view?usp=sharing) and add to `backend`.

## 🧪 How to Run

```bash
pip install -r requirements.txt
cd backend
python app.py
cd ..
cd frontend
npm start
```
