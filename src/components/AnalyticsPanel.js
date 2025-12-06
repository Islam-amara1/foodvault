'use client';

import { useMemo } from 'react';

export default function AnalyticsPanel({ entries, dailyGoals }) {
  const analytics = useMemo(() => {
    if (entries.length === 0) {
      return null;
    }

    // Get last 30 days of entries
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= thirtyDaysAgo;
    });

    // Group by date
    const entriesByDate = {};
    recentEntries.forEach(entry => {
      if (!entriesByDate[entry.date]) {
        entriesByDate[entry.date] = [];
      }
      entriesByDate[entry.date].push(entry);
    });

    // Calculate daily totals
    const dailyTotals = Object.keys(entriesByDate).map(date => {
      const dayEntries = entriesByDate[date];
      return {
        date,
        calories: dayEntries.reduce((sum, e) => sum + e.calories, 0),
        protein: dayEntries.reduce((sum, e) => sum + e.protein, 0),
        carbs: dayEntries.reduce((sum, e) => sum + e.carbs, 0),
        fats: dayEntries.reduce((sum, e) => sum + e.fats, 0),
      };
    });

    // Calculate averages
    const avgCalories = dailyTotals.length > 0
      ? Math.round(dailyTotals.reduce((sum, d) => sum + d.calories, 0) / dailyTotals.length)
      : 0;
    const avgProtein = dailyTotals.length > 0
      ? Math.round(dailyTotals.reduce((sum, d) => sum + d.protein, 0) / dailyTotals.length)
      : 0;
    const avgCarbs = dailyTotals.length > 0
      ? Math.round(dailyTotals.reduce((sum, d) => sum + d.carbs, 0) / dailyTotals.length)
      : 0;
    const avgFats = dailyTotals.length > 0
      ? Math.round(dailyTotals.reduce((sum, d) => sum + d.fats, 0) / dailyTotals.length)
      : 0;

    // Trend analysis - compare last 7 days vs previous 7 days
    const sortedDates = dailyTotals.map(d => d.date).sort();
    if (sortedDates.length < 14) {
      return {
        averages: { calories: avgCalories, protein: avgProtein, carbs: avgCarbs, fats: avgFats },
        trend: null,
        daysTracked: dailyTotals.length,
      };
    }

    const last7Days = sortedDates.slice(-7);
    const previous7Days = sortedDates.slice(-14, -7);

    const last7Avg = last7Days.reduce((sum, date) => {
      const day = dailyTotals.find(d => d.date === date);
      return sum + (day ? day.calories : 0);
    }, 0) / 7;

    const previous7Avg = previous7Days.reduce((sum, date) => {
      const day = dailyTotals.find(d => d.date === date);
      return sum + (day ? day.calories : 0);
    }, 0) / 7;

    const trend = last7Avg - previous7Avg;
    const trendPercent = previous7Avg > 0 ? Math.round((trend / previous7Avg) * 100) : 0;

    return {
      averages: { calories: avgCalories, protein: avgProtein, carbs: avgCarbs, fats: avgFats },
      trend: { value: Math.round(trend), percent: trendPercent },
      daysTracked: dailyTotals.length,
    };
  }, [entries]);

  if (!analytics || analytics.daysTracked === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Analytics</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Not enough data to show analytics</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Analytics (Last 30 Days)</h3>
      
      {/* Daily Averages */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Daily Averages</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400">Calories</div>
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {analytics.averages.calories}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Goal: {dailyGoals.calories}
            </div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400">Protein</div>
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {analytics.averages.protein}g
            </div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400">Carbs</div>
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {analytics.averages.carbs}g
            </div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400">Fats</div>
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {analytics.averages.fats}g
            </div>
          </div>
        </div>
      </div>

      {/* Trend Analysis */}
      {analytics.trend && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Trend Analysis</h4>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Last 7 days vs Previous 7 days:
              </span>
              <span className={`text-sm font-semibold ${
                analytics.trend.value > 0 
                  ? 'text-red-600 dark:text-red-400' 
                  : analytics.trend.value < 0 
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {analytics.trend.value > 0 ? '+' : ''}{analytics.trend.value} cal/day
                {analytics.trend.percent !== 0 && ` (${analytics.trend.percent > 0 ? '+' : ''}${analytics.trend.percent}%)`}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {analytics.trend.value > 0 
                ? '📈 Increasing trend' 
                : analytics.trend.value < 0 
                ? '📉 Decreasing trend'
                : '➡️ Stable'}
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        {analytics.daysTracked} days tracked
      </div>
    </div>
  );
}

