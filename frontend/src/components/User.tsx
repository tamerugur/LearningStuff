import { useState } from "react";
import { UserRegister } from "./UserRegister";
import { UserLogin } from "./UserLogin";

export function User() {
  const [activeTab, setActiveTab] = useState<"register" | "login">("login");
  const [direction, setDirection] = useState<"left" | "right">("left");

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

      <div>
        {activeTab === "register" && <UserRegister />}
        {activeTab === "login" && <UserLogin />}
      </div>
    </div>
  );
}
