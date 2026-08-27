
import { useEffect, useState } from 'react';
import './App.css';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3000/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async () => {
    if (!title.trim()) return;

    try {
      await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          status,
          priority,
        }),
      });

      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('medium');

      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async (id: number) => {
    const newStatus = window.prompt(
      'Enter new status (pending/completed):',
      'completed'
    );

    if (!newStatus) return;

    try {
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE',
      });

      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const completedTasks = tasks.filter(
    (task) => task.status === 'completed'
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === 'pending'
  ).length;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  return (
    <div className="app">
      <div className="container">

        <header className="header">

          <div className="brand">
            <div className="brand-icon">✓</div>
            <span>TaskFlow</span>
          </div>

          <h1>Task Management</h1>

          <p>
            Organize your work, track your progress, and get things done.
          </p>

        </header>

        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div>
              <span>Total Tasks</span>
              <strong>{tasks.length}</strong>
            </div>
          </div>

          <div className="stat-card pending-card">
            <div className="stat-icon">⏳</div>
            <div>
              <span>Pending</span>
              <strong>{pendingTasks}</strong>
            </div>
          </div>

          <div className="stat-card completed-card">
            <div className="stat-icon">✓</div>
            <div>
              <span>Completed</span>
              <strong>{completedTasks}</strong>
            </div>
          </div>

        </section>

        <section className="form-card">

          <div className="section-heading">

            <div className="heading-icon">+</div>

            <div>
              <h2>Add New Task</h2>
              <p>Create a task and start tracking your work.</p>
            </div>

          </div>

          <div className="form-grid">

            <div className="form-group">
              <label htmlFor="title">Task Title</label>

              <input
                id="title"
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>

              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>

              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

          </div>

          <div className="form-group">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              placeholder="Describe your task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

          </div>

          <button
            className="add-button"
            onClick={createTask}
          >
            <span>＋</span>
            Add Task
          </button>

        </section>

        <section className="tasks-section">

          <div className="tasks-header">

            <div>
              <h2>Your Tasks</h2>
              <p>Manage and track your current tasks.</p>
            </div>

            <div className="progress">
              <span>Completion</span>
              <strong>{progress}%</strong>
            </div>

          </div>

          {tasks.length === 0 ? (

            <div className="empty-message">

              <div className="empty-icon">✓</div>

              <h3>No tasks yet</h3>

              <p>
                Add your first task above to get started.
              </p>

            </div>

          ) : (

            <div className="task-list">

              {tasks.map((task, index) => (

                <div
                  className="task-card"
                  key={task.id}
                >

                  <div className="task-number">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="task-content">

                    <div className="task-card-header">

                      <h3>{task.title}</h3>

                      <span
                        className={`status ${task.status}`}
                      >
                        <span className="status-dot"></span>
                        {task.status}
                      </span>

                    </div>

                    <p>
                      {task.description || 'No description provided.'}
                    </p>

                    <div className="task-actions">

                      <span
                        className={`priority-badge ${task.priority}`}
                      >
                        {task.priority === 'high' && '🔴 High Priority'}
                        {task.priority === 'medium' && '🟡 Medium Priority'}
                        {task.priority === 'low' && '🟢 Low Priority'}
                      </span>

                      <button
                        className="edit-button"
                        onClick={() => updateTask(task.id)}
                      >
                        ✎ Edit Status
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => deleteTask(task.id)}
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        <footer>
          <span>TaskFlow</span>
          <span>Task Management System</span>
        </footer>

      </div>
    </div>
  );
}

export default App;
