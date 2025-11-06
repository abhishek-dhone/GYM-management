import React, { useState } from 'react';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...credentials,
          loginType // Send login type to backend
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Pass user data to parent component
      // Note: localStorage has been removed - handle token storage in your main app
      onLoginSuccess(data);

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">🏋️ FitZone Gym Login</h2>

        {/* Login Type Selector */}
        <div className="login-type-selector">
          <button
            type="button"
            className={`login-type-btn ${loginType === 'user' ? 'active' : ''}`}
            onClick={() => {
              setLoginType('user');
              setCredentials({ email: '', password: '' });
              setError('');
            }}
          >
            👤 User Login
          </button>
          <button
            type="button"
            className={`login-type-btn ${loginType === 'admin' ? 'active' : ''}`}
            onClick={() => {
              setLoginType('admin');
              setCredentials({ email: '', password: '' });
              setError('');
            }}
          >
            🔐 Admin Login
          </button>
        </div>
        
        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder={loginType === 'admin' ? 'admin@gym.com' : 'user@gym.com'}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '⏳ Logging in...' : '🚀 Login'}
          </button>
        </form>

        <div className="demo-credentials">
          <p className="demo-title"><strong>Demo Credentials:</strong></p>
          {loginType === 'admin' ? (
            <>
              <p>Email: admin@gym.com</p>
              <p>Password: admin123</p>
            </>
          ) : (
            <>
              <p>Email: user@gym.com</p>
              <p>Password: user123</p>
            </>
          )}
        </div>

        {loginType === 'user' && (
          <div className="login-footer">
            <p>
              Don't have an account?{' '}
              <a href="#register" className="register-link">
                Sign up here
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;