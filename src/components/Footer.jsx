import { Heart } from 'lucide-react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="footer-text">
          Developed with
          <span className="heart-icon-wrapper">
            <Heart className="heart-icon" />
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

