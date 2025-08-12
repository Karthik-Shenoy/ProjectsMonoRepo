export type ActiveRecallData = {
    questions: ActiveRecallQuestion[];
};

export interface ActiveRecallQuestion {
    question: string;
    choices: string[];
    answers: number[];
}

export interface ActiveRecallSession {
    questions: ActiveRecallQuestion[];
    userAnswers: number[][];
    score: number;
    /**
     * The date when the session was created or last modified.
     */
    lastModifiedDate: string;
    isPending: boolean;
}

export const ACTIVE_RECALL_FOLDER_NAME = "ACTIVE_RECALL";
export const ACTIVE_RECALL_QUESTION_FILE_NAME = "questions.json";
