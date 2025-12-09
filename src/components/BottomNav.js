import { FiHome, FiBookOpen, FiBarChart2 } from "react-icons/fi";
import { motion } from "framer-motion";

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", Icon: FiHome },
    { id: "diary", label: "Diary", Icon: FiBookOpen },   // Change label HERE
    { id: "insights", label: "Insights", Icon: FiBarChart2 },
  ];

return (
  <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f172a] border-t border-gray-800">
    <div className="max-w-md mx-auto px-4 py-3">
      <div className="flex justify-between items-center bg-[#1e293b] rounded-xl p-2">
        
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-2 mx-1 rounded-lg transition-all
            ${
              activeTab === tab.id
                ? "bg-green-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs mt-1">{tab.label}</span>
            
            {/* Small indicator line ONLY for active */}
            {activeTab === tab.id && (
              <span className="block w-6 h-1 bg-white rounded-full mt-1"></span>
            )}
          </button>
        ))}

      </div>
    </div>
  </div>
)
}
