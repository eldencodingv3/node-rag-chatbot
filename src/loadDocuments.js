import { readFileSync } from 'fs';
import path from 'path';
import { getEmbeddings } from './embeddings.js';
import { initVectorStore } from './vectorStore.js';

export async function loadAndIndexDocuments() {
  const faqPath = path.join(process.cwd(), 'data', 'faqs.json');
  const faqs = JSON.parse(readFileSync(faqPath, 'utf-8'));

  // Combine question + answer for embedding
  const texts = faqs.map(faq => `${faq.question} ${faq.answer}`);
  const embeddings = await getEmbeddings(texts);

  // Prepare documents with vectors
  const documents = faqs.map((faq, i) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    text: texts[i],
    vector: embeddings[i],
  }));

  await initVectorStore(documents);
  console.log(`Indexed ${documents.length} FAQ documents`);
}
