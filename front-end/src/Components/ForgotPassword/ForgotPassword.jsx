import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function ForgetPassword() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const apiUrl =  import.meta.env.VITE_API_URL;
    const handleSubmit = async (e) => {
        e.preventDefault(); 

        try {
            const res = await axios.post(`${apiUrl}/sendotp`, { email }, {
                withCredentials: true,  // Ensure credentials (cookies) are sent
            });

            if (res.status === 200) {
                setMessage('OTP sent successfully.');
                setIsSuccess(true);
                setTimeout(() => {
                    navigate('/changepassword');
                }, 1000);
            } else {
                setMessage('Email / Server Error.');
                setIsSuccess(false);
            }
        } catch (err) {
            if (err.response) {
                setMessage(err.response.data.message || 'Email not found.');
                setIsSuccess(false);
            } else {
                setMessage('An error occurred.');
                setIsSuccess(false);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-brand-dark">
            <div className="p-8 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 shadow-2xl rounded-2xl bg-white relative">

                {/* Back Button */}
                <button
                     onClick={() => navigate(-1)}
                     className="absolute top-1 left-2 md:top-4 md:left-4 bg-brand-500 text-white p-2 md:p-3 rounded-full hover:bg-brand-600 text-xs md:text-sm lg:text-base"
                    >
                     Back
                </button>

                <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-8">FORGOT PASSWORD</h1>
                
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 text-gray-700 font-semibold">Email</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="w-full text-gray-700 border border-gray-300 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        type="email"
                        placeholder="Enter your email"
                        required
                    />
                    
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-brand-600 to-brand-500 text-white w-full p-3 rounded-lg font-semibold shadow-md hover:from-brand-700 hover:to-brand-600 hover:shadow-lg hover:shadow-brand-500/30 transition-all"
                    >
                        SEND OTP
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

export default ForgetPassword;
