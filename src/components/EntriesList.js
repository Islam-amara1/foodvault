'use client';

import { useState } from 'react';
import EditEntryForm from './EditEntryForm';

export default function EntriesList({ entries, selectedDate, onDeleteEntry, onUpdateEntry }) {
  const [editingEntry, setEditingEntry] = useState(null);
  const selectedDateEntries = entries
    .filter(entry => entry.date === selectedDate)
    .sort((a, b) => {
      // Sort by timestamp if available, otherwise by id (newest first)
      if (a.timestamp && b.timestamp) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      return b.id - a.id;
    });
  
  if (selectedDateEntries.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Food Entries</h3>
        <p className="text-sm text-gray-500">No entries for this date</p>
      </div>
    );
  }

  const formatMealType = (mealType) => {
    return mealType.charAt(0).toUpperCase() + mealType.slice(1);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSave = (updatedEntry) => {
    onUpdateEntry(updatedEntry);
    setEditingEntry(null);
  };

  return (
    <>
      {editingEntry && (
        <EditEntryForm
          entry={editingEntry}
          onSave={handleSave}
          onCancel={() => setEditingEntry(null)}
        />
      )}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Food Entries</h3>
        <div className="space-y-3">
          {selectedDateEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {formatMealType(entry.mealType)}
                  </span>
                  {entry.timestamp && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(entry.timestamp)}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{entry.calories}</span> cal
                  {' • '}
                  P: {entry.protein}g • C: {entry.carbs}g • F: {entry.fats}g
                </div>
              </div>
              <div className="flex gap-2 ml-3">
                <button
                  onClick={() => setEditingEntry(entry)}
                  className="px-3 py-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors text-sm font-medium"
                  title="Edit entry"
                >
                  ✏️
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete this entry (${entry.calories} calories)?`)) {
                      onDeleteEntry(entry.id);
                    }
                  }}
                  className="px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors text-sm font-medium"
                  title="Delete entry"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

