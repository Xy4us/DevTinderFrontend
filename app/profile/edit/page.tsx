"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProfileForm } from "@/components/ProfileForm";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "@/utils/userSlice";
import { profileApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function EditProfilePage() {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSave = async (data: any) => {
    try {
      const res = await profileApi.edit(data);
      dispatch(addUser(res.data.data));
      toast.success("Profile updated successfully!");
      router.push("/profile");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
        <Navbar />

        <main className="flex-1 container mx-auto max-w-4xl px-4 py-8">
          <div className="bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm overflow-hidden p-6 md:p-10">
            <h1 className="text-2xl font-bold mb-6 tracking-tight">Edit Profile</h1>
            <ProfileForm
              initialData={user}
              onSave={handleSave}
              onCancel={() => router.push("/profile")}
            />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
