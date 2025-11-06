// pages/AllPages.js - Export all pages from one file
import React, { useState, useEffect } from 'react';
import './Contact.css';
// import './About.css';
import './Classes.css';

// Contact Page
export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <h1>📞 Get In Touch</h1>
        <p>We'd love to hear from you. Send us a message!</p>
      </section>

      <section className="contact-content">
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">📍</div>
            <h3>Visit Us</h3>
            <p>123 Fitness Street<br/>Pune, Maharashtra 411001</p>
          </div>
          <div className="info-card">
            <div className="info-icon">📧</div>
            <h3>Email Us</h3>
            <p>info@fitzonegym.com<br/>support@fitzonegym.com</p>
          </div>
          <div className="info-card">
            <div className="info-icon">📞</div>
            <h3>Call Us</h3>
            <p>+91 1234567890<br/>+91 0987654321</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🕒</div>
            <h3>Working Hours</h3>
            <p>Mon-Sat: 6:00 AM - 10:00 PM<br/>Sunday: 7:00 AM - 9:00 PM</p>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Send Us A Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <textarea
              placeholder="Your Message"
              rows="6"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
            />
            <button type="submit">Send Message 📤</button>
          </form>
        </div>
      </section>
    </div>
  );
}

// About Page
export function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About FitZone Gym</h1>
        <p>Your journey to fitness starts here</p>
      </section>

      <section className="about-content">
        <div className="about-story">
          <h2>Our Story</h2>
          <p>Founded in 2020, FitZone Gym has been dedicated to helping people achieve their fitness goals. With state-of-the-art equipment, expert trainers, and a supportive community, we've helped thousands transform their lives.</p>
        </div>

        <div className="about-values">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">💪</div>
              <h3>Excellence</h3>
              <p>We strive for excellence in everything we do</p>
            </div>
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>Community</h3>
              <p>Building a supportive fitness community</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h3>Results</h3>
              <p>Focused on delivering real results</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌟</div>
              <h3>Innovation</h3>
              <p>Latest equipment and training methods</p>
            </div>
          </div>
        </div>

        <div className="about-team">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">J</div>
              <h3>John Doe</h3>
              <p>Head Trainer</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">S</div>
              <h3>Sarah Smith</h3>
              <p>Yoga Instructor</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">M</div>
              <h3>Mike Johnson</h3>
              <p>Nutrition Expert</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Classes Page
export function Classes() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/classes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      setClasses([
        { _id: '1', name: 'Yoga', schedule: { day: 'Monday', startTime: '7:00 AM', endTime: '8:00 AM' }, trainer: { name: 'Sarah' }, capacity: 20, enrolled: 15, category: 'Yoga' },
        { _id: '2', name: 'CrossFit', schedule: { day: 'Tuesday', startTime: '6:00 PM', endTime: '7:00 PM' }, trainer: { name: 'John' }, capacity: 15, enrolled: 12, category: 'CrossFit' },
        { _id: '3', name: 'Zumba', schedule: { day: 'Wednesday', startTime: '5:00 PM', endTime: '6:00 PM' }, trainer: { name: 'Mike' }, capacity: 25, enrolled: 20, category: 'Zumba' }
      ]);
    }
  };

  return (
    <div className="classes-page">
      <section className="classes-hero">
        <h1>🎯 Our Classes</h1>
        <p>Find the perfect class for your fitness journey</p>
      </section>

      <section className="classes-grid">
        {classes.map(cls => (
          <div key={cls._id} className="class-card">
            <div className="class-category-badge">{cls.category}</div>
            <h3>{cls.name}</h3>
            <p className="class-trainer">👨‍🏫 Trainer: {cls.trainer?.name || 'TBA'}</p>
            <p className="class-schedule">📅 {cls.schedule.day} | ⏰ {cls.schedule.startTime} - {cls.schedule.endTime}</p>
            <div className="class-capacity">
              <div className="capacity-bar">
                <div 
                  className="capacity-fill" 
                  style={{ width: `${(cls.enrolled / cls.capacity) * 100}%` }}
                />
              </div>
              <p>{cls.enrolled}/{cls.capacity} enrolled</p>
            </div>
            <button className="btn-book">Book Class</button>
          </div>
        ))}
      </section>
    </div>
  );
}