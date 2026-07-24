"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Code, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { authApi } from "@/lib/api";
import { PublicRoute } from "@/components/PublicRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// min 8 characters, uppercase, lowercase, number, special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").regex(/^[A-Za-z]+$/, "Letters only"),
  lastName: z.string().regex(/^[A-Za-z]*$/, "Letters only").optional(),
  emailId: z.string().email("Invalid email address"),
  password: z.string().regex(passwordRegex, "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const passwordValue = watch("password", "");

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[a-z]/.test(pass)) score += 25;
    if (/\d/.test(pass) && /[@$!%*?&]/.test(pass)) score += 25;
    return score;
  };

  const strength = calculateStrength(passwordValue);

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...submitData } = data;
      await authApi.signup(submitData);
      toast.success("Account created successfully! Please login.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-lg shadow-2xl border-0">
          <CardHeader className="space-y-2 text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Code className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Create an account</CardTitle>
            <CardDescription>
              Join the developer network today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" {...register("firstName")} className={errors.firstName ? "border-red-500" : ""} />
                  {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...register("lastName")} className={errors.lastName ? "border-red-500" : ""} />
                  {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailId">Email *</Label>
                <Input id="emailId" type="email" {...register("emailId")} className={errors.emailId ? "border-red-500" : ""} />
                {errors.emailId && <p className="text-sm text-red-500">{errors.emailId.message}</p>}
              </div>
              
              <div className="space-y-2 relative">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {passwordValue.length > 0 && (
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
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
              </div>

              <Button type="submit" className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Sign Up
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-6">
            <p className="text-sm text-zinc-500">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </PublicRoute>
  );
}
