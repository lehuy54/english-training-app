// prisma/seed.ts

import bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

// 🔁 Import prisma từ src/prisma.ts
import prisma from '../src/prisma';

interface User {
  email: string;
  display_name: string;
  password_hash: string;
  role: string;
}

interface Topic {
  name: string;
  description: string;
}

interface GrammarLesson {
  title: string;
  content: string;
  video_url?: string;
}

interface Flashcard {
  topic_name: string;
  vocabulary: string;
  phonetics?: string;
  vietnamese_meaning?: string;
  description?: string;
  example?: string;
}

interface Question {
  content_type: string;
  content_id: number;
  content_name?: string;
  question_text: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_answer: number;
}

// Helper: Đọc file JSON
function readJsonFile(filename: string): any {
  const filePath = path.join(__dirname, 'seed-data', filename);
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

async function checkExistingData() {
  const userData = readJsonFile('users.json');
  const topicsData = readJsonFile('topics.json') as Topic[];
  const grammarLessonsData = readJsonFile('grammar_lessons.json') as GrammarLesson[];

  // Check admin user
  const adminExists = await prisma.users.findUnique({
    where: { email: userData.admin.email }
  });

  // Check normal users
  const normalUsersExist = await Promise.all(
    (userData.users as User[]).map(user => 
      prisma.users.findUnique({
        where: { email: user.email }
      })
    )
  );

  // Check topics
  const topicsExist = await Promise.all(
    topicsData.map(topic =>
      prisma.topics.findFirst({
        where: { name: topic.name }
      })
    )
  );

  // Check grammar lessons
  const grammarLessonsExist = await Promise.all(
    grammarLessonsData.map(lesson =>
      prisma.grammar_lessons.findFirst({
        where: { title: lesson.title }
      })
    )
  );

  // Log what exists and what doesn't
  const missingData = {
    admin: !adminExists,
    normalUsers: normalUsersExist.filter(exists => !exists).length,
    topics: topicsExist.filter(exists => !exists).length,
    grammarLessons: grammarLessonsExist.filter(exists => !exists).length
  };

  // If any data is missing, we should seed
  const shouldSeed = Object.values(missingData).some(count => Boolean(count));

  if (shouldSeed) {
    console.log('📊 Missing data found:');
    if (missingData.admin) console.log('❌ Admin user not found');
    if (missingData.normalUsers > 0) console.log(`❌ ${missingData.normalUsers} normal users not found`);
    if (missingData.topics > 0) console.log(`❌ ${missingData.topics} topics not found`);
    if (missingData.grammarLessons > 0) console.log(`❌ ${missingData.grammarLessons} grammar lessons not found`);
    return false;
  }

  console.log('✅ All seed data already exists in the database');
  return true;
}

async function main() {
  // Check if data already exists
  if (await checkExistingData()) {
    return;
  }

  console.log('🌱 Starting database seeding...');

  // 1. Seed users
  const userData = readJsonFile('users.json');
  
  // Create admin user if not exists
  const adminUser = await prisma.users.upsert({
    where: { email: userData.admin.email },
    update: {},
    create: {
      ...userData.admin,
      password_hash: await bcrypt.hash(userData.admin.password_hash, 10),
    },
  });
  console.log('✅ Admin user created/updated:', adminUser.email);

  // Create normal users if not exist
  for (const user of userData.users) {
    const createdUser = await prisma.users.upsert({
      where: { email: user.email },
      update: {},
      create: {
        ...user,
        password_hash: await bcrypt.hash(user.password_hash, 10),
      },
    });
    console.log('✅ Normal user created/updated:', createdUser.email);
  }

  // 2. Seed topics
  const topicsData = readJsonFile('topics.json');
  const topicsMap: { [key: string]: number } = {};
  
  for (const topic of topicsData) {
    const existingTopic = await prisma.topics.findFirst({
      where: { name: topic.name }
    });

    if (existingTopic) {
      topicsMap[topic.name] = existingTopic.id;
      console.log(`🟡 Topic already exists: ${topic.name}`);
      continue;
    }

    const createdTopic = await prisma.topics.create({ data: topic });
    topicsMap[createdTopic.name] = createdTopic.id;
    console.log(`✅ Created topic: ${createdTopic.name}`);
  }

  // 3. Seed flashcards
  const flashcardsData = readJsonFile('flashcards.json');
  for (const card of flashcardsData) {
    const topicId = topicsMap[card.topic_name];
    if (!topicId) {
      console.warn(`⚠️ Topic not found: ${card.topic_name}`);
      continue;
    }

    const existingCard = await prisma.flashcards.findFirst({
      where: {
        topic_id: topicId,
        vocabulary: card.vocabulary
      }
    });

    if (existingCard) {
      console.log(` Flashcard already exists: ${card.vocabulary}`);
      continue;
    }

    // Using type assertion to handle the new fields
    await prisma.flashcards.create({
      data: {
        vocabulary: card.vocabulary,
        phonetics: card.phonetics || null,
        // @ts-ignore - Schema has these fields but TypeScript doesn't recognize them yet
        vietnamese_meaning: card.vietnamese_meaning || null,
        description: card.description || null,
        example: card.example || null,
        topic_id: topicId
      } as any,
    });
    console.log(` Created flashcard: ${card.vocabulary}`);
  }

  // 4. Seed grammar lessons
  const grammarLessonsData = readJsonFile('grammar_lessons.json');
  for (const lesson of grammarLessonsData) {
    const existingLesson = await prisma.grammar_lessons.findFirst({
      where: { title: lesson.title }
    });

    if (existingLesson) {
      console.log(`🟡 Grammar lesson already exists: ${lesson.title}`);
      continue;
    }

    await prisma.grammar_lessons.create({
      data: {
        title: lesson.title,
        content: lesson.content,
        video_url: lesson.video_url || null,
      },
    });
    console.log(`✅ Created grammar lesson: ${lesson.title}`);
  }

  // 5. Seed questions
  const questionsData = readJsonFile('questions.json');
  const additionalQuestionsData = readJsonFile('additional_questions.json');
  const allQuestionsData = [...questionsData, ...additionalQuestionsData];
  for (const question of allQuestionsData) {
    const existingQuestion = await prisma.questions.findFirst({
      where: {
        content_type: question.content_type,
        content_id: question.content_id,
        question_text: question.question_text
      }
    });

    if (existingQuestion) {
      console.log(`🟡 Question already exists: ${question.question_text.substring(0, 30)}...`);
      continue;
    }

    // Using type assertion to handle the new fields
    await prisma.questions.create({
      data: {
        content_type: question.content_type,
        content_id: question.content_id,
        // @ts-ignore - Schema has this field but TypeScript doesn't recognize it yet
        content_name: question.content_name || null,
        question_text: question.question_text,
        option1: question.option1,
        option2: question.option2,
        option3: question.option3,
        option4: question.option4,
        correct_answer: question.correct_answer,
      } as any,
    });
    console.log(`✅ Created question: ${question.question_text.substring(0, 30)}...`);
  }

  // 6. Seed quiz attempts
  const quizAttemptsData = readJsonFile('quiz_attempts.json');
  for (const attempt of quizAttemptsData) {
    const existingAttempt = await prisma.quiz_attempts.findFirst({
      where: {
        user_id: attempt.user_id,
        content_type: attempt.content_type,
        content_id: attempt.content_id
      }
    });

    if (existingAttempt) {
      console.log(`🟡 Quiz attempt already exists for user ${attempt.user_id}`);
      continue;
    }

    await prisma.quiz_attempts.create({
      data: {
        user_id: attempt.user_id,
        content_type: attempt.content_type,
        content_id: attempt.content_id,
        score: attempt.score,
      },
    });
    console.log(`✅ Created quiz attempt for user ${attempt.user_id}`);
  }

  // 7. Seed quiz attempt answers
  const quizAttemptAnswersData = readJsonFile('quiz_attempt_answers.json');
  for (const answer of quizAttemptAnswersData) {
    const existingAnswer = await prisma.quiz_attempt_answers.findUnique({
      where: {
        attempt_id_question_id: {
          attempt_id: answer.attempt_id,
          question_id: answer.question_id
        }
      }
    });

    if (existingAnswer) {
      console.log(`🟡 Answer already exists for attempt ${answer.attempt_id}, question ${answer.question_id}`);
      continue;
    }

    await prisma.quiz_attempt_answers.create({
      data: {
        attempt_id: answer.attempt_id,
        question_id: answer.question_id,
        selected_option: answer.selected_option
      },
    });
    console.log(`✅ Created answer for attempt ${answer.attempt_id}, question ${answer.question_id}`);
  }

  // 8. Seed user progress
  const userProgressData = readJsonFile('user_progress.json');
  for (const progress of userProgressData) {
    const existingProgress = await prisma.user_progress.findUnique({
      where: {
        user_id_content_type_content_id: {
          user_id: progress.user_id,
          content_type: progress.content_type,
          content_id: progress.content_id
        }
      }
    });

    if (existingProgress) {
      console.log(`🟡 Progress already exists for user ${progress.user_id}`);
      continue;
    }

    await prisma.user_progress.create({
      data: {
        user_id: progress.user_id,
        content_type: progress.content_type,
        content_id: progress.content_id,
      },
    });
    console.log(`✅ Created progress for user ${progress.user_id}`);
  }

  console.log('✨ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });