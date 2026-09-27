import React, { SelectHTMLAttributes } from 'react';
import './Select.css';

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  icon?: React.ReactNode;
  options: Option[];
}

export const Select: React.FC<SelectProps> = ({ id, icon, options, ...props }) => {
  return (
    <div className="select-group">
      <div className="select-wrapper">
        {icon && <span className="select-icon">{icon}</span>}
        <select 
          id={id} 
          className={`select-field ${icon ? 'with-icon' : ''}`} 
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="select-chevron">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </div>
    </div>
  );
};
