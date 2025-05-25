// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import config from './config';
import prisma from './prisma';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
// Sử dụng kiểu Record<string, any> để thay thế JsonObject
type JsonObject = Record<string, any>;



// Load Swagger Docs từ file yaml
const swaggerDocumentYaml = fs.readFileSync(path.resolve(config.swaggerSpecPath), 'utf8');
const swaggerDocumentJson = yaml.load(swaggerDocumentYaml) as JsonObject;

const app = express();


// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));



// Route người dùng
import userRoute from './routes/userRoute';
import topicRoute from './routes/topicRoute';
import authRoute from './routes/authRoute';
import flashcardRoute from './routes/flashcardRoute'
import grammarRoute from './routes/grammarRoute';
import questionRoute from './routes/questionRoute';
import quizRoute from './routes/quizRoute';
import progressRoute from './routes/progressRoute';
import speakingRoute from './routes/speakingRoute';


app.use(`${config.baseApiPath}/auth`, authRoute);
app.use(`${config.baseApiPath}/users`, userRoute);
app.use(`${config.baseApiPath}/topics`, topicRoute);
app.use(`${config.baseApiPath}/flashcards`, flashcardRoute);
app.use(`${config.baseApiPath}/grammar-lessons`, grammarRoute);
app.use(`${config.baseApiPath}/questions`, questionRoute);
app.use(`${config.baseApiPath}/quiz-attempts`, quizRoute);
app.use(`${config.baseApiPath}/progress`, progressRoute);
app.use(`${config.baseApiPath}/speaking-practice`, speakingRoute);

// Swagger Docs
app.use(
  config.swaggerRoute,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocumentJson)
);

// Hàm khởi động server
async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Kết nối PostgreSQL thành công');

    app.listen(config.port, () => {
      console.log(`🟢 Server đang chạy tại http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('❌ Lỗi kết nối cơ sở dữ liệu:', error);
    process.exit(1);
  }
}

startServer();

export default app;