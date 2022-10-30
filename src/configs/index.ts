import dotenv from 'dotenv';

dotenv.config();

export const port = process.env.PORT as any | 8080;
