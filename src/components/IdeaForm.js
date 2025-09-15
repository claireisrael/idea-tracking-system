"use client";

import { useState, useEffect } from "react";
import { uploadFile } from "../lib/storage";

export default function IdeaForm({ idea, onSubmit, onCancel, categories }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "in-progress",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (idea) {
      setFormData({
        title: idea.title || "",
        description: idea.description || "",
        status: idea.status || "in-progress",
        tags: idea.tags || "",
      });
    }
  }, [idea]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);

    try {
      let attachmentUrls = [];

      // Upload files to the Appwrite storage
      if (selectedFiles.length > 0) {
        console.log("📁 Files selected:", selectedFiles.length);

        // Upload each file uploaded to Appwrite storage
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          console.log(
            `📤 Uploading file ${i + 1}/${selectedFiles.length}: ${file.name}`
          );

          try {
            const uploadedFile = await uploadFile(file, (progress) => {
              // Update progress for current file
              const fileProgress =
                (i / selectedFiles.length +
                  progress.percentage / selectedFiles.length / 100) *
                100;
              setUploadProgress(Math.round(fileProgress));
            });

            // Store file info with actual storage URL
            attachmentUrls.push({
              fileId: uploadedFile.$id,
              fileName: file.name,
              fileSize: file.size,
              mimeType: file.type,
              uploadedAt: new Date().toISOString(),
            });

            console.log(`✅ File uploaded successfully: ${file.name}`);
          } catch (uploadError) {
            console.error(`❌ Failed to upload ${file.name}:`, uploadError);
            // Continue with other files, but add error info
            attachmentUrls.push({
              fileName: file.name,
              fileSize: file.size,
              mimeType: file.type,
              uploadError: uploadError.message,
              uploadedAt: new Date().toISOString(),
            });
          }
        }

        setUploadProgress(100);
        console.log("📋 File uploads completed:", attachmentUrls);
      }

      const ideaData = {
        ...formData,
        attachments: JSON.stringify(attachmentUrls), // Store file info with storage URLs
      };

      await onSubmit(ideaData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {idea ? "Edit Idea" : "Add New Idea"}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your brilliant idea title..."
                required
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="input-field resize-none"
                placeholder="Describe your idea briefly (max 100 chars)..."
                required
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/100 characters
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="in-progress">🚧 In Progress</option>
                <option value="Completed">✅ Completed</option>
                <option value="on-hold">⏸️ On Hold</option>
              </select>
            </div>

            {/* File Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                attachments
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg
                    className="w-8 h-8 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">
                    Click to upload documents or drag and drop
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB each)
                  </span>
                </label>
              </div>

              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Selected Files:
                  </p>
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-gray-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="text-sm text-gray-700">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-700 mb-1">
                    <span>Uploading files...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={
                  loading ||
                  !formData.title.trim() ||
                  !formData.description.trim()
                }
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {idea ? "Updating..." : "Creating..."}
                  </div>
                ) : idea ? (
                  "✏️ Update Idea"
                ) : (
                  "✨ Create Idea"
                )}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
