"use client";

import { useQuery, useMutation } from "convex/react";
import Image from "next/image";
import { useState } from "react";
import { Loader2, Shield, User } from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { api } from "../../../../convex/_generated/api";
import { GlassSkeleton } from "@/components/ui/GlassSkeleton";
import { cn } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

export default function AdminUsersPage() {
    const setUserRole = useMutation(api.users.setUserRole);
    const removeUser = useMutation(api.users.remove);
    const { toast } = useToast();

    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [isLoadingAction, setIsLoadingAction] = useState(false);

    const handleRoleUpdate = async (userId: string, newRole: "admin" | "user") => {
        setIsLoadingAction(true);
        try {
            await setUserRole({ id: userId as any, role: newRole });
            setEditingUserId(null); // Close edit mode
        } catch (error) {
            console.error("Failed to update role:", error);
            toast({ type: "error", message: "Failed to update role" });
        } finally {
            setIsLoadingAction(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        setIsLoadingAction(true);
        try {
            await removeUser({ id: userId as any });
        } catch (error) {
            console.error("Failed to delete user:", error);
            toast({ type: "error", message: "Failed to delete user" });
        } finally {
            setIsLoadingAction(false);
        }
    };

    const users = useQuery(api.users.getAll);

    if (users === undefined) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">Users</h1>
                </div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <GlassSkeleton key={i} className="h-20 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Users</h1>
                <span className="rounded-full bg-white/10 px-4 py-1 text-sm text-gray-400">
                    {users.length} Total Users
                </span>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-xs uppercase text-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium">Email</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10">
                                                <UserAvatar
                                                    name={user.name}
                                                    imageUrl={user.imageUrl}
                                                    className="h-full w-full"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{user.name}</div>
                                                <div className="text-xs text-gray-500">Joined {new Date(user._creationTime).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingUserId === user._id ? (
                                            <select
                                                value={user.role || "user"}
                                                onChange={(e) => handleRoleUpdate(user._id, e.target.value as "admin" | "user")}
                                                disabled={isLoadingAction}
                                                className="rounded-lg border-none bg-black/20 py-1 pl-2 pr-8 text-xs font-medium focus:ring-1 focus:ring-bikely-green/50 text-white"
                                            >
                                                <option value="user" className="bg-gray-900">User</option>
                                                <option value="admin" className="bg-gray-900">Admin</option>
                                            </select>
                                        ) : (
                                            <span
                                                className={cn(
                                                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer hover:opacity-80",
                                                    user.role === "admin"
                                                        ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                                                        : "bg-gray-500/10 text-gray-400 border border-white/10"
                                                )}
                                                onClick={() => setEditingUserId(user._id)}
                                            >
                                                {user.role === "admin" && <Shield className="h-3 w-3" />}
                                                {user.role === "admin" ? "Admin" : "Customer"}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            disabled={isLoadingAction || user.role === "admin"} // Prevent deleting admins for safety
                                            className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                            title="Delete User"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
