import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import ReportCard from "../../components/dashboard/admin/ReportCard";
import ReportForm from "../../components/dashboard/admin/ReportForm";
import AutoGenerateSummary from "../../components/dashboard/admin/AutoGenerateSummary";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  const [showAutoModal, setShowAutoModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get("/match-summary");
      const data = res?.data ?? res;
      // Expecting an array of summaries
      setReports(Array.isArray(data) ? data : data.summaries ?? []);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (data) => {
    try {
      setLoading(true);
      await api.post("/match-summary", data);
      setShowCreateModal(false);
      await fetchReports();
    } catch (err) {
      console.error("Create report error:", err);
      setLoading(false);
    }
  };

  const updateReport = async (matchId, data) => {
    try {
      setLoading(true);
      // Note: your update controller updates by matchId (not summary _id)
      await api.put(`/match-summary/${matchId}`, data);
      setShowEditModal(false);
      setEditingReport(null);
      await fetchReports();
    } catch (err) {
      console.error("Update error:", err);
      setLoading(false);
    }
  };

  const deleteReport = async (summaryId) => {
    if (!window.confirm("Delete this report? This cannot be undone.")) return;
    try {
      setLoading(true);
      // Backend: I didn't see a DELETE route in your provided routes.
      // If you already have one, this will work. Otherwise add a DELETE /match-summary/:id route.
      await api.delete(`/match-summary/${summaryId}`);
      await fetchReports();
    } catch (err) {
      console.error("Delete error:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* BACK TO DASHBOARD */}
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-300"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
      </Link>

      {/* PAGE HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Reports
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => setShowAutoModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
          >
            <Plus className="w-4 h-4" /> Auto Generate Summary
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
          >
            <Plus className="w-4 h-4" /> Create Report
          </button>
        </div>
      </div>

      {/* REPORTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.length === 0 && (
          <p className="col-span-full text-gray-500 dark:text-gray-300 text-center py-10">
            No reports available.
          </p>
        )}

        {reports.map((report) => (
          <ReportCard
            key={report._id}
            report={report}
            onEdit={() => {
              setEditingReport(report);
              setShowEditModal(true);
            }}
            onDelete={() => deleteReport(report._id)}
          />
        ))}
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <ReportForm
          title="Create Report"
          onCancel={() => setShowCreateModal(false)}
          onSubmit={createReport}
          initialData={null}
        />
      )}

      {/* EDIT MODAL */}
      {showEditModal && editingReport && (
        <ReportForm
          title="Edit Report"
          onCancel={() => {
            setShowEditModal(false);
            setEditingReport(null);
          }}
          // NOTE: updateReport expects a matchId (your controller updates by matchId). If your summary doc id is needed, adapt backend.
          onSubmit={(payload) => updateReport(editingReport.matchId || editingReport.match?._id || editingReport._id, payload)}
          initialData={editingReport}
        />
      )}

      {/* AUTO GENERATE MODAL */}
      {showAutoModal && (
        <AutoGenerateSummary
          onClose={() => setShowAutoModal(false)}
          onCreated={() => {
            setShowAutoModal(false);
            fetchReports();
          }}
        />
      )}
    </div>
  );
}
