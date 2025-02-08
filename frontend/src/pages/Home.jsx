import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="w-full py-4 px-6 bg-white shadow-lg flex justify-between items-center fixed top-0 left-0 right-0 z-50">
        {/* Logo */}
        <div className="text-3xl font-extrabold text-blue-600">
          <Link to="/">Workfolio</Link>
        </div>

        {/* Navigation and buttons */}
        <div className="flex space-x-6 items-center">
          <Link to="/pricing" className="text-lg text-gray-700 hover:text-blue-600 transition duration-300">Pricing</Link>
          <Link to="/signup" className="text-lg text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl shadow-md transition duration-300">Sign Up</Link>
          <button className="text-lg text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl shadow-md transition duration-300">
            Book a demo
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-32 sm:px-12 bg-gradient-to-r from-blue-50 to-white">
        <header className="w-full max-w-6xl text-gray-900">
          <h1 className="text-6xl font-extrabold leading-tight mb-6 text-gray-800">
            Employee attendance clock-in software
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Auto-generate timesheets based on the productive hours of your employees—effortlessly track and monitor work.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="flex items-center space-x-2 text-gray-700">
              <span className="text-green-500 text-2xl">&#10003;</span>
              <span>Verified Working Hours</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <span className="text-green-500 text-2xl">&#10003;</span>
              <span>Computer Activity Tracking</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <span className="text-green-500 text-2xl">&#10003;</span>
              <span>Optional Screenshots</span>
            </div>
          </div>

          <div className="flex justify-center items-center space-x-6 mt-8">
            <button
              className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
              onClick={() => window.location.href = '/'}
            >
              Start monitoring your team - it's free!
            </button>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Unlimited Users. Free Forever.
          </p>
        </header>
      </div>

      {/* Footer */}
      <footer className="bg-white py-8 mt-16">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p>&copy; 2025 Workfolio. All rights reserved.</p>
          <div className="mt-4">
            <Link to="/privacy" className="hover:text-blue-600 transition duration-300">Privacy Policy</Link> | 
            <Link to="/terms" className="hover:text-blue-600 transition duration-300"> Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
