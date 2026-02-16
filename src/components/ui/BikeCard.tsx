import Image from "next/image";
import Link from "next/link";
import { Id } from "../../../convex/_generated/dataModel";
import { ArrowUpRight } from "lucide-react";

interface BikeCardProps {
    _id: Id<"bicycles">;
    name: string;
    price: number;
    imageUrls: (string | null)[];
}

export default function BikeCard({ _id, name, price, imageUrls }: BikeCardProps) {
    return (
        <Link href={`/bicycles/${_id}`} className="group block h-full">
            <div className="relative h-full overflow-hidden rounded-[32px] border border-white/5 bg-white/[0.02] p-2 transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px]">
                    {imageUrls[0] ? (
                        <Image
                            src={imageUrls[0]}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-white/5">
                            <span className="text-gray-500">No Image</span>
                        </div>
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

                    {/* Quick Action Button */}
                    <div className="absolute right-3 top-3 translate-x-10 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white transition-transform hover:scale-110 hover:bg-bikely-green hover:text-black">
                            <ArrowUpRight className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 py-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="line-clamp-1 text-lg font-bold text-white transition-colors group-hover:text-bikely-green">
                                {name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Electric Performance</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-lg font-bold text-white tracking-tight">${price.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
