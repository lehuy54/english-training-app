// Import Prisma client từ thư viện chuẩn
import prisma  from "../prisma";
import axios from "axios";
import config from "../config";

// Interface định nghĩa cấu trúc phản hồi từ API Ollama
interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

// Hàm gọi API AI từ server Ollama thông qua ngrok
export const generateAIResponse = async (
  context: string,
  tone: string,
  audience: string,
  content: string
) => {
  try {
    // URL của ngrok được expose từ máy chạy Ollama
    const OLLAMA_API_URL = config.ollamaApiUrl;
    
    // Xử lý URL để tránh trường hợp URL có dấu / ở cuối
    const apiUrl = OLLAMA_API_URL.endsWith('/') 
      ? `${OLLAMA_API_URL.slice(0, -1)}/api/generate` 
      : `${OLLAMA_API_URL}/api/generate`;
    
    // Tạo prompt cho mô hình dựa trên thông tin người dùng cung cấp
    const prompt = `
    TÔi đang muốn nói chuyện với một người khác bằng tiếng Anh
    
    trong ngữ cảnh: ${context},
    với giọng điệu: ${tone},
    người tôi đang muốn nói đến là: ${audience}
    nội dung cụ thể tôi muốn nói: "${content}".

    Hãy response lại câu trả lời cho tôi bằng tiếng Anh và Lưu ý đừng phản hồi nó dưới dạng mail, hãy phản hồi nó dưới dạng như một câu trả lời nằm trong dấu ngoặc kép
    `;

    // Gọi API Ollama
    const response = await axios.post<OllamaResponse>(apiUrl, {
      // model: "deepseek-r1:14b", // Thay đổi tên model sang llama2 vì llama3 không được tìm thấy
      model: "phi4:latest",
      prompt: prompt,
      stream: false
    });

    return response.data.response;
  } catch (error: any) {
    
    // Xử lý các loại lỗi khác nhau
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      throw new Error(`Không thể kết nối đến Ollama API. Vui lòng kiểm tra URL và kết nối.`);
    }
    
    if (error.response) {
      // Lỗi từ API server (2xx, 4xx, 5xx)
      throw new Error(`Lỗi từ Ollama API: ${error.response.status} - ${error.response.data?.message || error.message}`);
    }
    
    throw new Error(`Không thể tạo nội dung AI: ${error.message}`);
  }
};

// Lưu lịch sử luyện nói
export const saveSpeakingPractice = async (
  userId: number,
  context: string,
  tone: string,
  audience: string,
  content: string,
  aiResponse: string
) => {
  try {
    const practice = await prisma.speaking_practice_history.create({
      data: {
        user_id: userId,
        context,
        tone,
        audience,
        content,
        ai_response: aiResponse,
      },
    });
    
    return practice;
  } catch (error: any) {
    
    // Xử lý các loại lỗi cụ thể
    if (error.code === 'P2003') {
      throw new Error(`Người dùng với ID ${userId} không tồn tại.`);
    }
    
    if (error.code === 'P2002') {
      throw new Error("Dữ liệu đã tồn tại trong hệ thống.");
    }
    
    throw new Error(`Không thể lưu lịch sử luyện nói: ${error.message}`);
  }
};

// Lấy lịch sử luyện nói của người dùng
export const getSpeakingPracticeHistory = async (userId: number) => {
  try {
    const history = await prisma.speaking_practice_history.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    
    return history;
  } catch (error: any) {
    
    // Xử lý các loại lỗi cụ thể
    if (error.code === 'P2021') {
      throw new Error("Bảng speaking_practice_history không tồn tại trong database. Hãy chạy prisma migrate.");
    }
    
    throw new Error(`Không thể lấy lịch sử luyện nói: ${error.message}`);
  }
};

// Lấy chi tiết một lần luyện nói cụ thể
export const getSpeakingPracticeById = async (id: number) => {
  try {
    const practice = await prisma.speaking_practice_history.findUnique({
      where: {
        id,
      },
    });
    
    if (!practice) {
      throw new Error(`Bài luyện nói với ID ${id} không tồn tại.`);
    }
    
    return practice;
  } catch (error: any) {
    
    // Xử lý các loại lỗi cụ thể
    if (error.code === 'P2021') {
      throw new Error("Bảng speaking_practice_history không tồn tại trong database. Hãy chạy prisma migrate.");
    }
    
    // Trả về lỗi từ mục if ở trên nếu có
    if (error.message.includes('không tồn tại')) {
      throw error;
    }
    
    throw new Error(`Không thể lấy chi tiết bài luyện nói: ${error.message}`);
  }
};
