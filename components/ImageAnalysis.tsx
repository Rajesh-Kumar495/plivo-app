// components/ImageAnalysis.tsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function ImageAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setDescription("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setDescription("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/image-analysis", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image.");
      }

      const data = await response.json();
      setDescription(data.description);
    } catch (error: unknown) {
      // Corrected: `any` to `unknown`
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setDescription(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-200">Image Analysis</h2>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left pane: File upload and preview */}
        <div className="w-full md:w-1/2 bg-gray-700 p-6 rounded-lg flex flex-col items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-6 border border-gray-600 rounded-lg text-white bg-gray-600 hover:bg-gray-500 transition-colors"
            >
              {file ? file.name : "Select an image"}
            </button>
            {previewUrl && (
              <div className="mt-4 w-full h-64 relative rounded-md overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Image preview"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            )}
            <button
              type="submit"
              disabled={!file || isLoading}
              className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors ${
                !file || isLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isLoading ? "Analyzing..." : "Analyze Image"}
            </button>
          </form>
        </div>
        {/* Right pane: Output display */}
        <div className="w-full md:w-1/2 bg-gray-700 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-gray-200 mb-2">Description</h3>
          <div className="h-64 overflow-y-auto p-2 bg-gray-800 text-gray-300 rounded-md">
            {description ? (
              <p>{description}</p>
            ) : (
              <p>The image description will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
