import OpenAI from 'openai';
import { getEmbedding } from './embeddings.js';
import { searchSimilar } from './vectorStore.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateAnswer(question) {
  // 1. Get embedding for the question
  const queryVector = await getEmbedding(question);

  // 2. Search for similar FAQs
  const results = await searchSimilar(queryVector, 3);

  // 3. Build context from results
  const context = results.map(r =>
    `Q: ${r.question}\nA: ${r.answer}`
  ).join('\n\n');

  // 4. Generate answer using GPT-3.5-turbo
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are a helpful customer support assistant. Answer the user's question based on the following FAQ context. If the context doesn't contain relevant information, say so politely and suggest contacting support directly.\n\nContext:\n${context}`
      },
      {
        role: 'user',
        content: question
      }
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return {
    answer: completion.choices[0].message.content,
    sources: results.map(r => ({
      question: r.question,
      category: r.category,
    })),
  };
}
