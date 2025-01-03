export interface MatrixAnalysis {
  id: string;
  matrixId: string;
  fileId: string;
  userId: string;
  name: string;
  responses: {
    questionId: string;
    response: string;
  }[];
  createdAt: Date;
}