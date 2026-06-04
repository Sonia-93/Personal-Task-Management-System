import '../personal/home.css';
import { Link } from "react-router-dom";
import { FaTasks, FaCheckCircle, FaClock, FaPlusCircle, FaStar, FaBolt } from "react-icons/fa";
import { useEffect, useState } from 'react';

function LandingPage() {
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || 'User');
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

  return (
    <div className="landing-body">
      <header className="header2" style={{display:'flex', alignItems:'center', height:'140px', position:'fixed', top:0, width:'100%', backgroundColor:'white', zIndex:10, boxShadow:'0 4px 15px rgba(0,0,0,0.1)', padding:'0 20px'}}>
        <h1 className='ptns' style={{marginLeft: 160}}>📚 </h1>
        <h1 className="ptns2">PTMs</h1>
        <nav className="nav">
          <Link to="/home" className="a">Home</Link>
          <Link to="/tasks" className="a">My tasks</Link>
          <Link to="/dashboard" className="a">My dashboard</Link>
          <div className="a3-div">
            <Link to="/" className="a3">Logout</Link>
          </div>
        </nav>
      </header>

      {/* WELCOME HERO */}
      <div className="welcome-hero">
        <div className="welcome-badge">✨ Personal Task Management System</div>
        <h1 className="welcome-title">
          Welcome back, <span className="welcome-name">{userName}</span> 👋
        </h1>
        <p className="welcome-subtitle">
          "Stay organized, stay ahead. Your productivity journey continues here."
        </p>
        <div className="welcome-actions">
          <Link to="/tasks">
            <button className="welcome-btn-primary">
              <FaPlusCircle /> Add New Task
            </button>
          </Link>
          <Link to="/dashboard">
            <button className="welcome-btn-secondary">
              <FaBolt /> View Dashboard
            </button>
          </Link>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="welcome-cards">
        <div className="welcome-card wc-total">
          <FaTasks size={35} className="wc-icon" />
          <p className="wc-number">12</p>
          <p className="wc-label">Total Tasks</p>
        </div>
        <div className="welcome-card wc-done">
          <FaCheckCircle size={35} className="wc-icon" />
          <p className="wc-number">7</p>
          <p className="wc-label">Completed</p>
        </div>
        <div className="welcome-card wc-pending">
          <FaClock size={35} className="wc-icon" />
          <p className="wc-number">5</p>
          <p className="wc-label">Pending</p>
        </div>
        <div className="welcome-card wc-star">
          <FaStar size={35} className="wc-icon" />
          <p className="wc-number">3</p>
          <p className="wc-label">High Priority</p>
        </div>
      </div>

      {/* RECENT TASKS */}
    {/* RECENT TASKS */}
<div className="welcome-recent">
  <h2 className="welcome-recent-title">📋 Recent Tasks</h2>
  <ul className="welcome-task-list">
    <li className="welcome-task-item wtask-pending">
      📝 Finish project report <span className="wtask-tag pending-tag">Pending</span>
    </li>
    <li className="welcome-task-item wtask-done">
      ✅ Buy groceries <span className="wtask-tag done-tag">Completed</span>
    </li>
    <li className="welcome-task-item wtask-progress">
      ⏳ Study for exam <span className="wtask-tag progress-tag">In Progress</span>
    </li>
    <li className="welcome-task-item wtask-done">
      ✅ Call dentist <span className="wtask-tag done-tag">Completed</span>
    </li>
  </ul>
</div>

    </div>
  );
}

export default LandingPage;