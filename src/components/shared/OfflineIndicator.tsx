
"use client";

import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Function to update online status
    const updateOnlineStatus = () => {
      if (typeof navigator !== 'undefined') {
        setIsOffline(!navigator.onLine);
      }
    };

    // Initial check
    updateOnlineStatus();

    // Listen to online/offline events
    window.addEventListener('offline', updateOnlineStatus);
    window.addEventListener('online', updateOnlineStatus);

    return () => {
      window.removeEventListener('offline', updateOnlineStatus);
      window.removeEventListener('online',  updateOnlineStatus);
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 right-4 z-[1000] flex items-center gap-2 rounded-lg bg-destructive p-3 text-destructive-foreground shadow-lg"
          role="alert"
        >
          <WifiOff className="h-5 w-5" />
          <span className="text-sm font-medium">You are currently offline.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
