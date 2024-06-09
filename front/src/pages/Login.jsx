import React, { useState, useEffect } from 'react';
import { axiosClient } from '../API/axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token exists in local storage
        const token = localStorage.getItem('token');
        if (token) {
            // Redirect to products if token exists
            navigate('/products');
        }
    }, [navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axiosClient.post('/login', { email, password });
            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
                axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                navigate('/products');
            } else {
                // Handle invalid token response
                console.error('Invalid token received');
            }
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Log in </h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>
                <div className="flex justify-between items-center mt-4">
                    <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
                    <a href="#" className="text-blue-600 hover:underline">Sign up </a>
                </div>
            </div>
        </div>
    );
}

export default Login;
