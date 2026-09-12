import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import './Signin.css';

axios.defaults.withCredentials = true;

function Signin({ setName, setToken, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('email'); // 'email' | 'phone'
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
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

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setMessage('');
    setIsSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const identifier = mode === 'email' ? emailInput : phoneInput;
    if (!identifier || !password) {
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
        mode === 'email' ? { email: emailInput, password } : { phone: phoneInput, password },
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
        ACAD
      </div>
      <div className="p-8 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 shadow-2xl rounded-2xl bg-white/95 backdrop-blur-sm border border-white/60">
        <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-6">SIGN IN</h1>

        <div className="flex justify-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => switchMode('email')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${mode === 'email' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => switchMode('phone')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${mode === 'phone' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Phone
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'email' ? (
            <>
              <label className="block mb-2 text-gray-700 font-semibold">Email</label>
              <input
                onChange={(e) => setEmailInput(e.target.value)}
                value={emailInput}
                className="w-full text-gray-700 border border-gray-300 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-brand-500"
                type="email"
                required
              />
            </>
          ) : (
            <>
              <label className="block mb-2 text-gray-700 font-semibold">Phone Number</label>
              <input
                onChange={(e) => setPhoneInput(e.target.value)}
                value={phoneInput}
                placeholder="+919876543210"
                className="w-full text-gray-700 border border-gray-300 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-brand-500"
                type="tel"
                required
              />
            </>
          )}

          <label className="block mb-2 text-gray-700 font-semibold">Password</label>
          <div className="relative mb-6">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full text-gray-700 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
            className={`bg-gradient-to-r from-brand-600 to-brand-500 text-white w-full p-3 rounded-lg font-semibold shadow-md hover:from-brand-700 hover:to-brand-600 hover:shadow-lg hover:shadow-brand-500/30 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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

        {mode === 'email' && (
          <Link className="text-center block mt-6 text-brand-600 hover:text-brand-700 hover:underline" to={'/forgotpassword'}>
            Forgot Password
          </Link>
        )}
        <Link className="text-center block mt-6 text-brand-600 hover:text-brand-700 hover:underline" to={'/signup'}>
          SIGN UP
        </Link>

        {mode === 'email' && (
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
        )}
      </div>
    </div>
  );
}

export default Signin;
