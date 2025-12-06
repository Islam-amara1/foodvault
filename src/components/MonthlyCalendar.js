'use client';

import { useState, useMemo } from 'react';

export default function MonthlyCalendar({ entries, selectedDate, onDateChange, dailyGoals }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = new Date(selectedDate);
    return { year: date.getFullYear(), month: date.getMonth() };
  });

  const calendarData = useMemo(() => {
    const year = currentMonth.year;
    const month = currentMonth.month;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Get entries for this month
    const monthEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === year && entryDate.getMonth() === month;
    });

    // Group entries by date
    const entriesByDate = {};
    monthEntries.forEach(entry => {
      if (!entriesByDate[entry.date]) {
        entriesByDate[entry.date] = [];
      }
      entriesByDate[entry.date].push(entry);
    });

    // Calculate daily totals
    const dailyTotals = {};
    Object.keys(entriesByDate).forEach(date => {
      const dayEntries = entriesByDate[date];
      dailyTotals[date] = dayEntries.reduce((sum, e) => sum + e.calories, 0);
    });

    // Create calendar grid
    const days = [];
    const today = new Date().toISOString().split('T')[0];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const total = dailyTotals[dateStr] || 0;
      const isSelected = dateStr === selectedDate;
      const isToday = dateStr === today;
      const isPast = dateStr < today;

      // Determine color based on calories vs goal
      let colorClass = 'bg-gray-100 dark:bg-gray-700';
      if (total > 0) {
        const percentage = (total / dailyGoals.calories) * 100;
        if (percentage >= 100) {
          colorClass = 'bg-red-500 dark:bg-red-600';
        } else if (percentage >= 75) {
          colorClass = 'bg-yellow-500 dark:bg-yellow-600';
        } else if (percentage >= 50) {
          colorClass = 'bg-green-400 dark:bg-green-500';
        } else {
          colorClass = 'bg-green-300 dark:bg-green-400';
        }
      }

      days.push({
        day,
        date: dateStr,
        total,
        isSelected,
        isToday,
        isPast,
        colorClass,
      });
    }

    return days;
  }, [currentMonth, entries, selectedDate, dailyGoals]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      let newMonth = prev.month + direction;
      let newYear = prev.year;
      
      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }
      
      return { year: newYear, month: newMonth };
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth({ year: today.getFullYear(), month: today.getMonth() });
    onDateChange(today.toISOString().split('T')[0]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          ←
        </button>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {monthNames[currentMonth.month]} {currentMonth.year}
          </h3>
          <button
            onClick={goToToday}
            className="text-xs text-green-600 dark:text-green-400 hover:underline mt-1"
          >
            Go to Today
          </button>
        </div>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          →
        </button>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-600 dark:text-gray-400 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarData.map((dayData, index) => {
          if (!dayData) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          return (
            <button
              key={dayData.date}
              onClick={() => {
                if (dayData.isPast || dayData.isToday) {
                  onDateChange(dayData.date);
                }
              }}
              disabled={!dayData.isPast && !dayData.isToday}
              className={`
                aspect-square p-1 rounded-lg text-xs transition-all
                ${dayData.colorClass}
                ${dayData.isSelected 
                  ? 'ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-2 dark:ring-offset-gray-800' 
                  : ''}
                ${dayData.isToday 
                  ? 'font-bold border-2 border-gray-800 dark:border-gray-200' 
                  : ''}
                ${!dayData.isPast && !dayData.isToday 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer hover:opacity-80'}
              `}
              title={`${dayData.date}: ${dayData.total} calories`}
            >
              <div className="text-center">
                <div className={`${dayData.isToday ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                  {dayData.day}
                </div>
                {dayData.total > 0 && (
                  <div className="text-[10px] font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                    {dayData.total}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-100 dark:bg-gray-700 rounded"></div>
          <span>No data</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-300 dark:bg-green-400 rounded"></div>
          <span>&lt;50%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-400 dark:bg-green-500 rounded"></div>
          <span>50-75%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500 dark:bg-yellow-600 rounded"></div>
          <span>75-100%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 dark:bg-red-600 rounded"></div>
          <span>&gt;100%</span>
        </div>
      </div>
    </div>
  );
}

