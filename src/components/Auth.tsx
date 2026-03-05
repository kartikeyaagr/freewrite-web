"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface AuthProps {
  onSuccess: () => void;
  isLight: boolean;
}

export default function Auth({ onSuccess, isLight }: AuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colors = isLight
    ? {
        bg: "rgba(255, 255, 255, 0.95)",
        text: "#1a1a1a",
        muted: "rgba(0,0,0,0.45)",
        border: "rgba(0, 0, 0, 0.1)",
        inputBg: "rgba(0, 0, 0, 0.05)",
        btnBg: "#1a1a1a",
        btnText: "#ffffff",
        divider: "rgba(0,0,0,0.1)",
      }
    : {
        bg: "rgba(0, 0, 0, 0.85)",
        text: "rgba(255, 255, 255, 0.9)",
        muted: "rgba(255,255,255,0.45)",
        border: "rgba(255, 255, 255, 0.1)",
        inputBg: "rgba(255, 255, 255, 0.05)",
        btnBg: "rgba(255, 255, 255, 0.9)",
        btnText: "#000000",
        divider: "rgba(255,255,255,0.1)",
      };

  const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

  async function handleAuth(type: "login" | "signup", e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (type === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        onSuccess();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
    // On success, Supabase redirects the page — no further action needed here
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: colors.bg,
          padding: "36px",
          borderRadius: "12px",
          border: `1px solid ${colors.border}`,
          width: "100%",
          maxWidth: "340px",
          fontFamily: FONT,
          color: colors.text,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 600,
            marginBottom: "24px",
            textAlign: "center",
            letterSpacing: "0.02em",
          }}
        >
          Freewrite
        </h2>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: colors.inputBg,
            border: `1px solid ${colors.border}`,
            color: colors.text,
            padding: "10px 14px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 500,
            cursor: googleLoading ? "default" : "pointer",
            opacity: googleLoading ? 0.7 : 1,
            fontFamily: FONT,
            transition: "opacity 150ms ease",
            marginBottom: "16px",
          }}
        >
          {/* Google G SVG */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {googleLoading ? "Redirecting..." : "Continue with Google"}
        </button>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: "16px",
          }}
        >
          <div style={{ flex: 1, height: 1, background: colors.divider }} />
          <span
            style={{
              fontSize: 11,
              color: colors.muted,
              letterSpacing: "0.05em",
            }}
          >
            or
          </span>
          <div style={{ flex: 1, height: 1, background: colors.divider }} />
        </div>

        {error && (
          <div
            style={{
              color: "#ef4444",
              fontSize: "12px",
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              background: colors.inputBg,
              border: `1px solid ${colors.border}`,
              padding: "10px 14px",
              borderRadius: "6px",
              color: colors.text,
              fontSize: "14px",
              outline: "none",
              fontFamily: FONT,
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              background: colors.inputBg,
              border: `1px solid ${colors.border}`,
              padding: "10px 14px",
              borderRadius: "6px",
              color: colors.text,
              fontSize: "14px",
              outline: "none",
              fontFamily: FONT,
            }}
          />

          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            <button
              onClick={(e) => handleAuth("login", e)}
              disabled={loading || googleLoading}
              style={{
                flex: 1,
                background: colors.btnBg,
                color: colors.btnText,
                border: "none",
                padding: "10px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.7 : 1,
                fontFamily: FONT,
              }}
            >
              {loading ? "..." : "Log in"}
            </button>
            <button
              onClick={(e) => handleAuth("signup", e)}
              disabled={loading || googleLoading}
              style={{
                background: "transparent",
                color: colors.text,
                border: `1px solid ${colors.border}`,
                padding: "10px 16px",
                borderRadius: "6px",
                fontSize: "13px",
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.7 : 1,
                fontFamily: FONT,
              }}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
