"use client";

import { useState } from "react";
import { Sun, History } from "lucide-react";

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

type Colors = { rest: string; active: string; sep: string; clock: string };

function getColors(isLight: boolean): Colors {
  return isLight
    ? {
        rest: "rgba(0,0,0,0.65)",
        active: "rgba(0,0,0,0.95)",
        sep: "rgba(0,0,0,0.25)",
        clock: "rgba(0,0,0,0.65)",
      }
    : {
        rest: "rgba(255,255,255,0.65)",
        active: "rgba(255,255,255,0.95)",
        sep: "rgba(255,255,255,0.25)",
        clock: "rgba(255,255,255,0.65)",
      };
}

interface BarItemProps {
  onClick?: () => void;
  title?: string;
  active?: boolean;
  isIcon?: boolean;
  colors: Colors;
  children: React.ReactNode;
}

function BarItem({
  onClick,
  title,
  active,
  isIcon,
  colors,
  children,
}: BarItemProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      style={{
        background: "none",
        border: "none",
        cursor: onClick ? "pointer" : "default",
        color: active ? colors.active : colors.rest,
        fontSize: isIcon ? 0 : 13,
        fontFamily: FONT,
        letterSpacing: "0.02em",
        padding: "2px 0",
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        transition: "color 150ms ease",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        if (onClick)
          (e.currentTarget as HTMLButtonElement).style.color = colors.active;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = active
          ? colors.active
          : colors.rest;
      }}
    >
      {children}
    </button>
  );
}

function Sep({ colors }: { colors: Colors }) {
  return (
    <span
      style={{
        color: colors.sep,
        fontSize: 18,
        fontFamily: FONT,
        fontWeight: 700,
        userSelect: "none",
        lineHeight: 1,
      }}
    >
      •
    </span>
  );
}

interface BottomBarProps {
  fontSize: number;
  onFontSizeChange: () => void;
  fontLabel: string;
  onFontFamilyChange: () => void;
  timerDisplay: string;
  timerRunning: boolean;
  timerFinished: boolean;
  onTimerToggle: () => void;
  chatOpen: boolean;
  onChatToggle: () => void;
  showChatTooltip?: boolean;
  minutesWritten?: number;
  onCopyPrompt?: () => void;
  backspaceEnabled: boolean;
  onBackspaceToggle: () => void;
  onFullscreen: () => void;
  onNewEntry: () => void;
  onThemeToggle: () => void;
  onHistory: () => void;
  saveStatus?: "idle" | "saving" | "saved" | "error";
  isLight: boolean;
  sidebarOffset?: number;
}

