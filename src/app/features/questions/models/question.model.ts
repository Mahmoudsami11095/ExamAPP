export interface Question {
    _id: string;
    question: string;
    options: {
        key: string;
        value: string;
    }[];
    correct: string;
    subject: string;
    exam: string;
}

export interface ApiQuestion extends Omit<Question, 'options'> {
    answers: {
        key: string;
        answer: string;
    }[];
}

export interface QuestionsResponse {
    message: string;
    questions: ApiQuestion[];
}

export interface QuizResult {
    message: string;
    correct: number;
    wrong: number;
    total: number;
    // Add other fields if known, but these are verified usages
}
