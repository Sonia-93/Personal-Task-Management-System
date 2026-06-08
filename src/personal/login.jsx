import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGithub, FaArrowLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import API from '../api/axios';
import LandingImg from "../landing.jpeg";
import '../personal/signup.css';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
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
    <div className="auth-page">
      {/* LEFT — landing image */}
      <div className="auth-left">
        <img src={LandingImg} alt="PTMs" />
        <div className="auth-left-overlay">
          <div className="auth-left-logo">
            <span>📚</span>
            <span className="auth-logo-text">PTMs</span>
          </div>
          <div>
            <p className="auth-left-tagline">Personal Task Management</p>
            <h2 className="auth-left-heading">
              Made for<br />
              <em>Productive People</em><br />
              Everywhere
            </h2>
            <p className="auth-left-desc">
              Organize your tasks, track your progress, and stay on top of everything — all in one beautiful place.
            </p>
            <div className="auth-testimonial">
              <div className="auth-stars">★★★★★</div>
              <p className="auth-testimonial-text">
                "PTMs helped me stay organized and actually finish what I start. It's clean, fast, and just works."
              </p>
              <div className="auth-testimonial-author">
                <div className="auth-testimonial-avatar">H</div>
                <div className="auth-testimonial-info">
                  <p>Hope Keza</p>
                  <p>Software Developer · Kigali</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="auth-right">
        <div className="auth-card">
          {/* Tab switcher */}
          <div className="auth-tabs">
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <button className="auth-tab">Create Account</button>
            </Link>
            <button className="auth-tab auth-tab-active">Sign In</button>
          </div>

          <h2 className="auth-heading">Welcome back</h2>
          <p className="auth-subheading">Sign in to your PTMs account to continue.</p>

          {error && <div className="auth-error" style={{ marginBottom: '14px' }}>{error}</div>}

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-field">
              <label className="auth-label">Email address</label>
              <input
                type="email"
                className="auth-input"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <input
                  type={showPass ? "text" : "password"}
                  className="auth-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '40px' }}
                />
                <button type="button" className="auth-eye" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="auth-divider">or Continue with</p>

          <div className="auth-socials">
            <button className="auth-social-btn">
              <FcGoogle className="auth-social-icon" /> Google
            </button>
            <button className="auth-social-btn">
              <FaGithub className="auth-social-icon" /> GitHub
            </button>
          </div>

          <p className="auth-footer-link">
            Don't have an account? <Link to="/signup">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
