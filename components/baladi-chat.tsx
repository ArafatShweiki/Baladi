"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type UIEvent,
} from "react";

const chatTransport = new DefaultChatTransport({ api: "/api/chat" });
const NEAR_BOTTOM_PX = 80;
const MAX_MESSAGE_CHARACTERS = 4_000;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const PENDING_ASSISTANT_MESSAGE = {
  id: "baladi-pending-assistant",
  role: "assistant",
  parts: [],
} satisfies UIMessage;

function getPreferredScrollBehavior(): ScrollBehavior {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches ? "auto" : "smooth";
}

function getMessageRenderKey(
  messages: readonly UIMessage[],
  index: number,
): string {
  const message = messages[index];
  const previousMessage = messages[index - 1];

  if (message.role === "assistant" && previousMessage?.role === "user") {
    return `assistant-for-${previousMessage.id}`;
  }

  return message.id;
}

function hasVisibleText(message: UIMessage) {
  return message.parts.some(
    (part) => part.type === "text" && part.text.length > 0,
  );
}

function ThinkingIndicator() {
  return (
    <span
      className="inline-flex items-center gap-1 text-sm text-muted"
      role="status"
    >
      <span>Baladi AI is thinking</span>
      <span className="inline-flex gap-0.5" aria-hidden="true">
        <span className="animate-pulse motion-reduce:animate-none">.</span>
        <span className="animate-pulse [animation-delay:150ms] motion-reduce:animate-none">
          .
        </span>
        <span className="animate-pulse [animation-delay:300ms] motion-reduce:animate-none">
          .
        </span>
      </span>
    </span>
  );
}

