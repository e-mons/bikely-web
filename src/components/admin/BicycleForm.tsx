"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useToast } from "@/context/ToastContext";

interface BicycleFormProps {
    initialData?: {
        _id: Id<"bicycles">;
        name: string;
        description: string;
        price: number;
        stock: number;
        categoryId: Id<"categories">;
        imageUrls: (string | null)[];
        imageIds: string[];
        installmentAvailable: boolean;
        installmentDuration?: number;
        monthlyInstallment?: number;
        installmentInterval?: string;
    };
    categories: { _id: Id<"categories">; name: string }[];
    onSuccess: () => void;
    onCancel: () => void;
}

export default function BicycleForm({ initialData, categories, onSuccess, onCancel }: BicycleFormProps) {
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const createBicycle = useMutation(api.bicycles.create);
    const updateBicycle = useMutation(api.bicycles.update);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        description: initialData?.description || "",
        price: initialData?.price || 0,
        stock: initialData?.stock || 0,
        categoryId: initialData?.categoryId || (categories[0]?._id as string),
        installmentAvailable: initialData?.installmentAvailable || false,
        installmentDuration: initialData?.installmentDuration || 0,
        monthlyInstallment: initialData?.monthlyInstallment || 0,
        installmentInterval: initialData?.installmentInterval || "monthly",
    });

    const [imageFiles, setImageFiles] = useState<File[]>([]);

    // Create a combined state for existing images { id, url }
    const [existingImages, setExistingImages] = useState<{ id: string, url: string }[]>(() => {
        if (!initialData?.imageIds || !initialData?.imageUrls) return [];
        return initialData.imageIds.map((id, index) => ({
            id,
            url: initialData.imageUrls[index] || ""
        })).filter(img => img.url !== "");
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Upload New Images
            const newImageIds: string[] = [];
            for (const file of imageFiles) {
                const postUrl = await generateUploadUrl();
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": file.type },
                    body: file,
                });
                const { storageId } = await result.json();
                newImageIds.push(storageId);
            }

            // 2. Combine with Kept Existing Images
            const finalImageIds = [
                ...existingImages.map(img => img.id),
                ...newImageIds
            ];

            // 2. Prepare Data
            const bicycleData = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                stock: formData.stock,
                categoryId: formData.categoryId as Id<"categories">,
                installmentAvailable: formData.installmentAvailable,
                installmentDuration: formData.installmentAvailable && formData.installmentDuration ? formData.installmentDuration : undefined,
                monthlyInstallment: formData.installmentAvailable && formData.monthlyInstallment ? formData.monthlyInstallment : undefined,
                // Defaulting interval to monthly for now as it's the common case
                installmentInterval: formData.installmentAvailable ? "monthly" as const : undefined,
            };

            // 3. Mutate
            if (initialData) {
                await updateBicycle({
                    id: initialData._id,
                    ...bicycleData,
                    imageIds: finalImageIds
                });
            } else {
                await createBicycle({
                    ...bicycleData,
                    imageIds: finalImageIds, // For new bike, existingImages is empty
                });
            }

            onSuccess();
        } catch (error) {
            console.error("Failed to save bicycle:", error);
            toast({ type: "error", message: "Failed to save bicycle. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-lg bg-black/20 p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-bikely-green/50"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Category</label>
                    <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="w-full rounded-lg bg-black/20 p-3 text-white focus:outline-none focus:ring-2 focus:ring-bikely-green/50"
                    >
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id} className="bg-gray-900">
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-300">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="h-32 w-full rounded-lg bg-black/20 p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-bikely-green/50"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Price ($)</label>
                    <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full rounded-lg bg-black/20 p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-bikely-green/50"
                        required
                        min="0"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Stock</label>
                    <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                        className="w-full rounded-lg bg-black/20 p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-bikely-green/50"
                        required
                        min="0"
                    />
                </div>
            </div>

            <div className="space-y-4 rounded-xl bg-white/5 p-4">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="installment"
                        checked={formData.installmentAvailable}
                        onChange={(e) => setFormData({ ...formData, installmentAvailable: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-bikely-green focus:ring-bikely-green"
                    />
                    <label htmlFor="installment" className="text-sm font-medium text-white">Enable Installment Plan</label>
                </div>

                {formData.installmentAvailable && (
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400">Monthly ($)</label>
                            <input
                                type="number"
                                value={formData.monthlyInstallment}
                                onChange={(e) => setFormData({ ...formData, monthlyInstallment: Number(e.target.value) })}
                                className="w-full rounded-lg bg-black/20 p-2 text-sm text-white focus:ring-1 focus:ring-bikely-green/50"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400">Duration (Months)</label>
                            <input
                                type="number"
                                value={formData.installmentDuration}
                                onChange={(e) => setFormData({ ...formData, installmentDuration: Number(e.target.value) })}
                                className="w-full rounded-lg bg-black/20 p-2 text-sm text-white focus:ring-1 focus:ring-bikely-green/50"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Images</label>
                <div className="flex flex-wrap gap-4">
                    {/* Existing Images */}
                    {existingImages.map((img) => (
                        <div key={img.id} className="relative h-24 w-24 overflow-hidden rounded-xl border border-white/10 group">
                            <Image
                                src={img.url}
                                alt="Existing"
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => setExistingImages(existingImages.filter(i => i.id !== img.id))}
                                className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}

                    <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-500 bg-black/20 hover:bg-black/40 hover:border-bikely-green transition-colors">
                        <Upload className="h-6 w-6 text-gray-400" />
                        <span className="mt-1 text-xs text-gray-500">Upload</span>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setImageFiles([...imageFiles, ...Array.from(e.target.files)]);
                                }
                            }}
                        />
                    </label>

                    {imageFiles.map((file, idx) => (
                        <div key={idx} className="relative h-24 w-24 overflow-hidden rounded-xl border border-white/10">
                            <Image
                                src={URL.createObjectURL(file)}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))}
                                className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white hover:bg-red-500"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-full px-6 py-2 text-sm font-medium text-gray-400 hover:text-white"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    disabled={isSubmitting} // Add handler logic later
                    className="rounded-full bg-bikely-green px-6 py-2 text-sm font-bold text-black hover:bg-bikely-green/90 disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Bicycle"}
                </button>
            </div>
        </form>
    );
}
