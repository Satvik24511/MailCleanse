import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Zap, Inbox, Filter, Info } from 'lucide-react'; 

interface ScanLoadingOverlayProps {
  isFirstScan: boolean;
}

const tips = [
  "Did you know? Unsubscribing can significantly reduce your daily email clutter.",
  "We're diligently categorizing your senders to help you take control.",
  "Soon, you'll be able to see all your subscriptions in one organized place!",
  "A cleaner inbox means less distraction and more focus.",
  "We're identifying those pesky newsletters so you don't have to.",
  "Think of this as your digital decluttering assistant at work!",
  "We're scanning deep to find all hidden subscriptions.",
  "This may take 5-10 minutes, feel free to check back later!.",
  "Great things take time!",
];

const ScanLoadingOverlay: React.FC<ScanLoadingOverlayProps> = ({ isFirstScan }) => {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prevTip) => (prevTip + 1) % tips.length);
    }, 8000); 

    return () => clearInterval(tipInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-gray-900 bg-opacity-85 z-50 flex flex-col items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.1 }}
        className="bg-white rounded-2xl p-10 shadow-3xl flex flex-col items-center justify-center max-w-lg w-full text-center border-2 border-orange-300 relative overflow-hidden" // Added relative and overflow-hidden for the bar
      >
        <div className="relative mb-6">
          <Loader2 className="animate-spin h-20 w-20 text-orange-500" />
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-orange-400 animate-pulse" />
        </div>

        {isFirstScan ? (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              First-Time Scan in Progress!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              This initial scan can take a little longer as we&apos;re delving deep into your inbox to discover all your subscriptions.
              Hang tight, the magic is happening!
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Scanning Your Services...
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              We&apos;re quickly updating your subscription list. Thanks for your patience!
            </p>
          </>
        )}

        <motion.div
          key={currentTip}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="bg-orange-50 border border-orange-200 text-orange-700 p-4 rounded-lg flex items-start text-sm italic w-full"
        >
          <Info className="h-5 w-5 mr-3 flex-shrink-0 text-orange-600" />
          <p>{tips[currentTip]}</p>
        </motion.div>

        <div className="mt-8 grid grid-cols-2 gap-4 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            className="flex flex-col items-center p-3 bg-blue-50 rounded-lg text-blue-700"
          >
            <Inbox className="h-8 w-8 mb-2" />
            <span className="text-sm font-semibold">Organizing Inbox</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            className="flex flex-col items-center p-3 bg-green-50 rounded-lg text-green-700"
          >
            <Filter className="h-8 w-8 mb-2" />
            <span className="text-sm font-semibold">Identifying Senders</span>
          </motion.div>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full mt-8 overflow-hidden">
          <motion.div
            className="h-full bg-orange-500 rounded-full"
            animate={{ x: ["-100%", "100%"] }} 
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 1.5,
                ease: "linear",
              },
            }}
            style={{ width: "50%" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ScanLoadingOverlay;
