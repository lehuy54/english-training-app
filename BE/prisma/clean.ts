// prisma/clean.ts

import prisma from '../src/prisma';

async function cleanDatabase() {
  try {
    console.log('🧹 Bắt đầu dọn dẹp database');

    // Xóa dữ liệu theo thứ tự hợp lý (dựa vào quan hệ khóa ngoại)
  
    await prisma.user_progress.deleteMany({});
    await prisma.quiz_attempt_answers.deleteMany({});
    await prisma.quiz_attempts.deleteMany({});
    await prisma.flashcards.deleteMany({});
    await prisma.questions.deleteMany({});
    await prisma.grammar_lessons.deleteMany({});
    await prisma.topics.deleteMany({});

    // Giữ lại tài khoản admin nếu cần
    const adminEmail = 'admin@example.co';
    const allUsers = await prisma.users.findMany();
    if (allUsers.length > 1) {
      await prisma.users.deleteMany({
        where: {
          email: {
            not: adminEmail,
          },
        },
      });
    }

    console.log('✅ Đã xóa sạch dữ liệu');
  } catch (error) {
    console.error('❌ Lỗi khi dọn DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
