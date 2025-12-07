'use client';

import { useState } from 'react';

export default function Dashboard({ entries, dailyGoals, onUpdateDailyGoal, selectedDate, onDateChange }) {
  const today = new Date().toISOString().split('T')[0];
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(dailyGoals.calories.toString());

  const selectedDateEntries = entries.filter(entry => entry.date === selectedDate);

  const selectedDateTotals = selectedDateEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fats: acc.fats + entry.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  // Calculate weekly totals starting from Sunday
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek); // Go back to Sunday

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const weekEntries = entries.filter(entry => weekDates.includes(entry.date));

  const weeklyTotals = weekEntries.reduce(
    (acc, entry) => acc + entry.calories,
    0
  );

  // Calculate calorie differences from days before selected date and redistribute
  const todayStr = new Date().toISOString().split('T')[0];
  const daysBeforeSelected = weekDates.filter(date => new Date(date) < new Date(selectedDate));
  const daysFromSelected = weekDates.filter(date => new Date(date) >= new Date(selectedDate) && date <= todayStr);

  // Calculate the difference (deficit or surplus) for each day before selected date
  // Positive = deficit (under goal), Negative = surplus (over goal)
  const dayDifferences = daysBeforeSelected.map(date => {
    const dayEntries = entries.filter(entry => entry.date === date);
    const dayTotal = dayEntries.reduce((sum, entry) => sum + entry.calories, 0);
    // Return the difference: positive if under goal, negative if over goal
    return dailyGoals.calories - dayTotal;
  });

  // Sum all differences (deficits and surpluses)
  const totalDifference = dayDifferences.reduce((sum, diff) => sum + diff, 0);

  // Redistribute across days from selected date onwards (including selected date)
  const spreadPerRemainingDay = daysFromSelected.length > 0 ? totalDifference / daysFromSelected.length : 0;

  // Selected date's adjusted target (base goal + redistribution from past days)
  const selectedDateAdjustedTarget = dailyGoals.calories + spreadPerRemainingDay;

  // Use adjusted target if there's a redistribution, otherwise use base goal
  const effectiveDailyGoal = spreadPerRemainingDay !== 0 ? selectedDateAdjustedTarget : dailyGoals.calories;
  const remaining = Math.max(0, effectiveDailyGoal - selectedDateTotals.calories);
  const progress = effectiveDailyGoal > 0
    ? Math.min((selectedDateTotals.calories / effectiveDailyGoal) * 100, 100)
    : 0;

  // Calculate circumference for the apple progress ring
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    const newGoal = parseInt(tempGoal);
    if (newGoal > 0) {
      onUpdateDailyGoal(newGoal);
      setIsEditingGoal(false);
    }
  };

  const handleDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    const newDateStr = newDate.toISOString().split('T')[0];
    const todayStr = new Date().toISOString().split('T')[0];
    const weekStart = weekDates[0];
    // Don't allow future dates or dates before week start
    if (newDateStr <= todayStr && newDateStr >= weekStart) {
      onDateChange(newDateStr);
    }
  };

  const formatDateDisplay = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4">
      {/* Date Selector */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => handleDateChange(-1)}
          disabled={selectedDate <= weekDates[0]}
          className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ←
        </button>
        <div className="flex-1 text-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              const newDate = e.target.value;
              const todayStr = new Date().toISOString().split('T')[0];
              if (newDate <= todayStr) {
                onDateChange(newDate);
              }
            }}
            max={today}
            className="text-center text-sm font-semibold text-black dark:text-white border-none bg-transparent focus:outline-none cursor-pointer"
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDateDisplay(selectedDate)}</div>
        </div>
        <button
          onClick={() => handleDateChange(1)}
          disabled={selectedDate >= today}
          className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-xs text-gray-500 dark:text-gray-400">Daily</div>
        <div className="text-right">
          {isEditingGoal ? (
            <form onSubmit={handleGoalSubmit} className="flex items-center gap-2">
              <input
                type="number"
                value={tempGoal}
                onChange={(e) => setTempGoal(e.target.value)}
                className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-black dark:text-white bg-white dark:bg-gray-700"
                min="1"
                autoFocus
              />
              <button
                type="submit"
                className="text-green-600 dark:text-green-400 text-sm font-medium"
              >
                ✓
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditingGoal(false);
                  setTempGoal(dailyGoals.calories.toString());
                }}
                className="text-gray-500 dark:text-gray-400 text-sm"
              >
                ✕
              </button>
            </form>
          ) : (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Calorie Budget</div>
              <div
                className="text-2xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-700 dark:hover:text-blue-300"
                onClick={() => setIsEditingGoal(true)}
              >
                {Math.round(effectiveDailyGoal).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Daily Progress */}
      <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Daily Progress</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {selectedDateTotals.calories.toLocaleString()} / {Math.round(effectiveDailyGoal).toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
          <div
            className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        {spreadPerRemainingDay !== 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Adjusted target: {Math.round(selectedDateAdjustedTarget)} cal
            {spreadPerRemainingDay > 0 ? (
              <span>(base: {dailyGoals.calories} + spread: +{Math.round(spreadPerRemainingDay)})</span>
            ) : (
              <span>(base: {dailyGoals.calories} - excess: {Math.round(Math.abs(spreadPerRemainingDay))})</span>
            )}
          </div>
        )}
      </div>

      {/* Center - Apple Progress Ring */}
      <div className="flex justify-center items-center">
        <div className="relative w-[180px] h-[180px]">
          <svg className="transform -rotate-90 absolute inset-0" width="180" height="180">
            {/* Background circle */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="14"
            />
            {/* Progress circle */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#22c55e"
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          {/* Apple shape overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {selectedDateTotals.calories.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Left</div>
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">{Math.round(remaining)}</div>
          </div>
          {/* Stem and Leaf */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-1 h-3 bg-red-600 rounded-full mx-auto"></div>
            <div className="w-2 h-2 bg-green-600 rounded-full -ml-0.5 mt-0.5"></div>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">Weekly Goal</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {weekDates[0] && new Date(weekDates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {' '}
              {weekDates[6] && new Date(weekDates[6]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {weeklyTotals.toLocaleString()} / {dailyGoals.weekly.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {Math.round((weeklyTotals / dailyGoals.weekly) * 100)}% complete
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
          <div
            className="bg-green-600 dark:bg-green-500 h-3 rounded-full transition-all"
            style={{ width: `${Math.min((weeklyTotals / dailyGoals.weekly) * 100, 100)}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {weeklyTotals < dailyGoals.weekly ? (
            <span>Remaining: {(dailyGoals.weekly - weeklyTotals).toLocaleString()} calories</span>
          ) : (
            <span className="text-red-600 dark:text-red-400">Over goal by: {(weeklyTotals - dailyGoals.weekly).toLocaleString()} calories</span>
          )}
        </div>
      </div>
    </div>
  );
}
