import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import logoUrl from '../assets/pillpal-logo.svg';
import './Auth.css';

// SVG Icons
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const BadgeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

export const Auth: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [regRole, setRegRole] = useState<'specialist' | 'admin'>('specialist');
  const [loginRole, setLoginRole] = useState<'specialist' | 'admin'>('specialist');
  
  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  const [isLoading, setIsLoading] = useState(false);

  const switchMode = (mode: 'login' | 'register') => {
    navigate(`/${mode}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="auth-page-wrapper animate-slide-up">
      <Link to="/" className="back-home-button">
        <ArrowLeftIcon />
        <span>Back to Home</span>
      </Link>
      
      <div className={`auth-split-container ${!isLogin ? 'right-panel-active' : ''}`}>
        
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSubmit} className="auth-form-split">
            <img src={logoUrl} alt="PillPal Logo" className="auth-brand-logo" />
            <h1 className="split-title">Create Account</h1>
            <p className="split-subtitle">Join us and start managing your health.</p>
            
            <div className="split-inputs">
              <div className="role-toggle">
                <label className={`role-option ${regRole === 'specialist' ? 'active' : ''}`}>
                  <input type="radio" name="reg-role" value="specialist" checked={regRole === 'specialist'} onChange={() => setRegRole('specialist')} />
                  Specialist
                </label>
                <label className={`role-option ${regRole === 'admin' ? 'active' : ''}`}>
                  <input type="radio" name="reg-role" value="admin" checked={regRole === 'admin'} onChange={() => setRegRole('admin')} />
                  Admin
                </label>
              </div>
              <Input label="" id="reg-name" type="text" placeholder="Name" icon={<UserIcon />} required />
              <Input label="" id="reg-email" type="email" placeholder="E-mail" icon={<EmailIcon />} required />
              <Input label="" id="reg-password" type="password" placeholder="Password" icon={<LockIcon />} required />
            </div>
            
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Creating...' : 'CREATE ACCOUNT'}
            </Button>
            
            <div className="mobile-only-footer">
              <p>Already have an account? <button type="button" className="text-link highlight button-link" onClick={() => switchMode('login')}>Sign In</button></p>
            </div>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSubmit} className="auth-form-split">
            <img src={logoUrl} alt="PillPal Logo" className="auth-brand-logo" />
            <h1 className="split-title">Welcome Back</h1>
            <p className="split-subtitle">Sign in to your account.</p>
            
            <div className="split-inputs">
              <div className="role-toggle">
                <label className={`role-option ${loginRole === 'specialist' ? 'active' : ''}`}>
                  <input type="radio" name="login-role" value="specialist" checked={loginRole === 'specialist'} onChange={() => setLoginRole('specialist')} />
                  Specialist
                </label>
                <label className={`role-option ${loginRole === 'admin' ? 'active' : ''}`}>
                  <input type="radio" name="login-role" value="admin" checked={loginRole === 'admin'} onChange={() => setLoginRole('admin')} />
                  Admin
                </label>
              </div>
              <Input label="" id="login-email" type="email" placeholder="E-mail" icon={<EmailIcon />} required />
              <Input label="" id="login-password" type="password" placeholder="Password" icon={<LockIcon />} required />
            </div>
            
            <div className="auth-actions" style={{ width: '100%', padding: '0 4px' }}>
              <span className="text-link" style={{ cursor: 'pointer' }}>Forgot your password?</span>
            </div>
            
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'SIGN IN'}
            </Button>

            <div className="mobile-only-footer">
              <p>Don't have an account? <button type="button" className="text-link highlight button-link" onClick={() => switchMode('register')}>Sign Up</button></p>
            </div>
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="overlay-title">Glad to see you!</h1>
              <p className="overlay-desc">To keep connected with us please login with your personal info.</p>
              <Button variant="secondary" onClick={() => switchMode('login')} className="overlay-btn">
                SIGN IN
              </Button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="overlay-title">Hello, friend!</h1>
              <p className="overlay-desc">Enter your personal details and start your journey with us.</p>
              <Button variant="secondary" onClick={() => switchMode('register')} className="overlay-btn">
                SIGN UP
              </Button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
