"use client";

import { getCachedAccessToken } from "./auth-token";

export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export type ApiErrorKind =
  | "validation"
  | "authentication"
  | "permission"
  | "not_found"
  | "conflict"
  | "rate_limit"
  | "server"
  | "network"
  | "unknown";

type ApiErrorOptions = {
  status: number | null;
  kind: ApiErrorKind;
  code?: string;
  details?: unknown;
};

type ErrorPayload = {
  message?: unknown;
  error?: unknown;
  code?: unknown;
  details?: unknown;
};

function kindFromStatus(status: number): ApiErrorKind {
  switch (status) {
    case 400:
      return "validation";
    case 401:
      return "authentication";
    case 403:
      return "permission";
    case 404:
      return "not_found";
    case 409:
      return "conflict";
    case 429:
      return "rate_limit";
    default:
      return status >= 500 ? "server" : "unknown";
  }
}

function defaultMessage(status: number): string {
  switch (status) {
    case 400:
      return "The request was invalid.";
    case 401:
      return "Your session is no longer valid.";
    case 403:
      return "You do not have permission to do that.";
    case 404:
      return "The requested resource could not be found.";
    case 409:
      return "The request conflicts with the current state.";
    case 429:
      return "Too many requests. Please try again shortly.";
    default:
      return status >= 500
        ? "Orakl encountered a server error."
        : "The request could not be completed.";
  }
}

function extractMessage(payload: ErrorPayload, status: number): string {
  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  if (Array.isArray(payload.message)) {
    const messages = payload.message.filter(
      (message): message is string =>
        typeof message === "string" && message.trim().length > 0,
    );

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  if (typeof payload.error === "string" && payload.error.trim()) {
    return payload.error;
  }

  return defaultMessage(status);
}

async function readErrorPayload(response: Response): Promise<ErrorPayload> {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return {};
  }

  try {
    const payload: unknown = await response.json();

    if (
      typeof payload === "object" &&
      payload !== null &&
      !Array.isArray(payload)
    ) {
      return payload as ErrorPayload;
    }
  } catch {
    // Fall through to the status-based error below.
  }

  return {};
}

export class ApiError extends Error {
  readonly status: number | null;
  readonly kind: ApiErrorKind;
  readonly code?: string;
  readonly details?: unknown;

  constructor(message: string, options: ApiErrorOptions) {
    super(message);

    this.name = "ApiError";
    this.status = options.status;
    this.kind = options.kind;
    this.code = options.code;
    this.details = options.details;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const jwt = await getCachedAccessToken();

  const headers = new Headers(init.headers);

  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (jwt) {
    headers.set("Authorization", `Bearer ${jwt}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      credentials: "include",
    });
  } catch (error) {
    throw new ApiError("We couldn't reach Orakl. Please try again.", {
      status: null,
      kind: "network",
      details: error,
    });
  }

  if (!response.ok) {
    const payload = await readErrorPayload(response);

    throw new ApiError(extractMessage(payload, response.status), {
      status: response.status,
      kind: kindFromStatus(response.status),
      code: typeof payload.code === "string" ? payload.code : undefined,
      details: payload.details,
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
