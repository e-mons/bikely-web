import { ShieldCheck, Zap, Truck, Leaf } from "lucide-react";

export default function BrandFeatures() {
    const features = [
        {
            icon: Zap,
            title: "Electric Power",
            description: "Advanced battery technology providing up to 80 miles of range on a single charge."
        },
        {
            icon: ShieldCheck,
            title: "Premium Warranty",
            description: "Every Impala bike comes with a comprehensive 5-year frame and motor warranty."
        },
        {
            icon: Leaf,
            title: "Eco-Friendly",
            description: "Zero emissions, sustainable materials, and a commitment to a greener future."
        },
        {
            icon: Truck,
            title: "White Glove Delivery",
            description: "Fully assembled delivery right to your doorstep by our certified technicians."
        }
    ];

    return (
        <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-bikely-green/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-bikely-green">Why Choose Impala</h2>
                    <h3 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Engineered for Excellence</h3>
                    <p className="mx-auto max-w-2xl text-xl text-gray-400">
                        We don&apos;t just build bikes; we craft experiences. Discover the engineering marvels that set us apart.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group relative overflow-hidden rounded-[32px] border border-white/5 bg-white/[0.02] p-8 transition-all duration-300 hover:bg-white/[0.05] hover:-translate-y-2"
                        >
                            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 text-bikely-green shadow-[0_0_30px_-10px_rgba(204,255,0,0.3)] transition-transform group-hover:scale-110">
                                <feature.icon className="h-8 w-8" />
                            </div>
                            <h4 className="mb-4 text-xl font-bold text-white group-hover:text-bikely-green transition-colors">{feature.title}</h4>
                            <p className="text-gray-400 font-light leading-relaxed group-hover:text-gray-300 transition-colors">
                                {feature.description}
                            </p>

                            {/* Hover Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-bikely-green/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
