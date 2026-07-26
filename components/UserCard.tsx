"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillsBadge } from "./SkillsBadge";

interface User {
  _id: string;
  firstName: string;
  lastName?: string;
  photoUrl?: string;
  age?: number;
  gender?: "male" | "female" | "others";
  about?: string;
  skills?: string[];
}

interface UserCardProps {
  user: User;
  showActions?: boolean;
  isSwipeable?: boolean;
  onInterested?: (userId: string) => void;
  onIgnored?: (userId: string) => void;
}

export function UserCard({
  user,
  showActions = false,
  isSwipeable = false,
  onInterested,
  onIgnored,
}: UserCardProps) {
  const [exitX, setExitX] = useState<number | null>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [10, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-10, -100], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 100;
    const velocityThreshold = 400;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      setExitX(500);
      setTimeout(() => {
        onInterested?.(user._id);
      }, 200);
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      setExitX(-500);
      setTimeout(() => {
        onIgnored?.(user._id);
      }, 200);
    }
  };

  const handleButtonAction = (type: "interested" | "ignored") => {
    const targetX = type === "interested" ? 500 : -500;
    setExitX(targetX);
    animate(x, targetX, { duration: 0.25 });
    setTimeout(() => {
      if (type === "interested") {
        onInterested?.(user._id);
      } else {
        onIgnored?.(user._id);
      }
    }, 200);
  };

  return (
    <motion.div
      style={{
        x,
        rotate: isSwipeable ? rotate : 0,
      }}
      drag={isSwipeable ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={isSwipeable ? handleDragEnd : undefined}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={
        exitX !== null
          ? { x: exitX, opacity: 0, scale: 0.8 }
          : { opacity: 1, y: 0, scale: 1 }
      }
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full mx-auto select-none ${
        isSwipeable ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      <div className="relative h-96 w-full bg-zinc-100 dark:bg-zinc-800">
        <img
          src={
            user.photoUrl ||
            "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"
          }
          alt={user.firstName}
          className="w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Dynamic Swipe Overlays */}
        {isSwipeable && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-6 left-6 border-4 border-emerald-500 text-emerald-500 rounded-2xl px-4 py-1 font-extrabold text-2xl tracking-wider uppercase transform -rotate-12 bg-black/30 backdrop-blur-sm pointer-events-none flex items-center gap-2"
            >
              <Heart className="w-6 h-6 fill-emerald-500" />
              LIKE
            </motion.div>
            <motion.div
              style={{ opacity: nopeOpacity }}
              className="absolute top-6 right-6 border-4 border-rose-500 text-rose-500 rounded-2xl px-4 py-1 font-extrabold text-2xl tracking-wider uppercase transform rotate-12 bg-black/30 backdrop-blur-sm pointer-events-none flex items-center gap-2"
            >
              <X className="w-6 h-6" />
              PASS
            </motion.div>
          </>
        )}

        <div className="absolute bottom-0 left-0 w-full p-6 text-white pointer-events-none">
          <h2 className="text-3xl font-bold mb-1">
            {user.firstName} {user.lastName}{" "}
            {user.age && <span className="font-normal text-zinc-300">, {user.age}</span>}
          </h2>
          {user.gender && <p className="text-sm text-zinc-300 capitalize">{user.gender}</p>}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">About</h3>
          <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed line-clamp-3">
            {user.about || "No bio provided."}
          </p>
        </div>

        {user.skills && user.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Skills</h3>
            <SkillsBadge skills={user.skills} />
          </div>
        )}

        {showActions && (
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t dark:border-zinc-800">
            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16 rounded-full border-2 border-rose-200 dark:border-rose-950 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-500 hover:text-rose-600 transition-all shadow-md active:scale-95"
              onClick={() => handleButtonAction("ignored")}
            >
              <X className="h-8 w-8" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16 rounded-full border-2 border-emerald-200 dark:border-emerald-950 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-md active:scale-95"
              onClick={() => handleButtonAction("interested")}
            >
              <Heart className="h-8 w-8" fill="currentColor" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
