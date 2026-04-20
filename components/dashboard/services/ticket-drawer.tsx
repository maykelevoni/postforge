"use client";

import { useState } from "react";
import { X, Mail, Calendar, Clock, FileText, Package, Send, CreditCard, Copy, Check } from "lucide-react";
import { Ticket } from "./types";

interface TicketDrawerProps {
  ticket: Ticket;
  onClose: () => void;
  onUpdate: (updatedTicket: Ticket) => void;
}

const drawerOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 1000,
};

const drawerStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "480px",
  height: "100vh",
  backgroundColor: "#111",
  borderLeft: "1px solid #222",
  zIndex: 1001,
  overflow: "auto",
  boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.5)",
};

const headerStyle: React.CSSProperties = {
  padding: "24px",
  borderBottom: "1px solid #222",
  position: "sticky",
  top: 0,
  backgroundColor: "#111",
  zIndex: 10,
};

const headerTopStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "16px",
};

const closeButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#888",
  fontSize: "24px",
  cursor: "pointer",
  padding: "4px",
  lineHeight: 1,
  flexShrink: 0,
};

const clientNameStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#f5f5f5",
  marginBottom: "8px",
};

const emailStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "14px",
  color: "#888",
  textDecoration: "none",
  marginBottom: "12px",
};

const emailStyleHover: React.CSSProperties = {
  ...emailStyle,
  color: "#6366f1",
};

const badgesStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginBottom: "12px",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  padding: "4px 10px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: "600",
  textTransform: "uppercase",
};

const nicheBadgeStyle: React.CSSProperties = {
  ...badgeStyle,
  backgroundColor: "#6366f120",
  color: "#6366f1",
};

const sourceBadgeStyle: React.CSSProperties = {
  ...badgeStyle,
  backgroundColor: "#222",
  color: "#888",
};

const infoRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "12px",
  color: "#888",
  marginBottom: "4px",
};

const sectionStyle: React.CSSProperties = {
  padding: "24px",
  borderBottom: "1px solid #222",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#f5f5f5",
  marginBottom: "16px",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  fontSize: "14px",
  backgroundColor: "#1a1a1a",
  border: "1px solid #222",
  borderRadius: "4px",
  color: "#f5f5f5",
  cursor: "pointer",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "100px",
  padding: "12px",
  fontSize: "14px",
  backgroundColor: "#1a1a1a",
  border: "1px solid #222",
  borderRadius: "4px",
  color: "#f5f5f5",
  fontFamily: "inherit",
  resize: "vertical",
};

const buttonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "10px 16px",
  fontSize: "13px",
  fontWeight: "600",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",
  width: "100%",
};

const primaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "#6366f1",
  color: "white",
};

const successButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "#22c55e",
  color: "white",
};

const disabledButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "#222",
  color: "#888",
  cursor: "not-allowed",
};

const previewStyle: React.CSSProperties = {
  padding: "12px",
  backgroundColor: "#0a0a0a",
  border: "1px solid #222",
  borderRadius: "4px",
  fontSize: "13px",
  color: "#f5f5f5",
  lineHeight: "1.6",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  maxHeight: "400px",
  overflow: "auto",
};

const timestampStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "12px",
  color: "#888",
  marginTop: "8px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontSize: "13px",
  fontWeight: "500",
  color: "#888",
};

