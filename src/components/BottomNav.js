"use client";

import { useEffect, useState } from "react";
import { FiHome, FiBookOpen, FiBarChart2 } from "react-icons/fi";
import { motion, LayoutGroup } from "framer-motion";

export default function BottomNav({ activeTab, onTabChange }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Only render motion/swipe on client
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard", Icon: FiHome },
    { id: "diary", label: "Diary", Icon: FiBookOpen },
    { id: "insights", label: "Insights", Icon: FiBarChart2 },
  ];

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  if (!isMounted) {
    // SSR-friendly static nav
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f172a] border-t border-gray-800">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-between items-center bg-[#1e293b] rounded-xl p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex-1 flex flex-col items-center justify-center py-3 mx-1 rounded-lg"
              >
                <tab.Icon className="text-xl text-gray-400" />
                <span className="text-xs mt-1 text-gray-400">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Client-only interactive nav
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f172a] border-t border-gray-800">
      <div className="max-w-md mx-auto px-4 py-3">
        <LayoutGroup>
          <motion.div
            className="flex justify-between items-center bg-[#1e293b] rounded-xl p-2"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(event, info) => {
              if (info.offset.x < -50 && activeIndex < tabs.length - 1) {
                onTabChange(tabs[activeIndex + 1].id);
              } else if (info.offset.x > 50 && activeIndex > 0) {
                onTabChange(tabs[activeIndex - 1].id);
              }
            }}
            style={{ touchAction: "pan-x" }}
          >
            {tabs.map((tab) => {
              const Icon = tab.Icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="flex-1 relative flex flex-col items-center justify-center py-3 mx-1 rounded-lg"
                  style={{ touchAction: "manipulation" }}
                >
                  <motion.div
                    layout
                    animate={{ scale: isActive ? 1.2 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <Icon
                      className={`text-xl transition-colors duration-300 ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-xs mt-1 transition-colors duration-300 ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </motion.div>

                  {isActive && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute -top-1 w-6 h-1 bg-white rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        </LayoutGroup>
      </div>
    </div>
  );
}
