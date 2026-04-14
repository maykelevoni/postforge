"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import ServiceCard from "@/components/dashboard/services/service-card";
import ServiceForm, { ServiceFormData } from "@/components/dashboard/services/service-form";
import TicketPipeline from "@/components/dashboard/services/ticket-pipeline";
import TicketDrawer from "@/components/dashboard/services/ticket-drawer";
import { Service, Ticket } from "@/components/dashboard/services/types";

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

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#f5f5f5",
  marginBottom: "24px",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
  gap: "20px",
};

const dividerStyle: React.CSSProperties = {
  height: "1px",
  backgroundColor: "#222",
  margin: "48px 0",
};

const filterRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginBottom: "24px",
};

const filterLabelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#888",
};

const selectStyle: React.CSSProperties = {
  padding: "8px 12px",
  fontSize: "13px",
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "4px",
  color: "#f5f5f5",
  cursor: "pointer",
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

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filterServiceId, setFilterServiceId] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [servicesRes, ticketsRes] = await Promise.all([
        fetch("/api/services"),
        fetch("/api/tickets"),
      ]);

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData);
      }

      if (ticketsRes.ok) {
        const ticketsData = await ticketsRes.json();
        setTickets(ticketsData);
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

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleTicketUpdate = (updatedTicket: Ticket) => {
    setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
    if (selectedTicket?.id === updatedTicket.id) {
      setSelectedTicket(updatedTicket);
    }
  };

  const handleDrawerClose = () => {
    setSelectedTicket(null);
  };

  const filteredTickets = filterServiceId === "all"
    ? tickets
    : tickets.filter((t) => t.service.id === filterServiceId);

  if (loading) {
    return <div style={loadingStyle}>Loading...</div>;
  }

  return (
    <div style={pageStyle}>
      {/* Service Catalog Section */}
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
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
                onToggleStatus={handleToggleServiceStatus}
              />
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

      {/* Divider */}
      <div style={dividerStyle} />

      {/* Ticket Pipeline Section */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Client Pipeline</h2>

        <div style={filterRowStyle}>
          <label style={filterLabelStyle}>Filter by service:</label>
          <select
            value={filterServiceId}
            onChange={(e) => setFilterServiceId(e.target.value)}
            style={selectStyle}
          >
            <option value="all">All Services</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <TicketPipeline tickets={filteredTickets} onTicketClick={handleTicketClick} />
      </div>

      {/* Ticket Drawer */}
      {selectedTicket && (
        <TicketDrawer
          ticket={selectedTicket}
          onClose={handleDrawerClose}
          onUpdate={handleTicketUpdate}
        />
      )}
    </div>
  );
}
