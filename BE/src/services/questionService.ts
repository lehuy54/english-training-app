import prisma from '../prisma';

export const getAllQuestions = async () => {
  return await prisma.questions.findMany();
};

export const getQuestionById = async (id: number) => {
  return await prisma.questions.findUnique({ where: { id } });
};

export const createQuestion = async (
  content_type: string,
  content_id: number,
  content_name: string | null,
  question_text: string,
  option1: string,
  option2: string,
  option3: string,
  option4: string,
  correct_answer: number
) => {
  return await prisma.questions.create({
    data: {
      content_type,
      content_id,
      content_name,
      question_text,
      option1,
      option2,
      option3,
      option4,
      correct_answer
    },
  });
};

export const updateQuestion = async (
  id: number,
  content_name: string | null,
  question_text: string,
  option1: string,
  option2: string,
  option3: string,
  option4: string,
  correct_answer: number
) => {
  return await prisma.questions.update({
    where: { id },
    data: {
      question_text,
      option1,
      option2,
      option3,
      option4,
      correct_answer
    },
  });
};

export const deleteQuestion = async (id: number) => {
  return await prisma.questions.delete({ where: { id } });
};

export const getQuestionsByContentTypeAndId = async (contentType: string, contentId: number) => {
  return await prisma.questions.findMany({
    where: {
      content_type: contentType,
      content_id: contentId
    }
  });
};