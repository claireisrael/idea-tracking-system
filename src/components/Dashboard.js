"use client";

import { useState, useEffect } from "react";
import IdeaForm from "./IdeaForm";
import IdeaCard from "./IdeaCard";
import {
  createIdea,
  getIdeas,
  updateIdea,
  deleteIdea,
  searchIdeas,
  getIdeasByStatus,
  getIdeasStats,
} from "../lib/ideas";

export default function Dashboard({ user, onLogout }) {
  // Testing on how to version branch idea-categories by adding idea categories feature for Work, Personal and Business
  const [showForm, setShowForm] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [stats, setStats] = useState({});
  const [editingIdea, setEditingIdea] = useState(null);

  // Get ideas when the component loads
  useEffect(() => {
    loadIdeas();
    loadStats();
  }, [user]);

  // Update the filtered list when ideas or filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      filterIdeas();
    }, 300); // Debounce search by 300ms
    //filter by date range, just added this feature and I am testing branch improve-filter
    return () => clearTimeout(timeoutId);
  }, [ideas, searchTerm, statusFilter, dateRange]);

  // Fetch all ideas from the database
  const loadIdeas = async () => {
    try {
      setLoading(true);
      const userIdeas = await getIdeas();
      setIdeas(userIdeas);
      console.log("Loaded ideas:", userIdeas);
    } catch (error) {
      console.error("Error loading ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get dashboard statistics
  const loadStats = async () => {
    try {
      const statistics = await getIdeasStats();
      setStats(statistics);
      console.log("Loaded stats:", statistics);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  // Filter the ideas based on search and status using Appwrite functions
  const filterIdeas = async () => {
    try {
      let filtered = [];

      // If we have a search term, use the searchIdeas function
      if (searchTerm) {
        filtered = await searchIdeas(searchTerm);
      } else if (statusFilter !== "all") {
        // If we have a status filter, use getIdeasByStatus function
        filtered = await getIdeasByStatus(statusFilter);
      } else {
        // Otherwise, use all ideas
        filtered = ideas;
      }

      // If we have both search and status filter, apply status filter to search results
      if (searchTerm && statusFilter !== "all") {
        filtered = filtered.filter((idea) => idea.status === statusFilter);
      }

      // Apply date range filter
      if (dateRange !== "all") {
        const now = new Date();
        const filterDate = new Date();

        switch (dateRange) {
          case "today":
            filterDate.setHours(0, 0, 0, 0);
            break;
          case "week":
            filterDate.setDate(now.getDate() - 7);
            break;
          case "month":
            filterDate.setMonth(now.getMonth() - 1);
            break;
          case "year":
            filterDate.setFullYear(now.getFullYear() - 1);
            break;
        }

        filtered = filtered.filter((idea) => {
          const ideaDate = new Date(idea.createdAt);
          return ideaDate >= filterDate;
        });
      }

      setFilteredIdeas(filtered);
    } catch (error) {
      console.error("Error filtering ideas:", error);
      // Fallback to local filtering if API calls fail
      let filtered = ideas;
      if (searchTerm) {
        filtered = filtered.filter(
          (idea) =>
            idea.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            idea.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (statusFilter !== "all") {
        filtered = filtered.filter((idea) => idea.status === statusFilter);
      }
      setFilteredIdeas(filtered);
    }
  };

  const handleCreateIdea = async (ideaData) => {
    try {
      setLoading(true);
      const newIdea = await createIdea(ideaData, user.$id);
      setIdeas([newIdea, ...ideas]);
      setShowForm(false);
      loadStats(); // Refresh stats
      console.log("Idea created:", newIdea);
    } catch (error) {
      console.error("Error creating idea:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleEditIdea = async (ideaData) => {
    try {
      setLoading(true);
      const updatedIdea = await updateIdea(editingIdea.$id, ideaData);
      setIdeas(
        ideas.map((idea) => (idea.$id === editingIdea.$id ? updatedIdea : idea))
      );
      setEditingIdea(null);
      setShowForm(false);
      loadStats(); // Refresh stats
      console.log("Idea updated:", updatedIdea);
    } catch (error) {
      console.error("Error updating idea:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIdea = async (ideaId) => {
    try {
      setLoading(true);
      await deleteIdea(ideaId);
      setIdeas(ideas.filter((idea) => idea.$id !== ideaId));
      loadStats(); // Refresh stats
      console.log("Idea deleted:", ideaId);
    } catch (error) {
      console.error("Error deleting idea:", error);
    } finally {
      setLoading(false);
    }
  };

  // Clear all filters and search
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateRange("all");
  };

  // Get search results count
  const getSearchResultsCount = () => {
    if (searchTerm || statusFilter !== "all") {
      return filteredIdeas.length;
    }
    return ideas.length;
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Beautiful Header */}
      <header className="bg-white/90 backdrop-blur-lg shadow-xl border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-75"></div>
                <div className="relative p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-xl">
                  <span className="text-3xl animate-pulse">💡</span>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                  Idea Tracker
                </h1>
                <p className="text-gray-600 text-lg font-medium">
                  Welcome back,{" "}
                  <span className="font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                    {user?.name || user?.email}
                  </span>
                  ! 👋
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <span className="mr-2"></span>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats["in-progress"] || 0}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">🚧</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.Completed || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On Hold</p>
                <p className="text-3xl font-bold text-gray-600">
                  {stats["on-hold"] || 0}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <span className="text-2xl">⏸️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search ideas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="in-progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">📅 Today</option>
                <option value="week">📅 This Week</option>
                <option value="month">📅 This Month</option>
                <option value="year">📅 This Year</option>
              </select>

              {/* Clear filters button - only show when filters are active */}
              {(searchTerm ||
                statusFilter !== "all" ||
                dateRange !== "all") && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200"
                >
                  <span className="text-lg mr-2">🗑️</span>
                  Clear
                </button>
              )}

              <button
                onClick={() => {
                  setEditingIdea(null);
                  setShowForm(true);
                }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <span className="text-lg mr-2">✨</span>
                New Idea
              </button>
            </div>
          </div>
        </div>

        {/* Search Results Info */}
        {(searchTerm || statusFilter !== "all") && (
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔍</span>
                <span className="text-gray-700 font-medium">
                  {getSearchResultsCount()} idea
                  {getSearchResultsCount() !== 1 ? "s" : ""} found
                  {searchTerm && ` for "${searchTerm}"`}
                  {statusFilter !== "all" && ` with status "${statusFilter}"`}
                </span>
              </div>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* Ideas Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-gray-600">Loading ideas...</span>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-12 text-center">
            <div className="text-8xl mb-8 animate-bounce">💭</div>
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              {ideas.length === 0
                ? "Your idea vault is empty"
                : "No ideas match your filters"}
            </h3>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              {ideas.length === 0
                ? "Every great innovation starts with a single idea. What's yours?"
                : "Try adjusting your search or filters to find what you're looking for."}
            </p>
            <button
              onClick={() => {
                setEditingIdea(null);
                setShowForm(true);
              }}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <span className="text-xl mr-3">🚀</span>
              Create Your First Idea
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => (
              <IdeaCard
                key={idea.$id}
                idea={idea}
                onEdit={(idea) => {
                  setEditingIdea(idea);
                  setShowForm(true);
                }}
                onDelete={handleDeleteIdea}
              />
            ))}
          </div>
        )}
      </main>

      {/* Idea Form Modal */}
      {showForm && (
        <IdeaForm
          idea={editingIdea}
          onSubmit={editingIdea ? handleEditIdea : handleCreateIdea}
          onCancel={() => {
            setShowForm(false);
            setEditingIdea(null);
          }}
          categories={["business", "tech", "creative", "personal", "other"]}
          loading={loading}
        />
      )}
    </div>
  );
}
