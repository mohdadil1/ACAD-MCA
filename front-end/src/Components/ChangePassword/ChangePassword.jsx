import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function ChangePassword() {

    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const apiUrl =  import.meta.env.VITE_API_URL;
    const validate = () => {
        const errors = {};
        if (!otp) {
            errors.otp = "OTP is required";
        } else if (otp.length !== 4) {  // Change to 4 or 6 based on actual OTP length
            errors.otp = "OTP must be 4 digits";  // Adjust message as per actual OTP length
        }
        if (!password) {
            errors.password = "Password is required";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters long";
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        try {
            const res = await axios.post(`${apiUrl}/submitotp`, {
                otp: otp,
                password: password,
            }, {
                withCredentials: true,  // Ensure credentials (cookies) are sent
            });

            if (res.data.code === 200) {
                setMessage('Password updated successfully.');
                setIsSuccess(true);
                setTimeout(() => {
                    navigate('/signin');
                }, 1000);
            } else {
                setMessage('Wrong OTP.');
                setIsSuccess(false);
            }
        } catch (err) {
            setMessage('An error occurred.');
            setIsSuccess(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
            <div className="relative p-8 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 shadow-lg rounded-xl bg-white">
                <button
                    className="absolute top-1 left-2 md:top-4 md:left-4 bg-blue-500 text-white p-2 md:p-3 rounded-full hover:bg-blue-600 text-xs md:text-sm lg:text-base"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>
                <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-8">Change Password</h1>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block mb-2 text-gray-700 font-semibold">OTP</label>
                        <input
                            onChange={(e) => setOtp(e.target.value)}
                            value={otp}
                            className="w-full text-gray-700 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter your OTP"
                        />
                        {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-gray-700 font-semibold">New Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className="w-full text-gray-700 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="password"
                            placeholder="Enter your new password"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-blue-500 text-white w-full p-3 rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-blue-600 transition-all"
                    >
                        CHANGE PASSWORD
                    </button>
                </form>

                {message && (
                    <p className={`text-center mt-4 ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default ChangePassword;
