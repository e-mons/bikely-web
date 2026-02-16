import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import BicycleDetails from "@/components/BicycleDetails";

interface PageProps {
    params: Promise<{ id: Id<"bicycles"> }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;
    const bicycle = await fetchQuery(api.bicycles.getById, { id });

    return {
        title: bicycle?.name ? `${bicycle.name} | Bikely` : "Bicycle Details | Bikely",
        description: bicycle?.description || "Check out this premium bicycle.",
    };
}

export default async function BicycleDetailsPage({ params }: PageProps) {
    const { id } = await params;
    return <BicycleDetails bicycleId={id} />;
}
