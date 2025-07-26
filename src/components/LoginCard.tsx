'use client';

import React, { useState, useRef, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { loginSuccess } from '@/lib/features/auth/authSlice';
import styles from './LoginCard.module.css';

const LoginCard = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessageState, setShowMessageState] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);

  // Sync NextAuth session with Redux store
  useEffect(() => {
    if (session?.user) {
      dispatch(loginSuccess({
        username: session.user.name || session.user.email || 'User',
        role: (session.user as any).role || 'admin'
      }));
      
      // Check for redirect parameter
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect');
      if (redirect) {
        router.push(redirect);
      } else {
        router.push('/admin');
      }
    }
  }, [session, dispatch, router]);

  const showMessage = (text: string) => {
    setMessage(text);
    setShowMessageState(true);
    setTimeout(() => {
      setShowMessageState(false);
      setMessage('');
    }, 3000);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signIn('google', { 
        callbackUrl: '/admin',
        redirect: false 
      });
      
      if (result?.error) {
        showMessage('Login failed. Please try again.');
      } else {
        showMessage('Redirecting to Google...');
      }
    } catch (error) {
      console.error('Login error:', error);
      showMessage('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div
        ref={boxRef}
        className={`${styles.box} ${isHovered ? styles.hovered : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.gradientContainer}>
          <div className={`${styles.gradientBox} ${styles.gradientBox1}`}></div>
          <div className={`${styles.gradientBox} ${styles.gradientBox2}`}></div>
        </div>
        <div className={styles.redGradientContainer}>
          <div className={`${styles.redGradientBox} ${styles.redGradientBox1}`}></div>
          <div className={`${styles.redGradientBox} ${styles.redGradientBox2}`}></div>
        </div>
        
        <div className={styles.form}>
          <h2 className={isHovered ? '' : styles.scaled}>LOGIN</h2>
          
          <div className={styles.inputContainer}>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className={`${styles.button} ${styles.googleButton}`}
              style={{
                background: loading ? '#ccc' : 'linear-gradient(45deg, #4285f4, #34a853, #fbbc05, #ea4335)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                marginBottom: '16px'
              }}
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>
            
            <div className={styles.links}>
              <a href="#" className={styles.forgot}>
                Need help?
              </a>
              <a href="#" className={styles.signup}>
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.message} ${showMessageState ? styles.show : ''}`}>
        {message}
      </div>
    </div>
  );
};

export default LoginCard;