export default function TicketDrawer({ ticket, onClose, onUpdate }: TicketDrawerProps) {
  const [isHoveringEmail, setIsHoveringEmail] = useState(false);
  const [notes, setNotes] = useState(ticket.notes || "");
  const [quote, setQuote] = useState(ticket.quote || "");
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [isSendingQuote, setIsSendingQuote] = useState(false);
  const [isGeneratingDeliverables, setIsGeneratingDeliverables] = useState(false);
  const [isSendingDelivery, setIsSendingDelivery] = useState(false);
  const [deliverablesPreview, setDeliverablesPreview] = useState<string | null>(null);
  const [isRequestingPayment, setIsRequestingPayment] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updated = await response.json();
        onUpdate(updated);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleNotesBlur = async () => {
    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        const updated = await response.json();
        onUpdate(updated);
      }
    } catch (error) {
      console.error("Failed to save notes:", error);
    }
  };

  const handleQuoteBlur = async () => {
    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quote }),
      });

      if (response.ok) {
        const updated = await response.json();
        onUpdate(updated);
      }
    } catch (error) {
      console.error("Failed to save quote:", error);
    }
  };

  const handleGenerateQuote = async () => {
    setIsGeneratingQuote(true);
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/quote`, {
        method: "POST",
      });

      if (response.ok) {
        const updated = await response.json();
        setQuote(updated.quote);
        onUpdate(updated);
      }
    } catch (error) {
      console.error("Failed to generate quote:", error);
    } finally {
      setIsGeneratingQuote(false);
    }
  };

  const handleSendQuote = async () => {
    setIsSendingQuote(true);
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/send-quote`, {
        method: "POST",
      });

      if (response.ok) {
        const updated = await response.json();
        onUpdate(updated);
      }
    } catch (error) {
      console.error("Failed to send quote:", error);
    } finally {
      setIsSendingQuote(false);
    }
  };

  const handleGenerateDeliverables = async () => {
    setIsGeneratingDeliverables(true);
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/deliver`, {
        method: "POST",
      });

      if (response.ok) {
        const updated = await response.json();
        setDeliverablesPreview(updated.deliverables);
        onUpdate(updated);
      }
    } catch (error) {
      console.error("Failed to generate deliverables:", error);
    } finally {
      setIsGeneratingDeliverables(false);
    }
  };

  const handleSendDelivery = async () => {
    setIsSendingDelivery(true);
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/send-delivery`, {
        method: "POST",
      });

      if (response.ok) {
        const updated = await response.json();
        onUpdate(updated);
      }
    } catch (error) {
      console.error("Failed to send delivery:", error);
    } finally {
      setIsSendingDelivery(false);
    }
  };

  const handleRequestPayment = async () => {
    setIsRequestingPayment(true);
    setCheckoutError(null);
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/checkout`, {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok) {
        setCheckoutUrl(data.checkoutUrl);
        onUpdate({ ...ticket, status: "awaiting_payment", polarCheckoutId: data.checkoutId });
      } else {
        setCheckoutError(data.error || "Failed to create checkout");
      }
    } catch (error) {
      setCheckoutError("Failed to create checkout");
    } finally {
      setIsRequestingPayment(false);
    }
  };

  const handleCopyCheckoutUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const showDeliverablesSection = ["paid", "in_progress", "delivered"].includes(ticket.status);
  const canSendDelivery = ["paid", "in_progress"].includes(ticket.status);

  return (
    <>
      <div style={drawerOverlayStyle} onClick={onClose} />
      <div style={drawerStyle}>
        <div style={headerStyle}>
          <div style={headerTopStyle}>
            <div style={{ flex: 1 }}>
              <h2 style={clientNameStyle}>{ticket.clientName}</h2>
              <a
                href={`mailto:${ticket.clientEmail}`}
                style={isHoveringEmail ? emailStyleHover : emailStyle}
                onMouseEnter={() => setIsHoveringEmail(true)}
                onMouseLeave={() => setIsHoveringEmail(false)}
              >
                <Mail size={14} />
                {ticket.clientEmail}
              </a>
            </div>
            <button onClick={onClose} style={closeButtonStyle}>
              <X size={24} />
            </button>
          </div>

          <div style={badgesStyle}>
            <span style={nicheBadgeStyle}>{ticket.niche}</span>
            {ticket.source && <span style={sourceBadgeStyle}>{ticket.source}</span>}
          </div>

          <div style={infoRowStyle}>
            <Package size={12} />
            <span>{ticket.service.name}</span>
          </div>

          <div style={infoRowStyle}>
            <Calendar size={12} />
            <span>Created {formatDate(ticket.createdAt)}</span>
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Status</h3>
          <select
            value={ticket.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            style={selectStyle}
          >
            <option value="new">New</option>
            <option value="quoted">Quoted</option>
            <option value="awaiting_payment">Awaiting Payment</option>
            <option value="paid">Paid</option>
            <option value="in_progress">In Progress</option>
            <option value="delivered">Delivered</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div style={sectionStyle}>
          <label style={labelStyle}>Internal Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Add internal notes about this ticket..."
            style={textareaStyle}
          />
        </div>

        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Quote / Proposal</h3>

          <button
            onClick={handleGenerateQuote}
            disabled={isGeneratingQuote}
            style={isGeneratingQuote ? disabledButtonStyle : primaryButtonStyle}
          >
            <FileText size={16} />
            {isGeneratingQuote ? "Generating..." : "Generate Quote"}
          </button>

          {quote && (
            <>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                onBlur={handleQuoteBlur}
                style={{ ...textareaStyle, marginTop: "16px", minHeight: "200px" }}
              />
              <button
                onClick={handleSendQuote}
                disabled={isSendingQuote || !quote}
                style={
                  isSendingQuote || !quote
                    ? { ...disabledButtonStyle, marginTop: "12px" }
                    : { ...successButtonStyle, marginTop: "12px" }
                }
              >
                <Send size={16} />
                {isSendingQuote ? "Sending..." : "Send Quote"}
              </button>
            </>
          )}

          {ticket.quoteSentAt && (
            <div style={timestampStyle}>
              <Clock size={12} />
              Sent on {formatDate(ticket.quoteSentAt)}
            </div>
          )}
        </div>

        {ticket.status === "quoted" && (
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Payment</h3>

            <button
              onClick={handleRequestPayment}
              disabled={isRequestingPayment}
              style={isRequestingPayment ? disabledButtonStyle : primaryButtonStyle}
            >
              <CreditCard size={16} />
              {isRequestingPayment ? "Creating checkout..." : "Request Payment"}
            </button>

            {checkoutError && (
              <div style={{ fontSize: "13px", color: "#ef4444", marginTop: "10px" }}>
                {checkoutError.includes("Polar API key not configured") ? (
                  <>Polar API key not configured.{" "}
                    <a href="/settings" style={{ color: "#6366f1", textDecoration: "underline" }}>
                      Add it in Settings
                    </a>
                  </>
                ) : (
                  checkoutError
                )}
              </div>
            )}

            {checkoutUrl && (
              <div style={{ marginTop: "12px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    readOnly
                    value={checkoutUrl}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      fontSize: "12px",
                      backgroundColor: "#0a0a0a",
                      border: "1px solid #222",
                      borderRadius: "4px",
                      color: "#888",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  />
                  <button
                    onClick={() => handleCopyCheckoutUrl(checkoutUrl)}
                    style={{
                      padding: "10px 12px",
                      backgroundColor: copied ? "#22c55e20" : "#222",
                      border: "1px solid #333",
                      borderRadius: "4px",
                      color: copied ? "#22c55e" : "#888",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      flexShrink: 0,
                    }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {(ticket.status === "awaiting_payment" || ticket.status === "paid") && ticket.polarCheckoutId && (
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Payment Link</h3>
            <div style={{ fontSize: "13px", color: "#888", marginBottom: "10px" }}>
              {ticket.status === "awaiting_payment"
                ? "Waiting for client to complete payment."
                : <span style={{ color: "#22c55e" }}>Payment received.</span>
              }
            </div>
            {ticket.amountPaid && (
              <div style={{ fontSize: "13px", color: "#f5f5f5", marginBottom: "8px" }}>
                Amount paid: <strong>${(ticket.amountPaid / 100).toFixed(2)}</strong>
              </div>
            )}
          </div>
        )}

        {showDeliverablesSection && (
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Deliverables</h3>

            <button
              onClick={handleGenerateDeliverables}
              disabled={isGeneratingDeliverables}
              style={isGeneratingDeliverables ? disabledButtonStyle : primaryButtonStyle}
            >
              <Package size={16} />
              {isGeneratingDeliverables ? "Generating..." : "Generate Deliverables"}
            </button>

            {deliverablesPreview && (
              <>
                <div style={{ ...previewStyle, marginTop: "16px" }}>
                  {deliverablesPreview}
                </div>
                <button
                  onClick={handleSendDelivery}
                  disabled={isSendingDelivery || !canSendDelivery}
                  title={!canSendDelivery ? "Client must complete payment first" : undefined}
                  style={
                    isSendingDelivery || !canSendDelivery
                      ? { ...disabledButtonStyle, marginTop: "12px" }
                      : { ...successButtonStyle, marginTop: "12px" }
                  }
                >
                  <Send size={16} />
                  {isSendingDelivery ? "Sending..." : "Send Delivery"}
                </button>
                {!canSendDelivery && (
                  <div style={{ fontSize: "12px", color: "#888", marginTop: "6px", textAlign: "center" }}>
                    Client must complete payment first
                  </div>
                )}
              </>
            )}

            {ticket.deliveredAt && (
              <div style={timestampStyle}>
                <Clock size={12} />
                Delivered on {formatDate(ticket.deliveredAt)}
              </div>
            )}
          </div>
        )}

        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Timeline</h3>
          <div style={infoRowStyle}>
            <Calendar size={12} />
            <span>Created {formatDate(ticket.createdAt)}</span>
          </div>
          {ticket.quoteSentAt && (
            <div style={infoRowStyle}>
              <Clock size={12} />
              <span>Quoted {formatDate(ticket.quoteSentAt)}</span>
            </div>
          )}
          {ticket.deliveredAt && (
            <div style={infoRowStyle}>
              <Clock size={12} />
              <span>Delivered {formatDate(ticket.deliveredAt)}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
