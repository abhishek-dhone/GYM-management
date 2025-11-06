// Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  const quickLinks = [
    'About Us',
    'Membership Plans',
    'Class Schedule',
    'Our Trainers',
    'Gallery',
    'Blog'
  ];

  const supportLinks = [
    'FAQs',
    'Contact Us',
    'Terms & Conditions',
    'Privacy Policy',
    'Refund Policy',
    'Careers'
  ];

  const socialLinks = [
    { icon: '📘', name: 'Facebook', url: '#' },
    { icon: '📷', name: 'Instagram', url: '#' },
    { icon: '🐦', name: 'Twitter', url: '#' },
    { icon: '▶️', name: 'YouTube', url: '#' }
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* About Column */}
        <div className="footer-column">
          <div className="footer-brand">
            <span className="footer-icon">🏋️</span>
            <h3>FitZone Gym</h3>
          </div>
          <p className="footer-description">
            Transform your body, transform your life. Join thousands of members who have achieved their fitness goals with us.
          </p>
          <div className="social-links">
            {socialLinks.map((social, index) => (
              <a 
                key={index} 
                href={social.url} 
                className="social-link"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-column">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <a href="#">› {link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Column */}
        <div className="footer-column">
          <h4 className="footer-heading">Support</h4>
          <ul className="footer-links">
            {supportLinks.map((link, index) => (
              <li key={index}>
                <a href="#">› {link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="footer-column">
          <h4 className="footer-heading">Contact Info</h4>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <p>123 Fitness Street</p>
                <p>Pune, Maharashtra 411001</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <p>+91 1234567890</p>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <p>info@fitzonegym.com</p>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🕐</span>
              <div>
                <p>Mon-Sat: 6AM - 10PM</p>
                <p>Sunday: 7AM - 9PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p className="copyright">
          © 2025 FitZone Gym. All rights reserved. Made with ❤️ by FitZone Team
        </p>
        <div className="footer-bottom-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;