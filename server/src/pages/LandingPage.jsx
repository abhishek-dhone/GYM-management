import React from 'react';
import './LandingPage.css';

function LandingPage({ onNavigate }) {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Transform Your Body,<br />
            <span className="gradient-text">Transform Your Life</span>
          </h1>
          <p className="hero-subtitle">
            Join FitZone Gym - Where fitness meets excellence. State-of-the-art equipment,
            expert trainers, and a community that motivates you to achieve your goals.
          </p>
          <div className="hero-buttons">
            <button onClick={() => onNavigate('register')} className="btn-hero-primary">
              🚀 Get Started Free
            </button>
            <button onClick={() => onNavigate('pricing')} className="btn-hero-secondary">
              💰 View Pricing
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">5000+</div>
              <div className="stat-label">Active Members</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Expert Trainers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Weekly Classes</div>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-card">
            <span className="hero-emoji">💪</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose FitZone?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏋️</div>
            <h3>Modern Equipment</h3>
            <p>State-of-the-art machines and free weights for all fitness levels</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👨‍🏫</div>
            <h3>Expert Trainers</h3>
            <p>Certified professionals to guide your fitness journey</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Group Classes</h3>
            <p>Yoga, Zumba, CrossFit, and more - find your passion</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile App</h3>
            <p>Track workouts, book classes, and monitor progress</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🕒</div>
            <h3>24/7 Access</h3>
            <p>Work out on your schedule with round-the-clock access</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Flexible Plans</h3>
            <p>Affordable memberships starting from ₹1,000/month</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">What Our Members Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "Best gym in the city! The trainers are amazing and the equipment is top-notch.
              Lost 15kg in 3 months!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">R</div>
              <div>
                <div className="author-name">Rahul Sharma</div>
                <div className="author-role">Premium Member</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "The group classes are so fun! Made great friends and achieved my fitness goals.
              Highly recommend!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">P</div>
              <div>
                <div className="author-name">Priya Patel</div>
                <div className="author-role">VIP Member</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "Professional environment, clean facilities, and great value for money.
              Been a member for 2 years!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">A</div>
              <div>
                <div className="author-name">Amit Kumar</div>
                <div className="author-role">Basic Member</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Start Your Fitness Journey?</h2>
        <p>Join thousands of members who have transformed their lives</p>
        <button onClick={() => onNavigate('register')} className="btn-cta">
          🎉 Join Now - First Month Free!
        </button>
      </section>
    </div>
  );
}

export default LandingPage;