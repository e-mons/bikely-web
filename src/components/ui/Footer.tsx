import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

    if (pathname.startsWith("/admin")) return null;

    return (
        <footer className="relative border-t border-white/10 bg-black pt-20 pb-10 overflow-hidden">
            {/* Background glow */}
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-bikely-green/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="text-3xl font-bold tracking-tighter text-white font-outfit">
                            Bikely
                        </Link>
                        <p className="text-gray-400 max-w-xs">
                            Redefining urban mobility with premium electric bicycles engineered for performance and style.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                                <Link
                                    key={idx}
                                    href="#"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-bikely-green hover:text-black transition-all duration-300"
                                >
                                    <Icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h3 className="mb-6 text-lg font-bold text-white">Shop</h3>
                        <ul className="space-y-4">
                            {["All Bicycles", "City Commuters", "All-Terrain", "Accessories", "New Arrivals"].map((item) => (
                                <li key={item}>
                                    <Link href="/explore" className="text-gray-400 hover:text-bikely-green transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h3 className="mb-6 text-lg font-bold text-white">Support</h3>
                        <ul className="space-y-4">
                            {["Contact Us", "Warranty", "Shipping & Returns", "FAQ", "Service Centers"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-gray-400 hover:text-bikely-green transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="mb-6 text-lg font-bold text-white">Contact</h3>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-bikely-green shrink-0" />
                                <span>123 Innovation Drive,<br />Tech City, TC 94043</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-bikely-green shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-bikely-green shrink-0" />
                                <span>support@bikely.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-20 border-t border-white/10 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Bikely Inc. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm text-gray-500">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
