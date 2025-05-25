import prisma from '../prisma';

export const getAllGrammarLessons = async () => {
  return await prisma.grammar_lessons.findMany();
};

export const getGrammarLessonById = async (id: number) => {
  return await prisma.grammar_lessons.findUnique({ where: { id } });
};

export const createGrammarLesson = async (title: string, content: string, video_url?: string | null) => {
  return await prisma.grammar_lessons.create({
    data: { title, content, video_url },
  });
};

export const updateGrammarLesson = async (id: number, title: string, content: string, video_url?: string | null) => {
  return await prisma.grammar_lessons.update({
    where: { id },
    data: { title, content, video_url }
  });
};

export const deleteGrammarLesson = async (id: number) => {
  return await prisma.grammar_lessons.delete({ where: { id } });
};