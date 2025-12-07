'use client';

import { useState, useEffect } from 'react';
import AddEntryForm from '@/components/AddEntryForm';
import Dashboard from '@/components/Dashboard';
import WeeklyGraph from '@/components/WeeklyGraph';
import EntriesList from '@/components/EntriesList';
import MonthlyCalendar from '@/components/MonthlyCalendar';
import AnalyticsPanel from '@/components/AnalyticsPanel';
import BottomNav from '@/components/BottomNav';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const tabs = ['dashboard', 'diary', 'insights'];

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    const currentIndex = tabs.indexOf(activeTab);

    if (isLeftSwipe && currentIndex < tabs.length - 1) {
      // Swipe left = next tab
      setActiveTab(tabs[currentIndex + 1]);
    }
    if (isRightSwipe && currentIndex > 0) {
      // Swipe right = previous tab
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

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

  const handleDeleteEntry = (id) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
  };

  const handleUpdateEntry = (updatedEntry) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Green Header */}
      <div className="bg-green-600 dark:bg-green-700 text-white py-4 px-4 sticky top-0 z-40">
        <h1 className="text-xl font-semibold text-center">
          {activeTab === 'dashboard' && 'Dashboard'}
          {activeTab === 'diary' && 'Food Diary'}
          {activeTab === 'insights' && 'Insights'}
        </h1>
      </div>

      {/* Main Content - Swipeable */}
      <div
        className="max-w-md mx-auto px-4 py-6"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <Dashboard
            entries={entries}
            dailyGoals={dailyGoals}
            onUpdateDailyGoal={handleUpdateDailyGoal}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        )}

        {/* Tab 2: Diary (Add Entry + Food Entries) */}
        {activeTab === 'diary' && (
          <>
            <AddEntryForm
              onAddEntry={handleAddEntry}
              selectedDate={selectedDate}
            />
            <EntriesList
              entries={entries}
              selectedDate={selectedDate}
              onDeleteEntry={handleDeleteEntry}
              onUpdateEntry={handleUpdateEntry}
            />
          </>
        )}

        {/* Tab 3: Insights (Calendar + Weekly Graph + Analytics) */}
        {activeTab === 'insights' && (
          <>
            <MonthlyCalendar
              entries={entries}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              dailyGoals={dailyGoals}
            />
            <WeeklyGraph entries={entries} dailyGoals={dailyGoals} selectedDate={selectedDate} />
            <AnalyticsPanel entries={entries} dailyGoals={dailyGoals} />
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
