'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export default function AuthTestPage() {
  const [supabaseUrl, setSupabaseUrl] = useState<string>('');
  const [supabaseKey, setSupabaseKey] = useState<string>('');
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check if environment variables are available
    setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set');
    setSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden for security)' : 'Not set');
  }, []);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('');
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setTestResult(`Error connecting to Supabase: ${error.message}`);
      } else {
        setTestResult(`Successfully connected to Supabase. Session: ${data.session ? 'Active' : 'None'}`);
      }
    } catch (error) {
      setTestResult(`Exception: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    if (!email || !password) {
      setTestResult('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setTestResult('');
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('Raw login response:', { data, error });
      
      if (error) {
        setTestResult(`Login error: ${error.message}`);
      } else if (!data.user || !data.session) {
        setTestResult('Login succeeded but no user or session returned');
      } else {
        setTestResult(`Login successful! User ID: ${data.user.id}`);
      }
    } catch (error) {
      setTestResult(`Exception: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-indigo-600">
          <h1 className="text-lg leading-6 font-medium text-white">Supabase Auth Test</h1>
          <p className="mt-1 max-w-2xl text-sm text-indigo-100">Test your Supabase authentication configuration</p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">Environment Variables</h2>
          <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">NEXT_PUBLIC_SUPABASE_URL</dt>
              <dd className="mt-1 text-sm text-gray-900">{supabaseUrl}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">NEXT_PUBLIC_SUPABASE_ANON_KEY</dt>
              <dd className="mt-1 text-sm text-gray-900">{supabaseKey}</dd>
            </div>
          </dl>
          
          <div className="mt-6">
            <button
              onClick={testConnection}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Testing...' : 'Test Supabase Connection'}
            </button>
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Test Login</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <button
                  onClick={testLogin}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? 'Testing...' : 'Test Login'}
                </button>
              </div>
            </div>
          </div>
          
          {testResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-900">Test Result:</h3>
              <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{testResult}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
