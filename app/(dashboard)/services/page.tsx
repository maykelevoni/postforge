"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, ExternalLink, Trash2, Globe } from "lucide-react";
import ServiceCard from "@/components/dashboard/services/service-card";
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

const sectionStyle: React.CSSProperties = {
  marginBottom: "48px",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
  gap: "20px",
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

const landingPageRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "8px",
  padding: "8px 12px",
  backgroundColor: "#0a0a0a",
  border: "1px solid #1a1a1a",
  borderRadius: "6px",
  minHeight: "38px",
};

const generateLandingPageButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  background: "none",
  border: "none",
  color: "#6366f1",
  fontSize: "13px",
  fontWeight: "500",
  cursor: "pointer",
  padding: "2px 0",
};

const landingPageLinkStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  color: "#6366f1",
  fontSize: "12px",
  textDecoration: "none",
  flex: 1,
  overflow: "hidden",
};

const editLandingPageButtonStyle: React.CSSProperties = {
  padding: "4px 10px",
  fontSize: "12px",
  fontWeight: "500",
  borderRadius: "4px",
  border: "1px solid #333",
  backgroundColor: "transparent",
  color: "#999",
  cursor: "pointer",
  flexShrink: 0,
};

const deleteLandingPageButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "4px 8px",
  fontSize: "12px",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "#ef444415",
  color: "#ef4444",
  cursor: "pointer",
  flexShrink: 0,
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
      <div style={sectionStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Services</h1>
            <p style={subtitleStyle}>Manage your service offerings</p>
          </div>
          <button
            onClick={handleAddService}
            style={addButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#4f46e5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#6366f1";
            }}
          >
            <Plus size={18} />
            Add Service
          </button>
        </div>

        {services.length === 0 ? (
          <div style={emptyStyle}>
            No services yet. Create your first service to get started.
          </div>
        ) : (
          <div style={gridStyle}>
            {services.map((service) => (
              <div key={service.id}>
                <ServiceCard
                  service={service}
                  onEdit={handleEditService}
                  onDelete={handleDeleteService}
                  onToggleStatus={handleToggleServiceStatus}
                />
                {/* Landing page row */}
                <div style={landingPageRowStyle}>
                  {service.ownedLandingPage ? (
                    <>
                      <a
                        href={`/l/${service.ownedLandingPage.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={landingPageLinkStyle}
                      >
                        <Globe size={13} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          /l/{service.ownedLandingPage.slug}
                        </span>
                        <ExternalLink size={12} style={{ flexShrink: 0, opacity: 0.6 }} />
                      </a>
                      <button
                        style={editLandingPageButtonStyle}
                        onClick={() => handleOpenLandingPageModal(service)}
                      >
                        Edit
                      </button>
                      <button
                        style={deleteLandingPageButtonStyle}
                        onClick={() => handleDeleteLandingPage(service.ownedLandingPage!.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </>
                  ) : (
                    <button
                      style={generateLandingPageButtonStyle}
                      onClick={() => handleOpenLandingPageModal(service)}
                    >
                      <Globe size={14} />
                      Generate Landing Page
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
