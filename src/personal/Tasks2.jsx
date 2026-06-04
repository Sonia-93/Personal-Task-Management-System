import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaEdit, FaTimes, FaBriefcase, FaUser, FaHeart, FaBook, FaMoneyBill } from "react-icons/fa";
import API from '../api/axios';
import "./tasks2.css";

const CATEGORIES = ["Work", "Personal", "Health", "Learning", "Finance"];
const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["Pending", "In Progress", "Completed"];

const categoryColors = {
  Work:     { bg: "#e8f5e9", color: "#2e7d32" },
  Personal: { bg: "#e3f2fd", color: "#1565c0" },
  Health:   { bg: "#fce4ec", color: "#c62828" },
  Learning: { bg: "#f3e5f5", color: "#6a1b9a" },
  Finance:  { bg: "#fff8e1", color: "#f57f17" },
};

const priorityColors = {
  Low:    { bg: "#e8f5e9", color: "#2e7d32" },
  Medium: { bg: "#fff8e1", color: "#f57f17" },
  High:   { bg: "#fee2e2", color: "#dc2626" },
};

const categoryIcons = {
  Work: <FaBriefcase />, Personal: <FaUser />,
  Health: <FaHeart />, Learning: <FaBook />, Finance: <FaMoneyBill />
};

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", category: "Work", duedate: "", priority: "Medium", status: "Pending"
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      // The backend returns all tasks populated with user objects. Filter them locally to the current user.
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        const myTasks = res.data.filter(t => t.user && (t.user._id === userObj._id || t.user === userObj._id));
        setTasks(myTasks);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error("Error fetching tasks", err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const filtered = filterCategory === "All" ? tasks : tasks.filter(t => t.category === filterCategory);
  const getByStatus = (status) => filtered.filter(t => t.status === status);

  const openAdd = () => {
    setEditId(null);
    setForm({ title: "", category: "Work", duedate: "", priority: "Medium", status: "Pending" });
    setShowModal(true);
  };

  const openEdit = (task) => { 
    setEditId(task._id); 
    setForm({ 
      title: task.title, 
      category: task.category, 
      duedate: task.duedate ? task.duedate.split('T')[0] : "", // format for date input
      priority: task.priority, 
      status: task.status 
    }); 
    setShowModal(true); 
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const userId = userStr ? JSON.parse(userStr)._id : null;
      
      const payload = {
        ...form,
        user: userId
      };

      if (!payload.duedate) {
        delete payload.duedate;
      }

      if (editId) {
        // Edit task
        const res = await API.put(`/tasks/${editId}`, payload);
        // Replace in local state or re-fetch. Re-fetching is safer.
        await fetchTasks();
      } else {
        // Add task
        const res = await API.post('/tasks', payload);
        await fetchTasks();
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error saving task", err);
      alert(err.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };
  
  const handleStatusChange = async (id, status) => {
    try {
      const taskToUpdate = tasks.find(t => t._id === id);
      if (!taskToUpdate) return;
      
      // Optimiztic update
      setTasks(tasks.map(t => t._id === id ? { ...t, status } : t));
      
      const userStr = localStorage.getItem('user');
      const userId = userStr ? JSON.parse(userStr)._id : null;
      
      await API.put(`/tasks/${id}`, { ...taskToUpdate, status, user: userId });
    } catch (err) {
      console.error("Error updating status", err);
      // Revert on failure
      fetchTasks();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="tk-page">

      {/* HEADER */}
      <header className="tk-header">
        <Link to="/landing" className="tk-logo">
          <span>📚</span><span className="tk-logo-text">PTMs</span>
        </Link>
        <nav className="tk-nav">
          <Link to="/landing" className="tk-nav-link">Home</Link>
          <Link to="/tasks" className="tk-nav-link tk-active">My Tasks</Link>
          <Link to="/dashboard" className="tk-nav-link">Dashboard</Link>
          <button onClick={logout} className="tk-logout" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>Logout</button>
        </nav>
      </header>

      <div className="tk-body">

        {/* TOP BAR */}
        <div className="tk-topbar">
          <div>
            <h2 className="tk-title">My Tasks</h2>
            <p className="tk-subtitle">{tasks.length} total tasks</p>
          </div>
          <div className="tk-topbar-right">
            <div className="tk-filters">
              {["All", ...CATEGORIES].map(cat => (
                <button
                  key={cat}
                  className={`tk-filter-btn ${filterCategory === cat ? "tk-filter-active" : ""}`}
                  onClick={() => setFilterCategory(cat)}
                >{cat}</button>
              ))}
            </div>
            <button className="tk-add-btn" onClick={openAdd}><FaPlus /> Add Task</button>
          </div>
        </div>

        {/* KANBAN */}
        <div className="tk-kanban">
          {STATUSES.map(status => (
            <div key={status} className="tk-column">
              <div className={`tk-col-header tk-col-${status.replace(" ", "").toLowerCase()}`}>
                <span className="tk-col-title">{status}</span>
                <span className="tk-col-count">{getByStatus(status).length}</span>
              </div>
              <div className="tk-cards">
                {getByStatus(status).length === 0 && (
                  <div className="tk-empty">No tasks here</div>
                )}
                {getByStatus(status).map(task => (
                  <div key={task._id} className="tk-card-item">
                    <div className={`tk-priority-bar tk-pri-${task.priority.toLowerCase()}`} />
                    <div className="tk-card-top">
                      <span className="tk-cat-badge" style={{ backgroundColor: categoryColors[task.category]?.bg, color: categoryColors[task.category]?.color }}>
                        {categoryIcons[task.category]} {task.category}
                      </span>
                      <span className="tk-pri-badge" style={{ backgroundColor: priorityColors[task.priority]?.bg, color: priorityColors[task.priority]?.color }}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="tk-card-title-text">{task.title}</p>
                    <p className="tk-card-due">📅 Due: {task.duedate ? task.duedate.split('T')[0] : 'No date'}</p>
                    <select className="tk-status-select" value={task.status} onChange={e => handleStatusChange(task._id, e.target.value)}>
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <div className="tk-card-actions">
                      <button className="tk-btn-edit" onClick={() => openEdit(task)}><FaEdit /> Edit</button>
                      <button className="tk-btn-delete" onClick={() => handleDelete(task._id)}><FaTrash /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="tk-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="tk-modal" onClick={e => e.stopPropagation()}>
            <div className="tk-modal-header">
              <h3>{editId ? "Edit Task" : "Add New Task"}</h3>
              <button className="tk-modal-close" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            <div className="tk-modal-body">
              <label className="tk-modal-label">Title</label>
              <input className="tk-modal-input" placeholder="Task title..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <label className="tk-modal-label">Category</label>
              <select className="tk-modal-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <label className="tk-modal-label">Due Date</label>
              <input type="date" className="tk-modal-input" value={form.duedate} onChange={e => setForm({ ...form, duedate: e.target.value })} />
              <label className="tk-modal-label">Priority</label>
              <select className="tk-modal-input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
              <label className="tk-modal-label">Status</label>
              <select className="tk-modal-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="tk-modal-footer">
              <button className="tk-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="tk-modal-save" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : (editId ? "Save Changes" : "Add Task")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
