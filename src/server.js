import express from 'express';
import { readFileSync } from 'fs';
import { initializeDatabase, chat } from './rag.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Initialize the RAG database on startup
let faqTable = null;

async function init() {
  const faqs = JSON.parse(readFileSync('./data/faqs.json', 'utf-8'));
  console.log(`Initializing with ${faqs.length} FAQs...`);
  faqTable = await initializeDatabase(faqs);
  console.log('FAQ database ready.');
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', faqsLoaded: faqTable !== null });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }
    if (!faqTable) {
      return res.status(503).json({ error: 'Service initializing, please try again' });
    }
    const result = await chat(faqTable, message);
    res.json(result);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

init().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize:', err);
  process.exit(1);
});
