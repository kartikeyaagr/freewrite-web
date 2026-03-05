"use client";

import { useEffect, useState } from "react";
import Editor from "@/components/Editor";
import BottomBar from "@/components/BottomBar";
import Auth from "@/components/Auth";
import HistorySidebar from "@/components/HistorySidebar";
import UserMenu from "@/components/UserMenu";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useCountdown } from "@/hooks/useCountdown";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useWritingTimer } from "@/hooks/useWritingTimer";
import { supabase } from "@/lib/supabase";

const FONT_SIZES = [16, 18, 20, 22, 24, 26];
const FONT_FAMILIES = [
  "Arial, Helvetica, sans-serif",
  "Georgia, serif",
  "system-ui, sans-serif",
  "'Courier New', Courier, monospace",
];

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [chatPanelOpen, setChatPanelOpen] = useState(false);
  const [showChatTooltip, setShowChatTooltip] = useState(false);

  const PROMPT_PREFIX = `below is my journal entry. wyt? talk through it with me like a friend. don't therapize me and give me a whole breakdown, don't repeat my thoughts with headings. really take all of this, and tell me back stuff truly as if you're an old homie.

Keep it casual, dont say yo, help me make new connections i don't see, comfort, validate, challenge, all of it. dont be afraid to say a lot. format with markdown headings if needed.

do not just go through every single thing i say, and say it back to me. you need to process everything i say, make connections i don't see, and deliver it all back to me as a story that makes me feel what you think i wanna feel. thats what the best therapists do.

ideally, your style/tone should sound like the user themselves. it's as if the user is hearing their own tone but it should still feel different, because you have different things to say and don't just repeat back what they say.

else, start by saying, "hey, thanks for showing me this. my thoughts:"
    
my entry:`;

  const [content, setContent] = useLocalStorage("fw_content", "");
  const [fontSizeIndex, setFontSizeIndex] = useLocalStorage("fw_font_size", 1);
  const [fontFamilyIndex, setFontFamilyIndex] = useLocalStorage(
    "fw_font_family",
    0,
  );
  const [chatOpen, setChatOpen] = useLocalStorage("fw_chat_open", false);
  const [backspaceEnabled, setBackspaceEnabled] = useLocalStorage(
    "fw_backspace",
    true,
  );
  const [isLight, setIsLight] = useLocalStorage("fw_theme_light", false);

  const fontSize = FONT_SIZES[fontSizeIndex];
  const fontFamily = FONT_FAMILIES[fontFamilyIndex];

  const timer = useCountdown();
  const {
    status: saveStatus,
    resetEntry,
    loadEntry,
  } = useAutoSave(content, session);
  const { hasWrittenEnough, minutesWritten } = useWritingTimer(content);

  // Always start fresh on page load — no carrying over last session's content
  useEffect(() => {
    setContent("");
    resetEntry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply persisted theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle("light", isLight);
  }, [isLight]);

  // Check initial session & subscribe to auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthChecking(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  function handleThemeToggle() {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
  }

  function handleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  function handleChatToggle() {
    if (!hasWrittenEnough) {
      // Show tooltip for 3 seconds
      setShowChatTooltip(true);
      setTimeout(() => setShowChatTooltip(false), 3000);
      return;
    }
    setChatPanelOpen((v) => !v);
    setChatOpen((v: boolean) => !v);
  }

  function handleCopyPrompt() {
    navigator.clipboard.writeText(`${PROMPT_PREFIX}\n\n${content}`);
  }

  const sidebarOffset = historyOpen ? 300 : 0;

  return (
    <>
      {!authChecking && !session && (
        <Auth onSuccess={() => {}} isLight={isLight} />
      )}
      {session && !historyOpen && (
        <UserMenu session={session} isLight={isLight} />
      )}
      <Editor
        value={content}
        onChange={setContent}
        fontSize={fontSize}
        fontFamily={fontFamily}
        backspaceEnabled={backspaceEnabled}
        isLight={isLight}
        sidebarOffset={sidebarOffset}
      />
      <BottomBar
        fontSize={fontSize}
        onFontSizeChange={() =>
          setFontSizeIndex((i) => (i + 1) % FONT_SIZES.length)
        }
        fontLabel={fontFamily.split(",")[0].replace(/'/g, "").trim()}
        onFontFamilyChange={() =>
          setFontFamilyIndex((i) => (i + 1) % FONT_FAMILIES.length)
        }
        timerDisplay={timer.display}
        timerRunning={timer.running}
        timerFinished={timer.finished}
        onTimerToggle={timer.toggle}
        chatOpen={chatPanelOpen}
        onChatToggle={handleChatToggle}
        showChatTooltip={showChatTooltip}
        minutesWritten={minutesWritten}
        backspaceEnabled={backspaceEnabled}
        onBackspaceToggle={() => setBackspaceEnabled((v) => !v)}
        onFullscreen={handleFullscreen}
        onNewEntry={() => {
          setContent("");
          resetEntry();
        }}
        saveStatus={saveStatus}
        onThemeToggle={handleThemeToggle}
        onHistory={() => setHistoryOpen((v) => !v)}
        onCopyPrompt={handleCopyPrompt}
        isLight={isLight}
        sidebarOffset={sidebarOffset}
      />
      <HistorySidebar
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        session={session}
        isLight={isLight}
        onSelectEntry={(id, newContent) => {
          setContent(newContent);
          loadEntry(id, newContent);
        }}
      />
    </>
  );
}
