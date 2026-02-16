"use client";

import { useQuery, useMutation } from "convex/react";
import { UserButton } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import { Loader2, MapPin, Save, User as UserIcon, Mail, Camera, Trash2, Upload } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { GlassSkeleton } from "@/components/ui/GlassSkeleton";
import { useToast } from "@/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function ProfilePage() {
    const user = useQuery(api.users.getCurrentUser);
    const updateAddress = useMutation(api.users.updateAddress);
    const updateUser = useMutation(api.users.updateUser);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        country: "",
        state: "",
        city: "",
        street: "",
        zipCode: "",
        latitude: undefined as number | undefined,
        longitude: undefined as number | undefined,
    });

    useEffect(() => {
        if (user?.address) {
            setFormData({
                country: user.address.country,
                state: user.address.state,
                city: user.address.city,
                street: user.address.street,
                zipCode: user.address.zipCode,
                latitude: user.address.location?.latitude,
                longitude: user.address.location?.longitude,
            });
        }
    }, [user]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // 1. Generate upload URL
            const postUrl = await generateUploadUrl();

            // 2. Upload file to Convex Storage
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            if (!result.ok) throw new Error("Upload failed");

            const { storageId } = await result.json();

            // 3. Update user profile with storage ID
            await updateUser({ imageId: storageId });

            toast({ type: "success", message: "Profile picture updated successfully!" });
        } catch (error) {
            console.error("Failed to upload image:", error);
            toast({ type: "error", message: "Failed to upload image. Please try again." });
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = async () => {
        if (!confirm("Are you sure you want to remove your profile picture?")) return;

        setIsUploading(true);
        try {
            await updateUser({ imageId: null });
            toast({ type: "success", message: "Profile picture removed." });
        } catch (error) {
            console.error("Failed to remove image:", error);
            toast({ type: "error", message: "Failed to remove image." });
        } finally {
            setIsUploading(false);
        }
    };

    if (user === undefined) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-8 pb-20 sm:px-6 lg:px-8 pt-32">
                <GlassSkeleton className="h-48 w-full rounded-[32px] mb-8" />
                <GlassSkeleton className="h-96 w-full rounded-[32px]" />
            </div>
        );
    }

    if (user === null) {
        return <div className="pt-32 text-center text-white">Please log in to view your profile.</div>;
    }

    const handleGeolocation = () => {
        if (!navigator.geolocation) {
            toast({ type: "error", message: "Geolocation is not supported by your browser" });
            return;
        }

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setFormData(prev => ({ ...prev, latitude, longitude }));

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();

                    if (data.address) {
                        setFormData(prev => ({
                            ...prev,
                            country: data.address.country || prev.country,
                            state: data.address.state || data.address.region || prev.state,
                            city: data.address.city || data.address.town || data.address.village || prev.city,
                            street: data.address.road ? `${data.address.house_number || ''} ${data.address.road}`.trim() : prev.street,
                            zipCode: data.address.postcode || prev.zipCode,
                            latitude,
                            longitude
                        }));
                        toast({ type: "success", message: "Location detected successfully!", title: "Location Found" });
                    }
                } catch (error) {
                    console.error("Failed to reverse geocode:", error);
                    toast({ type: "warning", message: "Location detected but address lookup failed. Please enter address manually." });
                } finally {
                    setIsLoading(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                toast({ type: "error", message: "Unable to retrieve your location" });
                setIsLoading(false);
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateAddress({
                country: formData.country,
                state: formData.state,
                city: formData.city,
                street: formData.street,
                zipCode: formData.zipCode,
                latitude: formData.latitude,
                longitude: formData.longitude,
            });
            toast({ type: "success", message: "Your shipping information has been saved." });
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast({ type: "error", message: "Failed to update profile. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 relative selection:bg-bikely-green selection:text-black">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-bikely-green/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-4xl font-bold tracking-tight text-white font-outfit"
                >
                    My Profile
                </motion.h1>

                <div className="space-y-8">
                    {/* User Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card flex flex-col sm:flex-row items-center gap-8 p-8 border border-white/5 bg-white/[0.02]"
                    >
                        <div className="relative group">
                            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white/10 group-hover:border-bikely-green transition-all relative">
                                {user.imageUrl ? (
                                    <Image
                                        src={user.imageUrl}
                                        alt={user.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                avatarBox: "h-full w-full",
                                            },
                                        }}
                                    />
                                )}

                                {/* Overlay for upload interaction */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 rounded-full bg-white/10 hover:bg-bikely-green hover:text-black text-white transition-colors cursor-pointer"
                                        title="Change Photo"
                                    >
                                        <Camera className="h-5 w-5" />
                                    </button>
                                    {user.profileImageId && (
                                        <button
                                            onClick={handleRemoveImage}
                                            className="p-2 rounded-full bg-white/10 hover:bg-red-500 hover:text-white text-white transition-colors cursor-pointer"
                                            title="Remove Photo"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />

                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                    <Loader2 className="h-8 w-8 animate-spin text-bikely-green" />
                                </div>
                            )}
                        </div>

                        <div className="text-center sm:text-left space-y-2 flex-1">
                            <h2 className="text-3xl font-bold text-white font-outfit">{user.name}</h2>
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-400">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                            </div>
                            <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${user.role === "admin"
                                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                    : "bg-bikely-green/10 text-bikely-green border-bikely-green/20"
                                    }`}>
                                    {user.role === "admin" ? "Administrator" : "Customer Account"}
                                </span>

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="sm:hidden inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10 cursor-pointer"
                                >
                                    <Upload className="h-3 w-3" /> Change Photo
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Address Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-8 border border-white/5 bg-white/[0.02]"
                    >
                        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-bikely-green" />
                                    Shipping Address
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">Manage your delivery details for faster checkout</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleGeolocation}
                                disabled={isLoading}
                                className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10 hover:text-bikely-green transition-all border border-white/5 hover:border-bikely-green/30 cursor-pointer"
                            >
                                <MapPin className="h-4 w-4" />
                                {isLoading ? "Locating..." : "Auto-Detect Location"}
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid gap-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2 group">
                                    <label className="text-sm font-medium text-gray-300 ml-1 group-focus-within:text-bikely-green transition-colors">Street Address</label>
                                    <input
                                        type="text"
                                        value={formData.street}
                                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                        required
                                        className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:border-bikely-green/50 focus:outline-none focus:ring-2 focus:ring-bikely-green/20 transition-all font-light"
                                        placeholder="123 Bike Lane"
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-sm font-medium text-gray-300 ml-1 group-focus-within:text-bikely-green transition-colors">City</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        required
                                        className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:border-bikely-green/50 focus:outline-none focus:ring-2 focus:ring-bikely-green/20 transition-all font-light"
                                        placeholder="Metropolis"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2 group">
                                    <label className="text-sm font-medium text-gray-300 ml-1 group-focus-within:text-bikely-green transition-colors">State / Province</label>
                                    <input
                                        type="text"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        required
                                        className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:border-bikely-green/50 focus:outline-none focus:ring-2 focus:ring-bikely-green/20 transition-all font-light"
                                        placeholder="NY"
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-sm font-medium text-gray-300 ml-1 group-focus-within:text-bikely-green transition-colors">Postal Code</label>
                                    <input
                                        type="text"
                                        value={formData.zipCode}
                                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                        required
                                        className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:border-bikely-green/50 focus:outline-none focus:ring-2 focus:ring-bikely-green/20 transition-all font-light"
                                        placeholder="10001"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-sm font-medium text-gray-300 ml-1 group-focus-within:text-bikely-green transition-colors">Country</label>
                                <input
                                    type="text"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    required
                                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:border-bikely-green/50 focus:outline-none focus:ring-2 focus:ring-bikely-green/20 transition-all font-light"
                                    placeholder="United States"
                                />
                            </div>

                            {(formData.latitude && formData.longitude) && (
                                <div className="flex items-center gap-2 text-xs text-bikely-green bg-bikely-green/5 p-3 rounded-lg border border-bikely-green/10">
                                    <MapPin className="h-3 w-3" />
                                    Coordinates Verified: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                                </div>
                            )}

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center gap-2 rounded-full bg-bikely-green px-8 py-3 text-sm font-bold text-black transition-all hover:bg-bikely-green/90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] cursor-pointer"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
