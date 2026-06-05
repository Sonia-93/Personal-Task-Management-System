import { FaCog } from 'react-icons/fa';
import { FaRocket } from 'react-icons/fa';
import { Link } from "react-router-dom";
import  '../personal/form2.css';
import LandingImage from '../landing.jpeg';
import { useState, useEffect } from 'react';

function LandingPage1() {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing1-page">
      <header className="landing1-header" style={{position: 'fixed', top: 0, width: '100%', zIndex: 999, opacity: showHeader ? 0.95 : 0, transition: 'opacity 0.3s ease', pointerEvents: showHeader ? 'auto' : 'none'}}>
        <h1 className="landing1-logo">📚</h1>
        <h1 className="landing1-logotext">PTMs</h1>
        <nav className="landing1-nav">
          <Link to="/" className="landing1-link">Home</Link> 
          <Link to="/about" className="landing1-link">About Us</Link>
          <Link to="/signup" className="landing1-signup">SignUp</Link>
        </nav>
      </header>

      <div className="landing1-hero" style={{backgroundImage: `url(${LandingImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', position: 'relative', paddingTop: '60px'}}>
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)'}}></div>
        
        {/* Top Navigation - Visible on Hero */}
        <nav className="landing1-nav" style={{position: 'relative', zIndex: 10, width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '20px 0', opacity: showHeader ? 0 : 1, transition: 'opacity 0.3s ease'}}>
          <div style={{display: 'flex', gap: '40px'}}>
            <Link to="/" className="landing1-link" style={{color: '#4caf50', fontWeight: 'bold', fontSize: '16px'}}>Home</Link> 
            <Link to="/about" className="landing1-link" style={{color: '#4caf50', fontWeight: 'bold', fontSize: '16px'}}>About Us</Link>
          </div>
          <Link to="/signup" className="landing1-signup" style={{backgroundColor: '#4caf50', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold'}}>SignUp</Link>
        </nav>

        <div style={{position: 'relative', zIndex: 1, textAlign: 'center'}}>
          <h1 className="landing1-hero-title">📚 <span className="landing1-hero-span">PTMs</span></h1>
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
        <div style={{height: '60px'}}></div>
      </div>
    </div>
  );
}

export default LandingPage1;