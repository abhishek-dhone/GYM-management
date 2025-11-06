// PricingPage.jsx
import React, { useState } from 'react';
import './Pricing.css';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Basic Gym',
      icon: '🏋️',
      monthlyPrice: 999,
      yearlyPrice: 9999,
      features: [
        'Full Gym Access',
        'Locker Facility',
        'Basic Equipment',
        'Cardio Zone',
        'Free Weights'
      ],
      popular: false
    },
    {
      name: 'Gym + Zumba',
      icon: '💃',
      monthlyPrice: 1499,
      yearlyPrice: 14999,
      features: [
        'Everything in Basic',
        'Unlimited Zumba Classes',
        'Dance Studio Access',
        'Professional Instructors',
        'Group Sessions'
      ],
      popular: true
    },
    {
      name: 'Gym + Swimming',
      icon: '🏊',
      monthlyPrice: 1799,
      yearlyPrice: 17999,
      features: [
        'Everything in Basic',
        'Olympic Size Pool',
        'Swimming Lessons',
        'Aqua Aerobics',
        'Steam & Sauna'
      ],
      popular: false
    },
    {
      name: 'Premium All-Access',
      icon: '⭐',
      monthlyPrice: 2499,
      yearlyPrice: 24999,
      features: [
        'All Facilities',
        'Personal Trainer (4 sessions)',
        'Nutrition Consultation',
        'Yoga & Meditation',
        'Priority Booking',
        'Guest Passes (2/month)'
      ],
      popular: false
    }
  ];

  const faqs = [
    {
      icon: '💳',
      question: 'What payment methods do you accept?',
      answer: 'We accept Cash, Card, UPI, and Net Banking for your convenience.'
    },
    {
      icon: '🔄',
      question: 'Can I upgrade my plan later?',
      answer: 'Yes! You can upgrade to a higher plan anytime. Contact our support team.'
    },
    {
      icon: '❌',
      question: 'What\'s your cancellation policy?',
      answer: 'You can cancel anytime with 30 days notice. Partial refunds available.'
    },
    {
      icon: '🎯',
      question: 'Do you offer trial sessions?',
      answer: 'Yes! Get a free 3-day trial pass. Contact us to book your trial.'
    }
  ];

  return (
    <div className="pricing-page">
      
      {/* Hero Section */}
      <div className="pricing-hero">
        <h1>Choose Your Perfect Plan</h1>
        <p>Flexible membership plans designed for your fitness goals</p>
        
        {/* Billing Toggle */}
        <div className="billing-toggle">
          <span>Monthly</span>
          <button 
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`toggle-switch ${billingCycle === 'yearly' ? 'active' : ''}`}
          >
            <div className="toggle-thumb"></div>
          </button>
          <span>
            Yearly <span className="save-badge">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="pricing-cards-container">
        {plans.map((plan, index) => (
          <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
            {plan.popular && (
              <div className="popular-badge">MOST POPULAR</div>
            )}
            
            <div className="plan-icon">{plan.icon}</div>
            <h3 className="plan-name">{plan.name}</h3>
            
            <div className="plan-price">
              <span className="price-amount">
                ₹{billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
              </span>
              <span className="price-period">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
            </div>

            <ul className="plan-features">
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <span className="check-icon">✓</span> {feature}
                </li>
              ))}
            </ul>

            <button className="plan-button">Get Started</button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          {faqs.map((faq, i) => (
            <div key={i} className="faq-card">
              <div className="faq-icon">{faq.icon}</div>
              <h4>{faq.question}</h4>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;