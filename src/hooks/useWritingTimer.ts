/**
 * Returns whether the user has written at least 300 words in the current session.
 * This is a simple word-count gate — no timers needed.
 */
export function useWritingTimer(content: string) {
  const wordCount =
    content.trim() === "" ? 0 : content.trim().split(/\s+/).length;

  return {
    minutesWritten: 0, // kept for API compatibility
    hasWrittenEnough: wordCount >= 300,
    wordCount,
  };
}
