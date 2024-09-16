import './App.css'
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

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }
  return (
    <>
      <NavBar 
        name={children.props.name}
        setName={children.props.setName}
        setToken={children.props.setToken}
        setIsAuthenticated={children.props.setIsAuthenticated}
      />
      {children}
    </>
  );
};

function App() {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get('/check-auth', { withCredentials: true });
        

        if (res.status === 200 && res.data.user) {
          setIsAuthenticated(true);
          setName(res.data.user);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
       // console.error('Session check failed:', error.response ? error.response.data : error.message);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        setShowSpinner(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    setShowSpinner(true);
    const handleRouteChange = () => {
      
      const timer = setTimeout(() => {
        setShowSpinner(false);
      }, 800); 
      return () => clearTimeout(timer);
    };

    handleRouteChange();
  }, [location]);

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
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home 
                name={name}
                setName={setName}
                setToken={setToken}
                setIsAuthenticated={setIsAuthenticated}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/classroom" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Classroom 
                name={name}
                setName={setName}
                setToken={setToken}
                setIsAuthenticated={setIsAuthenticated}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/coding" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Coding 
                name={name}
                setName={setName}
                setToken={setToken}
                setIsAuthenticated={setIsAuthenticated}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/about-us" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <About 
                name={name}
                setName={setName}
                setToken={setToken}
                setIsAuthenticated={setIsAuthenticated}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/classroom/:semester" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Semester 
                name={name}
                setName={setName}
                setToken={setToken}
                setIsAuthenticated={setIsAuthenticated}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/classroom/:semester/:subject" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Subjects 
                name={name}
                setName={setName}
                setToken={setToken}
                setIsAuthenticated={setIsAuthenticated}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/contact-us" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <About 
                name={name}
                setName={setName}
                setToken={setToken}
                setIsAuthenticated={setIsAuthenticated}
              />
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
