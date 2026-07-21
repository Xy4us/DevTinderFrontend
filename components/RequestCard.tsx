"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillsBadge } from "./SkillsBadge";

interface RequestCardProps {
  request: {
    _id: string;
    fromUserId: {
      _id: string;
      firstName: string;
      lastName?: string;
      photoUrl?: string;
      age?: number;
      gender?: string;
      about?: string;
      skills?: string[];
    };
    status: string;
  };
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export function RequestCard({ request, onAccept, onReject }: RequestCardProps) {
  const user = request.fromUserId;

  return (
    <div className="bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row max-w-3xl w-full mx-auto">
      <div className="w-full md:w-48 h-48 md:h-auto shrink-0 bg-zinc-100 dark:bg-zinc-800">
        <img 
          src={user.photoUrl || "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"} 
          alt={user.firstName}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold">
                {user.firstName} {user.lastName} <span className="font-normal text-zinc-500 text-base">{user.age ? `, ${user.age}` : ''}</span>
              </h3>
              {user.gender && <p className="text-sm text-zinc-500 capitalize">{user.gender}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" className="h-10 w-10 rounded-full border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => onAccept(request._id)}>
                <Check className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="outline" className="h-10 w-10 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => onReject(request._id)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-2">
            {user.about || "No bio provided."}
          </p>
        </div>
        
        {user.skills && user.skills.length > 0 && (
          <div className="pt-4 border-t dark:border-zinc-800">
             <SkillsBadge skills={user.skills} />
          </div>
        )}
      </div>
    </div>
  );
}
