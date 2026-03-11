import type { User, Subject, Question, QuestionPaper, PaperSnapshot, PaperReviewAssignment, AppState } from '../types';

// Default initial data
const INITIAL_STATE: AppState = {
  users: [
    {
      id: 'user1',
      username: 'admin',
      email: 'admin@exam.com',
      password: 'admin123', // In production, use hashed passwords
      role: 'Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user2',
      username: 'examiner1',
      email: 'examiner1@exam.com',
      password: 'examiner123',
      role: 'Examiner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user3',
      username: 'student1',
      email: 'student1@exam.com',
      password: 'student123',
      role: 'Student',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  subjects: [
    {
      id: 'subject1',
      name: 'Mathematics',
      description: 'Advanced Mathematics Topics',
      createdBy: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'subject2',
      name: 'Physics',
      description: 'Physics and Mechanics',
      createdBy: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'subject3',
      name: 'English',
      description: 'English Literature and Grammar',
      createdBy: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  questions: [
    {
      id: 'q1',
      subjectId: 'subject1',
      text: 'What is the value of π (pi)?',
      type: 'MCQ',
      options: ['3.14159...', '2.71828...', '1.41421...', '1.61803...'],
      correctAnswer: 0,
      explanation: 'π is approximately 3.14159, used in circle calculations.',
      difficulty: 'Easy',
      visibility: 'Public',
      createdBy: 'user2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'q2',
      subjectId: 'subject1',
      text: 'Solve: 2x + 5 = 13',
      type: 'ShortAnswer',
      correctAnswer: 'x = 4',
      explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2.',
      difficulty: 'Easy',
      visibility: 'Public',
      createdBy: 'user2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'q3',
      subjectId: 'subject2',
      text: 'What is the SI unit of force?',
      type: 'MCQ',
      options: ['Newton', 'Joule', 'Watt', 'Pascal'],
      correctAnswer: 0,
      explanation: 'Newton (N) is the SI unit of force. 1 N = 1 kg·m/s².',
      difficulty: 'Easy',
      visibility: 'Public',
      createdBy: 'user2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'q4',
      subjectId: 'subject3',
      text: 'What is the main theme of "To Kill a Mockingbird"?',
      type: 'LongAnswer',
      correctAnswer: 'The main theme is racial injustice and moral growth.',
      explanation: 'Harper Lee explores racial prejudice, loss of innocence, and moral courage.',
      difficulty: 'Medium',
      visibility: 'Personal',
      createdBy: 'user2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  papers: [
    {
      id: 'paper1',
      title: 'Mathematics Mid-Term Exam',
      subjectId: 'subject1',
      totalMarks: 100,
      createdBy: 'user2',
      status: 'Saved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'paper2',
      title: 'Physics Final Exam',
      subjectId: 'subject2',
      totalMarks: 100,
      createdBy: 'user2',
      status: 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    },
  ],
  paperSnapshots: [
    {
      id: 'snap1',
      paperId: 'paper2',
      questionId: 'q3',
      snapshotText: 'What is the SI unit of force?',
      snapshotType: 'MCQ',
      snapshotOptions: ['Newton', 'Joule', 'Watt', 'Pascal'],
      snapshotCorrectAnswer: 0,
      snapshotExplanation: 'Newton (N) is the SI unit of force. 1 N = 1 kg·m/s².',
      snapshotDifficulty: 'Easy',
      order: 1,
      marks: 5,
    },
  ],
  reviewAssignments: [],
};

// Data Store Manager
export class DataStore {
  private data: AppState;
  private storageKey = 'exam_paper_generator_data';

  constructor() {
    this.data = this.loadFromStorage();
  }

  private loadFromStorage(): AppState {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : INITIAL_STATE;
    } catch (error) {
      console.error('Failed to load data from storage:', error);
      return INITIAL_STATE;
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save data to storage:', error);
    }
  }

  // Users
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  getUserByUsername(username: string): User | undefined {
    return this.data.users.find((u) => u.username === username);
  }

  addUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const newUser: User = {
      ...user,
      id: `user${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.saveToStorage();
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const user = this.data.users.find((u) => u.id === id);
    if (!user) return null;
    const updated = { ...user, ...updates, updatedAt: new Date().toISOString() };
    const index = this.data.users.indexOf(user);
    this.data.users[index] = updated;
    this.saveToStorage();
    return updated;
  }

  deleteUser(id: string): boolean {
    const index = this.data.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.data.users.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Subjects
  getSubjects(): Subject[] {
    return this.data.subjects;
  }

  getSubjectById(id: string): Subject | undefined {
    return this.data.subjects.find((s) => s.id === id);
  }

  addSubject(subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>): Subject {
    const newSubject: Subject = {
      ...subject,
      id: `subject${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.subjects.push(newSubject);
    this.saveToStorage();
    return newSubject;
  }

  updateSubject(id: string, updates: Partial<Subject>): Subject | null {
    const subject = this.data.subjects.find((s) => s.id === id);
    if (!subject) return null;
    const updated = { ...subject, ...updates, updatedAt: new Date().toISOString() };
    const index = this.data.subjects.indexOf(subject);
    this.data.subjects[index] = updated;
    this.saveToStorage();
    return updated;
  }

  deleteSubject(id: string): boolean {
    const index = this.data.subjects.findIndex((s) => s.id === id);
    if (index === -1) return false;
    this.data.subjects.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Questions
  getQuestions(): Question[] {
    return this.data.questions;
  }

  getQuestionById(id: string): Question | undefined {
    return this.data.questions.find((q) => q.id === id);
  }

  getQuestionsBySubject(subjectId: string): Question[] {
    return this.data.questions.filter((q) => q.subjectId === subjectId);
  }

  getQuestionsByExaminer(examinerId: string): Question[] {
    return this.data.questions.filter((q) => q.createdBy === examinerId);
  }

  getPublicQuestions(): Question[] {
    return this.data.questions.filter((q) => q.visibility === 'Public');
  }

  addQuestion(question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Question {
    const newQuestion: Question = {
      ...question,
      id: `q${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.questions.push(newQuestion);
    this.saveToStorage();
    return newQuestion;
  }

  updateQuestion(id: string, updates: Partial<Question>): Question | null {
    const question = this.data.questions.find((q) => q.id === id);
    if (!question) return null;
    const updated = { ...question, ...updates, updatedAt: new Date().toISOString() };
    const index = this.data.questions.indexOf(question);
    this.data.questions[index] = updated;
    this.saveToStorage();
    return updated;
  }

  deleteQuestion(id: string): boolean {
    const index = this.data.questions.findIndex((q) => q.id === id);
    if (index === -1) return false;
    this.data.questions.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Question Papers
  getPapers(): QuestionPaper[] {
    return this.data.papers;
  }

  getPaperById(id: string): QuestionPaper | undefined {
    return this.data.papers.find((p) => p.id === id);
  }

  getPapersByExaminer(examinerId: string): QuestionPaper[] {
    return this.data.papers.filter((p) => p.createdBy === examinerId);
  }

  getPapersByStatus(status: string): QuestionPaper[] {
    return this.data.papers.filter((p) => p.status === status);
  }

  addPaper(paper: Omit<QuestionPaper, 'id' | 'createdAt' | 'updatedAt'>): QuestionPaper {
    const newPaper: QuestionPaper = {
      ...paper,
      id: `paper${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.papers.push(newPaper);
    this.saveToStorage();
    return newPaper;
  }

  updatePaper(id: string, updates: Partial<QuestionPaper>): QuestionPaper | null {
    const paper = this.data.papers.find((p) => p.id === id);
    if (!paper) return null;
    const updated = { ...paper, ...updates, updatedAt: new Date().toISOString() };
    const index = this.data.papers.indexOf(paper);
    this.data.papers[index] = updated;
    this.saveToStorage();
    return updated;
  }

  deletePaper(id: string): boolean {
    const index = this.data.papers.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.data.papers.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Paper Snapshots
  getPaperSnapshots(): PaperSnapshot[] {
    return this.data.paperSnapshots;
  }

  getSnapshotsByPaper(paperId: string): PaperSnapshot[] {
    return this.data.paperSnapshots.filter((s) => s.paperId === paperId);
  }

  addSnapshot(snapshot: Omit<PaperSnapshot, 'id'>): PaperSnapshot {
    const newSnapshot: PaperSnapshot = {
      ...snapshot,
      id: `snap${Date.now()}`,
    };
    this.data.paperSnapshots.push(newSnapshot);
    this.saveToStorage();
    return newSnapshot;
  }

  // Review Assignments
  getReviewAssignments(): PaperReviewAssignment[] {
    return this.data.reviewAssignments;
  }

  getAssignmentsByPaper(paperId: string): PaperReviewAssignment[] {
    return this.data.reviewAssignments.filter((a) => a.paperId === paperId);
  }

  getAssignmentsByReviewer(reviewerId: string): PaperReviewAssignment[] {
    return this.data.reviewAssignments.filter((a) => a.reviewerId === reviewerId);
  }

  addReviewAssignment(assignment: PaperReviewAssignment): PaperReviewAssignment {
    this.data.reviewAssignments.push(assignment);
    this.saveToStorage();
    return assignment;
  }

  // Export
  exportAll(): AppState {
    return JSON.parse(JSON.stringify(this.data));
  }

  exportQuestionsByExaminer(examinerId: string): Question[] {
    return this.data.questions.filter((q) => q.createdBy === examinerId);
  }

  // Clear all data
  resetToInitial(): void {
    this.data = JSON.parse(JSON.stringify(INITIAL_STATE));
    this.saveToStorage();
  }
}

// Create a singleton instance
export const dataStore = new DataStore();
