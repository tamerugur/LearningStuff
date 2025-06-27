import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { UserRegister } from "./UserRegister";
import { UserLogin } from "./UserLogin";

type TabType = "register" | "login";
type DirectionType = "left" | "right";

export function User() {
  const [activeTab, setActiveTab] = useState<TabType>("login");
  const [direction, setDirection] = useState<DirectionType>("left");
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const activeRef = activeTab === "login" ? loginRef : registerRef;
    if (activeRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (activeRef.current) {
          setContentHeight(activeRef.current.scrollHeight);
        }
      });
      resizeObserver.observe(activeRef.current);
      setContentHeight(activeRef.current.scrollHeight);
      return () => resizeObserver.disconnect();
    }
  }, [activeTab]);

  const handleTabChange = useCallback(
    (tab: TabType) => {
      if (tab !== activeTab) {
        setDirection(tab === "register" ? "right" : "left");
        setActiveTab(tab);
      }
    },
    [activeTab]
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="p-8 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-card w-full max-w-xl">
        <div className="flex mb-6 relative">
          {(["login", "register"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-2 text-sm font-medium transition-colors relative select-none ${
                activeTab === tab
                  ? "text-primary dark:text-primary"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab === "login" ? "Login" : "Register"}

              {activeTab === tab && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                  transition={{
                    type: "spring",
                    stiffness: 170,
                    damping: 15,
                  }}
                />
              )}
            </button>
          ))}
        </div>

        <div
          className={`relative overflow-hidden ${
            isMounted ? "transition-height duration-300 ease-out" : ""
          }`}
          style={{ height: contentHeight }}
        >
          <div
            ref={loginRef}
            className={`absolute w-full transform transition-transform duration-600 ease-in-out
              ${
                activeTab === "login"
                  ? "z-10 translate-x-0"
                  : direction === "left"
                  ? "-translate-x-full z-0"
                  : "translate-x-full z-0"
              }`}
          >
            <UserLogin />
          </div>

          <div
            ref={registerRef}
            className={`absolute w-full transform transition-transform duration-600 ease-in-out
              ${
                activeTab === "register"
                  ? "z-10 translate-x-0"
                  : direction === "left"
                  ? "-translate-x-full z-0"
                  : "translate-x-full z-0"
              }`}
          >
            <UserRegister />
          </div>
        </div>
      </div>
    </div>
  );
}
