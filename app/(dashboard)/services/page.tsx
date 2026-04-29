"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, ExternalLink, Trash2, Globe, Briefcase } from "lucide-react";
import ServiceForm, { ServiceFormData } from "@/components/dashboard/services/service-form";
import LandingPageModal from "@/components/dashboard/services/landing-page-modal";
import LandingPagesTab from "@/components/dashboard/services/landing-pages-tab";
import { Service } from "@/components/dashboard/services/types";

const pageStyle: React.CSSProperties = {
  padding: "24px",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "32px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#f5f5f5",
  marginBottom: "8px",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#888",
};

const addButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 20px",
  fontSize: "14px",
  fontWeight: "600",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#6366f1",
  color: "white",
  cursor: "pointer",
  transition: "all 0.2s ease",
};


const loadingStyle: React.CSSProperties = {
  padding: "60px",
  textAlign: "center",
  color: "#888",
};

const emptyStyle: React.CSSProperties = {
  padding: "60px",
  textAlign: "center",
  color: "#888",
};


const tabBarStyle: React.CSSProperties = {
  display: "flex",
  borderBottom: "1px solid #222",
  marginBottom: "24px",
};

const getTabStyle = (active: boolean): React.CSSProperties => ({
  padding: "10px 20px",
  fontSize: "14px",
  fontWeight: active ? "600" : "400",
  color: active ? "#f5f5f5" : "#888",
  background: "none",
  border: "none",
  borderBottom: active ? "2px solid #6366f1" : "2px solid transparent",
  cursor: "pointer",
  transition: "all 0.15s ease",
  marginBottom: "-1px",
});

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"services" | "pages">(
    tabParam === "pages" ? "pages" : "services"
  );
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [landingPageService, setLandingPageService] = useState<Service | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleEditService = (id: string) => {
    const service = services.find((s) => s.id === id);
    if (service) {
      setEditingService(service);
      setShowForm(true);
    }
  };

  const handleSaveService = async (data: ServiceFormData) => {
    try {
      const isEdit = !!editingService;
      const url = isEdit ? `/api/services/${editingService.id}` : "/api/services";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingService(null);
        await loadData();
      }
    } catch (error) {
      console.error("Failed to save service:", error);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service? All associated tickets will also be deleted.")) {
      return;
    }

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };

  const handleToggleServiceStatus = async (id: string) => {
    try {
      const service = services.find((s) => s.id === id);
      if (!service) return;

      const response = await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: service.status === "active" ? "paused" : "active" }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Failed to toggle service status:", error);
    }
  };

  const handleOpenLandingPageModal = (service: Service) => {
    setLandingPageService(service);
  };

  const handleLandingPageModalClose = () => {
    setLandingPageService(null);
  };

  const handleLandingPageCreatedOrUpdated = async () => {
    setLandingPageService(null);
    await loadData();
  };

  const handleLandingPageDeleted = async () => {
    setLandingPageService(null);
    await loadData();
  };

  const handleDeleteLandingPage = async (landingPageId: string) => {
    if (!confirm("Delete this landing page? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/landing-pages/${landingPageId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Failed to delete landing page:", error);
    }
  };

  if (loading && activeTab === "services") {
    return <div style={loadingStyle}>Loading...</div>;
  }

  return (
    <div style={pageStyle}>
      <div style={tabBarStyle}>
        <button style={getTabStyle(activeTab === "services")} onClick={() => setActiveTab("services")}>
          Services
        </button>
        <button style={getTabStyle(activeTab === "pages")} onClick={() => setActiveTab("pages")}>
          Pages
        </button>
      </div>

      {activeTab === "pages" && <LandingPagesTab />}

      {activeTab === "services" && (
        <>
      <div>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Services</h1>
            <p style={subtitleStyle}>Manage your service offerings</p>
          </div>
          <button
            onClick={handleAddService}
            style={addButtonStyle}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#4f46e5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#6366f1"; }}
          >
            <Plus size={18} />
            Add Service
          </button>
        </div>

        <div style={{ border: "1px solid #222", borderRadius: "8px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "22%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "18%" }} />
            </colgroup>
            <thead>
              <tr style={{ backgroundColor: "#111", position: "sticky", top: 0, zIndex: 1 }}>
                {["Name", "Type", "Price", "Status", "Tickets", "Landing Page", "Actions"].map((label) => (
                  <th key={label} style={{
                    padding: "10px 12px",
                    textAlign: "left",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#666",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid #222",
                    whiteSpace: "nowrap",
                  }}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "48px", textAlign: "center", color: "#555", fontSize: "13px" }}>
                    No services yet. Click Add Service to get started.
                  </td>
                </tr>
              ) : services.map((service) => {
                const isActive = service.status === "active";
                const lp = service.ownedLandingPage;
                return (
                  <tr
                    key={service.id}
                    style={{ borderBottom: "1px solid #1a1a1a" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#161616")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Name */}
                    <td style={{ padding: "12px 12px" }}>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "#f5f5f5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {service.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "#555", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {service.turnaroundDays}d turnaround
                      </div>
                    </td>

                    {/* Type */}
                    <td style={{ padding: "12px 12px" }}>
                      <span style={{
                        fontSize: "10px", fontWeight: "700", padding: "2px 7px", borderRadius: "4px",
                        backgroundColor: "#6366f120", color: "#6366f1", textTransform: "capitalize",
                      }}>
                        {service.type.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* Price */}
                    <td style={{ padding: "12px 12px", fontSize: "12px", color: "#888", whiteSpace: "nowrap" }}>
                      ${service.priceMin}–${service.priceMax}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "12px 12px" }}>
                      <span style={{
                        fontSize: "10px", fontWeight: "700", padding: "2px 7px", borderRadius: "4px",
                        backgroundColor: isActive ? "#22c55e20" : "#6b728020",
                        color: isActive ? "#22c55e" : "#6b7280",
                      }}>
                        {isActive ? "Active" : "Paused"}
                      </span>
                    </td>

                    {/* Tickets */}
                    <td style={{ padding: "12px 12px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#888" }}>
                        <Briefcase size={12} />
                        {service._count?.tickets ?? 0}
                      </span>
                    </td>

                    {/* Landing Page */}
                    <td style={{ padding: "12px 12px", overflow: "hidden" }}>
                      {lp ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <a
                            href={`/l/${lp.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#6366f1", textDecoration: "none", overflow: "hidden" }}
                          >
                            <Globe size={11} style={{ flexShrink: 0 }} />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>/l/{lp.slug}</span>
                            <ExternalLink size={11} style={{ flexShrink: 0, opacity: 0.6 }} />
                          </a>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenLandingPageModal(service)}
                          style={{ fontSize: "11px", color: "#6366f1", background: "none", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", gap: "4px" }}
                        >
                          <Globe size={11} />
                          Generate
                        </button>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "12px 12px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => handleEditService(service.id)}
                          style={{ padding: "4px 10px", fontSize: "11px", fontWeight: "600", borderRadius: "4px", border: "1px solid #333", backgroundColor: "transparent", color: "#aaa", cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        {lp && (
                          <button
                            onClick={() => handleOpenLandingPageModal(service)}
                            style={{ padding: "4px 10px", fontSize: "11px", fontWeight: "600", borderRadius: "4px", border: "1px solid #333", backgroundColor: "transparent", color: "#aaa", cursor: "pointer" }}
                          >
                            Edit Page
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleServiceStatus(service.id)}
                          style={{ padding: "4px 10px", fontSize: "11px", fontWeight: "600", borderRadius: "4px", border: "1px solid #6366f130", backgroundColor: "#6366f115", color: "#6366f1", cursor: "pointer" }}
                        >
                          {isActive ? "Pause" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          style={{ padding: "4px 8px", fontSize: "11px", borderRadius: "4px", border: "none", backgroundColor: "#ef444415", color: "#ef4444", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Form Modal */}
      {showForm && (
        <ServiceForm
          service={editingService}
          onSave={handleSaveService}
          onCancel={() => {
            setShowForm(false);
            setEditingService(null);
          }}
        />
      )}

      {/* Landing Page Modal */}
      {landingPageService && (
        <LandingPageModal
          serviceId={landingPageService.id}
          serviceName={landingPageService.name}
          existingPage={landingPageService.ownedLandingPage}
          onClose={handleLandingPageModalClose}
          onCreated={handleLandingPageCreatedOrUpdated}
          onDeleted={handleLandingPageDeleted}
        />
      )}
        </>
      )}
    </div>
  );
}
