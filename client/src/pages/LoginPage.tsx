import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '../utils/constants';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        const decoded: any = jwtDecode(idToken);
        const userData = {
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
        };
        login(userData, idToken);
        navigate('/');
      }
    } catch (error) {
      console.error('Error during login', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="overflow-hidden rounded-[2.5rem] border border-white/20 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/80 backdrop-blur-2xl p-10 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col items-center gap-8">
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-xl transform rotate-12">
               <span className="text-white text-4xl font-black -rotate-12">T</span>
            </div>
            
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                Welcome Back
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg leading-relaxed">
                Continue your learning journey with <span className="text-blue-600 dark:text-blue-400 font-bold">TechEaze</span>
              </p>
            </div>

            <div className="w-full flex justify-center py-4">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.log('Login Failed')}
                theme="filled_black"
                shape="pill"
                size="large"
                width="320"
              />
            </div>

            <div className="mt-4 text-[11px] text-center text-neutral-400 dark:text-neutral-500 font-medium leading-relaxed max-w-[240px]">
              By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Decorative Blur Mask */}
      <div className="absolute inset-0 z-0 backdrop-blur-[1px] pointer-events-none" />
    </div>
  );
};
