import { useEffect, useRef } from "react";

const INJECTED_ATTR = "data-feedback-added";

/**
 * Observes the DOM and injects inline feedback (thumbs up/down + optional comment)
 * below each bot message bubble.
 */
export function useInlineFeedback(
  submitFeedback: (messageId: string, rating: number, comment?: string) => void,
  hasRated: (messageId: string) => boolean
) {
  const observerRef = useRef<MutationObserver | null>(null);
  const submitRef = useRef(submitFeedback);
  const hasRatedRef = useRef(hasRated);
  const isInjectingRef = useRef(false);
  submitRef.current = submitFeedback;
  hasRatedRef.current = hasRated;

  useEffect(() => {
    function showThanks(row: HTMLElement) {
      row.innerHTML = `<span class="inline-feedback-thanks-text">Thanks for your feedback!</span>`;
      row.classList.add("inline-feedback-thanks");
    }

    function showCommentInput(row: HTMLElement, msgId: string, rating: number) {
      // Keep the thumbs but add comment input below
      const existing = row.querySelector(".inline-feedback-comment");
      if (existing) return;

      // Highlight the selected thumb
      row.querySelectorAll(".inline-feedback-btn").forEach((btn) => {
        const r = btn.getAttribute("data-r");
        if (r === String(rating)) {
          btn.classList.add("inline-feedback-btn-active");
        } else {
          btn.classList.remove("inline-feedback-btn-active");
        }
      });

      const commentBox = document.createElement("div");
      commentBox.className = "inline-feedback-comment";
      commentBox.innerHTML = [
        `<input type="text" class="inline-feedback-input" placeholder="Any thoughts? (optional)" />`,
        `<div class="inline-feedback-actions">`,
        `<button class="inline-feedback-skip">Skip</button>`,
        `<button class="inline-feedback-submit">Submit</button>`,
        `</div>`,
      ].join("");

      row.appendChild(commentBox);

      const input = commentBox.querySelector("input") as HTMLInputElement;
      input?.focus();

      const doSubmit = () => {
        const comment = input?.value?.trim() || undefined;
        submitRef.current(msgId, rating, comment);
        showThanks(row);
      };

      commentBox.querySelector(".inline-feedback-submit")?.addEventListener("click", doSubmit);
      commentBox.querySelector(".inline-feedback-skip")?.addEventListener("click", () => {
        submitRef.current(msgId, rating);
        showThanks(row);
      });
      input?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") doSubmit();
      });
    }

    function inject() {
      if (isInjectingRef.current) return;
      isInjectingRef.current = true;

      try {
        const bubbles = document.querySelectorAll(
          `.bpMessageBlocksBubble[data-direction="incoming"]:not([${INJECTED_ATTR}])`
        );

        bubbles.forEach((bubble) => {
          bubble.setAttribute(INJECTED_ATTR, "true");

          const container = bubble.closest(".bpMessageContainer");
          const msgId =
            container?.getAttribute("data-message-id") ||
            container?.id ||
            `msg-${Math.random().toString(36).slice(2, 10)}`;

          const row = document.createElement("div");
          row.className = "inline-feedback";

          if (hasRatedRef.current(msgId)) {
            showThanks(row);
          } else {
            row.innerHTML = [
              `<button class="inline-feedback-btn" data-r="1" aria-label="Thumbs up">`,
              `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>`,
              `</button>`,
              `<button class="inline-feedback-btn" data-r="-1" aria-label="Thumbs down">`,
              `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/></svg>`,
              `</button>`,
            ].join("");

            row.addEventListener("click", (e) => {
              const btn = (e.target as HTMLElement).closest(".inline-feedback-btn");
              if (!btn) return;
              const rating = parseInt(btn.getAttribute("data-r") || "0", 10);
              showCommentInput(row, msgId, rating);
            });
          }

          if (bubble.nextSibling) {
            bubble.parentNode?.insertBefore(row, bubble.nextSibling);
          } else {
            bubble.parentNode?.appendChild(row);
          }
        });
      } finally {
        isInjectingRef.current = false;
      }
    }

    // Poll for new messages
    const interval = setInterval(inject, 500);

    // Also use MutationObserver for faster response
    observerRef.current = new MutationObserver(() => {
      setTimeout(inject, 50);
    });

    const tryObserve = () => {
      const target =
        document.querySelector(".bpMessageListViewport") ||
        document.querySelector(".bpMessageListContainer") ||
        document.querySelector(".bpContainer");
      if (target && observerRef.current) {
        observerRef.current.observe(target, { childList: true, subtree: true });
        return true;
      }
      return false;
    };

    if (!tryObserve()) {
      const retryTimer = setInterval(() => {
        if (tryObserve()) clearInterval(retryTimer);
      }, 500);
      setTimeout(() => clearInterval(retryTimer), 10000);
    }

    inject();

    return () => {
      clearInterval(interval);
      observerRef.current?.disconnect();
    };
  }, []);
}
