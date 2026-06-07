import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import {
  FaTasks, FaCheckCircle, FaClock, FaExclamationCircle,
  FaPlus, FaBriefcase, FaUser, FaHeart, FaBook, FaMoneyBill
} from "react-icons/fa";
import API from '../api/axios';
import Sidebar from "./Sidebar";
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
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
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

  useEffect(() => { fetchTasks(); }, []);

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
      if (err.response?.status === 401) navigate('/login');
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
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    setWeeklyData(days.map(day => ({
      day,
      Completed: Math.floor(Math.random() * (done > 0 ? 3 : 1)),
      InProgress: Math.floor(Math.random() * (progress > 0 ? 3 : 1)),
      Pending: Math.floor(Math.random() * (pending > 0 ? 3 : 1)),
    })));
    setCategories(defaultCategories.map(cat => {
      const catTasks = tList.filter(t => t.category === cat.name);
      return { ...cat, done: catTasks.filter(t => t.status === "Completed").length, total: catTasks.length };
    }));
  };

  const recentTasks = tasks.slice(-6).reverse();
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "short", day: "numeric" });
  const getPct = (val, tot) => tot > 0 ? Math.round((val / tot) * 100) : 0;

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="db-layout">
      <Sidebar />

      <div className="db-main">
        {/* TOP BAR */}
        <header className="db-topbar">
          <div>
            <p className="db-topbar-date">📅 {today}</p>
          </div>
          <div className="db-topbar-right">
            <span className="db-user-name">{user.name || "User"}</span>
            <div className="db-avatar">{(user.name || "U")[0].toUpperCase()}</div>
          </div>
        </header>

        <div className="db-body">
          {/* PAGE TITLE */}
          <div className="db-page-header">
            <h2 className="db-title">Dashboard</h2>
            <button className="db-add-btn" onClick={() => navigate('/tasks')}>
              <FaPlus /> Add Task
            </button>
          </div>

          {/* STAT CARDS */}
          <div className="db-stats">
            {[
              { label: "Total Tasks", val: stats.total, pct: 100, icon: <FaTasks size={20} />, cls: "db-icon-total", bar: "db-bar-total", width: "100%" },
              { label: "Completed",   val: stats.done,     pct: getPct(stats.done, stats.total),     icon: <FaCheckCircle size={20} />,      cls: "db-icon-done",     bar: "db-bar-done",     width: `${getPct(stats.done, stats.total)}%` },
              { label: "In Progress", val: stats.progress, pct: getPct(stats.progress, stats.total), icon: <FaClock size={20} />,            cls: "db-icon-progress", bar: "db-bar-progress", width: `${getPct(stats.progress, stats.total)}%` },
              { label: "Pending",     val: stats.pending,  pct: getPct(stats.pending, stats.total),  icon: <FaExclamationCircle size={20} />, cls: "db-icon-pending",  bar: "db-bar-pending",  width: `${getPct(stats.pending, stats.total)}%` },
            ].map((s, i) => (
              <div key={i} className="db-stat-card">
                <div className="db-stat-top">
                  <div>
                    <p className="db-stat-label">{s.label}</p>
                    <p className="db-stat-number">{s.val} <span className="db-stat-pct">({s.pct}%)</span></p>
                  </div>
                  <div className={`db-stat-icon ${s.cls}`}>{s.icon}</div>
                </div>
                <div className="db-stat-bar"><div className={`db-bar-fill ${s.bar}`} style={{ width: s.width }} /></div>
              </div>
            ))}
          </div>

          {/* CHARTS */}
          <div className="db-charts-row">
            <div className="db-card db-chart-bar">
              <h3 className="db-card-title">Weekly Activity (Est)</h3>
              <ResponsiveContainer width="100%" height={240}>
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
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} dataKey="value" paddingAngle={3}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={10} formatter={(v) => <span style={{ color: "#555", fontSize: 13 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RECENT + CATEGORIES */}
          <div className="db-bottom-row">
            <div className="db-card db-recent">
              <h3 className="db-card-title">Recent Tasks</h3>
              <ul className="db-task-list">
                {recentTasks.length === 0 && <p className="db-empty-msg">No tasks found.</p>}
                {recentTasks.map((task, i) => (
                  <li key={i} className="db-task-item">
                    <div className="db-task-left">
                      <span className="db-task-dot" style={{ backgroundColor: statusDots[task.status] || '#888' }} />
                      <div>
                        <p className="db-task-title">{task.title}</p>
                        <p className="db-task-meta">{task.category} · Due {task.duedate ? task.duedate.split('T')[0] : 'N/A'}</p>
                      </div>
                    </div>
                    <span className="db-task-tag" style={{ backgroundColor: statusColors[task.status]?.bg, color: statusColors[task.status]?.color }}>
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
                      <div className="db-cat-bar-fill" style={{ width: cat.total > 0 ? `${(cat.done / cat.total) * 100}%` : "0%" }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
