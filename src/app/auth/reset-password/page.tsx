'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
  const router = useRouter();

  // Check if we have a hash fragment in the URL (from password reset email)
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (!hashParams.get('access_token')) {
      setMessage({ 
        type: 'error', 
        text: 'Invalid or expired password reset link. Please request a new password reset.' 
      });
    }
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const supabase = createClient();
      
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw error;
      }

      setMessage({ 
        type: 'success', 
        text: 'Password updated successfully! You will be redirected to login...' 
      });
      
      // Redirect to login after successful password reset
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to reset password. Please try again or request a new reset link.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your new password below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message.text && (
            <div 
              className={`mb-4 p-4 rounded ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                  minLength={8}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                  minLength={8}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || message.type === 'success'}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  (loading || message.type === 'success') ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Return to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
