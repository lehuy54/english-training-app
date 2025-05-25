import prisma from '../prisma';

export const updateOrCreateUserProgress = async (
  userId: number,
  content_type: string,
  content_id: number
) => {
  return await prisma.user_progress.upsert({
    where: {
      user_id_content_type_content_id: {
        user_id: userId,
        content_type,
        content_id
      }
    },
    update: {
      completed_at: new Date()
    },
    create: {
      user_id: userId,
      content_type,
      content_id,
      completed_at: new Date()
    }
  });
};

export const getUserProgressStats = async (userId: number, content_type: string) => {
  const completed = await prisma.user_progress.count({
    where: { user_id: userId, content_type }
  });

  let total = 0;
  if (content_type === 'topic') {
    total = await prisma.topics.count();
  } else if (content_type === 'grammar' || content_type === 'grammar_lesson') {
    // Handle both 'grammar' and 'grammar_lesson' for backward compatibility
    total = await prisma.grammar_lessons.count();
  }

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    content_type,
    total,
    completed,
    percentage
  };
};