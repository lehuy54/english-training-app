import prisma from '../prisma';
import { updateOrCreateUserProgress } from '../services/progressService';


// tạo quiz_attempts
export const createQuizAttempt = async (user_id: number, content_type: string, content_id: number) => {
  return await prisma.quiz_attempts.create({
    data: {
      user_id,
      content_type,
      content_id
    },
  });
};

// hàm này thực hiện: lấy id của quiz_attempts và tính score dựa theo
// corrected từ questions và selected từ attempts, sau đó là update score đó
// vào quiz_attempts đó và thực hiện tạo tiến độ là đã hoàn thành
export const calculateAndUpdateScore = async (attemptId: number) => {
  const attempt = await prisma.quiz_attempts.findUnique({
    where: { id: attemptId },
    include: {
      quiz_attempt_answers: true
    }
  });

  if (!attempt) throw new Error('Không tìm thấy bài làm');

  const totalQuestions = await prisma.questions.count({
    where: {
      content_type: attempt.content_type,
      content_id: attempt.content_id
    }
  });

  let correctCount = 0;
  for (const ans of attempt.quiz_attempt_answers) {
    const question = await prisma.questions.findUnique({
      where: { id: ans.question_id }
    });

    if (ans.selected_option === question?.correct_answer) {
      correctCount++;
    }
  }

  const score = Math.round((correctCount / totalQuestions) * 20); // Điểm trên thang 20

  await prisma.quiz_attempts.update({
    where: { id: attemptId },
    data: { score }
  });

  // Cập nhật tiến độ học tập
  await updateOrCreateUserProgress(
    attempt.user_id,
    attempt.content_type,
    attempt.content_id
  );

  return { score, totalQuestions, correctCount };
};


// // 🔹 Lấy thông tin chi tiết bài làm có chứa tên nội dung
export const getQuizAttemptDetailsWithContentName = async (attemptId: number) => {
  const attempt = await prisma.quiz_attempts.findUnique({
    where: { id: attemptId },
  });

  if (!attempt) throw new Error('Bài làm không tồn tại');

  let contentName = '';

  if (attempt.content_type === 'topic') {
    const topic = await prisma.topics.findUnique({
      where: { id: attempt.content_id },
      select: { name: true }
    });

    contentName = topic?.name || 'Chủ đề không xác định';
  } else if (attempt.content_type === 'grammar') {
    const lesson = await prisma.grammar_lessons.findUnique({
      where: { id: attempt.content_id },
      select: { title: true }
    });

    contentName = lesson?.title || 'Bài học không xác định';
  } else {
    contentName = 'Nội dung không xác định';
  }

  return {
    content_type: attempt.content_type,
    content_id: attempt.content_id,
    content_name: contentName,
    score: attempt.score,
    submitted_at: attempt.submitted_at
  };
};

