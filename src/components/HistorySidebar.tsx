"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X, Download, Trash2 } from "lucide-react";

interface HistoryEntry {
  id: string;
  content: string;
  updated_at: string;
}

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEntry: (id: string, content: string) => void;
  isLight: boolean;
  session: any;
}

export default function HistorySidebar({
  isOpen,
  onClose,
  onSelectEntry,
  isLight,
  session,
}: HistorySidebarProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const colors = isLight
    ? {
        bg: "rgba(250, 250, 250, 0.97)",
        text: "#111111",
        muted: "rgba(0, 0, 0, 0.35)",
        border: "rgba(0, 0, 0, 0.08)",
        hoverBg: "rgba(0, 0, 0, 0.04)",
      }
    : {
        bg: "rgba(8, 8, 8, 0.95)",
        text: "#ffffff",
        muted: "rgba(255, 255, 255, 0.35)",
        border: "rgba(255, 255, 255, 0.08)",
        hoverBg: "rgba(255, 255, 255, 0.04)",
      };

  // Trigger animation after mount
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !session?.user) return;

    async function fetchEntries() {
      setLoading(true);
      const { data, error } = await supabase
        .from("entries")
        .select("id, content, updated_at")
        .eq("user_id", session.user.id)
        .order("updated_at", { ascending: false })
        .limit(50);

      if (!error && data) {
        setEntries(data as HistoryEntry[]);
      }
      setLoading(false);
    }

    fetchEntries();
  }, [isOpen, session]);

  function handleDownload(entry: HistoryEntry) {
    const snippet =
      entry.content.trim().split("\n")[0].substring(0, 30) || "entry";
    const date = new Date(entry.updated_at).toISOString().split("T")[0];
    const filename = `${date}_${snippet.replace(/[^a-z0-9]/gi, "_")}.txt`;

    const blob = new Blob([entry.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDelete(id: string) {
    await supabase
      .from("entries")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: 300,
        backgroundColor: colors.bg,
        borderLeft: `1px solid ${colors.border}`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        zIndex: 50,
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        boxShadow: "-20px 0 40px -8px rgba(0, 0, 0, 0.4)",
        color: colors.text,
        // Slide-in animation
        transform: mounted ? "translateX(0)" : "translateX(100%)",
        opacity: mounted ? 1 : 0,
        transition:
          "transform 280ms cubic-bezier(0.32, 0, 0.08, 1), opacity 200ms ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: colors.muted,
          }}
        >
          History
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: colors.muted,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
            opacity: 0.7,
            transition: "opacity 150ms ease",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.opacity = "0.7")
          }
        >
          <X size={14} />
        </button>
      </div>

      {/* List */}
      <div
        style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}
        className="[&::-webkit-scrollbar]:hidden"
      >
        {loading ? (
          <div
            style={{ padding: "12px 20px", fontSize: 12, color: colors.muted }}
          >
            Loading...
          </div>
        ) : entries.length === 0 ? (
          <div
            style={{ padding: "12px 20px", fontSize: 12, color: colors.muted }}
          >
            No past entries.
          </div>
        ) : (
          entries.map((entry) => {
            const snippet =
              entry.content.trim().split("\n")[0].substring(0, 42) ||
              "Empty entry";
            const date = new Date(entry.updated_at).toLocaleDateString([], {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={entry.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: `1px solid ${colors.border}`,
                  transition: "background-color 150ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor =
                    colors.hoverBg;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor =
                    "transparent";
                }}
              >
                {/* Entry text — takes remaining space */}
                <button
                  onClick={() => {
                    onSelectEntry(entry.id, entry.content);
                    onClose();
                  }}
                  style={{
                    flex: 1,
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    padding: "10px 12px 10px 20px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      color: colors.text,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "100%",
                    }}
                  >
                    {snippet}
                  </div>
                  <div style={{ fontSize: 10, color: colors.muted }}>
                    {date}
                  </div>
                </button>

                {/* Download button */}
                <button
                  onClick={() => handleDownload(entry)}
                  title="Download as .txt"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: colors.muted,
                    padding: "10px 16px 10px 8px",
                    display: "flex",
                    alignItems: "center",
                    opacity: 0.5,
                    flexShrink: 0,
                    transition: "opacity 150ms ease",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.opacity =
                      "0.5")
                  }
                >
                  <Download size={12} />
                </button>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(entry.id)}
                  title="Delete entry"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: colors.muted,
                    padding: "10px 16px 10px 4px",
                    display: "flex",
                    alignItems: "center",
                    opacity: 0.5,
                    flexShrink: 0,
                    transition: "opacity 150ms ease, color 150ms ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#ef4444";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.opacity =
                      "0.5";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      colors.muted;
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
