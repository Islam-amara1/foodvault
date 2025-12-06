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

export default function WeeklyGraph({ entries, dailyGoals }) {
  const chartData = useMemo(() => {
    // Get last 7 days
    const dates = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    // Calculate calories for each day
    const caloriesData = dates.map(date => {
      const dayEntries = entries.filter(entry => entry.date === date);
      return dayEntries.reduce((sum, entry) => sum + entry.calories, 0);
    });

    // Format dates for display (We 17, Th 18, etc.)
    const labels = dates.map(date => {
      const d = new Date(date);
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const day = d.getDate();
      return `${weekday} ${day}`;
    });

    // Determine bar colors (green if under goal, red if over)
    const backgroundColor = caloriesData.map(cal => 
      cal > dailyGoals.calories ? 'rgb(239, 68, 68)' : 'rgb(34, 197, 94)'
    );

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
  }, [entries, dailyGoals]);

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

