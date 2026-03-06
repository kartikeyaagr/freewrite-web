"use client";

import { useRef } from "react";

// Height of the bottom control bar — keeps the textarea from hiding behind it
const BOTTOM_BAR_HEIGHT = 100;

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  fontSize?: number;
  fontFamily?: string;
  disabled?: boolean;
  backspaceEnabled?: boolean;
  isLight?: boolean;
  sidebarOffset?: number;
  isMobile?: boolean;
}

export default function Editor({
  value,
  onChange,
  fontSize = 18,
  fontFamily = "Arial, Helvetica, sans-serif",
  disabled = false,
  backspaceEnabled = true,
  isLight = false,
  sidebarOffset = 0,
  isMobile = false,
}: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (!backspaceEnabled && e.key === "Backspace") {
          e.preventDefault();
        }
      }}
      disabled={disabled}
      placeholder="Just start writing"
      spellCheck={true}
      autoFocus
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: sidebarOffset,
        width: `calc(100% - ${sidebarOffset}px)`,
        height: `calc(100vh - ${BOTTOM_BAR_HEIGHT}px)`,
        transition:
          "right 280ms cubic-bezier(0.32, 0, 0.08, 1), width 280ms cubic-bezier(0.32, 0, 0.08, 1)",
        backgroundColor: "var(--background)",
        color: isLight ? "#111111" : "#ffffff",
        fontSize: `${fontSize}px`,
        fontFamily,
        lineHeight: 1.7,
        padding: isMobile ? "4vh 5vw" : "10vh 22vw",
        border: "none",
        outline: "none",
        resize: "none",
        overflowY: "auto",
        caretColor: isLight ? "#111111" : "#ffffff",
        // Scroll behaviour
        scrollbarWidth: "none", // Firefox
      }}
      // Hide scrollbar in Webkit, style placeholder
      className="[&::-webkit-scrollbar]:hidden placeholder:text-[var(--foreground)] placeholder:opacity-30"
    />
  );
}
