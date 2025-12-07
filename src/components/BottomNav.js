'use client';

import { useState } from 'react';

export default function BottomNav({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
        { id: 'diary', label: 'Diary', icon: '📝' },
        { id: 'insights', label: 'Insights', icon: '📊' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
            <div className="max-w-md mx-auto flex justify-around">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex-1 py-3 px-4 flex flex-col items-center justify-center transition-colors ${activeTab === tab.id
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <span className="text-2xl mb-1">{tab.icon}</span>
                        <span className="text-xs font-medium">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
