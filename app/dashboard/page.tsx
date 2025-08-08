"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ImageAnalysis from "@/components/ImageAnalysis";
import DocumentSummary from "@/components/DocumentSummary";

// Placeholder component for the other feature
const ConversationAnalysis = () => (
  <div className="text-white text-center">
    Conversation Analysis UI will go here.
  </div>
);

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const renderFeature = () => {
    switch (selectedFeature) {
      case "imageAnalysis":
        return <ImageAnalysis />;
      case "conversationAnalysis":
        return <ConversationAnalysis />;
      case "documentSummary":
        // Corrected: Now rendering the actual DocumentSummary component
        return <DocumentSummary />;
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">
              Choose a feature to get started:
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setSelectedFeature("imageAnalysis")}
                className="flex-1 py-3 px-6 border border-gray-600 rounded-lg text-white bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Image Analysis
              </button>
              <button
                onClick={() => setSelectedFeature("conversationAnalysis")}
                className="flex-1 py-3 px-6 border border-gray-600 rounded-lg text-white bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Conversation Analysis
              </button>
              <button
                onClick={() => setSelectedFeature("documentSummary")}
                className="flex-1 py-3 px-6 border border-gray-600 rounded-lg text-white bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Document Summary
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-8">
      <div className="w-full max-w-4xl space-y-8 p-8 bg-gray-800 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-white">Playground</h1>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800"
          >
            Sign Out
          </button>
        </div>

        {renderFeature()}
      </div>
    </div>
  );
}