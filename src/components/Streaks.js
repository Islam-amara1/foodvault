'use client';

import { FaFire } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Streaks({ streaks, entries }) {
  // Get last 7 days including today
  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const hasEntry = entries.some(entry => entry.date === dateStr);
      days.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hasEntry,
        isToday: dateStr === today.toISOString().split('T')[0]
      });
    }
    return days;
  };

  const last7Days = getLast7Days();

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaFire className="text-orange-500 mr-2 text-xl" />
          <div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {streaks.current}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">day streak</div>
          </div>
        </div>
        {streaks.current > 0 && (
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-300">Keep it up!</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">🔥 On fire!</div>
          </div>
        )}
      </div>

      {/* Weekly Row */}
      <div className="flex justify-center space-x-1 mb-2">
        {last7Days.map((day, index) => (
          <motion.div
            key={index}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer ${
              day.hasEntry
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            } ${day.isToday ? 'ring-2 ring-orange-300 dark:ring-orange-600' : ''}`}
            initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, type: 'spring', stiffness: 100 }}
            whileHover={{
              scale: 1.1,
              boxShadow: day.hasEntry ? '0 0 20px rgba(249, 115, 22, 0.6)' : '0 0 10px rgba(156, 163, 175, 0.4)',
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            {day.day[0]}
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {last7Days.filter(d => d.hasEntry).length} of 7 days this week
        </div>
      </div>
    </motion.div>
  );
}