// pages/login.js (or login.tsx if using TypeScript)

"use client"

import axios from 'axios';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Navbar from '../Navbar'; // Adjust path as needed

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      console.log('Logging in...');

      const response = await axios.post(
        'https://progres.mesrs.dz/api/authentication/v1/',
        {
          username,
          password,
        }
      );

      localStorage.setItem('userData', JSON.stringify(response.data));

      toast.success('Logged in successfully');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong', {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <Navbar />
      <div className="flex items-center justify-center flex-1 px-4">
        <div className="bg-gray-100 p-4 sm:p-6 md:p-8 rounded-lg shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md text-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={150}
            className="mx-auto mb-4 sm:mb-6 md:mb-8"
          />
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="mb-4 sm:mb-6 text-left">
              <label
                htmlFor="username"
                className="block mb-2 text-sm text-gray-600 font-bold"
              >
                <span className="text-red-500">*</span> Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="mb-4 sm:mb-6 md:mb-8 text-left">
              <label
                htmlFor="password"
                className="block mb-2 text-sm text-gray-600 font-bold"
              >
                <span className="text-red-500">*</span> Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading || username === '' || password === ''}
              className="w-full p-2 sm:p-3 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
