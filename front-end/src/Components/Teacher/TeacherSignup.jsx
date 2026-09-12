import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const apiUrl = import.meta.env.VITE_API_URL;

function TeacherSignup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      setMessage('Enter your email first.');
      setIsSuccess(false);
      return;
    }
    setSendingCode(true);
    setMessage('');
    try {
      const res = await axios.post(`${apiUrl}/teacher/send-invite-code`, { email });
      setMessage(res.data.message || 'Invite code sent to your email.');
      setIsSuccess(true);
      setCodeSent(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send invite code.');
      setIsSuccess(false);
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(
        `${apiUrl}/teacher/signup`,
        { name, email, password, inviteCode },
        { withCredentials: true }
      );
      setMessage(res.data.message || 'Signup successful.');
      setIsSuccess(true);
      setTimeout(() => navigate('/teacher/signin'), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Signup failed.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-dark">
      <div className="p-8 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 shadow-2xl rounded-2xl bg-white/95 backdrop-blur-sm border border-white/60">
        <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-2">TEACHER SIGN UP</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">We'll email you a 6-digit invite code to verify your address</p>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-gray-700 font-semibold">Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full text-gray-700 border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-brand-500"
            type="text"
            required
          />

          <label className="block mb-2 text-gray-700 font-semibold">Email</label>
          <div className="flex gap-2 mb-4">
            <input
              onChange={(e) => {
                setEmail(e.target.value);
                setCodeSent(false);
              }}
              value={email}
              className="flex-1 min-w-0 text-gray-700 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
              type="email"
              required
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={sendingCode || !email}
              className={`shrink-0 px-4 rounded-lg font-semibold text-sm border border-brand-500 text-brand-600 hover:bg-brand-50 transition-colors ${
                sendingCode || !email ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {sendingCode ? 'Sending...' : codeSent ? 'Resend' : 'Send Code'}
            </button>
          </div>

          <label className="block mb-2 text-gray-700 font-semibold">Password</label>
          <div className="relative mb-4">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full text-gray-700 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? (
                <EyeSlashIcon className="h-6 w-6 text-gray-500" />
              ) : (
                <EyeIcon className="h-6 w-6 text-gray-500" />
              )}
            </div>
          </div>

          <label className="block mb-2 text-gray-700 font-semibold">Invite Code</label>
          <input
            onChange={(e) => setInviteCode(e.target.value)}
            value={inviteCode}
            className="w-full text-gray-700 border border-gray-300 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-brand-500 tracking-widest"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="6-digit code from your email"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-gradient-to-r from-brand-600 to-brand-500 text-white w-full p-3 rounded-lg font-semibold shadow-md hover:from-brand-700 hover:to-brand-600 hover:shadow-lg hover:shadow-brand-500/30 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Submitting...' : 'SIGN UP'}
          </button>
        </form>

        {message && (
          <p className={`text-center mt-4 ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>{message}</p>
        )}

        <Link className="text-center block mt-6 text-brand-600 hover:text-brand-700 hover:underline" to="/teacher/signin">
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}

export default TeacherSignup;