export default function BottomBar({
  fontSize,
  onFontSizeChange,
  fontLabel,
  onFontFamilyChange,
  timerDisplay,
  timerRunning,
  timerFinished,
  onTimerToggle,
  chatOpen,
  onChatToggle,
  showChatTooltip = false,
  minutesWritten = 0,
  onCopyPrompt,
  backspaceEnabled,
  onBackspaceToggle,
  onFullscreen,
  onNewEntry,
  onThemeToggle,
  onHistory,
  saveStatus = "idle",
  isLight,
  sidebarOffset = 0,
}: BottomBarProps) {
  const colors = getColors(isLight);
  const showTimer = timerRunning || timerFinished || timerDisplay !== "15:00";
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    onCopyPrompt?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 40,
        left: 0,
        right: sidebarOffset,
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        userSelect: "none",
        pointerEvents: "none",
        transition: "right 280ms cubic-bezier(0.32, 0, 0.08, 1)",
      }}
    >
      {/* LEFT — Typography */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          pointerEvents: "auto",
        }}
      >
        <BarItem
          onClick={onFontSizeChange}
          title="Cycle font size"
          colors={colors}
        >
          {fontSize}px
        </BarItem>
        <Sep colors={colors} />
        <BarItem
          onClick={onFontFamilyChange}
          title="Cycle font"
          colors={colors}
        >
          {fontLabel}
        </BarItem>
        <span
          style={{
            marginLeft: 10,
            fontSize: 12,
            fontFamily: FONT,
            color: colors.rest,
            opacity: saveStatus !== "idle" ? 0.7 : 0,
            transition: "opacity 300ms ease",
            pointerEvents: "none",
          }}
        >
          {saveStatus === "saving" && "Saving..."}
          {saveStatus === "saved" && "Saved"}
          {saveStatus === "error" && "Error saving"}
        </span>
      </div>

      {/* RIGHT — Timer + Toggles + Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          pointerEvents: "auto",
        }}
      >
        <button
          onClick={onTimerToggle}
          title={
            showTimer
              ? timerRunning
                ? "Pause timer"
                : "Resume timer"
              : "Start 15-min timer"
          }
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontFamily: FONT,
            letterSpacing: "0.02em",
            color: timerFinished
              ? isLight
                ? "rgba(180,0,0,0.7)"
                : "rgba(255,80,80,0.8)"
              : timerRunning
                ? colors.active
                : colors.rest,
            transition: "color 200ms ease",
            whiteSpace: "nowrap",
            padding: "2px 0",
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          {timerDisplay}
        </button>
        <Sep colors={colors} />
        <span
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          {/* Lockout tooltip */}
          {showChatTooltip && (
            <span
              style={{
                position: "absolute",
                bottom: "calc(100% + 10px)",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#2a2a2a",
                color: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(255,255,255,0.12)",
                fontSize: 13,
                fontFamily: FONT,
                letterSpacing: "0.01em",
                lineHeight: 1.5,
                padding: "7px 12px",
                borderRadius: 7,
                whiteSpace: "nowrap",
                pointerEvents: "none",
                zIndex: 100,
                boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
              }}
            >
              Write for a minimum of 5 minutes. Then click this. Trust.
              {/* Downward caret arrow */}
              <span
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderTop: "5px solid #2a2a2a",
                }}
              />
            </span>
          )}
          {/* Unlocked chat tooltip */}
          {chatOpen && !showChatTooltip && (
            <span
              style={{
                position: "absolute",
                bottom: "calc(100% + 10px)",
                right: 0,
                left: "auto",
                transform: "none",
                background: "#2a2a2a",
                color: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(255,255,255,0.12)",
                fontSize: 13,
                fontFamily: FONT,
                letterSpacing: "0.01em",
                lineHeight: 1.6,
                padding: "14px 16px",
                borderRadius: 9,
                width: 280,
                whiteSpace: "normal",
                zIndex: 100,
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                pointerEvents: "auto",
              }}
            >
              Hey, your entry is quite long.
              <br />
              You'll need to manually copy the prompt by clicking 'Copy Prompt'
              below and then paste it into AI of your choice (ex. ChatGPT). The
              prompt includes your entry as well. So just copy paste and go! See
              what the AI says.
              {/* Divider — negative margin to escape the 16px padding */}
              <span
                style={{
                  display: "block",
                  height: 1,
                  background: "rgba(255,255,255,0.12)",
                  margin: "12px -16px 10px",
                }}
              />
              <button
                onClick={handleCopy}
                style={{
                  display: "block",
                  width: "100%",
                  background: "none",
                  border: "none",
                  color: copied
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.75)",
                  fontSize: 12,
                  fontFamily: FONT,
                  letterSpacing: "0.01em",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: 0,
                  fontWeight: 500,
                  transition: "color 150ms ease",
                }}
              >
                {copied ? "Copied!" : "Copy prompt"}
              </button>
              {/* Downward caret — aligned to right of bubble */}
              <span
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 12,
                  width: 0,
                  height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderTop: "5px solid #2a2a2a",
                }}
              />
            </span>
          )}
          <BarItem
            onClick={onChatToggle}
            title="Toggle chat"
            active={chatOpen}
            colors={colors}
          >
            Chat
          </BarItem>
        </span>
        <Sep colors={colors} />
        <BarItem
          onClick={onBackspaceToggle}
          title={backspaceEnabled ? "Backspace on" : "Backspace off"}
          active={!backspaceEnabled}
          colors={colors}
        >
          {backspaceEnabled ? "Backspace is On" : "Backspace is Off"}
        </BarItem>
        <Sep colors={colors} />
        <BarItem onClick={onFullscreen} title="Fullscreen" colors={colors}>
          Fullscreen
        </BarItem>
        <Sep colors={colors} />
        <BarItem onClick={onNewEntry} title="New entry" colors={colors}>
          New Entry
        </BarItem>
        <Sep colors={colors} />
        <BarItem
          onClick={onThemeToggle}
          title="Toggle theme"
          isIcon
          colors={colors}
        >
          <Sun size={14} />
        </BarItem>
        <Sep colors={colors} />
        <BarItem onClick={onHistory} title="History" isIcon colors={colors}>
          <History size={14} />
        </BarItem>
      </div>
    </div>
  );
}
