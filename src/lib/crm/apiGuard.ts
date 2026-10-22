import { getSession, Session } from "./auth";
import { ValidationError } from "./service";

/**
 * Wraps a CRM route handler so every endpoint rejects unauthenticated callers
 * the same way and turns validation failures into a 400 instead of a 500.
 */
export function withStaffSession<T extends { params?: unknown }>(
  handler: (
    request: Request,
    session: Session,
    context: T
  ) => Promise<Response> | Response
) {
  return async (request: Request, context: T): Promise<Response> => {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { error: "Sign in to the Jozi Dairy CRM first." },
        { status: 401 }
      );
    }

    try {
      return await handler(request, session, context);
    } catch (error) {
      if (error instanceof ValidationError) {
        return Response.json({ error: error.message }, { status: 400 });
      }

      console.error("[crm] request failed", error);
      return Response.json(
        { error: "Something went wrong saving that. Please try again." },
        { status: 500 }
      );
    }
  };
}

/** Parses a JSON body, treating an unreadable one as an empty object. */
export async function readJsonBody(
  request: Request
): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return body && typeof body === "object"
      ? (body as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}
