import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Signup from './Components/Signup/Signup';
import Signin from './Components/Signin/Signin';
import ForgetPassword from './Components/ForgotPassword/ForgotPassword';
import ChangePassword from './Components/ChangePassword/ChangePassword';
import Home from './Components/Home';
import Classroom from './Components/Classroom/Classroom';
import Coding from './Components/CSheet/CodingSheet';
import NavBar from './Components/Navbar/NavBar';
import Semester from './Components/Classroom/Semester/Semester';
import Subjects from './Components/Classroom/Semester/Subjects/Subjects';
import About from './Components/About/About';
import Spinner from './Components/Spinner/Spinner';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;  

const ProtectedRoute = ({ isAuthenticated, children, ...rest }) => {
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }
  return (
    <>
      <NavBar 
        name={rest.name}
        setName={rest.setName}
        setToken={rest.setToken}
        setIsAuthenticated={rest.setIsAuthenticated}
      />
      {children}
    </>
  );
};

function App() {
  const [name, setName] = useState('');
  const [token, setToken] = useState(localStorage.getItem('Token') || ''); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // 1. Check if session exists in MongoDB (via cookies)
        const sessionRes = await axios.get('/check-session', { withCredentials: true });
       
        if (sessionRes.status === 200 && sessionRes.data.user) {
          // Valid session found
          setIsAuthenticated(true);
          setName(sessionRes.data.user);
        } else if (token) {
          // 2. Fallback to token if no valid session
          try {
            const tokenRes = await axios.get('/check-auth', {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true
            });
            if (tokenRes.status === 200 && tokenRes.data.message) {
              // Token is valid, re-establish session
              setIsAuthenticated(true);
              
            } else {
              // Token is invalid or expired
              localStorage.removeItem('Token');
              setToken('');
              setIsAuthenticated(false);
            }
          } catch (error) {
            // Handle error when checking token
            localStorage.removeItem('Token');
            setToken('');
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Handle error and reset authentication state
        localStorage.removeItem('Token');
        setToken('');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        setShowSpinner(false);
      }
    };

    checkSession();
  }, [token]);

  useEffect(() => {
    setShowSpinner(true);
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 800); 

    return () => clearTimeout(timer);
  }, [location]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  if (isLoading || showSpinner) {
    return <Spinner />;
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<Signup setName={setName} />} />
        <Route path="/signin" element={<Signin setName={setName} setToken={setToken} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/forgotpassword" element={<ForgetPassword />} />
        <Route path="/changepassword" element={<ChangePassword />} />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} name={name} setName={setName} setToken={setToken} setIsAuthenticated={setIsAuthenticated}>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/classroom" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} name={name} setName={setName} setToken={setToken} setIsAuthenticated={setIsAuthenticated}>
              <Classroom />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/coding" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} name={name} setName={setName} setToken={setToken} setIsAuthenticated={setIsAuthenticated}>
              <Coding />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/about-us" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} name={name} setName={setName} setToken={setToken} setIsAuthenticated={setIsAuthenticated}>
              <About />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/classroom/:semester" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} name={name} setName={setName} setToken={setToken} setIsAuthenticated={setIsAuthenticated}>
              <Semester />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/classroom/:semester/:subject" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} name={name} setName={setName} setToken={setToken} setIsAuthenticated={setIsAuthenticated}>
              <Subjects />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/contact-us" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} name={name} setName={setName} setToken={setToken} setIsAuthenticated={setIsAuthenticated}>
              <About />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect to signin if no match */}
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </div>
  );
}

function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default Root;
