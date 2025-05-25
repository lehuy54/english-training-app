-- CreateTable
CREATE TABLE "flashcards" (
    "id" SERIAL NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "vocabulary" VARCHAR(255) NOT NULL,
    "phonetics" VARCHAR(255),
    "vietnamese_meaning" VARCHAR(255),
    "description" TEXT,
    "example" TEXT,

    CONSTRAINT "flashcards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grammar_lessons" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "video_url" VARCHAR(255),

    CONSTRAINT "grammar_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "content_type" VARCHAR(10) NOT NULL,
    "content_id" INTEGER NOT NULL,
    "content_name" VARCHAR(255),
    "question_text" TEXT NOT NULL,
    "option1" VARCHAR(255) NOT NULL,
    "option2" VARCHAR(255) NOT NULL,
    "option3" VARCHAR(255) NOT NULL,
    "option4" VARCHAR(255) NOT NULL,
    "correct_answer" SMALLINT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_attempt_answers" (
    "attempt_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "selected_option" SMALLINT NOT NULL,

    CONSTRAINT "quiz_attempt_answers_pkey" PRIMARY KEY ("attempt_id","question_id")
);

-- CreateTable
CREATE TABLE "quiz_attempts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "content_type" VARCHAR(10) NOT NULL,
    "content_id" INTEGER NOT NULL,
    "submitted_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "score" SMALLINT,

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress" (
    "user_id" INTEGER NOT NULL,
    "content_type" VARCHAR(10) NOT NULL,
    "content_id" INTEGER NOT NULL,
    "completed_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("user_id","content_type","content_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "display_name" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "registered_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "role" VARCHAR(10) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speaking_practice_history" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "context" TEXT,
    "tone" TEXT,
    "audience" TEXT,
    "content" TEXT NOT NULL,
    "ai_response" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "speaking_practice_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_flashcards_topic" ON "flashcards"("topic_id");

-- CreateIndex
CREATE INDEX "idx_questions_content" ON "questions"("content_type", "content_id");

-- CreateIndex
CREATE INDEX "idx_quiz_attempts_user" ON "quiz_attempts"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_progress" ON "user_progress"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_speaking_practice_user" ON "speaking_practice_history"("user_id");

-- AddForeignKey
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quiz_attempt_answers" ADD CONSTRAINT "quiz_attempt_answers_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "quiz_attempts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quiz_attempt_answers" ADD CONSTRAINT "quiz_attempt_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "speaking_practice_history" ADD CONSTRAINT "speaking_practice_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
