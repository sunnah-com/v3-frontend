/**
 * Toast utility functions
 *
 * Provides wrapper functions for displaying toast notifications with
 * appropriate durations based on UI configuration.
 */

import { toast } from "sonner";
import { uiConfig } from "../config/ui-config";

// We're using `unknown` to avoid TypeScript errors. The toast function
// will handle the type checking internally. We just need to ensure duration
// is properly set.
type ToastOptionsWithoutDuration = Omit<
  Parameters<typeof toast>[1],
  "duration"
>;

/**
 * Display a success toast notification
 * Duration is set to 1/3 of error toasts per requirements
 *
 * @param message The message to display
 * @param options Additional toast options
 */
export function toastSuccess(
  message: string,
  options: ToastOptionsWithoutDuration = {}
) {
  toast.success(message, {
    ...options,
    duration: uiConfig.toast.successDuration,
  });
}

/**
 * Display an error toast notification
 *
 * @param message The message to display
 * @param options Additional toast options
 */
export function toastError(
  message: string,
  options: ToastOptionsWithoutDuration = {}
) {
  toast.error(message, {
    ...options,
    duration: uiConfig.toast.errorDuration,
  });
}

/**
 * Display an info toast notification
 * Uses the success duration by default
 *
 * @param message The message to display
 * @param options Additional toast options
 */
export function toastInfo(
  message: string,
  options: ToastOptionsWithoutDuration = {}
) {
  toast.info(message, {
    ...options,
    duration: uiConfig.toast.successDuration,
  });
}

/**
 * Display a warning toast notification
 * Uses the error duration by default
 *
 * @param message The message to display
 * @param options Additional toast options
 */
export function toastWarning(
  message: string,
  options: ToastOptionsWithoutDuration = {}
) {
  toast.warning(message, {
    ...options,
    duration: uiConfig.toast.errorDuration,
  });
}
