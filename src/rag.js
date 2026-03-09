import OpenAI from 'openai';
import * as lancedb from '@lancedb/lancedb';

const openai = new OpenAI(); // uses OPENAI_API_KEY env var automatically

// Generate embedding for a text string
export async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float',
  });
  return response.data[0].embedding;
}

// Initialize the vector database with FAQ data
export async function initializeDatabase(faqs) {
  const db = await lancedb.connect('./lancedb_data');

  // Check if table already exists
  const tableNames = await db.tableNames();
  if (tableNames.includes('faqs')) {
    return db.openTable('faqs');
  }

  // Generate embeddings for all FAQs
  const records = [];
  for (const faq of faqs) {
    const embedding = await getEmbedding(faq.question + ' ' + faq.answer);
    records.push({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      vector: embedding,
    });
  }

  const table = await db.createTable('faqs', records);
  return table;
}

// Search for relevant FAQs and generate a response
export async function chat(table, userMessage) {
  // 1. Embed the user's question
  const queryVector = await getEmbedding(userMessage);

  // 2. Search for top 3 similar FAQs
  const results = await table
    .search(queryVector)
    .limit(3)
    .toArray();

  // 3. Build context from results
  const context = results.map(r =>
    `Q: ${r.question}\nA: ${r.answer}`
  ).join('\n\n');

  // 4. Generate response with GPT-3.5-turbo
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are a helpful customer support assistant for CloudSync, a cloud storage and sync service. Answer the user's question based on the following FAQ context. If the answer is not in the context, say you don't have specific information about that but suggest they contact support@cloudsync.example.com.\n\nContext:\n${context}`
      },
      {
        role: 'user',
        content: userMessage
      }
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return {
    reply: completion.choices[0].message.content,
    sources: results.map(r => ({
      question: r.question,
      category: r.category,
    })),
  };
}
