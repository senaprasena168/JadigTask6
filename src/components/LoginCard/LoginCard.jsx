import React, { useState, useRef, useEffect } from 'react';
import styles from './LoginCard.module.css';

const LoginCard = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessageState, setShowMessageState] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const boxRef = useRef(null);

  // Effect to handle the hover class for the box based on input focus
  useEffect(() => {
    const handleFocus = () => {
      setIsHovered(true);
    };

    const usernameInput = usernameInputRef.current;
    const passwordInput = passwordInputRef.current;

    if (usernameInput) {
      usernameInput.addEventListener('focus', handleFocus);
    }
    if (passwordInput) {
      passwordInput.addEventListener('focus', handleFocus);
    }

    return () => {
      if (usernameInput) {
        usernameInput.removeEventListener('focus', handleFocus);
      }
      if (passwordInput) {
        passwordInput.removeEventListener('focus', handleFocus);
      }
    };
  }, []);

  const shakeInput = (inputElement) => {
    if (inputElement && inputElement.parentElement) {
      inputElement.parentElement.classList.add(styles.shake);
      setTimeout(() => {
        inputElement.parentElement.classList.remove(styles.shake);
      }, 500);
    }
  };

  const showMessage = (text) => {
    setMessage(text);
    setShowMessageState(true);
    setTimeout(() => {
      setShowMessageState(false);
      setMessage('');
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      shakeInput(usernameInputRef.current);
      return;
    }

    if (!password.trim()) {
      shakeInput(passwordInputRef.current);
      return;
    }

    setLoading(true);
    // Simulate login process
    setTimeout(() => {
      console.log('Login attempt:', {
        username: username,
        password: '********', // Never log actual passwords
      });
      setLoading(false);
      showMessage('Login successful!');
      // Here you would typically handle actual authentication
    }, 1500);
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
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={isHovered ? '' : styles.scaled}>LOGIN</h2>
          <div className={styles.inputContainer}>
            <div className={styles.inputBox}>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                ref={usernameInputRef}
              />
              <span>Username</span>
            </div>
            <div className={styles.inputBox}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordInputRef}
              />
              <span>Password</span>
            </div>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <div className={styles.links}>
              <a href="#" className={styles.forgot}>Forgot Password</a>
              <a href="#" className={styles.signup}>Sign Up</a>
            </div>
          </div>
        </form>
      </div>
      <div className={`${styles.message} ${showMessageState ? styles.show : ''}`}>
        {message}
      </div>
    </div>
  );
};

export default LoginCard;