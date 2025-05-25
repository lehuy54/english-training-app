// src/services/flashcardService.ts

import prisma from '../prisma';

export const getFlashcardsByTopicId = async (topicId: number) => {
  return await prisma.flashcards.findMany({ where: { topic_id: topicId } });
};

export const createFlashcard = async (
  vocabulary: string,
  phonetics: string | null,
  vietnamese_meaning: string | null,
  description: string | null,
  example: string | null,
  topic_id: number
) => {
  return await prisma.flashcards.create({
    data: {
      vocabulary,
      phonetics,
      vietnamese_meaning,
      description,
      example,
      topic_id: topic_id,
    },
  });
};

export const updateFlashcard = async (
  flashcardId: number,
  vocabulary: string,
  phonetics: string | null,
  vietnamese_meaning: string | null,
  description: string | null,
  example: string | null
) => {
  return await prisma.flashcards.update({
    where: { id: flashcardId },
    data: { vocabulary, phonetics, vietnamese_meaning, description, example },
  });
};

export const deleteFlashcard = async (flashcardId: number) => {
  return await prisma.flashcards.delete({ where: { id: flashcardId } });
};