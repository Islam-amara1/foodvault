'use client';

export default function Recipes() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden relative">
      <div className="mb-4">
        <div className="text-2xl font-bold text-gray-800 mb-1">FAST & EASY</div>
        <div className="text-xl font-bold text-orange-500">RECIPES</div>
      </div>
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-2">🍽️</div>
          <div className="text-sm text-gray-600">Recipe suggestions coming soon</div>
        </div>
      </div>
    </div>
  );
}

