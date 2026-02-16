"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function TestConvex() {
    const user = useQuery(api.users.getCurrentUser);

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Convex Connection Test</h1>
            <div className="border p-4 rounded bg-gray-50">
                <p>Status: <span className="font-semibold text-green-600">Connected</span></p>
                <div className="mt-2">
                    <h2 className="font-semibold">Current User Query Result:</h2>
                    <pre className="mt-2 p-2 bg-gray-200 rounded text-sm overflow-auto">
                        {user === undefined ? "Loading..." : JSON.stringify(user, null, 2)}
                    </pre>
                    <p className="text-sm text-gray-500 mt-2">
                        (If null, it means you are not logged in, but the query successfully reached the backend)
                    </p>
                </div>
            </div>
        </div>
    );
}
