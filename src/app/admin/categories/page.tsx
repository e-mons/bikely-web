"use client";

import { useQuery, useMutation } from "convex/react";
import Image from "next/image";
import { useState } from "react";
import { Loader2, Plus, Pencil, Trash2, Search, AlertTriangle } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import CategoryForm from "@/components/admin/CategoryForm";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";

export default function AdminCategoriesPage() {
    const categories = useQuery(api.categories.get);
    const removeCategory = useMutation(api.categories.remove);
    const { toast } = useToast();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    if (categories === undefined) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-bikely-green" />
            </div>
        );
    }

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingCategory(null);
        setIsFormOpen(true);
    };

    const handleSuccess = () => {
        setIsFormOpen(false);
        setEditingCategory(null);
    };

    const handleDelete = async (id: any) => {
        if (!confirm("Are you sure? Deleting a category will also delete ALL associated bicycles and their orders! This action cannot be undone.")) return;

        setDeletingId(id);
        try {
            await removeCategory({ id });
            toast({ type: "success", message: "Category deleted successfully" });
        } catch (error) {
            console.error("Failed to delete category:", error);
            toast({ type: "error", message: "Failed to delete category" });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen pb-20 relative">
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white font-outfit">Categories</h1>
                    <p className="text-gray-400 mt-1">Manage product categories.</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative group w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-bikely-green transition-colors" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-bikely-green/50 focus:bg-white/10 transition-all"
                        />
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="flex items-center justify-center gap-2 rounded-full bg-bikely-green px-6 py-2.5 text-sm font-bold text-black transition-all hover:bg-bikely-green/90 shadow-[0_0_15px_rgba(204,255,0,0.2)] hover:shadow-[0_0_25px_rgba(204,255,0,0.4)] whitespace-nowrap cursor-pointer"
                    >
                        <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Add New</span>
                    </button>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence>
                    {filteredCategories.map((category, index) => (
                        <motion.div
                            key={category._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.05] transition-all"
                        >
                            <div className="aspect-[4/3] relative overflow-hidden bg-black/20">
                                {category.imageUrl ? (
                                    <Image
                                        src={category.imageUrl}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-gray-600">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="rounded-full bg-black/60 p-2 text-white hover:bg-bikely-green hover:text-black transition-colors backdrop-blur-sm cursor-pointer"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category._id)}
                                        disabled={deletingId === category._id}
                                        className="rounded-full bg-black/60 p-2 text-white hover:bg-red-500 transition-colors backdrop-blur-sm cursor-pointer"
                                    >
                                        {deletingId === category._id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="text-xl font-bold text-white font-outfit mb-1">{category.name}</h3>
                                {category.description && (
                                    <p className="text-sm text-gray-400 line-clamp-2">{category.description}</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredCategories.length === 0 && (
                <div className="mt-12 text-center text-gray-500">
                    No categories found matching "{searchQuery}"
                </div>
            )}

            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#0a0a0a] border border-white/10 rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-3xl font-bold text-white font-outfit">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                                    <button onClick={() => setIsFormOpen(false)} className="rounded-full bg-white/5 p-2 hover:bg-white/10 transition-colors cursor-pointer">
                                        <Plus className="h-6 w-6 rotate-45 text-gray-400" />
                                    </button>
                                </div>

                                {editingCategory && (
                                    <div className="mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 flex gap-3 text-yellow-500">
                                        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                                        <div className="text-sm">
                                            <p className="font-bold">Warning</p>
                                            <p className="opacity-90">Deleting a category will permanently delete all products associated with it.</p>
                                        </div>
                                    </div>
                                )}

                                <CategoryForm
                                    initialData={editingCategory}
                                    onSuccess={handleSuccess}
                                    onCancel={() => setIsFormOpen(false)}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
