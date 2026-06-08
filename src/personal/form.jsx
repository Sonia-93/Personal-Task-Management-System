import { useState, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGithub, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import API from '../api/axios';
import LandingImg from "../landing.jpeg";
import '../personal/signup.css';

const LeftPanel = () => (
  <div className="auth-left">
    <img src={LandingImg} alt="PTMs" />
    <div className="auth-left-overlay">
      <div className="auth-left-logo">
        <span>📚</span>
        <span className="auth-logo-text">PTMs</span>
      </div>
      <div>
        <p className="auth-left-tagline">Personal Task Management</p>
        <h2 className="auth-left-heading">Made for<br /><em>Productive People</em><br />Everywhere</h2>
        <p className="auth-left-desc">Organize your tasks, track your progress, and stay on top of everything — all in one beautiful place.</p>
        <div className="auth-testimonial">
          <div className="auth-stars">★★★★★</div>
          <p className="auth-testimonial-text">"PTMs helped me stay organized and actually finish what I start. It's clean, fast, and just works."</p>
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
);

function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPass) { setError("Passwords don't match"); return; }
    if (!agreed) { setError("Please agree to the terms to continue"); return; }
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/register', { , password });
      setIsVerifying(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Server error during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleDigitKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) { setError('Please enter the full 6-digit code'); return; }
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/verify-email', { email, code });
      const response = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid vede');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await API.post('/auth/register', { name, email, password });
    } catch {}
  };

  return (
    <div className="auth-page">
      <LeftPanel />
      <div className="auth-right">
        <div className="auth-card">

          {!isVerifying ? (
            <>
              <div className="auth-tabs">
                <button className="auth-tab auth-tab-active">Create Account</button>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <button className="auth-tab">Sign In</button>
                </Link>
              </div>

              <h2 className="auth-heading">Join PTMs</h2>
              <p className="auth-subheading">Create your account — it's completely free.</p>
              {error && <div className="auth-error" style={{ marginBottom: '14px' }}>{error}</div>}

              <form className="auth-form" onSubmit={handleRegister}>
                <div className="auth-row">
                  <div className="auth-field">
                    <label className="auth-label">Fe</label>
                    <input type="text" className="auth-input" placeholder="Sofia" value={firstName}
                      onChange={e => setName(e.target.value + (lastName ? ' ' + lastName : ''))} required />
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">Last name</label>
                    <input type="text" className="auth-input" placeholder="Mendez" value={lastName}
                      onChange={e => setName((firstName || '') + (e.target.value ? ' ' + e.target.value : ''))} />
                  </div>
                </div>
                <div className="auth-field">
                  <label className="auth-label">Email address</label>
                  <input type="email" className="auth-input" placeholder="your@email.com" value={email}
                    onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Password</label>
                  <div className="auth-input-wrap">
                    <input type={showPass ? "text" : "password"} className="auth-input" placeholder="••••••••••••"
                      value={password} onChange={e => setPassword(e.target.value)} required minLength="6"
                      style={{ paddingRight: '40px' }} />
                    <button type="button" className="auth-eye" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div className="auth-field">
                  <label className="auth-label">Confirm password</label>
                  <div className="auth-input-wrap">
                    <input type={showConfirm ? "text" : "password"
                      value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required
                      style={{ paddingRight: '40px' }} />
                    <button type="button" className="auth-eye" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <label className="auth-check-row">
                  <inonChange={e => setAgreed(e.target.checked)} />
               Terms of Service and Privacy Policy.</span>
                </label>
                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? "Creating account..." : "Create My Account"}
                </button>
              </form>

              <p className="auth-divider">or Sign up with</p>
              <div className="auth-socials">
  </button>
              </form>

              <p className="auth-resend">
                Didn't receive it? <button onClick={handleResend}>Resend Code</button>
              </p>

              <button className="auth-back-link" onClick={() => setIsVerifying(false)}>
                <FaArrowLeft size={12} /> Back to Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
n <span>15min</span></p>

                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? "Verifying..." : "Verify Email"}
              meric"
                      maxLength={1}
                      className="auth-otp-box"
                      value={d}
                      onChange={e => handleDigitChange(i, e.target.value)}
                      onKeyDown={e => handleDigitKeyDown(i, e)}
                    />
                  ))}
                </div>

                <p className="auth-expire-text">Code expires i            type="text"
                      inputMode="nuplay"
                value={email}
                readOnly
              />

              {error && <div className="auth-error" style={{ marginBottom: '14px' }}>{error}</div>}

              <form onSubmit={handleVerify}>
                <p className="auth-otp-label">Enter Verification Code</p>
                <div className="auth-otp-boxes">
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={el => inputRefs.current[i] = el}
            type="text"
                className="auth-email-dis          <p className="auth-footer-link">Already have an account? <Link to="/login">Sign in</Link></p>
            </>
          ) : (
            <>
              {/* VERIFICATION SCREEN */}
              <div className="auth-verify-icon">
                <FaEnvelope size={48} color="#4caf50" />
              </div>

              <h2 className="auth-heading">Check your inbox</h2>
              <p className="auth-subheading">We've sent a 6-digit verification code to</p>

              <input
              sName="auth-social-btn"><FaGithub className="auth-social-icon" /> GitHub</button>
              </div>
                    <button className="auth-social-btn"><FcGoogle className="auth-social-icon" /> Google</button>
                <button clas