import { Request, Response } from "express";
import { 
  generateAIResponse, 
  saveSpeakingPractice, 
  getSpeakingPracticeHistory, 
  getSpeakingPracticeById 
} from "../services/speakingService";

// Tạo bài luyện nói mới dựa trên input của người dùng
export const createSpeakingPractice = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('User object from token:', req.user);
    const userId = req.user?.userId; // Thay đổi từ req.user?.id sang req.user?.userId
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    console.log('Authorized with userId:', userId);

    const { context, tone, audience, content } = req.body;
    
    if (!content) {
      res.status(400).json({ message: "Content is required" });
      return;
    }

    // Gọi API AI để tạo phản hồi
    const aiResponse = await generateAIResponse(
      context || "",
      tone || "",
      audience || "",
      content
    );

    // Lưu lại thông tin thực hành và phản hồi AI
    const practice = await saveSpeakingPractice(
      userId,
      context || "",
      tone || "",
      audience || "",
      content,
      aiResponse
    );

    res.status(201).json({
      success: true,
      data: practice
    });
  } catch (error: any) {
    console.error("Error in createSpeakingPractice:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Lấy lịch sử luyện nói của người dùng
export const getUserSpeakingHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId; // Thay đổi từ req.user?.id sang req.user?.userId
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const history = await getSpeakingPracticeHistory(userId);
    
    res.json({
      success: true,
      data: history
    });
  } catch (error: any) {
    console.error("Error in getUserSpeakingHistory:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Lấy chi tiết một lần luyện nói cụ thể
export const getSpeakingPracticeDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId; // Thay đổi từ req.user?.id sang req.user?.userId
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const practiceId = parseInt(req.params.id);
    if (isNaN(practiceId)) {
      res.status(400).json({ message: "Invalid practice ID" });
      return;
    }
    
    const practice = await getSpeakingPracticeById(practiceId);
    
    if (!practice) {
      res.status(404).json({ message: "Practice not found" });
      return;
    }
    
    // Kiểm tra quyền truy cập (chỉ chủ sở hữu mới được xem)
    if (practice.user_id !== userId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    
    res.json({
      success: true,
      data: practice
    });
  } catch (error: any) {
    console.error("Error in getSpeakingPracticeDetail:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};
