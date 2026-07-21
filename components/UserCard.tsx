"use client";

import { motion } from "framer-motion";
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
  onInterested?: (userId: string) => void;
  onIgnored?: (userId: string) => void;
}

export function UserCard({ user, showActions = false, onInterested, onIgnored }: UserCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -200, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-zinc-900 border rounded-3xl overflow-hidden shadow-xl max-w-sm w-full mx-auto"
    >
      <div className="relative h-96 w-full bg-zinc-100 dark:bg-zinc-800">
        <img 
          src={user.photoUrl || "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"} 
          alt={user.firstName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
          <h2 className="text-3xl font-bold mb-1">
            {user.firstName} {user.lastName} {user.age && <span className="font-normal text-zinc-300">, {user.age}</span>}
          </h2>
          {user.gender && <p className="text-sm text-zinc-300 capitalize">{user.gender}</p>}
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">About</h3>
          <p className="text-zinc-700 dark:text-zinc-300 line-clamp-3">
            {user.about || "No bio provided."}
          </p>
        </div>

        {user.skills && user.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Skills</h3>
            <SkillsBadge skills={user.skills} />
          </div>
        )}

        {showActions && (
          <div className="flex items-center justify-center gap-6 mt-8 pt-4 border-t dark:border-zinc-800">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-16 w-16 rounded-full border-2 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-500 hover:text-red-500 transition-all shadow-sm"
              onClick={() => onIgnored && onIgnored(user._id)}
            >
              <X className="h-8 w-8" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-16 w-16 rounded-full border-2 border-green-200 text-green-500 hover:bg-green-50 hover:border-green-500 hover:text-green-500 transition-all shadow-sm"
              onClick={() => onInterested && onInterested(user._id)}
            >
              <Heart className="h-8 w-8" fill="currentColor" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
