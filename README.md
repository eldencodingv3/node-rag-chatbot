# Node.js RAG Chatbot

A simple Retrieval-Augmented Generation (RAG) chatbot built with Node.js that answers customer support FAQs. It uses LanceDB for vector storage and OpenAI for embeddings and chat completions.

## Architecture

- **Express** — HTTP server with REST API and static frontend
- **LanceDB** — Embedded vector database for FAQ embeddings
- **OpenAI** — Text embeddings (text-embedding-3-small) and chat completions (gpt-4o-mini)

## Setup

```bash
git clone https://github.com/eldencodingv3/node-rag-chatbot.git
cd node-rag-chatbot
npm install
```

Copy the example env file and add your OpenAI API key:

```bash
cp .env.example .env
# Edit .env and set OPENAI_API_KEY
```

Start the server:

```bash
npm start
```

The server runs on `http://localhost:3000` by default.

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | Yes | — | OpenAI API key for embeddings and chat |
| `PORT` | No | `3000` | HTTP server port |

## Updating the FAQ Dataset

1. Edit `data/faqs.json` with your questions and answers
2. Restart the server — it re-ingests on startup

## Project Structure

```
src/
  server.js    — Express server and API routes
  ingest.js    — FAQ ingestion and embedding pipeline
public/
  index.html   — Chat UI frontend
data/
  faqs.json    — FAQ dataset
```

## Deployment

Deployed on Railway. Pushes to `main` trigger automatic deployments.
