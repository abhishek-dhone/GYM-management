import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import { Contact, About, Classes } from './pages/AllPages';

// User Pages
import UserDashboard from './pages/UserDashboard';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import MembersList from './components/MembersList';
import AddMemberForm from './components/AddMemberForm';
import ManageTrainers from './pages/Admin/ManageTrainers';
import ManagePlans from './pages/Admin/ManagePlans';
import ManageClasses from './pages/Admin/ManageClasses';
import ManagePayments from './pages/Admin/ManagePayments';
import Announcements from './pages/Admin/Announcements';

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');

    if (token && userName && userRole) {
      setIsLoggedIn(true);
      setUser({ name: userName, role: userRole, email: userEmail });
      setCurrentPage(userRole === 'admin' ? 'dashboard' : 'user-dashboard');
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser({ name: userData.name, role: userData.role, email: userData.email });
    
    // Store all authentication data in localStorage
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('userEmail', userData.email || '');
    
    setCurrentPage(userData.role === 'admin' ? 'dashboard' : 'user-dashboard');
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    setMembers([]);
    setCurrentPage('home');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleMemberAdded = (newMember) => {
    setMembers([...members, newMember]);
  };

  // Render pages based on currentPage state
  const renderPage = () => {
    // ========== PUBLIC PAGES ==========
    if (!isLoggedIn) {
      switch(currentPage) {
        case 'login':
          return <Login onLoginSuccess={handleLoginSuccess} />;
        case 'register':
          return <Register onRegisterSuccess={handleLoginSuccess} />;
        case 'pricing':
          return <Pricing onNavigate={handleNavigate} />;
        case 'contact':
          return <Contact />;
        case 'about':
          return <About />;
        case 'classes':
          return <Classes />;
        case 'home':
        default:
          return <LandingPage onNavigate={handleNavigate} />;
      }
    }

    // ========== ADMIN PAGES ==========
    if (user?.role === 'admin') {
      switch(currentPage) {
        case 'dashboard':
          return <AdminDashboard />;
        
        case 'members':
          return (
            <div className="admin-content">
              <AddMemberForm onMemberAdded={handleMemberAdded} />
              <MembersList members={members} />
            </div>
          );
        
        case 'trainers':
          return <ManageTrainers />;
        
        case 'plans':
          return <ManagePlans />;
        
        case 'classes':
          return <ManageClasses />;
        
        case 'payments':
          return <ManagePayments />;
        
        case 'announcements':
          return <Announcements />;
        
        case 'attendance':
          return (
            <div className="admin-content">
              <h1>📊 Attendance Management</h1>
              <p>Coming soon...</p>
            </div>
          );
        
        case 'reports':
          return (
            <div className="admin-content">
              <h1>📈 Reports & Analytics</h1>
              <p>Coming soon...</p>
            </div>
          );
        
        default:
          return <AdminDashboard />;
      }
    } 
    
    // ========== USER PAGES ==========
    switch(currentPage) {
      case 'profile':
        return (
          <div className="user-content">
            <h1>👤 My Profile</h1>
            <p>Profile management coming soon...</p>
          </div>
        );
      
      case 'my-classes':
        return (
          <div className="user-content">
            <h1>🎯 My Classes</h1>
            <p>View your enrolled classes here...</p>
          </div>
        );
      
      case 'my-payments':
        return (
          <div className="user-content">
            <h1>💳 Payment History</h1>
            <p>Your payment history will appear here...</p>
          </div>
        );
      
      case 'user-dashboard':
      default:
        return <UserDashboard user={user} />;
    }
  };

  return (
    <div className="App">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        user={user} 
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
      
      <main className="app-main">
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
}

export default App;