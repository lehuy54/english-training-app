// src/services/topicService.ts
import prisma from '../prisma';

export const getAllTopics = async () => {
  try {
    const topics = await prisma.topics.findMany();
    return topics;
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách chủ đề');
  }
};

export const getTopicById = async (topicId: number) => {
  return await prisma.topics.findUnique({ where: { id: topicId } });
};

export const createTopic = async (name: string, description?: string | null) => {
  return await prisma.topics.create({
    data: { name, description },
  });
};

export const updateTopic = async (topicId: number, name: string, description?: string | null) => {
  return await prisma.topics.update({
    where: { id: topicId },
    data: { name, description },
  });
};

export const deleteTopic = async (topicId: number) => {
  return await prisma.topics.delete({ where: { id: topicId } });
};