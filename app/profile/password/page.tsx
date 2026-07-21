"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import { profileApi } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().regex(passwordRegex, "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password cannot be the same as current password",
  path: ["newPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const newPasswordValue = watch("newPassword", "");

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[a-z]/.test(pass)) score += 25;
    if (/\d/.test(pass) && /[@$!%*?&]/.test(pass)) score += 25;
    return score;
  };

  const strength = calculateStrength(newPasswordValue);

  const onSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
    try {
      await profileApi.updatePassword(data);
      toast.success("Password updated successfully!");
      router.push("/profile");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
        <Navbar />
        
        <main className="flex-1 container mx-auto max-w-xl px-4 py-8">
          <div className="bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm overflow-hidden p-6 md:p-10">
            <h1 className="text-2xl font-bold mb-6 tracking-tight">Change Password</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2 relative">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    {...register("currentPassword")}
                    className={errors.currentPassword ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
                  >
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword.message}</p>}
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    {...register("newPassword")}
                    className={errors.newPassword ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {newPasswordValue.length > 0 && (
                  <div className="mt-2">
                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden flex">
                      <div className={`h-full transition-all duration-300 ${strength <= 25 ? 'bg-red-500 w-1/4' : strength <= 50 ? 'bg-orange-500 w-2/4' : strength <= 75 ? 'bg-yellow-500 w-3/4' : 'bg-green-500 w-full'}`} />
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      {strength <= 25 && "Weak"}
                      {strength > 25 && strength <= 50 && "Fair"}
                      {strength > 50 && strength <= 75 && "Good"}
                      {strength === 100 && "Strong"}
                    </p>
                  </div>
                )}
                {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword.message}</p>}
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    {...register("confirmPassword")}
                    className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
              </div>

              <div className="pt-4 flex gap-4 border-t">
                <Button type="button" variant="outline" onClick={() => router.push("/profile")} className="flex-1" disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
