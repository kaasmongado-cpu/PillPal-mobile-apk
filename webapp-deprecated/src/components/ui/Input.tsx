import React, { InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, id, icon, ...props }) => {
  return (
    <div className="input-group">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input 
          id={id} 
          className={`input-field ${icon ? 'with-icon' : ''}`} 
          {...props} 
        />
      </div>
    </div>
  );
};
