import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { jwtDecode } from 'jwt-decode';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;

    try {
      // Send the idToken to the backend
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Backend response:', data);
        
        // Also decode and update local auth context
        const decoded: any = jwtDecode(idToken);
        const userData = {
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
        };
        login(userData);
        navigate('/');
      } else {
        console.error('Backend authentication failed');
      }
    } catch (error) {
      console.error('Error sending token to backend', error);
    }
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden bg-neutral-100 dark:bg-neutral-950">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md px-4"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/20 dark:border-neutral-800/50 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl p-8 shadow-2xl">
          <div className="flex flex-col items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
               <span className="text-white text-2xl font-bold">T</span>
            </div>
            
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Welcome Back
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Continue your learning journey with TextToLearn
              </p>
            </div>

            <div className="w-full flex justify-center scale-110">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                theme="filled_black"
                shape="pill"
                size="large"
                text="continue_with"
                width="100%"
              />
            </div>

            <div className="mt-4 text-xs text-center text-neutral-500 dark:text-neutral-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Abstract Background Blur "Behind" everything */}
      <div className="absolute inset-0 z-0 backdrop-blur-[2px]" />
    </div>
  );
};
