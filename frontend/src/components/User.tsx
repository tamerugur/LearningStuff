import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserRegister } from "./UserRegister";
import { UserLogin } from "./UserLogin";

type TabType = "register" | "login";
type Direction = "left" | "right";

export function User() {
  const [activeTab, setActiveTab] = useState<TabType>("login");
  const [direction, setDirection] = useState<Direction>("left");
  const [contentHeight, setContentHeight] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTabChange = useCallback(
    (tab: TabType) => {
      if (tab !== activeTab) {
        // Register is to the right of login
        setDirection(tab === "register" ? "right" : "left");
        setActiveTab(tab);
      }
    },
    [activeTab]
  );

  useEffect(() => {
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (contentRef.current) {
          setContentHeight(contentRef.current.scrollHeight);
        }
      });
      resizeObserver.observe(contentRef.current);
      setContentHeight(contentRef.current.scrollHeight);
      return () => resizeObserver.disconnect();
    }
  }, [activeTab]);

  const variants = {
    enter: (dir: Direction) => ({
      x: dir === "right" ? 500 : -500,
      opacity: 1,
      position: "absolute" as const,
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "absolute" as const,
    },
    exit: (dir: Direction) => ({
      x: dir === "right" ? -500 : 500,
      opacity: 1,
      position: "absolute" as const,
    }),
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="p-8 shadow-lg rounded-xl border border-border bg-card w-full max-w-xl">
        {/* Tabs */}
        <div className="flex mb-6 relative border-b border-border">
          {(["login", "register"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-2 text-sm font-medium transition-colors relative select-none ${
                activeTab === tab
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "login" ? "Login" : "Register"}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Animated Content */}
        <div
          className="relative transition-[height] duration-300 ease-in-out overflow-hidden"
          style={{ height: contentHeight }}
        >
          <AnimatePresence custom={direction}>
            {activeTab === "login" && (
              <motion.div
                key="login"
                ref={contentRef}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={direction}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full"
              >
                <UserLogin />
              </motion.div>
            )}

            {activeTab === "register" && (
              <motion.div
                key="register"
                ref={contentRef}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={direction}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full"
              >
                <UserRegister />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
