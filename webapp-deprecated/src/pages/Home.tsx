import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import logoUrl from '../assets/pillpal-logo.svg';
import './Home.css';

export const Home: React.FC = () => {
  return (
    <div className="home-container animate-slide-up">
      <div className="home-content">
        <div className="home-brand">
          <img src={logoUrl} alt="PillPal Logo" className="brand-logo" />
          <span className="brand-name">PillPal</span>
        </div>
        
        <h1 className="home-title">
          Manage your health<br />
          <span className="text-muted">with precision.</span>
        </h1>
        
        <p className="home-subtitle">
          The elegant way to track your medications, schedules, and health routines without the clutter.
        </p>
        
        <div className="home-actions">
          <Link to="/register" className="link-button">
            <Button variant="primary">Get Started</Button>
          </Link>
          <Link to="/login" className="link-button">
            <Button variant="secondary">Sign In</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
