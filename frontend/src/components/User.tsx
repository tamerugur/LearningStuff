import { useState, useRef, useEffect } from "react";
import { UserRegister } from "./UserRegister";
import { UserLogin } from "./UserLogin";

export function User() {
  const [activeTab, setActiveTab] = useState<"register" | "login">("login");
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [contentHeight, setContentHeight] = useState<number>(0);
  const loginRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeRef = activeTab === "login" ? loginRef : registerRef;
    if (activeRef.current) {
      setContentHeight(activeRef.current.scrollHeight);
    }
  }, [activeTab]);

  const handleTabChange = (tab: "register" | "login") => {
    if (tab !== activeTab) {
      setDirection(tab === "register" ? "right" : "left");
      setActiveTab(tab);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex mb-6 relative">
        <button
          className={`flex-1 py-2 text-sm font-medium transition-colors relative ${
            activeTab === "login"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
          onClick={() => handleTabChange("login")}
        >
          Login
          <div
            className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transition-transform duration-1100 ease-in-out ${
              activeTab === "login" ? "scale-x-100" : "scale-x-0"
            }`}
            style={{
              transformOrigin:
                activeTab === "login"
                  ? direction === "left"
                    ? "right"
                    : "left"
                  : direction === "left"
                  ? "left"
                  : "right",
            }}
          />
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium transition-colors relative ${
            activeTab === "register"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
          onClick={() => handleTabChange("register")}
        >
          Register
          <div
            className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transition-transform duration-1100 ease-in-out ${
              activeTab === "register" ? "scale-x-100" : "scale-x-0"
            }`}
            style={{
              transformOrigin:
                activeTab === "register"
                  ? direction === "left"
                    ? "right"
                    : "left"
                  : direction === "left"
                  ? "left"
                  : "right",
            }}
          />
        </button>
      </div>

      <div
        className="transition-all duration-1100 ease-in-out overflow-hidden relative"
        style={{ height: contentHeight }}
      >
        <div
          ref={loginRef}
          className={`absolute w-full transition-all duration-1100 ease-in-out ${
            activeTab === "login"
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          }`}
        >
          <UserLogin />
        </div>
        <div
          ref={registerRef}
          className={`absolute w-full transition-all duration-1100 ease-in-out ${
            activeTab === "register"
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
        >
          <UserRegister />
        </div>
      </div>
    </div>
  );
}
