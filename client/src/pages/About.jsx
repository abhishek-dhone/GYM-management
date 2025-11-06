// ========== pages/About.jsx ==========
function About() {
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