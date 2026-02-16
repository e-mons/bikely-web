"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useToast } from "@/context/ToastContext";

interface CategoryFormProps {
    initialData?: {
        _id: Id<"categories">;
        name: string;
        description?: string;
        imageId: string;
        imageUrl?: string;
    };
    onSuccess: () => void;
    onCancel: () => void;
}

export default function CategoryForm({ initialData, onSuccess, onCancel }: CategoryFormProps) {
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const createCategory = useMutation(api.categories.create);
    const updateCategory = useMutation(api.categories.update);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        description: initialData?.description || "",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let imageId = initialData?.imageId;

            // 1. Upload Image if changed
            if (imageFile) {
                const postUrl = await generateUploadUrl();
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": imageFile.type },
                    body: imageFile,
                });
                const { storageId } = await result.json();
                imageId = storageId;
            }

            if (!imageId) {
                toast({ type: "error", message: "Please upload a category image." });
                setIsSubmitting(false);
                return;
            }

            // 2. Mutate
            if (initialData) {
                await updateCategory({
                    id: initialData._id,
                    name: formData.name,
                    description: formData.description,
                    imageId: imageId !== initialData.imageId ? imageId : undefined,
                });
                toast({ type: "success", message: "Category updated successfully!" });
            } else {
                await createCategory({
                    name: formData.name,
                    description: formData.description,
                    imageId: imageId,
                });
                toast({ type: "success", message: "Category created successfully!" });
            }

            onSuccess();
        } catch (error) {
            console.error("Failed to save category:", error);
            toast({ type: "error", message: "Failed to save category. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Name</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg bg-black/20 p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-bikely-green/50"
                    required
                    placeholder="e.g. Mountain Bikes"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="h-32 w-full rounded-lg bg-black/20 p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-bikely-green/50"
                    placeholder="Brief description of the category..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Cover Image</label>
                <div className="flex flex-col gap-4">
                    {!previewUrl ? (
                        <label className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-black/20 hover:bg-black/40 hover:border-bikely-green transition-all group">
                            <Upload className="h-8 w-8 text-gray-500 group-hover:text-bikely-green transition-colors" />
                            <span className="mt-2 text-sm text-gray-400 group-hover:text-white transition-colors">Click to upload image</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                    ) : (
                        <div className="relative h-40 w-full overflow-hidden rounded-xl border border-white/10 group">
                            <Image
                                src={previewUrl}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="rounded-full bg-red-500/80 p-2 text-white hover:bg-red-500 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-full px-6 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-bikely-green px-6 py-2 text-sm font-bold text-black hover:bg-bikely-green/90 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(204,255,0,0.2)] hover:shadow-[0_0_25px_rgba(204,255,0,0.4)]"
                >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (initialData ? "Update Category" : "Create Category")}
                </button>
            </div>
        </form>
    );
}
