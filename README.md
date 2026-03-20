# Node.js RAG Chatbot

A Retrieval-Augmented Generation (RAG) chatbot built with Node.js that answers customer support questions. It embeds FAQ documents into a vector database, retrieves the most relevant ones for each user query, and uses OpenAI to generate a natural-language answer grounded in your FAQ data.

## Tech Stack

- **Node.js 20+** — Runtime
- **Express** — HTTP server, REST API, static file serving
- **LanceDB** — Embedded vector database (no external server required)
- **OpenAI** — `text-embedding-3-small` for embeddings, `gpt-3.5-turbo` for chat completions
- **Vanilla HTML/CSS/JS** — Lightweight chat UI

## Prerequisites

- Node.js 20 or later
- An [OpenAI API key](https://platform.openai.com/api-keys)

## Setup & Installation

```bash
git clone https://github.com/eldencodingv3/node-rag-chatbot.git
cd node-rag-chatbot
npm install
```

Copy the example environment file and add your OpenAI API key:

```bash
cp .env.example .env
# Edit .env and set your OPENAI_API_KEY
```

Start the server:

```bash
npm start
```

The app will load and embed the FAQ documents on startup, then serve the chat UI at `http://localhost:3000`.

For development with auto-reload:

```bash
npm run dev
```

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | Yes | — | Your OpenAI API key for embeddings and chat completions |
| `PORT` | No | `3000` | HTTP server port |

## How It Works

1. **Ingestion** — On startup, the server reads `data/faqs.json`, generates vector embeddings for each FAQ using OpenAI's `text-embedding-3-small` model, and stores them in a local LanceDB database.
2. **Retrieval** — When a user asks a question, the question is embedded and a vector similarity search finds the top 3 most relevant FAQs.
3. **Generation** — The retrieved FAQs are passed as context to `gpt-3.5-turbo`, which generates a helpful, grounded answer.

## Updating the FAQ Dataset

1. Edit `data/faqs.json` — each entry needs `id`, `question`, `answer`, and `category`
2. Delete `data/lancedb/` to clear the cached embeddings (optional — the server re-creates the table if it doesn't exist)
3. Restart the server

Supported categories: `account`, `billing`, `shipping`, `returns`, `technical`, `general`.

## Project Structure

```
src/
  index.js          — Express server, API routes, static serving
  embeddings.js     — OpenAI embedding generation
  vectorStore.js    — LanceDB connection, table management, vector search
  loadDocuments.js  — FAQ loading and indexing pipeline
  rag.js            — Retrieve + Generate pipeline
public/
  index.html        — Chat UI
  style.css         — Styling
  script.js         — Frontend logic
data/
  faqs.json         — FAQ dataset (14 entries across 6 categories)
```

## API Endpoints

### `GET /api/health`

Health check endpoint.

**Response:**
```json
{ "status": "ok", "timestamp": "2026-03-20T00:00:00.000Z" }
```

### `POST /api/chat`

Send a question and receive an AI-generated answer.

**Request:**
```json
{ "question": "How do I reset my password?" }
```

**Response:**
```json
{
  "answer": "To reset your password, go to the login page and click 'Forgot Password'...",
  "sources": [
    { "question": "How do I reset my password?", "category": "account" }
  ]
}
```

## Deployment to Railway

1. Push to the `main` branch — Railway auto-deploys on push
2. Set environment variables in Railway dashboard:
   - `OPENAI_API_KEY` — your OpenAI key
   - `PORT` is set automatically by Railway
3. The app uses an embedded LanceDB database, so no external database service is needed

## License

MIT
