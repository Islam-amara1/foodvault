'use client';

import { useState } from 'react'; 
import { motion } from 'framer-motion';

export default function AddEntryForm({ onAddEntry, selectedDate }) {
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [mealType, setMealType] = useState('breakfast');

  // Default macro split: 30% protein, 40% carbs, 30% fats
  const calculateMacrosFromCalories = (cal) => {
    if (!cal || cal <= 0) return { protein: 0, carbs: 0, fats: 0 };

    // Protein: 30% of calories = 0.3 * cal / 4 = cal * 0.075
    // Carbs: 40% of calories = 0.4 * cal / 4 = cal * 0.1
    // Fats: 30% of calories = 0.3 * cal / 9 = cal * 0.0333...
    const proteinGrams = Math.round((cal * 0.3) / 4);
    const carbsGrams = Math.round((cal * 0.4) / 4);
    const fatsGrams = Math.round((cal * 0.3) / 9);

    return { protein: proteinGrams, carbs: carbsGrams, fats: fatsGrams };
  }; 

  // Calculate calories from macros: protein*4 + carbs*4 + fats*9
  const calculateCaloriesFromMacros = (p, c, f) => {
    return (p * 4) + (c * 4) + (f * 9);
  };

  // When macros change, update calories
  const handleMacroChange = (type, value) => {
    const numValue = value === '' ? 0 : parseInt(value) || 0;

    if (type === 'protein') {
      setProtein(value);
    } else if (type === 'carbs') {
      setCarbs(value);
    } else if (type === 'fats') {
      setFats(value);
    }

    // Recalculate calories from all macros
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
      const macros = calculateMacrosFromCalories(parseInt(value));
      setProtein(macros.protein.toString());
      setCarbs(macros.carbs.toString());
      setFats(macros.fats.toString());
    } else {
      setProtein('');
      setCarbs('');
      setFats('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!calories || !protein || !carbs || !fats) {
      alert('Please fill in all fields');
      return;
    }

    const cal = parseInt(calories);
    const p = parseInt(protein);
    const c = parseInt(carbs);
    const f = parseInt(fats);

    // Validate all values are valid numbers
    if (isNaN(cal) || isNaN(p) || isNaN(c) || isNaN(f) || cal < 0 || p < 0 || c < 0 || f < 0) {
      alert('Please enter valid positive numbers for all fields');
      return;
    }

    const entry = {
      id: Date.now(),
      date: selectedDate,
      timestamp: new Date().toISOString(),
      calories: cal,
      protein: p,
      carbs: c,
      fats: f,
      mealType: mealType,
    };

    onAddEntry(entry);

    // Reset form
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Add Food Entry</h2>
      <div className="mb-4 p-2 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">Adding to:</span>{' '}
          <span className="text-green-700 dark:text-green-400 font-semibold">
            {selectedDate === new Date().toISOString().split('T')[0]
              ? 'Today'
              : new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Meal Type
          </label>
          <select
            id="mealType"
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
          <label htmlFor="calories" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Calories
          </label>
          <input
            type="number"
            id="calories"
            value={calories}
            onChange={(e) => handleCaloriesChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black dark:text-white bg-white dark:bg-gray-700"
            placeholder="0"
            min="0"
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter calories to auto-calculate macros</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="protein" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Protein (g)
            </label>
            <input
              type="number"
              id="protein"
              value={protein}
              onChange={(e) => handleMacroChange('protein', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black dark:text-white bg-white dark:bg-gray-700"
              placeholder="0"
              min="0"
              required
            />
          </div>
          <div>
            <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Carbs (g)
            </label>
            <input
              type="number"
              id="carbs"
              value={carbs}
              onChange={(e) => handleMacroChange('carbs', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black dark:text-white bg-white dark:bg-gray-700"
              placeholder="0"
              min="0"
              required
            />
          </div>
          <div>
            <label htmlFor="fats" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fats (g)
            </label>
            <input
              type="number"
              id="fats"
              value={fats}
              onChange={(e) => handleMacroChange('fats', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black dark:text-white bg-white dark:bg-gray-700"
              placeholder="0"
              min="0"
              required
            />
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">
          <strong>Formula:</strong> Calories = (Protein × 4) + (Carbs × 4) + (Fats × 9)
        </div>
        <div className="flex justify-center pt-4">
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="
          px-6 py-3
          bg-green-600 
          text-white
          font-semibold
          rounded-xl 
          shadow-md
          "
        >
          Add Entry
        </motion.button>
        </div>
      </form>
    </div>
  );
}
