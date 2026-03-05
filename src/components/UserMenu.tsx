"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface UserMenuProps {
  session: any;
  isLight: boolean;
}

export default function UserMenu({ session, isLight }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

  const colors = isLight
    ? {
        iconColor: "rgba(0,0,0,0.4)",
        popupBg: "rgba(255,255,255,0.97)",
        text: "#111111",
        muted: "rgba(0,0,0,0.45)",
        border: "rgba(0,0,0,0.08)",
        hoverBg: "rgba(0,0,0,0.05)",
      }
    : {
        iconColor: "rgba(255,255,255,0.4)",
        popupBg: "rgba(12,12,12,0.97)",
        text: "#ffffff",
        muted: "rgba(255,255,255,0.40)",
        border: "rgba(255,255,255,0.08)",
        hoverBg: "rgba(255,255,255,0.06)",
      };

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setOpen(false);
  }

  if (!session) return null;

  const email = session.user?.email ?? "";

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: 28,
        right: 28,
        zIndex: 60,
        fontFamily: FONT,
      }}
    >
      {/* Icon button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Account"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: open
            ? isLight
              ? "rgba(0,0,0,0.7)"
              : "rgba(255,255,255,0.7)"
            : colors.iconColor,
          display: "flex",
          alignItems: "center",
          padding: 2,
          transition: "color 150ms ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = isLight
            ? "rgba(0,0,0,0.7)"
            : "rgba(255,255,255,0.7)";
        }}
        onMouseLeave={(e) => {
          if (!open) {
            (e.currentTarget as HTMLButtonElement).style.color =
              colors.iconColor;
          }
        }}
      >
        <User size={16} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            backgroundColor: colors.popupBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 9,
            minWidth: 200,
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            overflow: "hidden",
          }}
        >
          {/* Email row */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: colors.muted,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              Signed in as
            </div>
            <div
              style={{
                fontSize: 12,
                color: colors.text,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {email}
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              padding: "11px 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: colors.text,
              fontSize: 13,
              cursor: "pointer",
              textAlign: "left",
              fontFamily: FONT,
              transition: "background-color 150ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                colors.hoverBg;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            <LogOut size={13} style={{ opacity: 0.6 }} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
