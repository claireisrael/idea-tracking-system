"use client";

import { useState } from "react";
import { getFileView, getFileDownload } from "../lib/storage";

export default function IdeaCard({ idea, onEdit, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      business: "💼",
      tech: "💻",
      creative: "🎨",
      personal: "👤",
      other: "📝",
    };
    return icons[category] || "💡";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    const colors = {
      "in-progress": "bg-orange-100 text-orange-800",
      Completed: "bg-green-100 text-green-800",
      "on-hold": "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-blue-100 text-blue-800";
  };

  const getAttachments = () => {
    try {
      if (!idea.attachments) return [];
      return JSON.parse(idea.attachments);
    } catch (error) {
      console.error("Error parsing attachments:", error);
      return [];
    }
  };

  const handleFileView = (attachment) => {
    if (attachment.fileId) {
      // Open file in new tab for viewing
      const fileUrl = getFileView(attachment.fileId);
      window.open(fileUrl, "_blank");
    }
  };

  const handleFileDownload = (attachment) => {
    if (attachment.fileId) {
      // Enable file download
      const downloadUrl = getFileDownload(attachment.fileId);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = attachment.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes("image")) return "🖼️";
    if (mimeType?.includes("pdf")) return "📄";
    if (mimeType?.includes("word") || mimeType?.includes("document"))
      return "📝";
    if (mimeType?.includes("text")) return "📋";
    return "📎";
  };

  const attachments = getAttachments();

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getCategoryIcon(idea.category)}</span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
              idea.priority
            )}`}
          >
            {idea.priority}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(idea)}
            className="text-gray-400 hover:text-primary-500 transition-colors"
            title="Edit idea"
          >
            ✏️
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Delete idea"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {idea.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3">{idea.description}</p>
      </div>

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2 font-medium">
            📎 Attachments ({attachments.length})
          </div>
          <div className="space-y-2">
            {attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded border"
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <span className="text-sm">
                    {getFileIcon(attachment.mimeType)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">
                      {attachment.fileName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {attachment.fileSize
                        ? `${(attachment.fileSize / 1024 / 1024).toFixed(2)} MB`
                        : "Unknown size"}
                    </p>
                  </div>
                </div>
                {attachment.fileId && !attachment.uploadError && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleFileView(attachment)}
                      className="text-blue-500 hover:text-blue-700 text-xs px-2 py-1"
                      title="View file"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => handleFileDownload(attachment)}
                      className="text-green-500 hover:text-green-700 text-xs px-2 py-1"
                      title="Download file"
                    >
                      ⬇️
                    </button>
                  </div>
                )}
                {attachment.uploadError && (
                  <span
                    className="text-red-500 text-xs"
                    title={attachment.uploadError}
                  >
                    ❌
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {idea.tags && idea.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {idea.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-100">
        <span
          className={`px-2 py-1 rounded-full font-medium ${getStatusColor(
            idea.status
          )}`}
        >
          {idea.status.replace("-", " ")}
        </span>
        <span>{formatDate(idea.$createdAt)}</span>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Idea?
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{idea.title}"? This action cannot
              be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  onDelete(idea.$id);
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
