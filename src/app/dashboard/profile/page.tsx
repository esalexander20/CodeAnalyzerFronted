'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState({
    id: '',
    fullName: '',
    email: '',
    githubUsername: '',
    avatarUrl: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
    createdAt: '',
    preferences: {
      emailNotifications: true,
      weeklyDigest: true,
      darkMode: false
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    githubUsername: '',
    preferences: {
      emailNotifications: true,
      weeklyDigest: true,
      darkMode: false
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Load user data from Supabase auth
  useEffect(() => {
    if (authUser) {
      const userData = {
        id: authUser.id,
        fullName: authUser.user_metadata?.name || '',
        email: authUser.email || '',
        githubUsername: authUser.user_metadata?.github_username || '',
        avatarUrl: authUser.user_metadata?.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        createdAt: authUser.created_at || '',
        preferences: {
          emailNotifications: authUser.user_metadata?.preferences?.emailNotifications ?? true,
          weeklyDigest: authUser.user_metadata?.preferences?.weeklyDigest ?? true,
          darkMode: authUser.user_metadata?.preferences?.darkMode ?? false
        }
      };
      
      setUser(userData);
      setFormData({
        fullName: userData.fullName,
        email: userData.email,
        githubUsername: userData.githubUsername,
        preferences: { ...userData.preferences }
      });
    }
  }, [authUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const preferenceName = name.split('.')[1];
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          [preferenceName]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      const supabase = createClient();
      
      // Update user metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          name: formData.fullName,
          github_username: formData.githubUsername,
          preferences: formData.preferences
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Update user state with form data
      setUser({
        ...user,
        fullName: formData.fullName,
        githubUsername: formData.githubUsername,
        preferences: formData.preferences
      });
      
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setErrorMessage('Failed to update profile. Please try again.');
      console.error('Profile update error:', err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle authentication state
  useEffect(() => {
    if (!authLoading && !authUser) {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [authLoading, authUser, router]);

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
        <div className="py-6 flex justify-center items-center h-64">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2">Loading profile...</p>
          </div>
        </div>
    );
  }
  
  // If not authenticated and not loading, don't render anything
  if (!authUser) {
    return null;
  }

  return (
      <div className="py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Profile
            </button>
          )}
        </div>
        
        {successMessage && (
          <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        {errorMessage && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <Image
              className="h-32 w-32 rounded-full"
              src={user.avatarUrl}
              alt="User avatar"
              width={128}
              height={128}
            />
            <div className="ml-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{user.fullName}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          {isEditing ? (
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                    <p className="mt-1 text-sm text-gray-500">Update your account information.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="fullName"
                          id="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="githubUsername" className="block text-sm font-medium text-gray-700">
                        GitHub Username
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="githubUsername"
                          id="githubUsername"
                          value={formData.githubUsername}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Preferences</h3>
                    <p className="mt-1 text-sm text-gray-500">Customize your experience.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="emailNotifications"
                          name="preferences.emailNotifications"
                          type="checkbox"
                          checked={formData.preferences.emailNotifications}
                          onChange={handleInputChange}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="emailNotifications" className="font-medium text-gray-700">Email Notifications</label>
                        <p className="text-gray-500">Receive email notifications about your repository analysis.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="weeklyDigest"
                          name="preferences.weeklyDigest"
                          type="checkbox"
                          checked={formData.preferences.weeklyDigest}
                          onChange={handleInputChange}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="weeklyDigest" className="font-medium text-gray-700">Weekly Digest</label>
                        <p className="text-gray-500">Receive a weekly summary of your repositories&apos; performance.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="darkMode"
                          name="preferences.darkMode"
                          type="checkbox"
                          checked={formData.preferences.darkMode}
                          onChange={handleInputChange}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="darkMode" className="font-medium text-gray-700">Dark Mode</label>
                        <p className="text-gray-500">Use dark theme for the application interface.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          fullName: user.fullName,
                          email: user.email,
                          githubUsername: user.githubUsername,
                          preferences: { ...user.preferences }
                        });
                      }}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.fullName}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">GitHub username</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user.githubUsername ? (
                      <a 
                        href={`https://github.com/${user.githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {user.githubUsername}
                      </a>
                    ) : (
                      <span className="text-gray-500 italic">Not provided</span>
                    )}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Preferences</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                      <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <span className="ml-2 flex-1 w-0 truncate">Email Notifications</span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {user.preferences.emailNotifications ? (
                            <span className="font-medium text-green-600">Enabled</span>
                          ) : (
                            <span className="font-medium text-red-600">Disabled</span>
                          )}
                        </div>
                      </li>
                      <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <span className="ml-2 flex-1 w-0 truncate">Weekly Digest</span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {user.preferences.weeklyDigest ? (
                            <span className="font-medium text-green-600">Enabled</span>
                          ) : (
                            <span className="font-medium text-red-600">Disabled</span>
                          )}
                        </div>
                      </li>
                      <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <span className="ml-2 flex-1 w-0 truncate">Dark Mode</span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {user.preferences.darkMode ? (
                            <span className="font-medium text-green-600">Enabled</span>
                          ) : (
                            <span className="font-medium text-red-600">Disabled</span>
                          )}
                        </div>
                      </li>
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
        
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Account Management</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your account settings and security.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const supabase = createClient();
                    await supabase.auth.resetPasswordForEmail(user.email, {
                      redirectTo: `${window.location.origin}/auth/reset-password`,
                    });
                    setSuccessMessage('Password reset email sent. Please check your inbox.');
                  } catch (error) {
                    setErrorMessage('Failed to send password reset email.');
                    console.error(error);
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Change Password
              </button>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Connect GitHub Account
              </button>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
