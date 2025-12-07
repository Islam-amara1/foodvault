'use client';

import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function WeeklyGraph({ entries, dailyGoals, selectedDate }) {
  const chartData = useMemo(() => {
    // Get the week of the selected date, starting from Sunday
    const dates = [];
    const selected = new Date(selectedDate + 'T00:00:00');
    const dayOfWeek = selected.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(selected);
    startOfWeek.setDate(selected.getDate() - dayOfWeek); // Go back to Sunday

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }

    // Calculate calories for each day
    const caloriesData = dates.map(date => {
      const dayEntries = entries.filter(entry => entry.date === date);
      return dayEntries.reduce((sum, entry) => sum + entry.calories, 0);
    });

    // Format dates for display (Sun 1, Mon 2, etc.)
    const labels = dates.map(dateStr => {
      const d = new Date(dateStr + 'T00:00:00');
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const day = d.getDate();
      return `${weekday} ${day}`;
    });

    // Determine bar colors to match calendar logic
    const backgroundColor = caloriesData.map(cal => {
      const percentage = dailyGoals.calories > 0 ? (cal / dailyGoals.calories) * 100 : 0;
      if (percentage > 100) {
        return 'rgb(239, 68, 68)'; // Red (>100%)
      } else if (percentage >= 75) {
        return 'rgb(34, 197, 94)'; // Green (75-100%)
      } else if (percentage >= 50) {
        return 'rgb(134, 239, 172)'; // Light Green (50-75%)
      } else if (cal > 0) {
        return 'rgb(250, 204, 21)'; // Yellow (<50%)
      } else {
        return 'rgb(156, 163, 175)'; // Gray (no data)
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Calories',
          data: caloriesData,
          backgroundColor: backgroundColor,
          borderRadius: 8,
        },
      ],
    };
  }, [entries, dailyGoals, selectedDate]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4">
      <div style={{ height: '200px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

