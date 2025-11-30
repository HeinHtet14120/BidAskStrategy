import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../styles/ComingSoon.css';

const ComingSoon = ({ strategyName, strategyColor, strategyGradient }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '') return '.';
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="coming-soon-page" style={{ '--strategy-color': strategyColor }}>
      <div className="bg-gradient-animated"></div>
      
      <Link to="/" className="back-button">
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Link>

      <div className="coming-soon-container">
        <div className="loading-animation">
          <div className="spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
        </div>

        <div className="coming-soon-content">
          <h1 
            className="coming-soon-title"
            style={{
              background: strategyGradient || `linear-gradient(135deg, ${strategyColor}, ${strategyColor}dd)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {strategyName} Strategy
          </h1>
          <p className="coming-soon-subtitle">
            Coming Soon{dots}
          </p>
          <p className="coming-soon-description">
            We're working hard to bring you detailed information about the {strategyName} strategy.
            <br />
            Check back soon!
          </p>
        </div>

        <div className="pulse-dots">
          <div className="pulse-dot" style={{ '--delay': '0s' }}></div>
          <div className="pulse-dot" style={{ '--delay': '0.2s' }}></div>
          <div className="pulse-dot" style={{ '--delay': '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;

