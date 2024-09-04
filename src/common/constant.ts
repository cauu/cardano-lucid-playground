// import dotenv from "dotenv";

// dotenv.config(); // Load environment variables from .env file

export const RPC_URL = 'https://cardano-preview.blockfrost.io/api/v0';

export const PRIVATE_KEY = import.meta.env.VITE_WALLET_PRIVATE_KEY || ''; // Retrieve the environment variable
export const BLOCKFORST_API_KEY = import.meta.env.VITE_BLOCKFROST_API_KEY || '';
