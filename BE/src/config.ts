// src/config.ts
import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  jwtSecret: string;
  baseApiPath: string;
  swaggerRoute: string;
  swaggerSpecPath: string;
  ollamaApiUrl: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  baseApiPath: '/api',
  swaggerRoute: '/api-docs',
  swaggerSpecPath: './src/utils/swagger.yaml', // Đường dẫn tuyệt đối hoặc tương đối từ root
  ollamaApiUrl: process.env.OLLAMA_API_URL || 'http://localhost:11434',
};

export default config;