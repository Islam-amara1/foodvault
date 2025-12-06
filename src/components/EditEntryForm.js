'use client';

import { useState, useEffect } from 'react';

export default function EditEntryForm({ entry, onSave, onCancel }) {
  const [calories, setCalories] = useState(entry.calories.toString());
  const [protein, setProtein] = useState(entry.protein.toString());
  const [carbs, setCarbs] = useState(entry.carbs.toString());
  const [fats, setFats] = useState(entry.fats.toString());
  const [mealType, setMealType] = useState(entry.mealType);

  const calculateCaloriesFromMacros = (p, c, f) => {
    return (p * 4) + (c * 4) + (f * 9);
  };

  const handleMacroChange = (type, value) => {
    const numValue = value === '' ? 0 : parseInt(value) || 0;
    
    if (type === 'protein') {
      setProtein(value);
    } else if (type === 'carbs') {
      setCarbs(value);
    } else if (type === 'fats') {
      setFats(value);
    }

    const p = type === 'protein' ? numValue : parseInt(protein) || 0;
    const c = type === 'carbs' ? numValue : parseInt(carbs) || 0;
    const f = type === 'fats' ? numValue : parseInt(fats) || 0;
    
    const calculatedCalories = calculateCaloriesFromMacros(p, c, f);
    if (calculatedCalories > 0) {
      setCalories(calculatedCalories.toString());
    }
  };

  const handleCaloriesChange = (value) => {
    setCalories(value);
    if (value) {
      const cal = parseInt(value);
      const proteinGrams = Math.round((cal * 0.3) / 4);
      const carbsGrams = Math.round((cal * 0.4) / 4);
      const fatsGrams = Math.round((cal * 0.3) / 9);
      setProtein(proteinGrams.toString());
      setCarbs(carbsGrams.toString());
      setFats(fatsGrams.toString());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cal = parseInt(calories);
    const p = parseInt(protein);
    const c = parseInt(carbs);
    const f = parseInt(fats);

    if (isNaN(cal) || isNaN(p) || isNaN(c) || isNaN(f) || cal < 0 || p < 0 || c < 0 || f < 0) {
      alert('Please enter valid positive numbers for all fields');
      return;
    }

    const calculatedCal = calculateCaloriesFromMacros(p, c, f);
    if (Math.abs(calculatedCal - cal) > 1) {
      alert(`Macros don't match calories! Expected ${calculatedCal} calories from these macros.`);
      return;
    }

    const updatedEntry = {
      ...entry,
      calories: cal,
      protein: p,
      carbs: c,
      fats: f,
      mealType: mealType,
    };

    onSave(updatedEntry);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Edit Entry</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="editMealType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Meal Type
            </label>
            <select
              id="editMealType"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
          <div>
            <label htmlFor="editCalories" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Calories
            </label>
            <input
              type="number"
              id="editCalories"
              value={calories}
              onChange={(e) => handleCaloriesChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black dark:text-white bg-white dark:bg-gray-700"
              placeholder="0"
              min="0"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="editProtein" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                id="editProtein"
                value={protein}
                onChange={(e) => handleMacroChange('protein', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black dark:text-white bg-white dark:bg-gray-700"
                placeholder="0"
                min="0"
                required
              />
            </div>
            <div>
              <label htmlFor="editCarbs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                id="editCarbs"
                value={carbs}
                onChange={(e) => handleMacroChange('carbs', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black dark:text-white bg-white dark:bg-gray-700"
                placeholder="0"
                min="0"
                required
              />
            </div>
            <div>
              <label htmlFor="editFats" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fats (g)
              </label>
              <input
                type="number"
                id="editFats"
                value={fats}
                onChange={(e) => handleMacroChange('fats', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black dark:text-white bg-white dark:bg-gray-700"
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

