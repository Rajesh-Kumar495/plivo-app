// components/DocumentSummary.tsx
"use client";

import { useState, useRef } from "react";

export default function DocumentSummary() {
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTextInput("");
      setSummary("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput && !file) return;

    setIsLoading(true);
    setSummary("");

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else {
      formData.append("text", textInput);
    }

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to summarize content.");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error: unknown) {
      // Corrected: `any` to `unknown`
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setSummary(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-200">
        Document/URL Summarization
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left pane: Input */}
        <div className="w-full md:w-1/2 bg-gray-700 p-6 rounded-lg">
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <h3 className="text-lg font-bold text-gray-200">
              Enter URL or text
            </h3>
            <textarea
              value={textInput}
              onChange={(e) => {
                setTextInput(e.target.value);
                setFile(null);
              }}
              rows={6}
              className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Paste a URL or type/paste text here."
            />
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-700 px-2 text-gray-400">
                  Or upload a PDF file
                </span>
              </div>
            </div>
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-6 border border-gray-600 rounded-lg text-white bg-gray-600 hover:bg-gray-500 transition-colors"
            >
              {file ? file.name : "Select a file"}
            </button>
            <button
              type="submit"
              disabled={isLoading || (!textInput && !file)}
              className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors ${
                isLoading || (!textInput && !file)
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isLoading ? "Summarizing..." : "Summarize Content"}
            </button>
          </form>
        </div>
        {/* Right pane: Output display */}
        <div className="w-full md:w-1/2 bg-gray-700 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-gray-200 mb-2">Summary</h3>
          <div className="h-full max-h-96 overflow-y-auto p-2 bg-gray-800 text-gray-300 rounded-md">
            {summary ? (
              <p>{summary}</p>
            ) : (
              <p>The concise summary will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}