function MessageBubble({
  message,
  isLast,
  isGenerating,
  wasStopped,
}: {
  message: UIMessage;
  isLast: boolean;
  isGenerating: boolean;
  wasStopped: boolean;
}) {
  const isUser = message.role === "user";
  const textParts = message.parts.filter((part) => part.type === "text");
  const hasText = hasVisibleText(message);
  const showThinking =
    !isUser && isLast && isGenerating && !hasText;

  if (textParts.length === 0 && !showThinking) {
    return null;
  }

  return (
    <li
      className={`chat-message-enter flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className="max-w-[88%] space-y-1.5 sm:max-w-[78%]">
        <p
          className={`text-xs font-semibold ${isUser ? "text-right text-primary" : "text-muted"}`}
        >
          {isUser ? "You" : "Baladi AI"}
        </p>
        <div
          className={`rounded-radius px-3.5 py-3 text-sm leading-6 sm:px-4 ${
            isUser
              ? "bg-primary text-background"
              : "border border-border bg-subtle text-foreground"
          }`}
        >
          <div className="grid min-h-6 min-w-0">
            <div
              className={`col-start-1 row-start-1 min-h-6 min-w-0 transition-opacity duration-200 ease-out motion-reduce:transition-none ${showThinking ? "opacity-0" : "opacity-100"}`}
              aria-hidden={showThinking}
            >
              {textParts.map((part, index) => (
                <p
                  key={`${message.id}-text-${index}`}
                  className="whitespace-pre-wrap break-words"
                  dir="auto"
                >
                  {part.text}
                </p>
              ))}
            </div>
            {!isUser && isLast && isGenerating ? (
              <div
                className={`col-start-1 row-start-1 flex min-h-6 items-center transition-opacity duration-200 ease-out motion-reduce:transition-none ${showThinking ? "opacity-100" : "pointer-events-none opacity-0"}`}
                aria-hidden={!showThinking}
              >
                <ThinkingIndicator />
              </div>
            ) : null}
          </div>
        </div>
        {wasStopped ? (
          <p className="text-xs text-muted">Response stopped</p>
        ) : null}
      </div>
    </li>
  );
}

export function BaladiChat() {
  const [input, setInput] = useState("");
  const [isFollowing, setIsFollowing] = useState(true);
  const [stoppedMessageId, setStoppedMessageId] = useState<string>();
  const transcriptRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const followingRef = useRef(true);
  const previousScrollTopRef = useRef(0);
  const wasGeneratingRef = useRef(false);

  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
    clearError,
  } = useChat({
    transport: chatTransport,
    onFinish: ({ message, isAbort }) => {
      if (isAbort) {
        setStoppedMessageId(message.id);
      }
    },
  });

  const isGenerating = status === "submitted" || status === "streaming";
  const lastMessage = messages.at(-1);
  const showPendingAssistant =
    isGenerating && lastMessage?.role !== "assistant";
  const renderedMessages = showPendingAssistant
    ? [...messages, PENDING_ASSISTANT_MESSAGE]
    : messages;

  const updateFollowing = useCallback((nextValue: boolean) => {
    followingRef.current = nextValue;
    setIsFollowing(nextValue);
  }, []);

  const scrollToLatest = useCallback(() => {
    const transcript = transcriptRef.current;

    if (!transcript) {
      return;
    }

    updateFollowing(true);
    transcript.scrollTo({
      top: transcript.scrollHeight,
      behavior: getPreferredScrollBehavior(),
    });
    previousScrollTopRef.current = transcript.scrollTop;
  }, [updateFollowing]);

  useLayoutEffect(() => {
    if (!followingRef.current) {
      return;
    }

    // Coalesce streamed text updates into one scroll request per frame. The
    // existing following guard still lets manual upward scrolling take over.
    const frameId = requestAnimationFrame(() => {
      const transcript = transcriptRef.current;

      if (!transcript || !followingRef.current) {
        return;
      }

      const behavior = getPreferredScrollBehavior();
      transcript.scrollTo({ top: transcript.scrollHeight, behavior });

      if (behavior === "auto") {
        previousScrollTopRef.current = transcript.scrollTop;
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [messages, isGenerating]);

  useEffect(() => {
    if (wasGeneratingRef.current && !isGenerating) {
      inputRef.current?.focus();
    }

    wasGeneratingRef.current = isGenerating;
  }, [isGenerating]);

  const handleTranscriptScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const transcript = event.currentTarget;
      const currentScrollTop = transcript.scrollTop;
      const previousScrollTop = previousScrollTopRef.current;
      const distanceFromBottom =
        transcript.scrollHeight -
        transcript.clientHeight -
        currentScrollTop;

      if (currentScrollTop < previousScrollTop - 1) {
        updateFollowing(false);
      } else if (distanceFromBottom <= NEAR_BOTTOM_PX) {
        updateFollowing(true);
      }

      previousScrollTopRef.current = currentScrollTop;
    },
    [updateFollowing],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = input.trim();

    if (!text || isGenerating) {
      return;
    }

    clearError();
    setInput("");
    updateFollowing(true);
    void sendMessage({ text });
    requestAnimationFrame(scrollToLatest);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <section className="max-w-3xl space-y-4" aria-labelledby="baladi-ai-heading">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          AI guidance
        </p>
        <h2
          id="baladi-ai-heading"
          className="text-2xl font-bold tracking-tight sm:text-3xl"
        >
          Baladi AI Assistant
        </h2>
        <p className="leading-7 text-muted">
          Describe a community issue and Baladi AI will help organize its type,
          location, urgency, and useful details for a future report. Nothing is
          submitted or saved.
        </p>
      </div>

      <div className="overflow-hidden rounded-radius border border-border bg-background">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-subtle px-3 py-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-background"
              aria-hidden="true"
            >
              B
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Baladi AI</p>
              <p className="truncate text-xs text-muted">
                Community issue guide
              </p>
            </div>
          </div>
          <p className="flex shrink-0 items-center gap-1.5 text-xs text-muted">
            <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
            Assistant
          </p>
        </div>

        <div className="relative">
          <div
            ref={transcriptRef}
            className="h-[26rem] overflow-y-auto overscroll-contain p-3 [overflow-anchor:none] [scrollbar-gutter:stable] sm:h-[30rem] sm:p-5"
            role="log"
            aria-label="Conversation with Baladi AI"
            aria-live="polite"
            aria-relevant="additions text"
            onScroll={handleTranscriptScroll}
            tabIndex={0}
          >
            {messages.length === 0 ? (
              <div className="grid min-h-full place-items-center py-8 text-center">
                <div className="max-w-sm space-y-2">
                  <p className="font-semibold">What is happening nearby?</p>
                  <p className="text-sm leading-6 text-muted">
                    Start with a simple description, such as “There is a broken
                    streetlight near my university.”
                  </p>
                </div>
              </div>
            ) : (
              <ol className="space-y-4">
                {renderedMessages.map((message, index) => (
                  <MessageBubble
                    key={getMessageRenderKey(renderedMessages, index)}
                    message={message}
                    isLast={index === renderedMessages.length - 1}
                    isGenerating={isGenerating}
                    wasStopped={message.id === stoppedMessageId}
                  />
                ))}
              </ol>
            )}
          </div>

          {!isFollowing ? (
            <button
              type="button"
              onClick={scrollToLatest}
              className="absolute bottom-3 left-1/2 min-h-10 -translate-x-1/2 rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-primary shadow-sm hover:bg-subtle focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              ↓ Jump to latest
            </button>
          ) : null}
        </div>

        {error ? (
          <div
            className="border-t border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800 sm:px-4"
            role="alert"
          >
            Baladi AI is unavailable right now. Please try again in a moment.
          </div>
        ) : null}

        <form
          className="border-t border-border p-3 sm:p-4"
          onSubmit={handleSubmit}
        >
          <label className="sr-only" htmlFor="baladi-chat-input">
            Describe a local issue
          </label>
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              id="baladi-chat-input"
              name="message"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                if (error) {
                  clearError();
                }
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="Describe a local issue..."
              rows={2}
              maxLength={MAX_MESSAGE_CHARACTERS}
              disabled={isGenerating}
              dir="auto"
              aria-describedby="baladi-chat-help"
              className="min-h-12 min-w-0 flex-1 resize-none rounded-radius border border-border bg-background px-3 py-2.5 text-base leading-6 outline-none placeholder:text-muted focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:bg-subtle disabled:opacity-70 sm:text-sm"
            />
            <button
              type={isGenerating ? "button" : "submit"}
              onClick={isGenerating ? () => void stop() : undefined}
              disabled={!isGenerating && !input.trim()}
              aria-label={isGenerating ? "Stop response" : "Send message"}
              className={`grid min-h-12 w-16 shrink-0 place-items-center overflow-hidden rounded-radius border px-3 py-2 text-sm font-semibold transition-[background-color,border-color,color,filter,opacity] duration-200 ease-out motion-reduce:transition-none ${
                isGenerating
                  ? "border-border bg-background text-foreground hover:bg-subtle"
                  : "border-transparent bg-primary text-background hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-45"
              } focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary`}
            >
              <span className="grid" aria-hidden="true">
                <span
                  className={`col-start-1 row-start-1 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${isGenerating ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"}`}
                >
                  Send
                </span>
                <span
                  className={`col-start-1 row-start-1 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${isGenerating ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"}`}
                >
                  Stop
                </span>
              </span>
            </button>
          </div>
          <p id="baladi-chat-help" className="mt-2 text-xs text-muted">
            Enter to send · Shift + Enter for a new line
          </p>
        </form>
      </div>
    </section>
  );
}