// 🔸 Lấy danh sách lịch sử làm bài của người dùng (có tên nội dung)
export const getQuizHistoryByUserId = async (userId: number) => {
  console.log(`Getting quiz history for user ${userId}`);
  // Get all quiz attempts for the user, ordered by most recent first
  const attempts = await prisma.quiz_attempts.findMany({
    where: { user_id: userId },
    orderBy: { submitted_at: 'desc' },
    include: {
      quiz_attempt_answers: {
        select: {
          question_id: true,
          selected_option: true
        }
      }
    }
  });
  
  console.log(`Found ${attempts.length} attempts for user ${userId}`);
  console.log('Sample attempt data:', attempts.length > 0 ? JSON.stringify(attempts[0], null, 2) : 'No attempts');

  const result = [];

  for (const attempt of attempts) {
    // Get content name based on content type
    let contentName = '';
    let contentUrl = '';
    let contentImage = '';
    
    if (attempt.content_type === 'topic') {
      const topic = await prisma.topics.findUnique({
        where: { id: attempt.content_id },
        select: { name: true }
      });
      contentName = topic?.name || 'Chủ đề không xác định';
      contentUrl = `/topics/${attempt.content_id}`;
      contentImage = '';
    } else if (attempt.content_type === 'grammar') {
      const lesson = await prisma.grammar_lessons.findUnique({
        where: { id: attempt.content_id },
        select: { title: true }
      });
      contentName = lesson?.title || 'Bài học không xác định';
      contentUrl = `/grammar-lessons/${attempt.content_id}`;
    }

    // Get total questions count
    const totalQuestions = await prisma.questions.count({
      where: {
        content_type: attempt.content_type,
        content_id: attempt.content_id
      }
    });

    // Calculate correct answers
    let correctCount = 0;
    let answeredCount = 0;
    
    // Log thông tin chi tiết về attempt.quiz_attempt_answers
    console.log(`Attempt ID ${attempt.id} has ${attempt.quiz_attempt_answers.length} answers`);
    
    // Lấy tất cả câu hỏi cho content này
    const questions = await prisma.questions.findMany({
      where: {
        content_type: attempt.content_type,
        content_id: attempt.content_id
      }
    });
    
    console.log(`Found ${questions.length} questions for content ${attempt.content_type}/${attempt.content_id}`);
    
    // Duyệt qua từng câu trả lời và kiểm tra
    for (const answer of attempt.quiz_attempt_answers) {
      if (answer.selected_option > 0) { // Chỉ đếm câu đã trả lời
        answeredCount++;
        
        // Tìm câu hỏi tương ứng
        const question = questions.find(q => q.id === answer.question_id);

        if (question && answer.selected_option === question.correct_answer) {
          correctCount++;
        }
      }
    }
    
    console.log(`Attempt ${attempt.id} stats: ${correctCount}/${answeredCount} correct out of ${totalQuestions} total`);
    
    // Tính điểm trực tiếp từ số câu đúng/tổng số câu
    const percentageScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    // Format submission date
    const submittedDate = attempt.submitted_at ? new Date(attempt.submitted_at) : new Date();
    const formattedDate = submittedDate.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Tạo object kết quả với thông tin đầy đủ
    const resultItem = {
      id: attempt.id,
      user_id: attempt.user_id,
      content_type: attempt.content_type,
      content_type_display: attempt.content_type === 'topic' ? 'Từ vựng' : 'Ngữ pháp',
      content_id: attempt.content_id,
      content_name: contentName,
      content_url: contentUrl,
      content_image: contentImage,
      score: percentageScore / 5, // Đổi từ thông tin cũ để không ảnh hưởng đến mã hiện tại
      percentage_score: percentageScore,
      correct_answers: correctCount,
      total_questions: totalQuestions,
      answer_count: answeredCount,
      submitted_at: attempt.submitted_at,
      formatted_date: formattedDate
    };
    
    console.log(`Result for attempt ${attempt.id}:`, JSON.stringify(resultItem, null, 2));
    result.push(resultItem);
  }

  return result;
};

// 🔸 Lấy chi tiết về một lần làm bài kiểm tra, bao gồm câu hỏi và câu trả lời
export const getQuizAttemptWithAnswers = async (attemptId: number) => {
  // Get the quiz attempt with answers
  const attempt = await prisma.quiz_attempts.findUnique({
    where: { id: attemptId },
    include: {
      quiz_attempt_answers: true
    }
  });

  if (!attempt) throw new Error('Bài làm không tồn tại');

  // Get content name
  let contentName = '';
  let contentUrl = '';
  
  if (attempt.content_type === 'topic') {
    const topic = await prisma.topics.findUnique({
      where: { id: attempt.content_id },
      select: { name: true }
    });
    contentName = topic?.name || 'Chủ đề không xác định';
    contentUrl = `/topics/${attempt.content_id}`;
  } else if (attempt.content_type === 'grammar') {
    const lesson = await prisma.grammar_lessons.findUnique({
      where: { id: attempt.content_id },
      select: { title: true }
    });
    contentName = lesson?.title || 'Bài học không xác định';
    contentUrl = `/grammar-lessons/${attempt.content_id}`;
  }

  // Get questions for this content
  const questions = await prisma.questions.findMany({
    where: {
      content_type: attempt.content_type,
      content_id: attempt.content_id
    }
  });

  // Map user answers with questions
  const answersWithDetails = [];
  
  for (const answer of attempt.quiz_attempt_answers) {
    const question = questions.find(q => q.id === answer.question_id);
    
    if (question) {
      answersWithDetails.push({
        question_id: answer.question_id,
        question_text: question.question_text,
        selected_option: answer.selected_option,
        correct_answer: question.correct_answer,
        is_correct: answer.selected_option === question.correct_answer,
        options: {
          option1: question.option1,
          option2: question.option2,
          option3: question.option3,
          option4: question.option4
        }
      });
    }
  }

  // Calculate stats
  const totalQuestions = questions.length;
  const correctAnswers = answersWithDetails.filter(a => a.is_correct).length;
  const percentageScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  // Format submission date
  const submittedDate = attempt.submitted_at ? new Date(attempt.submitted_at) : new Date();
  const formattedDate = submittedDate.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return {
    id: attempt.id,
    user_id: attempt.user_id,
    content_type: attempt.content_type,
    content_type_display: attempt.content_type === 'topic' ? 'Từ vựng' : 'Ngữ pháp',
    content_id: attempt.content_id,
    content_name: contentName,
    content_url: contentUrl,
    score: attempt.score,
    percentage_score: percentageScore,
    total_questions: totalQuestions,
    correct_answers: correctAnswers,
    submitted_at: attempt.submitted_at,
    formatted_date: formattedDate,
    answers: answersWithDetails
  };
};
