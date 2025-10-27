"use client";
import { useState, forwardRef, useImperativeHandle } from "react";

const FileUpload = forwardRef(({ onUploadSuccess }, ref) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError("");
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onUploadSuccess(data.url);

      // ✅ Reset local state after upload
      setFile(null);
      setPreview(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Expose resetImage function to parent (ReportForm)
  useImperativeHandle(ref, () => ({
    resetImage: () => {
      setFile(null);
      setPreview(null);
    },
  }));

  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
      {preview && <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-md mb-2" />}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button onClick={handleUpload} disabled={uploading || !file} className={`w-full p-2 text-white rounded-md ${uploading ? "bg-blue-700" : "bg-gray-700 hover:bg-blue-700"}`}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
});

export default FileUpload;
