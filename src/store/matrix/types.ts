export interface Matrix {
  id: string;
  name: string;
  questions: Question[];
  userId: string;
  createdAt: Date;
}

export interface Question {
  id: string;
  text: string;
  responseType: 'text' | 'multiple' | 'number' | 'boolean';
}

export interface MatrixAnalysis {
  id: string;
  //matrixId: string;
  userId: string;
  name: string;
  responses: {
    questionId: string;
    response: string;
  }[];
  createdAt: Date;
}

export interface MatrixState {
  matrices: Matrix[];
  analyses: MatrixAnalysis[];
  loading: boolean;
  error: string | null;
  fetchMatrices: (userId: string) => Promise<void>;
  fetchAnalyses: (userId: string) => Promise<void>;
  fetchAllAnalyses: (userId: string) => Promise<void>;
  saveAnalysis: (matrixId: string, responses: Record<string, string>, name: string) => Promise<string>;
}
