import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dataStore } from '../store/dataStore';
import type { QuestionPaper, PaperSnapshot } from '../types';
import '../styles/pages.css';

export const StudentDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [publishedPapers] = useState<QuestionPaper[]>(
    dataStore.getPapersByStatus('Published')
  );
  const [selectedPaper, setSelectedPaper] = useState<QuestionPaper | null>(null);
  const [paperSnapshots, setPaperSnapshots] = useState<PaperSnapshot[]>([]);
  const [subjects] = useState(dataStore.getSubjects());

  const handleViewPaper = (paper: QuestionPaper) => {
    setSelectedPaper(paper);
    setPaperSnapshots(dataStore.getSnapshotsByPaper(paper.id));
  };

  const handleLogout = () => {
    logout();
  };

  const handlePrint = () => {
    window.print();
  };

  if (selectedPaper) {
    return (
      <div className="dashboard">
        <header className="header">
          <h1>{selectedPaper.title}</h1>
          <div className="user-info">
            <button onClick={() => setSelectedPaper(null)} className="btn-secondary">
              Back
            </button>
            <button onClick={handlePrint} className="btn-primary">
              Print
            </button>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </header>

        <div className="paper-container">
          <div className="paper-header">
            <h2>{selectedPaper.title}</h2>
            <p>Subject: {subjects.find((s) => s.id === selectedPaper.subjectId)?.name}</p>
            <p>Total Marks: {selectedPaper.totalMarks}</p>
            <p>Date: {new Date(selectedPaper.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="questions-section">
            <h3>Questions</h3>
            {paperSnapshots.map((snapshot, idx) => (
              <div key={snapshot.id} className="question-card">
                <h4>
                  Q{idx + 1}. {snapshot.snapshotText}
                </h4>
                {snapshot.snapshotOptions && (
                  <div className="options">
                    {snapshot.snapshotOptions.map((opt, optIdx) => (
                      <div key={optIdx} className="option">
                        {String.fromCharCode(65 + optIdx)}) {opt}
                      </div>
                    ))}
                  </div>
                )}
                <p className="marks">Marks: {snapshot.marks}</p>
              </div>
            ))}
          </div>

          <div className="answer-key no-print">
            <h3>Answer Key (Examiner Copy)</h3>
            {paperSnapshots.map((snapshot, idx) => (
              <div key={snapshot.id} className="answer-item">
                <strong>Q{idx + 1}:</strong> {snapshot.snapshotCorrectAnswer}
                {snapshot.snapshotExplanation && (
                  <p className="explanation">{snapshot.snapshotExplanation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Student Dashboard</h1>
        <div className="user-info">
          <span>{currentUser?.email}</span>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{publishedPapers.length}</h3>
          <p>Published Papers</p>
        </div>
      </div>

      <section className="section">
        <h2>Available Question Papers</h2>
        <div className="papers-grid">
          {publishedPapers.map((paper) => (
            <div key={paper.id} className="paper-card">
              <h3>{paper.title}</h3>
              <p>Subject: {subjects.find((s) => s.id === paper.subjectId)?.name}</p>
              <p>Marks: {paper.totalMarks}</p>
              <p>Published: {new Date(paper.createdAt).toLocaleDateString()}</p>
              <button
                onClick={() => handleViewPaper(paper)}
                className="btn-primary"
              >
                View Paper
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
