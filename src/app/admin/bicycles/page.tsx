"use client";

import { useQuery, useMutation } from "convex/react";
import Image from "next/image";
import { useState } from "react";
import { Loader2, Plus, Pencil, Trash2, Search, Filter } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import BicycleForm from "@/components/admin/BicycleForm";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";

export default function AdminBicyclesPage() {
    const bicycles = useQuery(api.bicycles.get);
    const categories = useQuery(api.categories.get);
    const removeBicycle = useMutation(api.bicycles.remove);
    const { toast } = useToast();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBike, setEditingBike] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    if (bicycles === undefined || categories === undefined) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-bikely-green" />
            </div>
        );
    }

    const filteredBicycles = bicycles.filter(bike =>
        bike.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (bike: any) => {
        setEditingBike(bike);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingBike(null);
        setIsFormOpen(true);
    };

    const handleSuccess = () => {
        setIsFormOpen(false);
        setEditingBike(null);
    };

    const handleDelete = async (id: any) => {
        if (!confirm("Are you sure you want to delete this bicycle? This action cannot be undone.")) return;

        setDeletingId(id);
        try {
            await removeBicycle({ id });
            toast({ type: "success", message: "Bicycle deleted successfully" });
        } catch (error) {
            console.error("Failed to delete bicycle:", error);
            toast({ type: "error", message: "Failed to delete bicycle" });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen pb-20 relative">
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white font-outfit">Bicycles</h1>
                    <p className="text-gray-400 mt-1">Manage your product inventory.</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative group w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-bikely-green transition-colors" />
                        <input
                            type="text"
                            placeholder="Search bicycles..."
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

            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] backdrop-blur-md shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-xs uppercase text-gray-300 font-bold tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-5">Product</th>
                                <th scope="col" className="px-6 py-5">Price</th>
                                <th scope="col" className="px-6 py-5">Stock</th>
                                <th scope="col" className="px-6 py-5">Installment</th>
                                <th scope="col" className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {filteredBicycles.map((bike, index) => (
                                    <motion.tr
                                        key={bike._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-white/[0.04] transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-black/40 border border-white/10">
                                                    {bike.imageUrls?.[0] && (
                                                        <Image
                                                            src={bike.imageUrls[0]}
                                                            alt={bike.name}
                                                            fill
                                                            className="object-cover transition-transform group-hover:scale-110"
                                                        />
                                                    )}
                                                </div>
                                                <div className="font-bold text-white group-hover:text-bikely-green transition-colors">{bike.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-white font-mono">${bike.price.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={cn(
                                                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase",
                                                    bike.stock > 0
                                                        ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                                        : "bg-red-500/10 text-red-500 border border-red-500/20"
                                                )}
                                            >
                                                {bike.stock > 0 ? `${bike.stock} in stock` : "Out of stock"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {bike.installmentAvailable ? (
                                                <span className="flex items-center gap-1.5 text-bikely-green text-xs font-bold uppercase">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-bikely-green" /> Available
                                                </span>
                                            ) : (
                                                <span className="text-gray-600 text-xs uppercase font-medium">--</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(bike)}
                                                    className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(bike._id)}
                                                    disabled={deletingId === bike._id}
                                                    className="rounded-full p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all cursor-pointer"
                                                    title="Delete"
                                                >
                                                    {deletingId === bike._id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                {filteredBicycles.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No bicycles found matching "{searchQuery}"
                    </div>
                )}
            </div>

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
                            className="bg-[#0a0a0a] border border-white/10 rounded-[32px] shadow-2xl w-full max-w-4xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8 max-h-[90vh] overflow-y-auto">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-3xl font-bold text-white font-outfit">{editingBike ? 'Edit Bicycle' : 'Add New Bicycle'}</h2>
                                    <button onClick={() => setIsFormOpen(false)} className="rounded-full bg-white/5 p-2 hover:bg-white/10 cursor-pointer">
                                        <Plus className="h-6 w-6 rotate-45 text-gray-400" />
                                    </button>
                                </div>
                                <BicycleForm
                                    initialData={editingBike}
                                    categories={categories}
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
