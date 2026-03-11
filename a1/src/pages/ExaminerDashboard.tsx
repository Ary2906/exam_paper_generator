import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dataStore } from '../store/dataStore';
import type { Question, QuestionPaper } from '../types';
import { exportPDFFromElement } from '../utils/pdfExport';
import { PaperEditor } from '../components/PaperEditor';
import '../styles/pages.css';

interface TabType {
  type: 'overview' | 'questions' | 'papers';
}

export const ExaminerDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType['type']>('overview');
  const [questions, setQuestions] = useState<Question[]>(
    dataStore.getQuestionsByExaminer(currentUser!.id)
  );
  const [papers, setPapers] = useState<QuestionPaper[]>(
    dataStore.getPapersByExaminer(currentUser!.id)
  );
  const [subjects] = useState(dataStore.getSubjects());
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showAddPaper, setShowAddPaper] = useState(false);
  const [editingPaper, setEditingPaper] = useState<QuestionPaper | null>(null);

  const [newQuestion, setNewQuestion] = useState({
    subjectId: subjects[0]?.id || '',
    text: '',
    type: 'MCQ' as const,
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    difficulty: 'Medium' as const,
    visibility: 'Personal' as const,
  });

  const [newPaper, setNewPaper] = useState({
    title: '',
    subjectId: subjects[0]?.id || '',
    totalMarks: 100,
  });

  const handleAddQuestion = () => {
    if (newQuestion.text.trim()) {
      const question = dataStore.addQuestion({
        ...newQuestion,
        createdBy: currentUser!.id,
      });
      setQuestions([...questions, question]);
      setNewQuestion({
        subjectId: subjects[0]?.id || '',
        text: '',
        type: 'MCQ',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        difficulty: 'Medium',
        visibility: 'Personal',
      });
      setShowAddQuestion(false);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Are you sure?')) {
      dataStore.deleteQuestion(id);
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleAddPaper = () => {
    if (newPaper.title.trim()) {
      const paper = dataStore.addPaper({
        ...newPaper,
        createdBy: currentUser!.id,
        status: 'Saved',
      });
      setPapers([...papers, paper]);
      setNewPaper({
        title: '',
        subjectId: subjects[0]?.id || '',
        totalMarks: 100,
      });
      setShowAddPaper(false);
    }
  };

  const handleDeletePaper = (id: string) => {
    if (confirm('Are you sure?')) {
      dataStore.deletePaper(id);
      setPapers(papers.filter((p) => p.id !== id));
    }
  };

  const handleEditPaper = (paper: QuestionPaper) => {
    setEditingPaper(paper);
  };

  const handleClosePaperEditor = () => {
    setEditingPaper(null);
  };

  const handleSavePaper = () => {
    setPapers([...dataStore.getPapersByExaminer(currentUser!.id)]);
    handleClosePaperEditor();
  };

  const handleExportPaperPDF = (paper: QuestionPaper) => {
    const snapshots = dataStore.getSnapshotsByPaper(paper.id);
    if (snapshots.length === 0) {
      alert('No questions in this paper');
      return;
    }

    const tempElementId = `paper-export-${Date.now()}`;
    const container = document.createElement('div');
    container.id = tempElementId;
    container.style.display = 'none';

    const subject = subjects.find((s) => s.id === paper.subjectId);

    // Build content using DOM methods (more efficient than string concatenation)
    container.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="text-align: center;">${paper.title}</h2>
        <p style="text-align: center;"><strong>Subject:</strong> ${subject?.name || 'N/A'}</p>
        <p style="text-align: center;"><strong>Marks:</strong> ${paper.totalMarks}</p>
        <p style="text-align: center;"><strong>Date:</strong> ${new Date(paper.createdAt).toLocaleDateString()}</p>
        <hr style="margin: 20px 0;"><h3>Questions</h3>
    `;

    // Add questions
    const questionsSection = document.createElement('div');
    snapshots.forEach((snapshot, idx) => {
      const q = document.createElement('div');
      q.style.marginBottom = '20px';
      q.innerHTML = `
        <p><strong>Q${idx + 1}. ${snapshot.snapshotText}</strong></p>
        ${snapshot.snapshotOptions?.length ? `<ol type="a" style="margin: 10px 0;">${snapshot.snapshotOptions.map(opt => `<li>${opt}</li>`).join('')}</ol>` : ''}
        <p style="margin: 10px 0;"><strong>Marks:</strong> ${snapshot.marks}</p>
      `;
      questionsSection.appendChild(q);
    });
    container.appendChild(questionsSection);

    // Add answer key
    const answerSection = document.createElement('div');
    answerSection.innerHTML = '<hr style="margin: 20px 0;"><h3>Answer Key</h3>';
    snapshots.forEach((snapshot, idx) => {
      const answer = document.createElement('div');
      answer.style.marginBottom = '15px';
      answer.innerHTML = `<p><strong>Q${idx + 1}:</strong> ${snapshot.snapshotCorrectAnswer}${snapshot.snapshotExplanation ? `<br/><em style="color: #666;">Explanation: ${snapshot.snapshotExplanation}</em>` : ''}</p>`;
      answerSection.appendChild(answer);
    });
    container.appendChild(answerSection);

    document.body.appendChild(container);

    const filename = `${paper.title.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
    exportPDFFromElement(tempElementId, filename);

    // Cleanup
    setTimeout(() => document.body.removeChild(container), 1000);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Examiner Dashboard</h1>
        <div className="user-info">
          <span>{currentUser?.email}</span>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          Question Bank
        </button>
        <button
          className={`tab ${activeTab === 'papers' ? 'active' : ''}`}
          onClick={() => setActiveTab('papers')}
        >
          Question Papers
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{questions.length}</h3>
            <p>Questions Created</p>
          </div>
          <div className="stat-card">
            <h3>{papers.length}</h3>
            <p>Papers Created</p>
          </div>
          <div className="stat-card">
            <h3>{papers.filter((p) => p.status === 'Published').length}</h3>
            <p>Published Papers</p>
          </div>
        </div>
      )}

      {activeTab === 'questions' && (
        <section className="section">
          <div className="section-header">
            <h2>Question Bank</h2>
            <button
              onClick={() => setShowAddQuestion(!showAddQuestion)}
              className="btn-primary"
            >
              {showAddQuestion ? 'Cancel' : 'Add Question'}
            </button>
          </div>

          {showAddQuestion && (
            <div className="form-card">
              <div className="form-group">
                <label>Subject</label>
                <select
                  value={newQuestion.subjectId}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, subjectId: e.target.value })
                  }
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Question Text</label>
                <textarea
                  value={newQuestion.text}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, text: e.target.value })
                  }
                  placeholder="Enter question"
                />
              </div>

              <div className="form-group">
                <label>Question Type</label>
                <select
                  value={newQuestion.type}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, type: e.target.value as any })
                  }
                >
                  <option>MCQ</option>
                  <option>ShortAnswer</option>
                  <option>LongAnswer</option>
                  <option>TrueFalse</option>
                </select>
              </div>

              {(newQuestion.type === 'MCQ' || newQuestion.type === 'TrueFalse') && (
                <div className="form-group">
                  <label>Options</label>
                  {newQuestion.options.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const opts = [...newQuestion.options];
                        opts[idx] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: opts });
                      }}
                      placeholder={`Option ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              <div className="form-group">
                <label>Correct Answer</label>
                <input
                  type="text"
                  value={newQuestion.correctAnswer}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, correctAnswer: e.target.value as any })
                  }
                  placeholder="Enter correct answer"
                />
              </div>

              <div className="form-group">
                <label>Explanation</label>
                <textarea
                  value={newQuestion.explanation}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, explanation: e.target.value })
                  }
                  placeholder="Explanation"
                />
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select
                  value={newQuestion.difficulty}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, difficulty: e.target.value as any })
                  }
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label>Visibility</label>
                <select
                  value={newQuestion.visibility}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, visibility: e.target.value as any })
                  }
                >
                  <option>Personal</option>
                  <option>Public</option>
                </select>
              </div>

              <button onClick={handleAddQuestion} className="btn-primary">
                Create Question
              </button>
            </div>
          )}

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Subject</th>
                  <th>Type</th>
                  <th>Difficulty</th>
                  <th>Visibility</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id}>
                    <td>{q.text.substring(0, 50)}...</td>
                    <td>{subjects.find((s) => s.id === q.subjectId)?.name}</td>
                    <td>{q.type}</td>
                    <td>{q.difficulty}</td>
                    <td>
                      <span className={`badge badge-${q.visibility.toLowerCase()}`}>
                        {q.visibility}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'papers' && (
        <section className="section">
          <div className="section-header">
            <h2>Question Papers</h2>
            <button
              onClick={() => setShowAddPaper(!showAddPaper)}
              className="btn-primary"
            >
              {showAddPaper ? 'Cancel' : 'Create Paper'}
            </button>
          </div>

          {showAddPaper && (
            <div className="form-card">
              <div className="form-group">
                <label>Paper Title</label>
                <input
                  type="text"
                  value={newPaper.title}
                  onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
                  placeholder="e.g., Mathematics Mid-Term"
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <select
                  value={newPaper.subjectId}
                  onChange={(e) => setNewPaper({ ...newPaper, subjectId: e.target.value })}
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Total Marks</label>
                <input
                  type="number"
                  value={newPaper.totalMarks}
                  onChange={(e) =>
                    setNewPaper({ ...newPaper, totalMarks: Number(e.target.value) })
                  }
                />
              </div>

              <button onClick={handleAddPaper} className="btn-primary">
                Create Paper
              </button>
            </div>
          )}

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {papers.map((p) => (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td>{subjects.find((s) => s.id === p.subjectId)?.name}</td>
                    <td>
                      <span className={`badge badge-${p.status.toLowerCase()}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleExportPaperPDF(p)}
                        className="btn-secondary"
                        title="Export as PDF"
                      >
                        📥 PDF
                      </button>
                      <button
                        onClick={() => handleEditPaper(p)}
                        className="btn-info"
                        disabled={p.status === 'Published'}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePaper(p.id)}
                        className="btn-danger"
                        disabled={p.status === 'Published'}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {editingPaper && (
        <PaperEditor
          paper={editingPaper}
          onClose={handleClosePaperEditor}
          onSave={handleSavePaper}
        />
      )}
    </div>
  );
};
