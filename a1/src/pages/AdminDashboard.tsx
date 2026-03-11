import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dataStore } from '../store/dataStore';
import type { Subject } from '../types';
import '../styles/pages.css';

export const AdminDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>(dataStore.getSubjects());
  const [users] = useState(dataStore.getUsers());
  const [newSubject, setNewSubject] = useState({ name: '', description: '' });
  const [showAddSubject, setShowAddSubject] = useState(false);

  const handleAddSubject = () => {
    if (newSubject.name.trim()) {
      const subject = dataStore.addSubject({
        name: newSubject.name,
        description: newSubject.description,
        createdBy: currentUser!.id,
      });
      setSubjects([...subjects, subject]);
      setNewSubject({ name: '', description: '' });
      setShowAddSubject(false);
    }
  };

  const handleDeleteSubject = (id: string) => {
    if (confirm('Are you sure?')) {
      dataStore.deleteSubject(id);
      setSubjects(subjects.filter((s) => s.id !== id));
    }
  };

  const handleLogout = () => {
    logout();
  };

  const totalQuestions = dataStore.getQuestions().length;
  const totalPapers = dataStore.getPapers().length;
  const examiners = users.filter((u) => u.role === 'Examiner').length;

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>{currentUser?.email}</span>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{totalQuestions}</h3>
          <p>Total Questions</p>
        </div>
        <div className="stat-card">
          <h3>{totalPapers}</h3>
          <p>Question Papers</p>
        </div>
        <div className="stat-card">
          <h3>{examiners}</h3>
          <p>Examiners</p>
        </div>
        <div className="stat-card">
          <h3>{subjects.length}</h3>
          <p>Subjects</p>
        </div>
      </div>

      <section className="section">
        <div className="section-header">
          <h2>Subject Management</h2>
          <button
            onClick={() => setShowAddSubject(!showAddSubject)}
            className="btn-primary"
          >
            {showAddSubject ? 'Cancel' : 'Add Subject'}
          </button>
        </div>

        {showAddSubject && (
          <div className="form-card">
            <div className="form-group">
              <label>Subject Name</label>
              <input
                type="text"
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                placeholder="e.g., Mathematics"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newSubject.description}
                onChange={(e) =>
                  setNewSubject({ ...newSubject, description: e.target.value })
                }
                placeholder="Subject description"
              />
            </div>
            <button onClick={handleAddSubject} className="btn-primary">
              Create Subject
            </button>
          </div>
        )}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Description</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <td>{subject.name}</td>
                  <td>{subject.description || '-'}</td>
                  <td>{new Date(subject.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteSubject(subject.id)}
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

      <section className="section">
        <h2>User Management</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
