"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const PROMPT_TEMPLATE = `below is my journal entry. wyt? talk through it with me like a friend. don't therapize me and give me a whole breakdown, don't repeat my thoughts with headings. really take all of this, and tell me back stuff truly as if you're an old homie.

Keep it casual, dont say yo, help me make new connections i don't see, comfort, validate, challenge, all of it. dont be afraid to say a lot. format with markdown headings if needed.

do not just go through every single thing i say, and say it back to me. you need to process everything i say, make connections i don't see, and deliver it all back to me as a story that makes me feel what you think i wanna feel. thats what the best therapists do.

ideally, your style/tone should sound like the user themselves. it's as if the user is hearing their own tone but it should still feel different, because you have different things to say and don't just repeat back what they say.

else, start by saying, "hey, thanks for showing me this. my thoughts:"
    
my entry:`;

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  isLight: boolean;
}

export default function ChatPanel({
  isOpen,
  onClose,
  content,
  isLight,
}: ChatPanelProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  const colors = isLight
    ? {
        bg: "rgba(250, 250, 250, 0.97)",
        text: "#111111",
        muted: "rgba(0, 0, 0, 0.45)",
        border: "rgba(0, 0, 0, 0.08)",
        promptBg: "rgba(0, 0, 0, 0.04)",
        btnBg: "#111111",
        btnText: "#ffffff",
      }
    : {
        bg: "rgba(8, 8, 8, 0.97)",
        text: "#ffffff",
        muted: "rgba(255, 255, 255, 0.45)",
        border: "rgba(255, 255, 255, 0.08)",
        promptBg: "rgba(255, 255, 255, 0.05)",
        btnBg: "#ffffff",
        btnText: "#000000",
      };

  // Trigger slide-in animation
  if (isOpen && !mounted) setTimeout(() => setMounted(true), 10);
  if (!isOpen && mounted) setMounted(false);

  function handleCopy() {
    const fullPrompt = `${PROMPT_TEMPLATE}\n\n${content}`;
    navigator.clipboard.writeText(fullPrompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 60,
        padding: "0 24px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: colors.bg,
          border: `1px solid ${colors.border}`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 12,
          width: "100%",
          maxWidth: 480,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          color: colors.text,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
          overflow: "hidden",
          transform: mounted
            ? "scale(1) translateY(0)"
            : "scale(0.97) translateY(8px)",
          opacity: mounted ? 1 : 0,
          transition:
            "transform 240ms cubic-bezier(0.32, 0, 0.08, 1), opacity 200ms ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: `1px solid ${colors.border}`,
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
            Chat Prompt
          </span>
        </div>

        {/* Prompt preview */}
        <div
          style={{ padding: "16px 24px", maxHeight: 200, overflowY: "auto" }}
          className="[&::-webkit-scrollbar]:hidden"
        >
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.7,
              color: colors.muted,
              background: colors.promptBg,
              borderRadius: 6,
              padding: "12px 14px",
              margin: 0,
              whiteSpace: "pre-wrap",
            }}
          >
            {PROMPT_TEMPLATE}
            {"\n\n"}
            <span style={{ color: colors.text, opacity: 0.7 }}>
              {content.trim().substring(0, 120)}
              {content.length > 120 ? "…" : ""}
            </span>
          </p>
        </div>

        {/* Actions */}
        <div
          style={{
            padding: "0 24px 20px",
            display: "flex",
            gap: 8,
          }}
        >
          <button
            onClick={handleCopy}
            style={{
              flex: 1,
              background: colors.btnBg,
              color: colors.btnText,
              border: "none",
              padding: "10px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              transition: "opacity 150ms ease",
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy prompt"}
          </button>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              color: colors.muted,
              border: `1px solid ${colors.border}`,
              padding: "10px 16px",
              borderRadius: 6,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
