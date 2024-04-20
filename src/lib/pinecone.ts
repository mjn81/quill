import { Pinecone } from '@pinecone-database/pinecone';

const getPineconeConfig = () => {
  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) {
    throw new Error('PINECONE_API_KEY is not set');
  }
  return { apiKey };
} 
export const pinecone = new Pinecone({
  apiKey: getPineconeConfig().apiKey,
});
