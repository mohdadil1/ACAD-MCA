import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import './Signup.css';

function Signup() {
    const [mode, setMode] = useState('email'); // 'email' | 'phone'

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    // Phone signup state
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);

    const switchMode = (nextMode) => {
        setMode(nextMode);
        setMessage('');
        setErrors({});
        setIsSuccess(false);
    };

    // Validation for the form fields
    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = "Name is required.";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email address is invalid.";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required.";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long.";
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(`${apiUrl}/signup`, {
                name,
                email,
                password
            }, {
                withCredentials: true,
            });

            setMessage(res.data.message);
            if (res.data.code === 200) {
                setIsSuccess(true);
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            }
        } catch (err) {
            console.error("Error response:", err);
            setMessage(err.response?.data?.message || 'An error occurred.');
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post(`${apiUrl}/gsignup`, {
                token: credentialResponse.credential,
            }, {
                withCredentials: true,
            });

            if (res.status === 200) {
                setMessage('Signup success.');
                setIsSuccess(true);
                setTimeout(() => {
                    navigate('/signin');
                }, 1000);
            } else {
                setMessage('Google signup failed.');
                setIsSuccess(false);
            }
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || 'Google signup error.');
            setIsSuccess(false);
        }
    };

    // --- Phone signup ---
    const handleSendOtp = async () => {
        setMessage('');
        setErrors({});
        if (!name.trim()) {
            setErrors({ name: 'Name is required.' });
            return;
        }
        if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
            setErrors({ phone: 'Enter a valid phone number with country code, e.g. +919876543210.' });
            return;
        }

        setSendingOtp(true);
        try {
            await axios.post(`${apiUrl}/phone/send-otp`, { phone }, { withCredentials: true });
            setOtpSent(true);
            setMessage('OTP sent. Please check your phone.');
            setIsSuccess(true);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to send OTP.');
            setIsSuccess(false);
        } finally {
            setSendingOtp(false);
        }
    };

    const handlePhoneSignup = async (e) => {
        e.preventDefault();
        setMessage('');

        const newErrors = {};
        if (!password.trim()) {
            newErrors.password = 'Password is required.';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
        }
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }
        if (!otp.trim()) {
            newErrors.otp = 'OTP is required.';
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);
        try {
            const res = await axios.post(`${apiUrl}/phone/signup`, {
                name,
                phone,
                password,
                otp,
            }, { withCredentials: true });

            setMessage(res.data.message);
            if (res.data.code === 200) {
                setIsSuccess(true);
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            }
        } catch (err) {
            setMessage(err.response?.data?.message || 'An error occurred.');
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    // Toggle password visibility functions
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="flex items-center justify-center min-h-screen relative bg">
            <div className="absolute top-5 left-5 text-4xl font-bold moving-text">
                ACAD
            </div>

            <div className="p-8 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 shadow-2xl rounded-2xl bg-white/95 backdrop-blur-sm border border-white/60">
                <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-6">SIGNUP</h1>

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

                {mode === 'email' && (
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 text-gray-700 font-semibold">Name</label>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        className={`w-full text-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-brand-500`}
                        type="text"
                        required
                    />
                    {errors.name && <p className="text-red-500 text-sm mb-4">{errors.name}</p>}

                    <label className="block mb-2 text-gray-700 font-semibold">Email</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className={`w-full text-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-brand-500`}
                        type="email"
                        required
                    />
                    {errors.email && <p className="text-red-500 text-sm mb-4">{errors.email}</p>}

                    <label className="block mb-2 text-gray-700 font-semibold">Password</label>
                    <div className="relative">
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className={`w-full text-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-brand-500`}
                            type={showPassword ? "text" : "password"}
                            required
                        />
                        <div
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <EyeIcon className="h-6 w-6 text-gray-500" />
                            ) : (
                                <EyeSlashIcon className="h-6 w-6 text-gray-500" />
                            )}
                        </div>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mb-4">{errors.password}</p>}

                    <label className="block mb-2 text-gray-700 font-semibold">Confirm Password</label>
                    <div className="relative">
                        <input
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            className={`w-full text-gray-700 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-brand-500`}
                            type={showConfirmPassword ? "text" : "password"}
                            required
                        />
                        <div
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            onClick={toggleConfirmPasswordVisibility}
                        >
                            {showConfirmPassword ? (
                                <EyeIcon className="h-6 w-6 text-gray-500" />
                            ) : (
                                <EyeSlashIcon className="h-6 w-6 text-gray-500" />
                            )}
                        </div>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mb-4">{errors.confirmPassword}</p>}

                    {message && (
                        <div className={`text-center p-3 mb-4 rounded-lg ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`bg-gradient-to-r from-brand-600 to-brand-500 text-white w-full p-3 rounded-lg font-semibold shadow-md hover:from-brand-700 hover:to-brand-600 hover:shadow-lg hover:shadow-brand-500/30 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'SUBMIT'}
                    </button>
                </form>
                )}

                {mode === 'phone' && (
                <form onSubmit={handlePhoneSignup}>
                    <label className="block mb-2 text-gray-700 font-semibold">Name</label>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        disabled={otpSent}
                        className={`w-full text-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-gray-100`}
                        type="text"
                        required
                    />
                    {errors.name && <p className="text-red-500 text-sm mb-4">{errors.name}</p>}

                    <label className="block mb-2 text-gray-700 font-semibold">Phone Number</label>
                    <div className="flex gap-2 mb-2">
                        <input
                            onChange={(e) => setPhone(e.target.value)}
                            value={phone}
                            disabled={otpSent}
                            placeholder="+919876543210"
                            className={`flex-1 text-gray-700 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-gray-100`}
                            type="tel"
                            required
                        />
                        <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={sendingOtp || otpSent}
                            className={`bg-brand-500 hover:bg-brand-600 text-white font-semibold px-4 rounded-lg whitespace-nowrap transition-colors duration-200 ${(sendingOtp || otpSent) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {otpSent ? 'Sent' : sendingOtp ? 'Sending…' : 'Send OTP'}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Include your country code, e.g. +91 for India.</p>
                    {errors.phone && <p className="text-red-500 text-sm mb-4">{errors.phone}</p>}

                    {otpSent && (
                        <>
                            <label className="block mb-2 text-gray-700 font-semibold">OTP</label>
                            <input
                                onChange={(e) => setOtp(e.target.value)}
                                value={otp}
                                className={`w-full text-gray-700 border ${errors.otp ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-brand-500`}
                                type="text"
                                required
                            />
                            {errors.otp && <p className="text-red-500 text-sm mb-4">{errors.otp}</p>}

                            <label className="block mb-2 text-gray-700 font-semibold">Password</label>
                            <div className="relative">
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    className={`w-full text-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-brand-500`}
                                    type={showPassword ? "text" : "password"}
                                    required
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <EyeIcon className="h-6 w-6 text-gray-500" />
                                    ) : (
                                        <EyeSlashIcon className="h-6 w-6 text-gray-500" />
                                    )}
                                </div>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mb-4">{errors.password}</p>}

                            <label className="block mb-2 text-gray-700 font-semibold">Confirm Password</label>
                            <div className="relative">
                                <input
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                    className={`w-full text-gray-700 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-brand-500`}
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {showConfirmPassword ? (
                                        <EyeIcon className="h-6 w-6 text-gray-500" />
                                    ) : (
                                        <EyeSlashIcon className="h-6 w-6 text-gray-500" />
                                    )}
                                </div>
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-sm mb-4">{errors.confirmPassword}</p>}
                        </>
                    )}

                    {message && (
                        <div className={`text-center p-3 mb-4 rounded-lg ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message}
                        </div>
                    )}

                    {otpSent && (
                        <button
                            type="submit"
                            className={`bg-gradient-to-r from-brand-600 to-brand-500 text-white w-full p-3 rounded-lg font-semibold shadow-md hover:from-brand-700 hover:to-brand-600 hover:shadow-lg hover:shadow-brand-500/30 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'VERIFY & SIGN UP'}
                        </button>
                    )}
                </form>
                )}

                <Link className="text-center block mt-6 text-brand-600 hover:text-brand-700 hover:underline" to={'/signin'}>
                    SIGN IN
                </Link>

                {mode === 'email' && (
                <div className="mt-6 flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                            setMessage('Google signup failed.');
                        }}
                        auto_select={false}
                    />
                </div>
                )}
            </div>
        </div>
    );
}

export default Signup;
