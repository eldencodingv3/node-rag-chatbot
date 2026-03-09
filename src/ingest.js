import { readFileSync } from 'fs';
import { initializeDatabase } from './rag.js';
import 'dotenv/config';

const faqs = JSON.parse(readFileSync('./data/faqs.json', 'utf-8'));
console.log(`Loading ${faqs.length} FAQs...`);
const table = await initializeDatabase(faqs);
console.log('Database initialized successfully.');
