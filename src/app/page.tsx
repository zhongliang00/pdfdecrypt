"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { decryptPdf } from "../lib/decryptPdf";
import { useWorker } from "../lib/useWorker";

export default function Home() {
  const { start, status, results } = useWorker(decryptPdf);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const baseName = file.name.replace(/\.pdf$/i, "");
      const outName = baseName + "_decrypted.pdf";
      start({
        args: [file],
        onSuccess: (blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = outName;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 100);
        },
      });
    },
    [start]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-900 dark:via-black dark:to-gray-800 transition-colors">
      <div className="w-full max-w-md flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center drop-shadow-sm">
          PDF Decrypt
        </h1>
        <ul className="text-gray-600 dark:text-gray-300 mb-4 list-disc list-inside space-y-2 self-start">
          <li>Remove passwords from your PDF files instantly</li>
          <li>Drag & drop your locked PDF below</li>
          <li>Your files never leave your device</li>
        </ul>
      </div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-indigo-400 dark:border-indigo-600 rounded-xl p-12 flex flex-col items-center justify-center bg-white/80 dark:bg-black/40 shadow-lg transition-colors w-full max-w-md h-64 cursor-pointer hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/40"
      >
        <input {...getInputProps()} />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-indigo-400 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        {isDragActive ? (
          <p className="text-lg text-indigo-700 dark:text-indigo-200 font-semibold text-center">
            Drop the PDF here ...
          </p>
        ) : (
          <p className="text-lg text-gray-700 dark:text-gray-200 text-center">
            Drag & drop a PDF file here, or click to select
          </p>
        )}
        {status === "pending" && (
          <p className="mt-4 text-blue-600 animate-pulse">Decrypting...</p>
        )}
        {results.length > 0 && results[0].status === "error" && (
          <p className="mt-4 text-red-600">{results[0].reason}</p>
        )}
      </div>
      <footer className="mt-10 text-xs text-gray-500 dark:text-gray-400 text-center">
        <span>Made with <span className="text-pink-400">♥</span> for privacy. No files are uploaded.</span>
      </footer>
    </div>
  );
}
