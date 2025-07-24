'use client';

import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { startTimer, stopTimer, decrementTime, resetTimer, setTime, startBeeping, stopBeeping } from '@/lib/features/timer/timerSlice';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Menu from './Menu';

export default function Timer() {
  const { time, isActive, isBeeping } = useSelector((state: RootState) => state.timer);
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [newTime, setNewTime] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/tinot.mp3');
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        dispatch(decrementTime());
      }, 10);
    } else if (time === 0 && isActive) {
      dispatch(startBeeping());
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, time, dispatch]);

  useEffect(() => {
    let beepInterval: NodeJS.Timeout | undefined;
    let beepTimeout: NodeJS.Timeout | undefined;

    if (isBeeping) {
      const playSound = () => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
      };
      playSound();
      beepInterval = setInterval(playSound, 1000);
      beepTimeout = setTimeout(() => {
        dispatch(stopBeeping());
      }, 60000);
    }

    return () => {
      if (beepInterval) {
        clearInterval(beepInterval);
      }
      if (beepTimeout) {
        clearTimeout(beepTimeout);
      }
    };
  }, [isBeeping, dispatch]);



  const formatTime = (centiseconds: number) => {
    const minutes = Math.floor(centiseconds / 6000);
    const seconds = Math.floor((centiseconds % 6000) / 100);
    const centis = centiseconds % 100;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${centis.toString().padStart(2, '0')}`;
  };

  const handleAppleClick = () => {
    if (isBeeping) {
      dispatch(stopBeeping());
      dispatch(resetTimer());
    } else if (isEditing) {
      setIsEditing(false);
      setNewTime('');
      dispatch(startTimer());
    } else {
      dispatch(isActive ? stopTimer() : startTimer());
    }
  };

  const handleTimeClick = () => {
    if (!isActive) {
      setIsEditing(true);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/[^0-9]/g, '');
    if (input.length <= 4) {
      setNewTime(input);
      const paddedInput = input.padStart(4, '0');
      const minutes = parseInt(paddedInput.slice(0, 2), 10);
      const seconds = parseInt(paddedInput.slice(2, 4), 10);
      dispatch(setTime((minutes * 60 + seconds) * 100));
    }
  };

  const handleTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [minutes, seconds] = newTime.split(':').map(Number);
    if (!isNaN(minutes) && !isNaN(seconds)) {
      dispatch(setTime((minutes * 60 + seconds) * 100));
      setIsEditing(false);
      setNewTime('');
    }
  };

  const appleVariants = {
    shaking: {
      x: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.5, repeat: Infinity },
    },
    still: {
      x: 0,
    },
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <div className="absolute top-10 left-10">
        <Menu />
      </div>
      <div className="h-20">
        {isBeeping ? (
          <h1 className="text-5xl font-bold text-red-500 mb-4 animate-blink">ALARM!</h1>
        ) : (
          isActive && <h1 className="text-5xl font-bold text-white mb-4 animate-blink">FOCUS TIME!</h1>
        )}
      </div>
      <motion.div
        animate={isBeeping ? 'shaking' : 'still'}
        variants={appleVariants}
      >
        <motion.button
          onClick={handleAppleClick}
          className="mb-4 cursor-pointer"
          whileTap={{ scale: 0.95 }}
        >
          <Image src="/yellowapple.png" alt="Start Timer" width={400} height={400} />
        </motion.button>
      </motion.div>
      {isEditing ? (
        <form onSubmit={handleTimeSubmit} ref={formRef}>
          <input
            type="text"
            value={newTime.replace(/(\d{2})(?=\d)/, '$1:')}
            onChange={handleTimeChange}
            className="text-5xl font-bold text-white bg-black text-center"
            placeholder="00:00"
            maxLength={5}
          />
        </form>
      ) : (
        <div onClick={handleTimeClick} className="text-5xl font-bold text-white cursor-pointer">
          {formatTime(time)}
        </div>
      )}
      <button
        onClick={() => dispatch(resetTimer())}
        className="px-4 py-2 mt-4 font-semibold text-white bg-red-500 rounded hover:bg-red-700"
      >
        Reset
      </button>
      <p className="text-white mt-4 text-sm">
        click the clock to set time, click the apple to start or stop, click reset to reset timer, click menu for more
      </p>
    </div>
  );
}