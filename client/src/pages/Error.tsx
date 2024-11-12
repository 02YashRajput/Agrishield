import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center p-10 bg-white shadow-md rounded-lg">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-xl mb-4">Something went wrong. The page you're looking for doesn't exist.</p>
        <p className="text-gray-600 mb-6">Please check the URL or go back to the homepage.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Go back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
