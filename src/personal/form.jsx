import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import API from '../api/axios';
import LoginImage from "../login_image.png";
import '../personal/signup.css';

function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [code, setCode] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/register', { name, email, password });
      setIsVerifying(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Server error during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/verify-email', { email, code });
      const response = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <img src={LoginImage} className="signupImage" alt="hello" />
      <div className="signup-card">

        <h1 className="signup-logo">📚 <span className="signup-logotext">PTMs</span></h1>
        
        {!isVerifying ? (
          <>
            <h2 className="signup-title">Create your account</h2>
            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
            <form className="signup-form" onSubmit={handleRegister}>
              <label className="signup-label">Name</label>
              <input type="text" className="signup-input" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} required />

              <label className="signup-label">Email</label>
              <input type="email" className="signup-input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />

              <label className="signup-label">Password</label>
              <input type="password" className="signup-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength="6" />

              <button type="submit" className="signup-btn" disabled={loading}>
                {loading ? "Registering..." : "Sign Up"}
              </button>

              <p className="signup-footer">
                Already have an account?{" "}
                <Link to="/login" className="signup-link">Login</Link>
              </p>
            </form>
          </>
        ) : (
          <>
            <h2 className="signup-title">Verify Your Email</h2>
            <p style={{ color: '#888', marginBottom: '20px', fontSize: '0.95rem' }}>We sent a code to {email}.</p>
            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
            <form className="signup-form" onSubmit={handleVerify}>
              <label className="signup-label">Verification Code</label>
              <input type="text" className="signup-input" placeholder="Enter 6-digit code" value={code} onChange={e => setCode(e.target.value)} required />

              <button type="submit" className="signup-btn" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default SignUpForm;