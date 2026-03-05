import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useAutoSave(
  content: string,
  session: any,
  delay: number = 2000,
) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [entryId, setEntryId] = useState<string | null>(null);

  const prevContentRef = useRef(content);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Expose a way to manually reset the active entry ID
  // (e.g., when the user clicks "New Entry")
  const resetEntry = () => {
    setEntryId(null);
    setStatus("idle");
    prevContentRef.current = "";
  };

  // Expose a way to manually load a historical entry
  // We sync prevContentRef immediately so the first render
  // doesn't trigger an auto-save loop
  const loadEntry = (id: string, loadedContent: string) => {
    setEntryId(id);
    setStatus("idle");
    prevContentRef.current = loadedContent;
  };

  useEffect(() => {
    // 1. Don't save if unauthenticated
    if (!session?.user) return;

    // 2. Don't save if content hasn't actually changed since last save
    if (content === prevContentRef.current) return;

    // 3. Never save empty content (new or existing entry)
    if (content.trim() === "") {
      prevContentRef.current = "";
      setStatus("idle");
      return;
    }

    // 4. Debounce the save operation
    setStatus("saving");

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      try {
        if (!entryId) {
          // INSERT new entry
          const { data, error } = await supabase
            .from("entries")
            .insert({
              user_id: session.user.id,
              content: content,
            })
            .select("id")
            .single();

          if (error) throw error;
          if (data) setEntryId(data.id);
        } else {
          // UPDATE existing entry
          const { error } = await supabase
            .from("entries")
            .update({ content: content })
            .eq("id", entryId)
            .eq("user_id", session.user.id);

          if (error) throw error;
        }

        prevContentRef.current = content;
        setStatus("saved");

        // Clear "saved" status after a few seconds down to "idle"
        setTimeout(() => setStatus("idle"), 3000);
      } catch (err) {
        console.error("Auto-save failed:", err);
        setStatus("error");
      }
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [content, session, entryId, delay]);

  return { status, resetEntry, loadEntry };
}
