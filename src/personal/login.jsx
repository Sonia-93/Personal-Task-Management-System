import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import API from '../api/axios';
import LoginImage2 from "../login_image2.png";
import '../personal/signup.css';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
       <img src={LoginImage2} className="signupImage" alt="hello" />
      <div className="signup-card">
        <h1 className="signup-logo">📚 <span className="signup-logotext">PTMs</span></h1>
        <h2 className="signup-title">Welcome Back 👋</h2>
        <p style={{color:'#888', marginBottom:'20px', fontSize:'0.95rem'}}>login to your account</p>

        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

        <form className="signup-form" onSubmit={handleLogin}>
          <label className="signup-label">Email</label>
          <input type="email" className="signup-input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />

          <label className="signup-label">Password</label>
          <input type="password" className="signup-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="signup-footer">
            Don't have an account?{" "}
            <Link to="/signup" className="signup-link">create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;