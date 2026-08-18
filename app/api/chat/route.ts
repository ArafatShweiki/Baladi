import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  safeValidateUIMessages,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";

import { baladiAIConfig } from "@/lib/ai/config";

const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARACTERS = 4_000;
const MAX_CONVERSATION_CHARACTERS = 30_000;
const MAX_REQUEST_BYTES = 64_000;

function errorResponse(message: string, status: number) {
  return Response.json(
    { error: message },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function keepTextOnly(messages: UIMessage[]): UIMessage[] {
  return messages.flatMap((message) => {
    const parts = message.parts.flatMap((part) =>
      part.type === "text" && part.text.trim().length > 0
        ? [{ type: "text" as const, text: part.text }]
        : [],
    );

    return parts.length > 0
      ? [{ id: message.id, role: message.role, parts }]
      : [];
  });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return errorResponse("The conversation is too large.", 413);
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return errorResponse("Baladi AI is not configured yet.", 503);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("The request body must be valid JSON.", 400);
  }

  if (!isObject(body) || !("messages" in body)) {
    return errorResponse("A conversation is required.", 400);
  }

  const validation = await safeValidateUIMessages<UIMessage>({
    messages: body.messages,
  });

  if (!validation.success) {
    return errorResponse("The conversation format is invalid.", 400);
  }

  if (
    validation.data.length > MAX_MESSAGES ||
    validation.data.some((message) => message.role === "system")
  ) {
    return errorResponse("The conversation cannot be processed.", 400);
  }

  // The Baladi chat is text-only. Removing other valid SDK parts prevents
  // unsupported attachments or tool data from being forwarded to the model.
  const messages = keepTextOnly(validation.data);
  const characterCounts = messages.map((message) =>
    message.parts.reduce(
      (total, part) => total + (part.type === "text" ? part.text.length : 0),
      0,
    ),
  );
  const totalCharacters = characterCounts.reduce(
    (total, count) => total + count,
    0,
  );

  if (
    messages.length === 0 ||
    messages.at(-1)?.role !== "user" ||
    characterCounts.some((count) => count > MAX_MESSAGE_CHARACTERS) ||
    totalCharacters > MAX_CONVERSATION_CHARACTERS
  ) {
    return errorResponse("The conversation is empty or too large.", 400);
  }

  try {
    const result = streamText({
      ...baladiAIConfig,
      messages: await convertToModelMessages(messages),
      abortSignal: request.signal,
      onError: ({ error }) => {
        console.error("Baladi AI generation failed.", error);
      },
    });

    return createUIMessageStreamResponse({
      headers: { "Cache-Control": "no-cache, no-transform" },
      stream: toUIMessageStream({
        stream: result.stream,
        originalMessages: messages,
        sendReasoning: false,
        onError: () =>
          "Baladi AI could not finish this response. Please try again.",
      }),
    });
  } catch (error) {
    console.error("Baladi AI request failed.", error);
    return errorResponse("Baladi AI is temporarily unavailable.", 500);
  }
}
