// src/controllers/topicController.ts
import { Request, Response } from 'express';
import { 
    getAllTopics,
    getTopicById,
    createTopic,
    updateTopic,
    deleteTopic,
} from '../services/topicService';

export const getTopicsController = async (req: Request, res: Response) => {
  try {
    const topics = await getAllTopics();
    res.json(topics)
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTopicByIdController = async (req: Request, res: Response) => {
  const topicId = parseInt(req.params.id, 10);

  try {
    const topic = await getTopicById(topicId);
    if (!topic) res.status(404).json({ error: 'Chủ đề không tồn tại' }); return;
    res.json(topic);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createTopicController = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  try {
    const newTopic = await createTopic(name, description);
    res.status(201).json(newTopic);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTopicController = async (req: Request, res: Response) => {
  const topicId = parseInt(req.params.id, 10);
  const { name, description } = req.body;

  try {
    const updated = await updateTopic(topicId, name, description);
    res.json(updated);
  } catch (error: any) {
    if (error.code === 'P2025') {
       res.status(404).json({ error: 'Chủ đề không tồn tại' });
       return;
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteTopicController = async (req: Request, res: Response) => {
  const topicId = parseInt(req.params.id, 10);

  try {
    await deleteTopic(topicId);
    res.json({ message: 'Xóa chủ đề thành công' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Chủ đề không tồn tại' });
      return;
    }
    res.status(500).json({ error: error.message });
  }
};




