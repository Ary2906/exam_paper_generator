/* User & Authentication Types */
export type UserRole = 'Admin' | 'Examiner' | 'Student';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // In production, this should be hashed
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/* Subject Types */
export interface Subject {
  id: string;
  name: string;
  description?: string;
  createdBy: string; // Admin ID
  createdAt: string;
  updatedAt: string;
}

/* Question Bank Types */
export type QuestionVisibility = 'Personal' | 'Public';
export type QuestionType = 'MCQ' | 'ShortAnswer' | 'LongAnswer' | 'TrueFalse';

export interface Question {
  id: string;
  subjectId: string;
  text: string;
  type: QuestionType;
  options?: string[]; // For MCQ and TrueFalse
  correctAnswer: string | number; // Index for MCQ/TrueFalse, or text for short/long
  explanation?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  visibility: QuestionVisibility;
  createdBy: string; // Examiner ID
  createdAt: string;
  updatedAt: string;
}

/* Question Paper Types */
export type PaperStatus = 'Saved' | 'In Review' | 'Published';

export interface QuestionPaper {
  id: string;
  title: string;
  subjectId: string;
  totalMarks?: number;
  createdBy: string; // Examiner ID
  reviewedBy?: string; // Reviewer Examiner ID
  status: PaperStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

/* Paper Snapshot Types - The Immutable Copy */
export interface PaperSnapshot {
  id: string;
  paperId: string;
  questionId: string; // Reference to original question for traceability
  snapshotText: string; // Original question text at time of generation
  snapshotType: QuestionType;
  snapshotOptions?: string[]; // Original options at time of generation
  snapshotCorrectAnswer: string | number;
  snapshotExplanation?: string;
  snapshotDifficulty?: 'Easy' | 'Medium' | 'Hard';
  order: number; // Question order in the paper
  marks?: number;
}

/* Examiner Reviewer Types */
export interface PaperReviewAssignment {
  paperId: string;
  reviewerId: string; // Examiner who is reviewing
  assignedAt: string;
  notes?: string;
}

/* Export Types */
export interface ExportData {
  questions: Question[];
  exportDate: string;
  exportedBy: string;
}

/* Application State Types */
export interface AppState {
  users: User[];
  subjects: Subject[];
  questions: Question[];
  papers: QuestionPaper[];
  paperSnapshots: PaperSnapshot[];
  reviewAssignments: PaperReviewAssignment[];
}

/* Auth Context Types */
export interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => boolean;
}

/* Filter & Search Types */
export interface QuestionFilter {
  subjectId?: string;
  visibility?: QuestionVisibility;
  difficulty?: string;
  type?: QuestionType;
  createdBy?: string;
  searchText?: string;
}

export interface PaperFilter {
  subjectId?: string;
  status?: PaperStatus;
  createdBy?: string;
  searchText?: string;
}
