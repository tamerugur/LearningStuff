import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserRegister } from "./UserRegister";
import { UserLogin } from "./UserLogin";

type TabType = "register" | "login";
type DirectionType = "left" | "right";

export function User() {
  const [activeTab, setActiveTab] = useState<TabType>("login");
  const [direction, setDirection] = useState<DirectionType>("left");
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTabChange = useCallback(
    (tab: TabType) => {
      if (tab !== activeTab) {
        setDirection(tab === "register" ? "right" : "left");
        setActiveTab(tab);
      }
    },
    [activeTab]
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;

    const node = contentRef.current;
    const observer = new ResizeObserver(() => {
      setContentHeight(node.scrollHeight);
    });

    observer.observe(node);
    setContentHeight(node.scrollHeight);

    return () => observer.disconnect();
  }, [activeTab]);

  const variants = {
    enter: (dir: DirectionType) => ({
      x: dir === "right" ? 500 : -500,
      opacity: 1,
      position: "absolute" as const,
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "absolute" as const,
    },
    exit: (dir: DirectionType) => ({
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
              {activeTab === tab && isMounted && (
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
            isMounted ? "transition-[height] duration-300 ease-in-out" : ""
          }`}
          style={{ height: contentHeight }}
        >
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={activeTab}
              ref={contentRef}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              custom={direction}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full"
            >
              {activeTab === "login" ? <UserLogin /> : <UserRegister />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
