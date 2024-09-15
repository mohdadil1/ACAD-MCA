import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; 
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import './Signup.css';

function Signup() {
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
                ACAD MCA
            </div>

            <div className="p-8 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 shadow-lg rounded-xl bg-white bg-opacity-90">
                <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-8">SIGNUP</h1>

                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 text-gray-700 font-semibold">Name</label>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        className={`w-full text-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        type="text"
                        required
                    />
                    {errors.name && <p className="text-red-500 text-sm mb-4">{errors.name}</p>}

                    <label className="block mb-2 text-gray-700 font-semibold">Email</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className={`w-full text-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        type="email"
                        required
                    />
                    {errors.email && <p className="text-red-500 text-sm mb-4">{errors.email}</p>}
                    
                    <label className="block mb-2 text-gray-700 font-semibold">Password</label>
                    <div className="relative">
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className={`w-full text-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                            className={`w-full text-gray-700 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                        className={`bg-gradient-to-r from-blue-600 to-blue-500 text-white w-full p-3 rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-blue-600 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        disabled={loading}
                    > 
                        {loading ? 'Submitting...' : 'SUBMIT'}
                    </button>
                </form>

                <Link className="text-center block mt-6 text-blue-600 hover:underline" to={'/signin'}>
                    SIGN IN
                </Link>

                <div className="mt-6 flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                            setMessage('Google signup failed.');
                        }}
                        auto_select={false}  
                    />
                </div>
            </div>
        </div>
    );
}

export default Signup;
