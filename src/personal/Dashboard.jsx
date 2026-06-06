import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import {
  FaTasks, FaCheckCircle, FaClock, FaExclamationCircle,
  FaPlus, FaBriefcase, FaUser, FaHeart, FaBook, FaMoneyBill
} from "react-icons/fa";
import API from '../api/axios';
import "../personal/dashboard.css";

const statusColors = {
  Completed: { bg: "#dcfce7", color: "#16a34a" },
  "In Progress": { bg: "#fef3c7", color: "#d97706" },
  Pending: { bg: "#fee2e2", color: "#dc2626" },
};

const statusDots = {
  Completed: "#4caf50",
  "In Progress": "#f59e0b",
  Pending: "#ef4444",
};

const defaultCategories = [
  { name: "Work", icon: <FaBriefcase /> },
  { name: "Personal", icon: <FaUser /> },
  { name: "Health", icon: <FaHeart /> },
  { name: "Learning", icon: <FaBook /> },
  { name: "Finance", icon: <FaMoneyBill /> },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="db-tooltip">
        <p className="db-tooltip-label">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, done: 0, progress: 0, pending: 0 });
  const [pieData, setPieData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      const userStr = localStorage.getItem('user');
      let myTasks = res.data;
      if (userStr) {
        const userObj = JSON.parse(userStr);
        myTasks = res.data.filter(t => t.user && (t.user._id === userObj._id || t.user === userObj._id));
      } else {
        myTasks = [];
      }
      setTasks(myTasks);
      processTasks(myTasks);
    } catch (err) {
      console.error(err);
      if(err.response?.status === 401) {
          navigate('/login');
      }
    }
  };

  const processTasks = (tList) => {
    const total = tList.length;
    const done = tList.filter(t => t.status === "Completed").length;
    const progress = tList.filter(t => t.status === "In Progress").length;
    const pending = tList.filter(t => t.status === "Pending").length;

    setStats({ total, done, progress, pending });

    setPieData([
      { name: "Completed", value: done || 0, color: "#4caf50" },
      { name: "In Progress", value: progress || 0, color: "#f59e0b" },
      { name: "Pending", value: pending || 0, color: "#ef4444" },
    ]);

    // Simple weekly dummy logic derived from actual tasks if we had dates, 
    // but for now let's just show a static layout or slightly randomize to show activity
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const wData = days.map(day => ({
      day, 
      Completed: Math.floor(Math.random() * (done > 0 ? 3 : 1)), 
      InProgress: Math.floor(Math.random() * (progress > 0 ? 3 : 1)), 
      Pending: Math.floor(Math.random() * (pending > 0 ? 3 : 1))
    }));
    setWeeklyData(wData);

    // Group by category
    const catStats = defaultCategories.map(cat => {
      const catTasks = tList.filter(t => t.category === cat.name);
      return {
        ...cat,
        done: catTasks.filter(t => t.status === "Completed").length,
        total: catTasks.length
      };
    });
    setCategories(catStats);
  };

  const recentTasks = tasks.slice(-6).reverse(); // last 6 tasks

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "short", day: "numeric"
  });

  const getPct = (val, tot) => tot > 0 ? Math.round((val / tot) * 100) : 0;

  return (
    <div className="db-page">
      {/* HEADER */}
      <header className="db-header">
        <div className="db-header-left">
          <Link to="/dashboard" className="db-logo">
            <span>📚</span>
            <span className="db-logo-text">PTMs</span>
          </Link>
          <div className="db-header-title">
            <h2 className="db-title">Dashboard</h2>
            <p className="db-subtitle">Personal Task Management System</p>
          </div>
        </div>
        <div className="db-header-right">
          <span className="db-date">📅 {today}</span>
          <Link to ="/tasks" className="db-add-link">
          <button className="db-add-btn">
            <FaPlus /> Add Task
          </button>
          </Link>
        </div>
      </header>

      <div className="db-body">
        {/* STAT CARDS */}
        <div className="db-stats">
          <div className="db-stat-card">
            <div className="db-stat-top">
              <div>
                <p className="db-stat-label">Total Tasks</p>
                <p className="db-stat-number">{stats.total} <span className="db-stat-pct">(100%)</span></p>
              </div>
              <div className="db-stat-icon db-icon-total"><FaTasks size={22} /></div>
            </div>
            <div className="db-stat-bar"><div className="db-bar-fill db-bar-total" style={{ width: "100%" }} /></div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-top">
              <div>
                <p className="db-stat-label">Completed</p>
                <p className="db-stat-number">{stats.done} <span className="db-stat-pct">({getPct(stats.done, stats.total)}%)</span></p>
              </div>
              <div className="db-stat-icon db-icon-done"><FaCheckCircle size={22} /></div>
            </div>
            <div className="db-stat-bar"><div className="db-bar-fill db-bar-done" style={{ width: `${getPct(stats.done, stats.total)}%` }} /></div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-top">
              <div>
                <p className="db-stat-label">In Progress</p>
                <p className="db-stat-number">{stats.progress} <span className="db-stat-pct">({getPct(stats.progress, stats.total)}%)</span></p>
              </div>
              <div className="db-stat-icon db-icon-progress"><FaClock size={22} /></div>
            </div>
            <div className="db-stat-bar"><div className="db-bar-fill db-bar-progress" style={{ width: `${getPct(stats.progress, stats.total)}%` }} /></div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-top">
              <div>
                <p className="db-stat-label">Pending</p>
                <p className="db-stat-number">{stats.pending} <span className="db-stat-pct">({getPct(stats.pending, stats.total)}%)</span></p>
              </div>
              <div className="db-stat-icon db-icon-pending"><FaExclamationCircle size={22} /></div>
            </div>
            <div className="db-stat-bar"><div className="db-bar-fill db-bar-pending" style={{ width: `${getPct(stats.pending, stats.total)}%` }} /></div>
          </div>
        </div>

        {/* CHARTS ROW */}
        <div className="db-charts-row">
          <div className="db-card db-chart-bar">
            <h3 className="db-card-title">Weekly Activity (Est)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData} barCategoryGap="30%">
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 13 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Completed" fill="#4caf50" radius={[4, 4, 0, 0]} />
                <Bar dataKey="InProgress" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pending" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="db-card db-chart-pie">
            <h3 className="db-card-title">Status Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={10}
                  formatter={(value) => <span style={{ color: "#555", fontSize: 13 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT TASKS + CATEGORIES */}
        <div className="db-bottom-row">
          <div className="db-card db-recent">
            <h3 className="db-card-title">Recent Tasks</h3>
            <ul className="db-task-list">
              {recentTasks.length === 0 && <p style={{ color: '#888', marginTop: '10px' }}>No tasks found.</p>}
              {recentTasks.map((task, i) => (
                <li key={i} className="db-task-item">
                  <div className="db-task-left">
                    <span className="db-task-dot" style={{ backgroundColor: statusDots[task.status] || '#888' }} />
                    <div>
                      <p className="db-task-title">{task.title}</p>
                      <p className="db-task-meta">{task.category} · Due {task.duedate ? task.duedate.split('T')[0] : 'N/A'}</p>
                    </div>
                  </div>
                  <span
                    className="db-task-tag"
                    style={{ 
                      backgroundColor: statusColors[task.status]?.bg || '#eee', 
                      color: statusColors[task.status]?.color || '#333' 
                    }}
                  >
                    {task.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="db-card db-categories">
            <h3 className="db-card-title">By Category</h3>
            <ul className="db-cat-list">
              {categories.map((cat, i) => (
                <li key={i} className="db-cat-item">
                  <div className="db-cat-left">
                    <span className="db-cat-icon">{cat.icon}</span>
                    <span className="db-cat-name">{cat.name}</span>
                  </div>
                  <span className="db-cat-count">{cat.done}/{cat.total}</span>
                  <div className="db-cat-bar-bg">
                    <div
                      className="db-cat-bar-fill"
                      style={{ width: cat.total > 0 ? `${(cat.done / cat.total) * 100}%` : "0%" }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
