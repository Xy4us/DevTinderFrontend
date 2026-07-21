"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").regex(/^[A-Za-z]+$/, "Letters only"),
  lastName: z.string().optional(),
  age: z.any(),
  gender: z.enum(["male", "female", "others"]).optional(),
  photoUrl: z.string().optional(),
  about: z.string().max(500).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialData: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function ProfileForm({ initialData, onSave, onCancel }: ProfileFormProps) {
  const [skills, setSkills] = useState<string[]>(initialData.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      age: initialData.age || "",
      gender: initialData.gender || undefined,
      photoUrl: initialData.photoUrl || "",
      about: initialData.about || "",
    },
  });

  const photoUrlValue = watch("photoUrl");

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = skillInput.trim();
      if (val && skills.length < 10 && val.length <= 30 && !skills.some(s => s.toLowerCase() === val.toLowerCase())) {
        setSkills([...skills, val]);
        setSkillInput("");
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      await onSave({ ...data, skills });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
          <div className="h-48 w-48 rounded-full overflow-hidden bg-zinc-100 border-4 border-white shadow-lg shrink-0 relative">
            <img 
              src={photoUrlValue || "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"} 
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png";
              }}
            />
          </div>
          <div className="w-full space-y-2">
            <Label htmlFor="photoUrl">Photo URL</Label>
            <Input id="photoUrl" placeholder="https://..." {...register("photoUrl")} />
            {errors.photoUrl && <p className="text-sm text-red-500">{errors.photoUrl.message}</p>}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" {...register("age")} />
              {errors.age && <p className="text-sm text-red-500">{errors.age.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(val) => setValue("gender", val as any)} defaultValue={initialData.gender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea id="about" rows={4} placeholder="Write something about yourself..." {...register("about")} />
            {errors.about && <p className="text-sm text-red-500">{errors.about.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills (Max 10)</Label>
            <div className="p-3 border rounded-md bg-white dark:bg-zinc-950 min-h-12 flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-zinc-400 focus-within:border-transparent transition-all">
              {skills.map(skill => (
                <span key={skill} className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md text-sm flex items-center gap-1 font-medium">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {skills.length < 10 && (
                <input
                  id="skills"
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder={skills.length === 0 ? "Type a skill and press Enter" : "Add more..."}
                  className="flex-1 outline-none bg-transparent min-w-[120px] text-sm"
                  maxLength={30}
                />
              )}
            </div>
            <p className="text-xs text-zinc-500">Press enter to add a skill</p>
          </div>

          <div className="pt-6 flex gap-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
