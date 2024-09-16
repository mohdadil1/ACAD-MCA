import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import './Signin.css';

axios.defaults.withCredentials = true;

function Signin({ setName, setToken, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('Token');
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('Token');
        localStorage.removeItem('Name'); 
        window.location.href = '/signin';
      }
      return Promise.reject(error);
    }
  );

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailInput || !password) {
      setMessage('All fields are required.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${apiUrl}/signin`,
        { email: emailInput, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setMessage('Signin success.');
        setIsSuccess(true);
        localStorage.setItem('Token', res.data.token);
        localStorage.setItem('Name', res.data.name);
        setToken(res.data.token);
        setName(res.data.name);

        setTimeout(() => {
          setIsAuthenticated(true);
          navigate('/');
        }, 500);

      } else {
        setMessage(res.data.message || 'Signin failed.');
        setIsSuccess(false);
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage(err.response?.data?.message || 'An error occurred.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${apiUrl}/gsignin`,
        { idToken: credentialResponse.credential },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setMessage('Google Sign-in success.');
        setIsSuccess(true);
        localStorage.setItem('Token', res.data.token);
        localStorage.setItem('Name', res.data.name);
        setToken(res.data.token);
        setName(res.data.name);

        setTimeout(() => {
          setIsAuthenticated(true);
          navigate('/');
        }, 1000);

      } else {
        setMessage(res.data.message || 'Google sign-in failed.');
        setIsSuccess(false);
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setMessage(err.response?.data?.message || 'Google sign-in error.');
      setIsSuccess(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative bg">
      <div className="absolute top-5 left-5 text-4xl font-bold moving-text">
        ACAD MCA
      </div>
      <div className="p-8 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 shadow-lg rounded-xl bg-white bg-opacity-90">
        <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-8">SIGN IN</h1>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-gray-700 font-semibold">Email</label>
          <input
            onChange={(e) => setEmailInput(e.target.value)}
            value={emailInput}
            className="w-full text-gray-700 border border-gray-300 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            required
          />

          <label className="block mb-2 text-gray-700 font-semibold">Password</label>
          <div className="relative mb-6">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full text-gray-700 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {!showPassword ? (
                <EyeSlashIcon className="h-6 w-6 text-gray-500" />
              ) : (
                <EyeIcon className="h-6 w-6 text-gray-500" />
              )}
            </div>
          </div>

          <button
            type="submit"
            className={`bg-gradient-to-r from-blue-600 to-blue-500 text-white w-full p-3 rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-blue-600 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'SUBMIT'}
          </button>
        </form>

        {message && (
          <p className={`text-center mt-4 ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <Link className="text-center block mt-6 text-blue-600 hover:underline" to={'/forgotpassword'}>
          Forgot Password
        </Link>
        <Link className="text-center block mt-6 text-blue-600 hover:underline" to={'/signup'}>
          SIGN UP
        </Link>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              setMessage('Google sign-in failed.');
              setIsSuccess(false);
            }}
            auto_select={false}
          />
        </div>
      </div>
    </div>
  );
}

export default Signin;
