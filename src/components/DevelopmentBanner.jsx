import { useEffect, useState } from 'react';
import '../styles/DevelopmentBanner.css';

const DevelopmentBanner = () => {
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
    <div className="dev-banner">
      <div className="dev-banner-content">
        <div className="dev-banner-loader">
          <div className="dev-spinner"></div>
        </div>
        <div className="dev-banner-text">
          <span className="dev-text-main">In Progress</span>
          <span className="dev-text-dots">{dots}</span>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentBanner;

