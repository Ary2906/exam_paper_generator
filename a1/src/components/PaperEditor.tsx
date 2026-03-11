import React, { useState } from 'react';
import type { QuestionPaper, Question, PaperSnapshot } from '../types';
import { dataStore } from '../store/dataStore';
import '../styles/pages.css';

interface PaperEditorProps {
  paper: QuestionPaper;
  onClose: () => void;
  onSave: () => void;
}

export const PaperEditor: React.FC<PaperEditorProps> = ({ paper, onClose, onSave }) => {
  const [availableQuestions] = useState<Question[]>(
    dataStore.getQuestionsBySubject(paper.subjectId)
  );
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [snapshots, setSnapshots] = useState<PaperSnapshot[]>(
    dataStore.getSnapshotsByPaper(paper.id)
  );
  const [marks, setMarks] = useState<{ [key: string]: number }>({});
  const [showPublish, setShowPublish] = useState(false);

  const handleAddQuestion = (questionId: string) => {
    if (!selectedQuestions.includes(questionId)) {
      setSelectedQuestions([...selectedQuestions, questionId]);
      setMarks({ ...marks, [questionId]: 5 });
    }
  };

  const handleRemoveQuestion = (questionId: string) => {
    setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
    const newMarks = { ...marks };
    delete newMarks[questionId];
    setMarks(newMarks);
  };

  const handleGenerateSnapshots = () => {
    const existingSnapshots = dataStore.getSnapshotsByPaper(paper.id);
    
    // Delete existing snapshots first
    existingSnapshots.forEach(snap => {
      const snapshots = dataStore.getPaperSnapshots();
      const index = snapshots.findIndex(s => s.id === snap.id);
      if (index !== -1) {
        // We'll just update the paper with new snapshots
      }
    });

    // Create snapshots for each selected question
    const newSnapshots: PaperSnapshot[] = selectedQuestions.map((qId, idx) => {
      const question = dataStore.getQuestionById(qId);
      if (!question) return null as any;

      return dataStore.addSnapshot({
        paperId: paper.id,
        questionId: question.id,
        snapshotText: question.text,
        snapshotType: question.type,
        snapshotOptions: question.options,
        snapshotCorrectAnswer: question.correctAnswer,
        snapshotExplanation: question.explanation,
        snapshotDifficulty: question.difficulty,
        order: idx + 1,
        marks: marks[qId] || 5,
      });
    }).filter(Boolean);

    setSnapshots(newSnapshots);
    alert(`Generated ${newSnapshots.length} question snapshots!`);
  };

  const handlePublish = () => {
    if (snapshots.length === 0) {
      alert('Please add questions to the paper first!');
      return;
    }

    dataStore.updatePaper(paper.id, {
      status: 'Published',
      publishedAt: new Date().toISOString(),
    });

    setShowPublish(false);
    onSave();
    alert('Paper published successfully!');
  };

  const getQuestionName = (id: string) => {
    const q = dataStore.getQuestionById(id);
    return q ? q.text.substring(0, 50) + '...' : 'Unknown';
  };

  return (
    <div className="paper-editor-overlay">
      <div className="paper-editor-modal">
        <div className="editor-header">
          <h2>Edit Paper: {paper.title}</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <div className="editor-content">
          <div className="questions-list">
            <h3>Available Questions</h3>
            <div className="questions-select">
              {availableQuestions.map((q) => (
                <div key={q.id} className="question-item">
                  <input
                    type="checkbox"
                    id={`q-${q.id}`}
                    checked={selectedQuestions.includes(q.id)}
                    onChange={(e) =>
                      e.target.checked ? handleAddQuestion(q.id) : handleRemoveQuestion(q.id)
                    }
                  />
                  <label htmlFor={`q-${q.id}`}>
                    {q.text.substring(0, 50)}...
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="selected-questions">
            <h3>Selected Questions & Marks</h3>
            {selectedQuestions.length === 0 ? (
              <p className="no-selection">No questions selected yet</p>
            ) : (
              <div className="marks-table">
                {selectedQuestions.map((qId, idx) => (
                  <div key={qId} className="marks-row">
                    <span>Q{idx + 1}. {getQuestionName(qId)}</span>
                    <div className="marks-input">
                      <input
                        type="number"
                        min="1"
                        value={marks[qId] || 5}
                        onChange={(e) =>
                          setMarks({ ...marks, [qId]: Number(e.target.value) })
                        }
                      />
                      <span>marks</span>
                    </div>
                    <button
                      onClick={() => handleRemoveQuestion(qId)}
                      className="btn-danger"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="snapshots-section">
            <h3>Paper Snapshots ({snapshots.length})</h3>
            {snapshots.length > 0 && (
              <div className="snapshots-list">
                {snapshots.map((snap, idx) => (
                  <div key={snap.id} className="snapshot-item">
                    <strong>Q{idx + 1}:</strong> {snap.snapshotText.substring(0, 40)}... ({snap.marks} marks)
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="editor-actions">
          <button onClick={handleGenerateSnapshots} className="btn-primary">
            Generate Snapshots
          </button>
          <button
            onClick={() => setShowPublish(!showPublish)}
            className="btn-info"
            disabled={snapshots.length === 0}
          >
            {paper.status === 'Published' ? 'Already Published' : 'Publish Paper'}
          </button>
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>

        {showPublish && (
          <div className="publish-confirm">
            <p>Publishing will make this paper immutable. Are you sure?</p>
            <button onClick={handlePublish} className="btn-primary">
              Confirm Publish
            </button>
            <button onClick={() => setShowPublish(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
