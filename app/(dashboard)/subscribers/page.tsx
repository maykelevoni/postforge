"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Ticket } from "@/components/dashboard/services/types";
import TicketPipeline from "@/components/dashboard/services/ticket-pipeline";
import TicketDrawer from "@/components/dashboard/services/ticket-drawer";

interface Subscriber {
  id: string;
  name: string;
  email: string;
  source: string | null;
  landingPage: { id: string; slug: string } | null;
  service: { id: string; name: string } | null;
  createdAt: string;
}

interface LandingPageOption {
  id: string;
  slug: string;
}

interface ServiceOption {
  id: string;
  name: string;
}

const pageStyle: React.CSSProperties = {
  padding: "24px",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "32px",
};

const titleRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#f5f5f5",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  fontSize: "13px",
  fontWeight: "600",
  borderRadius: "999px",
  backgroundColor: "#1a1a2e",
  color: "#6366f1",
  border: "1px solid #2a2a4e",
};

const exportButtonStyle: React.CSSProperties = {
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

const tabBarStyle: React.CSSProperties = {
  display: "flex",
  gap: "0",
  borderBottom: "1px solid #222",
  marginBottom: "24px",
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

const tableWrapperStyle: React.CSSProperties = {
  overflowX: "auto",
  borderRadius: "8px",
  border: "1px solid #222",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const theadStyle: React.CSSProperties = {
  backgroundColor: "#111",
};

const thStyle: React.CSSProperties = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: "12px",
  fontWeight: "600",
  color: "#888",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: "1px solid #222",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: "14px",
  color: "#f5f5f5",
  borderBottom: "1px solid #1a1a1a",
};

const mutedTdStyle: React.CSSProperties = {
  ...tdStyle,
  color: "#888",
};

const emptyStyle: React.CSSProperties = {
  padding: "60px",
  textAlign: "center",
  color: "#888",
  fontSize: "14px",
};

const loadingStyle: React.CSSProperties = {
  padding: "60px",
  textAlign: "center",
  color: "#888",
};

export default function SubscribersPage() {
  const [activeTab, setActiveTab] = useState<"subscribers" | "clients">("subscribers");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Subscribers state
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [landingPages, setLandingPages] = useState<LandingPageOption[]>([]);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [filterLandingPageId, setFilterLandingPageId] = useState<string>("all");
  const [filterServiceId, setFilterServiceId] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Clients (pipeline) state
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketServices, setTicketServices] = useState<ServiceOption[]>([]);
  const [ticketsLoaded, setTicketsLoaded] = useState(false);
  const [ticketFilterServiceId, setTicketFilterServiceId] = useState<string>("all");

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadSubscribers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterLandingPageId, filterServiceId]);

  const loadFilterOptions = async () => {
    try {
      const [lpRes, svcRes] = await Promise.all([
        fetch("/api/landing-pages"),
        fetch("/api/services"),
      ]);
      if (lpRes.ok) {
        const data = await lpRes.json();
        setLandingPages(Array.isArray(data) ? data : []);
      }
      if (svcRes.ok) {
        const data = await svcRes.json();
        setServices(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load filter options:", err);
    }
  };

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterLandingPageId !== "all") params.set("landingPageId", filterLandingPageId);
      if (filterServiceId !== "all") params.set("serviceId", filterServiceId);
      const query = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`/api/subscribers${query}`);
      if (res.ok) {
        const data = await res.json();
        setSubscribers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load subscribers:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadTickets = async () => {
    try {
      const [ticketsRes, svcRes] = await Promise.all([
        fetch("/api/tickets"),
        fetch("/api/services"),
      ]);
      if (ticketsRes.ok) {
        const data = await ticketsRes.json();
        setTickets(Array.isArray(data) ? data : (data.tickets ?? []));
      }
      if (svcRes.ok) {
        const data = await svcRes.json();
        setTicketServices(Array.isArray(data) ? data : []);
      }
      setTicketsLoaded(true);
    } catch (err) {
      console.error("Failed to load tickets:", err);
    }
  };

  const handleTabChange = (tab: "subscribers" | "clients") => {
    setActiveTab(tab);
    if (tab === "clients" && !ticketsLoaded) {
      loadTickets();
    }
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (filterLandingPageId !== "all") params.set("landingPageId", filterLandingPageId);
    if (filterServiceId !== "all") params.set("serviceId", filterServiceId);
    const query = params.toString() ? `?${params.toString()}` : "";
    const a = document.createElement("a");
    a.href = `/api/subscribers/export${query}`;
    a.download = "subscribers.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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

  const filteredTickets =
    ticketFilterServiceId === "all"
      ? tickets
      : tickets.filter((t) => t.service.id === ticketFilterServiceId);

  const getTabStyle = (tab: "subscribers" | "clients"): React.CSSProperties => ({
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: activeTab === tab ? "600" : "400",
    color: activeTab === tab ? "#fff" : "#888",
    background: "none",
    border: "none",
    borderBottom: activeTab === tab ? "2px solid #6366f1" : "2px solid transparent",
    cursor: "pointer",
    transition: "all 0.15s ease",
    marginBottom: "-1px",
  });

  if (loading && activeTab === "subscribers") {
    return <div style={loadingStyle}>Loading...</div>;
  }

  return (
    <div style={{ ...pageStyle, padding: isMobile ? "16px" : "24px" }}>
      {/* Header */}
      <div style={{ ...headerStyle, flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? "12px" : undefined }}>
        <div style={titleRowStyle}>
          <h1 style={titleStyle}>Subscribers</h1>
          {activeTab === "subscribers" && (
            <span style={badgeStyle}>{subscribers.length}</span>
          )}
        </div>
        {activeTab === "subscribers" && (
          <button
            onClick={handleExportCsv}
            style={{ ...exportButtonStyle, width: isMobile ? "100%" : undefined, justifyContent: isMobile ? "center" : undefined }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#4f46e5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#6366f1"; }}
          >
            <Download size={16} />
            Export CSV
          </button>
        )}
      </div>

      {/* Tab switcher */}
      <div style={tabBarStyle}>
        <button style={getTabStyle("subscribers")} onClick={() => handleTabChange("subscribers")}>
          Subscribers
        </button>
        <button style={getTabStyle("clients")} onClick={() => handleTabChange("clients")}>
          Clients
        </button>
      </div>

      {/* Subscribers tab */}
      {activeTab === "subscribers" && (
        <>
          {/* Filters */}
          <div style={{ ...filterRowStyle, flexWrap: "wrap", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center" }}>
            <label style={filterLabelStyle}>Landing Page:</label>
            <select
              value={filterLandingPageId}
              onChange={(e) => setFilterLandingPageId(e.target.value)}
              style={{ ...selectStyle, width: isMobile ? "100%" : undefined }}
            >
              <option value="all">All</option>
              {landingPages.map((lp) => (
                <option key={lp.id} value={lp.id}>{lp.slug}</option>
              ))}
            </select>

            <label style={filterLabelStyle}>Service:</label>
            <select
              value={filterServiceId}
              onChange={(e) => setFilterServiceId(e.target.value)}
              style={{ ...selectStyle, width: isMobile ? "100%" : undefined }}
            >
              <option value="all">All</option>
              {services.map((svc) => (
                <option key={svc.id} value={svc.id}>{svc.name}</option>
              ))}
            </select>
          </div>

          {/* Table or empty state */}
          {subscribers.length === 0 ? (
            <div style={emptyStyle}>
              No subscribers yet. Share your landing page to start capturing leads.
            </div>
          ) : (
            <div style={tableWrapperStyle}>
              <table style={tableStyle}>
                <thead style={theadStyle}>
                  <tr>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Source</th>
                    <th style={thStyle}>Landing Page</th>
                    <th style={thStyle}>Service</th>
                    <th style={thStyle}>Date Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr key={sub.id}>
                      <td style={tdStyle}>{sub.name}</td>
                      <td style={tdStyle}>{sub.email}</td>
                      <td style={mutedTdStyle}>{sub.source ?? "—"}</td>
                      <td style={mutedTdStyle}>{sub.landingPage?.slug ?? "—"}</td>
                      <td style={mutedTdStyle}>{sub.service?.name ?? "—"}</td>
                      <td style={mutedTdStyle}>
                        {new Date(sub.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Clients tab */}
      {activeTab === "clients" && (
        <>
          {!ticketsLoaded ? (
            <div style={loadingStyle}>Loading clients...</div>
          ) : (
            <>
              {/* Service filter */}
              <div style={{ ...filterRowStyle, flexWrap: "wrap", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center" }}>
                <label style={filterLabelStyle}>Filter by service:</label>
                <select
                  value={ticketFilterServiceId}
                  onChange={(e) => setTicketFilterServiceId(e.target.value)}
                  style={{ ...selectStyle, width: isMobile ? "100%" : undefined }}
                >
                  <option value="all">All Services</option>
                  {ticketServices.map((svc) => (
                    <option key={svc.id} value={svc.id}>{svc.name}</option>
                  ))}
                </select>
              </div>

              <TicketPipeline tickets={filteredTickets} onTicketClick={handleTicketClick} />

              {selectedTicket && (
                <TicketDrawer
                  ticket={selectedTicket}
                  onClose={handleDrawerClose}
                  onUpdate={handleTicketUpdate}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
