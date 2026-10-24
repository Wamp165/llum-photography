import { isRedirectError } from "next/dist/client/components/redirect-error";
import type { FormAction } from "@/types/action-result";

/**
 * Turns an unexpected error thrown by a Server Action into an error result, so the
 * form keeps its inputs and shows a toast. Redirects must keep working: re-throw them.
 */
export function safeAction(action: FormAction): FormAction {
  return async (state, formData) => {
    try {
      return await action(state, formData);
    } catch (error) {
      if (isRedirectError(error)) throw error;
      console.error(error);
      return { ok: false, error: "Something went wrong. Please try again." };
    }
  };
}
