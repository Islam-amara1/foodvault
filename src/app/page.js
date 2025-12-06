'use client';

import { useState, useEffect } from 'react';
import AddEntryForm from '@/components/AddEntryForm';
import Dashboard from '@/components/Dashboard';
import WeeklyGraph from '@/components/WeeklyGraph';
import EntriesList from '@/components/EntriesList';
import DarkModeToggle from '@/components/DarkModeToggle';
import MonthlyCalendar from '@/components/MonthlyCalendar';
import AnalyticsPanel from '@/components/AnalyticsPanel';

export default function Home() {
  const [entries, setEntries] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('calorieEntries');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    if (typeof window !== 'undefined') {
      return new Date().toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  });
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dailyCalorieGoal');
      return saved ? parseInt(saved) : 1900;
    }
    return 1900;
  });
  const [weeklyCalorieGoal, setWeeklyCalorieGoal] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('weeklyCalorieGoal');
      return saved ? parseInt(saved) : 13300; // 1900 * 7
    }
    return 13300;
  });

  // Save goals to localStorage
  useEffect(() => {
    localStorage.setItem('dailyCalorieGoal', dailyCalorieGoal.toString());
    localStorage.setItem('weeklyCalorieGoal', weeklyCalorieGoal.toString());
  }, [dailyCalorieGoal, weeklyCalorieGoal]);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('calorieEntries', JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = (newEntry) => {
    setEntries((prevEntries) => [...prevEntries, newEntry]);
  };

  const handleDeleteEntry = (entryId) => {
    setEntries((prevEntries) => prevEntries.filter(entry => entry.id !== entryId));
  };

  const handleUpdateEntry = (updatedEntry) => {
    setEntries((prevEntries) =>
      prevEntries.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry)
    );
  };

  const handleUpdateDailyGoal = (newGoal) => {
    setDailyCalorieGoal(newGoal);
    setWeeklyCalorieGoal(newGoal * 7);
  };

  const dailyGoals = {
    calories: dailyCalorieGoal,
    weekly: weeklyCalorieGoal,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DarkModeToggle />
      {/* Green Header */}
      <div className="bg-green-600 dark:bg-green-700 text-white py-4 px-4">
        <h1 className="text-xl font-semibold text-center">Dashboard</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 pb-20">
        <AddEntryForm onAddEntry={handleAddEntry} selectedDate={selectedDate} />
        <Dashboard 
          entries={entries} 
          dailyGoals={dailyGoals}
          onUpdateDailyGoal={handleUpdateDailyGoal}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <AnalyticsPanel entries={entries} dailyGoals={dailyGoals} />
        <EntriesList 
          entries={entries}
          selectedDate={selectedDate}
          onDeleteEntry={handleDeleteEntry}
          onUpdateEntry={handleUpdateEntry}
        />
        <MonthlyCalendar 
          entries={entries}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          dailyGoals={dailyGoals}
        />
        <WeeklyGraph entries={entries} dailyGoals={dailyGoals} />
      </div>
    </div>
  );
}
