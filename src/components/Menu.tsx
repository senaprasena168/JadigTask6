'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowAbout(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        <Image src="/menu-ico-trans.png" alt="Menu" width={50} height={50} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="absolute top-14 left-0 bg-white rounded-lg shadow-lg p-4 w-64"
          >
            {showAbout ? (
              <div onClick={() => setShowAbout(false)} className="cursor-pointer">
                <p className="text-sm text-gray-700">
                  A timer app that uses redux, useSelector, useDispatch, component A, component B, input form, and display the input in a timer form. made to fulfill task 5 (meeting 6) from Fullstack Web Programming JDA 2025. thank you for reviewing this!
                  <br /><br />
                  attribution:
                  <br />
                  beeps3.mp3 by steveygos93 -- <a href="https://freesound.org/s/103588/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://freesound.org/s/103588/</a> -- License: Attribution 3.0
                </p>
              </div>
            ) : (
              <ul>
                <li>
                  <a href="https://jadig-task5.vercel.app/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                    Vercel Link
                  </a>
                </li>
                <li>
                  <a href="https://github.com/senaprasena168/JadigTask5" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                    GitHub Link
                  </a>
                </li>
                <li>
                  <button onClick={() => setShowAbout(true)} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">
                    About
                  </button>
                </li>
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}