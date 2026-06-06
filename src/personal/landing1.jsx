import { FaCog } from 'react-icons/fa';
import { FaRocket } from 'react-icons/fa';
import { Link } from "react-router-dom";
import '../personal/form2.css';
import LandingImage from '../landing.jpeg';
import { useState, useEffect } from 'react';

function LandingPage1() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing1-page">
      <header className={`landing1-header${scrolled ? ' landing1-header--scrolled' : ''}`}>
        <div className="landing1-brand">
          <h1 className="landing1-logo">📚</h1>
          <h1 className="landing1-logotext">PTMs</h1>
        </div>
        <nav className="landing1-nav">
          <Link to="/" className="landing1-link">Home</Link>
          <Link to="/about" className="landing1-link">About Us</Link>
          <Link to="/signup" className="landing1-signup">SignUp</Link>
        </nav>
      </header>

      <div
        className="landing1-hero"
        style={{ backgroundImage: `url(${LandingImage})` }}
      >
        <div className="landing1-hero-overlay" />

        <div className="landing1-hero-content">
          <h1 className="landing1-hero-title">
            📚 <span className="landing1-hero-span">PTMs</span>
          </h1>
          <h2 className="landing1-hero-sub">Personal Task Management System</h2>
          <p className="landing1-hero-p">Organise your tasks and stay productive with PTMS.</p>

          <div className="landing1-btns">
            <Link to="/about">
              <button className="landing1-btn-explore">
                <FaCog /> Explore
              </button>
            </Link>
            <Link to="/signup">
              <button className="landing1-btn-signup">
                <FaRocket /> Signup
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage1;
