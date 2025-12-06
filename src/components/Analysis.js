'use client';

export default function Analysis({ entries, dailyGoals }) {
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = entries.filter(entry => entry.date === today);
  
  const todayTotals = todayEntries.reduce(
    (acc, entry) => acc + entry.calories,
    0
  );

  const isOnTarget = todayTotals <= dailyGoals.calories && todayTotals >= dailyGoals.calories * 0.8;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
      <div className="flex items-center gap-3">
        <div className="text-2xl">🔬</div>
        <div className="flex-1">
          <span className="text-gray-700">My Analysis: </span>
          <button className={`px-4 py-1 rounded-full text-white text-sm font-medium ${
            isOnTarget ? 'bg-green-600' : 'bg-yellow-500'
          }`}>
            {isOnTarget ? 'On Target' : 'Needs Attention'}
          </button>
        </div>
      </div>
    </div>
  );
}

